import formatUnicornSafe from 'format-unicorn/safe'
import lodash from 'lodash'
import { chromium } from 'playwright'
import { getUser } from './adrive'
import logger from './logger'
import { userAgent } from './ua'
import { toBoolean } from './util'

// 是否自动领取奖励, 默认 true
const autoPrizeCollection = toBoolean(process.env.AUTO_PRIZE_COLLECTION, true)

function formatMessage(format: string, replacements: {}): string {
  return formatUnicornSafe(format, replacements)
}

export async function checkin(access_token: string): Promise<string> {
  const replacements: any = {}

  const user = await getUser(access_token)
  const userName = user.nick_name || user.phone
  replacements.userName = userName

  const browser = await chromium.launch()
  const page = await browser.newPage({
    // 模拟移动端访问
    userAgent,
  })

  // 所有请求附带 access_token
  page.route('**/*', (route, request) => {
    const headers = request.headers()
    if (request.method() === 'POST') {
      headers['Authorization'] = `Bearer ${access_token}`
    }

    route.continue({ headers })
  })

  const [_, singInListResponse] = await Promise.all([
    // 签到
    page.goto(
      'https://pages.aliyundrive.com/mobile-page/web/dailycheck.html?disableNav=YES',
      {
        waitUntil: 'domcontentloaded',
      },
    ),
    page.waitForResponse(/sign_in_list/, { timeout: 60000 }),
  ])

  const { result: singInListResult } = await singInListResponse.json()
  const { signInCount, signInInfos } = singInListResult
  const signInOfToday = signInInfos[signInCount - 1]

  replacements.signInCount = signInCount

  let dailyCheckinReward = signInOfToday.rewards.find(
    (v) => v.type === 'dailySignIn',
  )
  let rewardDesc = `${dailyCheckinReward.name} -- ${dailyCheckinReward.rewardDesc}`
  replacements.rewardDesc = rewardDesc

  let isRewardVerification = dailyCheckinReward.status === 'verification'

  logger.info(`账号昵称 ${userName}`)
  logger.info(`今日奖励: ${rewardDesc}`)
  logger.info(
    `本月累计签到 ${signInCount} 天，今日奖励${
      isRewardVerification ? '已' : '待'
    }领取`,
  )

  if (isRewardVerification) {
    return formatMessage(
      '阿里云盘账号「{userName}」签到完成，奖励({rewardDesc})已领取，无需重复领取',
      replacements,
    )
  }

  if (!autoPrizeCollection) {
    return formatMessage(
      '阿里云盘账号「{userName}」签到完成，今日奖励({rewardDesc})待手动领取',
      replacements,
    )
  }

  // 领取奖励
  const rewardButtonSelector = '.rax-view-v2[class*=components--finished]'
  await page
    .waitForSelector(rewardButtonSelector, { timeout: 15000 })
    .catch(lodash.noop)
  const hasReward = await page.locator(rewardButtonSelector).isVisible()
  if (hasReward) {
    logger.info('有奖励需要领取')
    await page.locator(rewardButtonSelector).click()

    const signInRewardResp = await page
      .waitForResponse(/sign_in_reward/, { timeout: 15000 })
      .catch(lodash.noop)

    if (signInRewardResp && signInRewardResp.ok()) {
      const { result } = await signInRewardResp.json()

      replacements.rewardName = result.notice
      replacements.rewardDescription = result.subNotice

      const successMessage =
        process.env.SUCCESS_CHECKIN_MESSAGE ||
        '阿里云盘账号「{userName}」签到完成，获得奖励: {rewardName} {rewardDescription}, 本月已累计签到 {signInCount} 天'
      return formatMessage(successMessage, replacements)
    }

    return formatMessage(
      '阿里云盘账号「{userName}」签到完成，奖励({rewardDesc})领取失败，请手动领取',
      replacements,
    )
  } else {
    return formatMessage(
      '阿里云盘账号「{userName}」签到完成，奖励类型({rewardDesc})无需领取',
      replacements,
    )
  }
}
