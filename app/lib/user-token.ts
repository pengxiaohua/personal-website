import crypto from 'crypto'

const USER_TOKEN_SECRET = process.env.USER_TOKEN_SECRET || 'dev-secret'

export type UserTokenPayload = {
  openId: string
  exp: number // epoch seconds
}

export function signUserToken(payload: UserTokenPayload): string {
  const json = JSON.stringify(payload)
  const data = Buffer.from(json).toString('base64url')
  const hmac = crypto.createHmac('sha256', USER_TOKEN_SECRET).update(data).digest('base64url')
  return `${data}.${hmac}`
}

export function verifyUserToken(token: string): UserTokenPayload | null {
  const [data, sig] = token.split('.')
  if (!data || !sig) return null
  const expected = crypto.createHmac('sha256', USER_TOKEN_SECRET).update(data).digest('base64url')
  if (expected !== sig) return null
  try {
    const json = Buffer.from(data, 'base64url').toString('utf-8')
    const payload = JSON.parse(json) as UserTokenPayload
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export function getUserTokenFromRequestHeaders(headers: Headers): string | null {
  const auth = headers.get('authorization') || ''
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  return null
}


