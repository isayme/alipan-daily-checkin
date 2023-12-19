import { Robot } from '@isayme/dingtalk-robot'
import logger from './logger'

let robot = new Robot({
  url: process.env.DINGTALK_WEBHOOK_URL,
  accessToken: process.env.DINGTALK_WEBHOOK_ACCESS_TOKEN,
  secret: process.env.DINGTALK_WEBHOOK_SECRET,
  timeout: 3000,
})

export async function notifyDingtalk(message: string) {
  logger.info(message)
  await robot.text(message)
}
