import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { basicAuthResponse, verifyBasicAuth } from '@/lib/auth'
import { getUserTokenFromRequestHeaders, verifyUserToken } from '@/lib/user-token'

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams
  const bookId = searchParams.get('bookId')
  if (!bookId) return Response.json({ error: 'bookId required' }, { status: 400 })
  if (process.env.DISABLE_AUTH === 'true' || verifyBasicAuth(request)) {
    const progress = await prisma.readingProgress.findUnique({ where: { bookId } })
    return Response.json(progress)
  }
  const token = getUserTokenFromRequestHeaders(request.headers)
  const payload = token ? verifyUserToken(token) : null
  if (!payload) return basicAuthResponse()
  // 校验 book 属于该用户
  const book = await prisma.book.findUnique({ where: { id: bookId } })
  if (!book) return Response.json({ error: 'book not found' }, { status: 404 })
  const user = await prisma.user.findUnique({ where: { openId: payload.openId } })
  if (!user || book.userId !== user.id) return Response.json({ error: 'forbidden' }, { status: 403 })
  const progress = await prisma.readingProgress.findUnique({ where: { bookId } })
  return Response.json(progress)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!body.bookId) return Response.json({ error: 'bookId required' }, { status: 400 })
  if (process.env.DISABLE_AUTH === 'true' || verifyBasicAuth(request)) {
    const progress = await prisma.readingProgress.upsert({
      where: { bookId: body.bookId },
      update: body,
      create: body
    })
    return Response.json(progress)
  }
  const token = getUserTokenFromRequestHeaders(request.headers)
  const payload = token ? verifyUserToken(token) : null
  if (!payload) return basicAuthResponse()
  const book = await prisma.book.findUnique({ where: { id: body.bookId } })
  const user = await prisma.user.findUnique({ where: { openId: payload.openId } })
  if (!book || !user || book.userId !== user.id) return Response.json({ error: 'forbidden' }, { status: 403 })
  const progress = await prisma.readingProgress.upsert({
    where: { bookId: body.bookId },
    update: body,
    create: body
  })
  return Response.json(progress)
}


