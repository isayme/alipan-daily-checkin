import { execSync } from 'child_process'

export function persistRefreshToken(refreshToken: string) {
  process.env.ALIYUNDRIVE_REFRESH_TOKEN = refreshToken

  // 更新 github action secret ALIYUNDRIVE_REFRESH_TOKEN
  execSync(
    'gh secret set ALIYUNDRIVE_REFRESH_TOKEN --body "${ALIYUNDRIVE_REFRESH_TOKEN}"',
  )
}
