import { refreshToken } from './adrive'
import { checkin } from './checkin'
import { notifyDingtalk } from './dingtalk'
import { persistRefreshToken } from './persist-refresh-token'
import { runMain } from './util'

async function main() {
  // 刷新 token
  const { refresh_token, access_token } = await refreshToken(
    process.env.ALIYUNDRIVE_REFRESH_TOKEN,
  )

  persistRefreshToken(refresh_token)

  const message = await checkin(access_token)
  await notifyDingtalk(message)
}

runMain(main)
