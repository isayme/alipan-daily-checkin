import { Client } from '@isayme/qinglong'

let client: Client | null = null

let qinglongUrl = process.env.QINGLONG_URL
let qinglongClientId = process.env.QINGLONG_CLIENT_ID
let qinglongClientSecret = process.env.QINGLONG_CLIENT_SECRET
if (qinglongUrl && qinglongClientId && qinglongClientSecret) {
  client = new Client(qinglongUrl, qinglongClientId, qinglongClientSecret)
}

export async function persistRefreshToken(refreshToken: string) {
  if (!client) {
    return
  }

  await client.setEnv('ALIYUNDRIVE_REFRESH_TOKEN', refreshToken)
}
