import { notifyDingtalk } from './dingtalk'

export async function runMain(fn: Function) {
  fn()
    .then(() => {
      process.exit(0)
    })
    .catch((err) => {
      notifyDingtalk(`阿里云盘签到失败: ${err}`).finally(() => {
        process.exit(-1)
      })
    })
}

export function toBoolean(v: any, defaultValue: boolean) {
  v = v?.toLowerCase()?.trim()

  switch (v) {
    case 'true':
    case 'yes':
    case '1':
      return true

    case 'false':
    case 'no':
    case '0':
      return false

    default:
      return defaultValue
  }
}
