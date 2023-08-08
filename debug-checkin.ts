import { refreshToken } from './adrive'
import { checkin } from './checkin'
import { notifyDingtalk } from './dingtalk'
import { runMain } from './util'

async function main() {
  const { access_token } = await refreshToken(
    process.env.ALIYUNDRIVE_REFRESH_TOKEN,
  )

  const message = await checkin(access_token)
  await notifyDingtalk(message)
}

runMain(main)
