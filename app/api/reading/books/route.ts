import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { basicAuthResponse, verifyBasicAuth } from '@/lib/auth'
import { getUserTokenFromRequestHeaders, verifyUserToken } from '@/lib/user-token'

export async function GET(request: NextRequest) {
  // 管理员列出全部；或用户列出自己的
  if (process.env.DISABLE_AUTH === 'true' || verifyBasicAuth(request)) {
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

  // 1) 管理员 BasicAuth：直接透传 body（允许指定 userId）
  if (verifyBasicAuth(request)) {
    const book = await prisma.book.create({ data: body })
    return Response.json(book)
  }

  // 2) 常规/开发模式：优先使用 Bearer Token 解析用户；
  //    若 DISABLE_AUTH=true 且无 Token，则绑定/创建 dev-openid 用户再写入
  if (payload) {
    const user = await prisma.user.findUnique({ where: { openId: payload.openId } })
    if (!user) return Response.json({ error: 'user not found' }, { status: 401 })
    const data = { ...body, userId: user.id }
    const book = await prisma.book.create({ data })
    return Response.json(book)
  }

  if (process.env.DISABLE_AUTH === 'true') {
    const now = new Date()
    const dev = await prisma.user.upsert({
      where: { openId: 'dev-openid' },
      update: { lastLoginAt: now },
      create: { openId: 'dev-openid', nickname: 'Dev User', lastLoginAt: now }
    })
    const data = { ...body, userId: dev.id }
    const book = await prisma.book.create({ data })
    return Response.json(book)
  }

  return basicAuthResponse()
}


