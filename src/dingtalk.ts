import { Robot } from '@isayme/dingtalk-robot'
import logger from './logger'

let robot = new Robot({
  url: process.env.DINGTALK_WEBHOOK_URL,
})

export async function notifyDingtalk(message: string) {
  logger.info(message)
  await robot.text(message)
}
