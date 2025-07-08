import Image from "next/image";
import Link from "next/link";

// 模拟博客文章数据
const blogData = {
  'how-to-become-fullstack-developer': {
    title: "如何成为一名优秀的全栈开发者",
    content: `
      <h2>前言</h2>
      <p>成为一名全栈开发者是许多程序员的目标。在这篇文章中，我将分享我从前端开发者转变为全栈开发者的经历和心得。</p>
      
      <h2>技术栈的选择</h2>
      <p>选择合适的技术栈是成为全栈开发者的第一步。我推荐以下技术栈：</p>
      <ul>
        <li>前端：React/Vue.js + TypeScript</li>
        <li>后端：Node.js/Python + Express/FastAPI</li>
        <li>数据库：PostgreSQL/MongoDB</li>
        <li>部署：Docker + AWS/阿里云</li>
      </ul>
      
      <h2>学习路径</h2>
      <p>建议按照以下顺序学习：</p>
      <ol>
        <li>掌握一门前端框架</li>
        <li>学习后端开发基础</li>
        <li>了解数据库设计</li>
        <li>学习部署和运维</li>
      </ol>
      
      <h2>实践项目</h2>
      <p>理论学习固然重要，但实践更加关键。我建议从以下项目开始：</p>
      <ul>
        <li>个人博客系统</li>
        <li>待办事项应用</li>
        <li>在线聊天应用</li>
        <li>电商网站</li>
      </ul>
      
      <h2>总结</h2>
      <p>成为全栈开发者需要持续学习和实践。重要的是要保持好奇心，不断挑战自己，并且要有耐心。</p>
    `,
    date: "2024-01-15",
    readTime: "5 分钟",
    tags: ["全栈开发", "职业发展", "技术分享"],
    author: "全栈小华"
  },
  'nextjs-15-new-features': {
    title: "Next.js 15 新特性详解",
    content: `
      <h2>引言</h2>
      <p>Next.js 15 带来了许多令人兴奋的新特性。本文将详细介绍这些新功能以及如何在项目中使用它们。</p>
      
      <h2>App Router 的改进</h2>
      <p>App Router 在 Next.js 15 中得到了进一步的优化和改进：</p>
      <ul>
        <li>更好的性能优化</li>
        <li>改进的错误处理</li>
        <li>更灵活的路由配置</li>
      </ul>
      
      <h2>Server Components 的增强</h2>
      <p>Server Components 现在支持更多的功能：</p>
      <ul>
        <li>更好的数据获取</li>
        <li>改进的缓存机制</li>
        <li>更好的 SEO 支持</li>
      </ul>
      
      <h2>新的 API 功能</h2>
      <p>Next.js 15 引入了一些新的 API 功能，使开发更加便捷。</p>
      
      <h2>结论</h2>
      <p>Next.js 15 是一个重要的版本更新，为开发者提供了更多的工具和功能来构建现代 Web 应用。</p>
    `,
    date: "2024-01-10",
    readTime: "8 分钟",
    tags: ["Next.js", "React", "前端开发"],
    author: "全栈小华"
  },
  'remote-work-experience': {
    title: "远程工作的那些事儿",
    content: `
      <h2>远程工作的开始</h2>
      <p>我开始远程工作已经有两年多了。这段经历让我对工作和生活有了全新的认识。</p>
      
      <h2>远程工作的优势</h2>
      <ul>
        <li>时间自由度高</li>
        <li>节省通勤时间</li>
        <li>工作环境舒适</li>
        <li>更好的工作生活平衡</li>
      </ul>
      
      <h2>面临的挑战</h2>
      <p>当然，远程工作也有一些挑战：</p>
      <ul>
        <li>沟通成本增加</li>
        <li>需要更强的自律性</li>
        <li>可能会感到孤独</li>
      </ul>
      
      <h2>我的解决方案</h2>
      <p>针对这些挑战，我采取了以下措施：</p>
      <ul>
        <li>制定严格的工作时间表</li>
        <li>定期与团队成员沟通</li>
        <li>创造良好的工作环境</li>
        <li>参加线下活动和聚会</li>
      </ul>
      
      <h2>总结</h2>
      <p>远程工作对我来说是一次很好的体验。它让我更加独立，也让我学会了如何更好地管理时间和工作。</p>
    `,
    date: "2024-01-05",
    readTime: "6 分钟",
    tags: ["远程工作", "生活感悟", "工作经验"],
    author: "全栈小华"
  }
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = blogData[slug as keyof typeof blogData];

  if (!post) {
    return (
      <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
        <Link href="/blog" className="text-blue-500 hover:underline mb-8 inline-block">
          ← 返回博客
        </Link>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">文章未找到</h1>
          <p>抱歉，您查找的文章不存在。</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      {/* 头部导航 */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/blog" className="text-blue-500 hover:underline">
          ← 返回博客
        </Link>
      </div>

      {/* 文章内容 */}
      <article className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {/* 文章头部 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-4">
              <span>作者：{post.author}</span>
              <span>发布时间：{post.date}</span>
              <span>阅读时间：{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* 文章正文 */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{
            lineHeight: '1.8',
          }}
        />

        {/* 文章底部 */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <p>如果您觉得这篇文章有帮助，请分享给更多的人。</p>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                分享文章
              </button>
            </div>
          </div>
        </footer>
      </article>

      {/* 相关文章推荐 */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          相关文章
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(blogData)
            .filter(([key]) => key !== slug)
            .slice(0, 2)
            .map(([key, relatedPost]) => (
              <Link
                key={key}
                href={`/blog/${key}`}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-[0_4px_18px_0_rgba(0,0,0,0.25)] hover:border-[#008bf8] transition-all duration-300 block"
              >
                <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors">
                  {relatedPost.title}
                </h3>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{relatedPost.date}</span>
                  <span>{relatedPost.readTime}阅读</span>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="text-center text-gray-500 text-sm py-8 mt-12">
        <p>© {new Date().getFullYear()} xiaohua.run - 保留所有权利</p>
      </footer>
    </main>
  );
} 