import Link from "next/link";

export default function BlogPage() {
  const blogPosts = [
    {
      title: "如何成为一名优秀的全栈开发者",
      excerpt: "分享我从前端到全栈的成长经历，以及一些实用的学习方法和技巧...",
      date: "2024-01-15",
      readTime: "5 分钟",
      tags: ["全栈开发", "职业发展", "技术分享"],
      slug: "how-to-become-fullstack-developer"
    },
    {
      title: "Next.js 15 新特性详解",
      excerpt: "深入探讨 Next.js 15 的新功能，包括 App Router、Server Components 等...",
      date: "2024-01-10",
      readTime: "8 分钟",
      tags: ["Next.js", "React", "前端开发"],
      slug: "nextjs-15-new-features"
    },
    {
      title: "远程工作的那些事儿",
      excerpt: "作为一名远程工作者，分享我的工作经验和生活感悟...",
      date: "2024-01-05",
      readTime: "6 分钟",
      tags: ["远程工作", "生活感悟", "工作经验"],
      slug: "remote-work-experience"
    }
  ];

  const categories = [
    { name: "技术分享", count: 12 },
    { name: "职业发展", count: 8 },
    { name: "生活感悟", count: 6 },
    { name: "项目经验", count: 10 }
  ];

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* 头部导航 */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="text-blue-500 hover:underline">
          ← 返回主页
        </Link>
      </div>

      {/* 博客头部 */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          全栈小华的博客
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          分享技术心得、职业感悟和生活点滴
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主要内容区域 */}
        <div className="lg:col-span-3">
          <div className="space-y-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-[0_4px_18px_0_rgba(0,0,0,0.25)] hover:border-[#008bf8] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span>{post.readTime}阅读</span>
                </div>
              </article>
            ))}
          </div>

          {/* 分页 */}
          <div className="flex justify-center mt-12">
            <nav className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                1
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                2
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                3
              </button>
            </nav>
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* 关于博客 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                关于博客
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                这里记录我的技术学习、工作经验和生活感悟。希望能够帮助到同样在技术路上前行的朋友们。
              </p>
            </div>

            {/* 分类 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                分类
              </h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({category.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 最新文章 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                最新文章
              </h3>
              <div className="space-y-3">
                {blogPosts.slice(0, 3).map((post, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <Link href={`/blog/${post.slug}`} className="text-sm text-gray-700 hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="text-center text-gray-500 text-sm py-8 mt-12">
        <p>© {new Date().getFullYear()} xiaohua.run - 保留所有权利</p>
      </footer>
    </main>
  );
} 