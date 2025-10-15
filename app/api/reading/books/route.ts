import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { basicAuthResponse, verifyBasicAuth } from '@/lib/auth'
import { getUserTokenFromRequestHeaders, verifyUserToken } from '@/lib/user-token'

export async function GET(request: NextRequest) {
  // 管理员列出全部；或用户列出自己的
  if (verifyBasicAuth(request)) {
    const books = await prisma.book.findMany({ orderBy: { createdAt: 'desc' } })
    return Response.json(books)
  }
  const token = getUserTokenFromRequestHeaders(request.headers)
  const payload = token ? verifyUserToken(token) : null
  if (!payload) return basicAuthResponse()
  const user = await prisma.user.findUnique({ where: { openId: payload.openId } })
  if (!user) return Response.json({ error: 'user not found' }, { status: 401 })
  const books = await prisma.book.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
  return Response.json(books)
}

export async function POST(request: NextRequest) {
  // 管理员可指定 userId；用户只能写入自己的
  const token = getUserTokenFromRequestHeaders(request.headers)
  const payload = token ? verifyUserToken(token) : null
  const body = await request.json()
  if (verifyBasicAuth(request)) {
    const book = await prisma.book.create({ data: body })
    return Response.json(book)
  }
  if (!payload) return basicAuthResponse()
  const user = await prisma.user.findUnique({ where: { openId: payload.openId } })
  if (!user) return Response.json({ error: 'user not found' }, { status: 401 })
  const data = { ...body, userId: user.id }
  const book = await prisma.book.create({ data })
  return Response.json(book)
}


