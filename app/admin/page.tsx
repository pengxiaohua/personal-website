import { prisma } from '@/lib/prisma'

export default async function AdminPage() {
  const books = await prisma.book.count()
  const records = await prisma.readingRecord.count()

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">后台管理</h1>
      <div className="space-y-2">
        <div>图书总数：{books}</div>
        <div>打卡记录数：{records}</div>
      </div>
      <p className="text-sm text-gray-400 mt-4">接口：/api/reading/* （Basic Auth）</p>
    </main>
  )
}


