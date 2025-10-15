import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  const { pathname } = new URL(request.url)

  // Basic Auth 保护 /admin
  if (pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization') || ''
    if (!authHeader.startsWith('Basic ')) {
      return new Response('Authentication required.', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' }
      })
    }
    try {
      const base64Credentials = authHeader.split(' ')[1]
      // 使用 atob 以兼容 Edge Runtime
      const decoded = atob(base64Credentials)
      const [username, password] = decoded.split(':')
      const ADMIN_USERNAME = process.env.ADMIN_USERNAME || ''
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
      if (!(username === ADMIN_USERNAME && password === ADMIN_PASSWORD)) {
        return new Response('Authentication required.', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' }
        })
      }
    } catch {
      return new Response('Authentication required.', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' }
      })
    }
  }
  
  // 获取子域名
  const subdomain = hostname?.split('.')[0]
  
  // 根据子域名重写路径
  switch (subdomain) {
    case 'resume':
      return NextResponse.rewrite(new URL('/resume', request.url))
    case 'blog':
      return NextResponse.rewrite(new URL('/blog', request.url))
    case 'fate':
      return NextResponse.rewrite(new URL('/fate', request.url))
    case 'www':
    case 'xiaohua':
      // 主域名，保持原样
      return NextResponse.next()
    default:
      // 其他情况，重定向到主域名
      if (hostname !== 'xiaohua.run' && hostname !== 'localhost:3000' && hostname !== 'localhost:3001' && hostname !== 'localhost:3002') {
        return NextResponse.redirect(new URL('https://xiaohua.run', request.url))
      }
      return NextResponse.next()
  }

  // API 路由的鉴权在各自的 Route Handler 内部完成
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 