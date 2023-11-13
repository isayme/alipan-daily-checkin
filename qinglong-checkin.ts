/**
 * new Env('阿里云盘日签自动签到')
 * cron: 3 5 10 * * *
 */

import { refreshToken } from './src/adrive'
import { checkin } from './src/checkin'
import { notifyDingtalk } from './src/dingtalk'
import { persistRefreshToken } from './src/persist-refresh-token'
import { runMain } from './src/util'

async function main() {
  // 刷新 token
  const { refresh_token, access_token } = await refreshToken(
    process.env.ALIYUNDRIVE_REFRESH_TOKEN,
  )

  await persistRefreshToken(refresh_token)

  const message = await checkin(access_token)
  await notifyDingtalk(message)
}

runMain(main)
