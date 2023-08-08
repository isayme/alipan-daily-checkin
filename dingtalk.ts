import logger from './logger'

export async function notifyDingtalk(message: string) {
  logger.info(message)
  let url = process.env.DINGTALK_WEBHOOK_URL
  if (!url) {
    return
  }

  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      msgtype: 'text',
      text: {
        content: message,
      },
    }),
    headers: {
      'content-type': 'application/json',
    },
  })
}
