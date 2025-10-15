import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signUserToken } from '@/lib/user-token'

// 这是小程序端 wx.login(code) 后端换取 openid 的入口
// 前提：已在 .env 配置 WECHAT_APPID / WECHAT_SECRET

export async function POST(request: NextRequest) {
  const { code, userInfo } = await request.json() as { code: string, userInfo?: any }
  if (!code) return Response.json({ error: 'code required' }, { status: 400 })

  const appid = process.env.WECHAT_APPID
  const secret = process.env.WECHAT_SECRET
  if (!appid || !secret) return Response.json({ error: 'wechat env not set' }, { status: 500 })

  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
  const wxResp = await fetch(url)
  const wx = await wxResp.json() as { openid?: string, unionid?: string, session_key?: string, errcode?: number, errmsg?: string }
  if (!wx.openid) return Response.json({ error: wx.errmsg || 'wx login failed' }, { status: 400 })

  const now = new Date()
  const user = await prisma.user.upsert({
    where: { openId: wx.openid },
    update: {
      unionId: wx.unionid || undefined,
      nickname: userInfo?.nickName || undefined,
      avatarUrl: userInfo?.avatarUrl || undefined,
      gender: typeof userInfo?.gender === 'number' ? userInfo.gender : undefined,
      country: userInfo?.country || undefined,
      province: userInfo?.province || undefined,
      city: userInfo?.city || undefined,
      language: userInfo?.language || undefined,
      lastLoginAt: now,
    },
    create: {
      openId: wx.openid,
      unionId: wx.unionid || undefined,
      nickname: userInfo?.nickName || undefined,
      avatarUrl: userInfo?.avatarUrl || undefined,
      gender: typeof userInfo?.gender === 'number' ? userInfo.gender : undefined,
      country: userInfo?.country || undefined,
      province: userInfo?.province || undefined,
      city: userInfo?.city || undefined,
      language: userInfo?.language || undefined,
      lastLoginAt: now,
    }
  })

  const token = signUserToken({ openId: user.openId, exp: Math.floor(Date.now()/1000) + 60*60*24*30 })
  return Response.json({ token, user })
}


