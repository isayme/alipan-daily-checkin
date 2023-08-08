interface RereshTokenResp {
  refresh_token: string
  access_token: string
}

export async function refreshToken(
  refreshToken: string,
): Promise<RereshTokenResp> {
  // 刷新 token
  const response = await fetch('https://api.aliyundrive.com/token/refresh', {
    method: 'POST',
    body: JSON.stringify({
      refresh_token: process.env.ALIYUNDRIVE_REFRESH_TOKEN,
    }),
    headers: {
      'content-type': 'application/json',
    },
  })
  if (!response.ok) {
    let respBody = await response.text()
    throw new Error(`刷新token失败: ${respBody}`)
  }

  const { refresh_token, access_token } = await response.json()
  return { refresh_token, access_token }
}

interface GetUserResp {
  nick_name: string
  phone: string
}
export async function getUser(accessToken: string): Promise<GetUserResp> {
  const response = await fetch(
    'https://api.aliyundrive.com/adrive/v2/user/get',
    {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    },
  )
  if (!response.ok) {
    let respBody = await response.text()
    throw new Error(`获取用户信息失败: ${respBody}`)
  }

  const { nick_name, phone } = await response.json()
  return { nick_name, phone }
}
