import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 个人简介部分 */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-32 w-32 mb-6 ring-4 ring-white shadow-lg">
            <AvatarImage src="/avatar.jpg" alt="个人头像" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">彭小华</h1>
          <p className="text-xl text-gray-600 mb-6 animate-fade-in-delay">10年前端开发专家</p>
          <p className="max-w-2xl text-gray-600 animate-fade-in-delay-2">
            作为一名拥有10年前端开发经验的专业人士，我专注于创建优秀的用户体验和高性能的Web应用。
            我热衷于分享技术知识，帮助其他开发者成长。
          </p>
        </div>
      </section>

      {/* 自媒体频道部分 */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">我的自媒体频道</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="card-hover">
              <CardHeader>
                <CardTitle>频道 {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">这里是对频道的简短描述</p>
                <Button variant="outline">了解更多</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 产品展示部分 */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">我的产品</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <Card key={i} className="card-hover">
              <CardHeader>
                <CardTitle>产品 {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">这里是产品的详细描述</p>
                <Button>查看详情</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 课程部分 */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">我的课程</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="card-hover">
              <CardHeader>
                <CardTitle>课程 {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">这里是课程的简短描述</p>
                <Button variant="outline">立即报名</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
} 