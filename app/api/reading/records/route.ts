import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { basicAuthResponse, verifyBasicAuth } from '@/lib/auth'
import { getUserTokenFromRequestHeaders, verifyUserToken } from '@/lib/user-token'

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams
  const bookId = searchParams.get('bookId') || undefined
  if (process.env.DISABLE_AUTH === 'true' || verifyBasicAuth(request)) {
    const records = await prisma.readingRecord.findMany({ where: { bookId }, orderBy: { date: 'desc' } })
    return Response.json(records)
  }
  const token = getUserTokenFromRequestHeaders(request.headers)
  const payload = token ? verifyUserToken(token) : null
  if (!payload) return basicAuthResponse()
  const user = await prisma.user.findUnique({ where: { openId: payload.openId } })
  if (!user) return Response.json({ error: 'user not found' }, { status: 401 })
  const records = await prisma.readingRecord.findMany({ where: { bookId, userId: user.id }, orderBy: { date: 'desc' } })
  return Response.json(records)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (process.env.DISABLE_AUTH === 'true' || verifyBasicAuth(request)) {
    const record = await prisma.readingRecord.create({ data: body })
    return Response.json(record)
  }
  const token = getUserTokenFromRequestHeaders(request.headers)
  const payload = token ? verifyUserToken(token) : null
  if (!payload) return basicAuthResponse()
  const user = await prisma.user.findUnique({ where: { openId: payload.openId } })
  if (!user) return Response.json({ error: 'user not found' }, { status: 401 })
  const data = { ...body, userId: user.id }
  const record = await prisma.readingRecord.create({ data })
  return Response.json(record)
}


