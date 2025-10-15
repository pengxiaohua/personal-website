import { NextRequest } from 'next/server'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

export function verifyBasicAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) return false

  try {
    const base64Credentials = authHeader.split(' ')[1]
    const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8')
    const [username, password] = decoded.split(':')
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
  } catch {
    return false
  }
}

export function basicAuthResponse() {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"'
    }
  })
}


