import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAdmin(request: NextRequest) {
  const auth = request.headers.get('authorization') || ''
  if (!auth.startsWith('Basic ')) return false
  try {
    const decoded = Buffer.from(auth.split(' ')[1], 'base64').toString('utf-8')
    const [u, p] = decoded.split(':')
    return u === (process.env.ADMIN_USERNAME || '') && p === (process.env.ADMIN_PASSWORD || '')
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return new Response('Authentication required.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' }
    })
  }
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  return Response.json(users)
}


