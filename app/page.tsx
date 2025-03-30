import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // 自媒体平台数据
  const socialMedia = [
    {
      name: '抖音',
      icon: '/douyin.svg',
      url: 'https://www.douyin.com/user/xiaohua'
    },
    {
      name: '微博',
      icon: '/weibo.svg',
      url: 'https://weibo.com/xiaohua'
    },
    {
      name: '微信公众号',
      icon: '/wechat.svg',
      url: '#'
    },
    {
      name: '小红书',
      icon: '/xiaohongshu.svg',
      url: 'https://www.xiaohongshu.com/user/profile/xiaohua'
    }
  ];

  // 个人项目数据
  const projects = [
    {
      title: '智能助手项目',
      description: '基于人工智能的个人助手应用，帮助用户管理日程和提高工作效率',
      image: '/project1.jpg',
      url: 'https://project1.xiaohua.run',
      github: 'https://github.com/xiaohua/project1'
    },
    {
      title: '在线学习平台',
      description: '为学生提供在线课程和学习资源的教育平台',
      image: '/project2.jpg',
      url: 'https://project2.xiaohua.run',
      github: 'https://github.com/xiaohua/project2'
    },
    {
      title: '社区论坛系统',
      description: '一个现代化的社区讨论平台，支持多种媒体内容分享',
      image: '/project3.jpg',
      url: 'https://project3.xiaohua.run',
      github: 'https://github.com/xiaohua/project3'
    }
  ];

  // 课程数据
  const courses = [
    {
      title: 'Web开发入门',
      description: '学习HTML、CSS和JavaScript基础，开始您的网页开发之旅',
      image: '/course1.jpg',
      slug: 'web-development-basics'
    },
    {
      title: 'React全栈开发',
      description: '从零开始学习React框架，掌握现代前端开发技能',
      image: '/course2.jpg',
      slug: 'react-fullstack'
    },
    {
      title: '人工智能应用',
      description: '探索AI技术在实际项目中的应用，包括机器学习和自然语言处理',
      image: '/course3.jpg',
      slug: 'ai-applications'
    }
  ];

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* 顶部Logo */}
      <div className="flex justify-center mb-12">
        <Image src="/logo.svg" alt="xiaohua.run" width={200} height={60} priority />
      </div>

      {/* 个人简介部分 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">关于我</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-700 leading-relaxed">
            你好！我是小花，一名充满热情的全栈开发者和教育工作者。我拥有超过8年的软件开发经验，
            专注于Web应用和人工智能领域。我相信技术的力量可以改变世界，并致力于通过教育和创新项目
            来实现这一目标。在我的职业生涯中，我参与开发了多个成功的商业项目，同时也热衷于分享知识，
            帮助更多人进入科技行业。
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            除了编程，我还喜欢探索新技术、阅读科技书籍和参与开源社区。我期待与志同道合的朋友一起
            合作，创造更多有价值的产品和服务。
          </p>
        </div>
      </section>

      {/* 自媒体账号部分 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4 text-center">关注我</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {socialMedia.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              className="flex flex-col items-center hover:scale-110 transition-transform"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-16 h-16 mb-2">
                <Image
                  src={platform.icon}
                  alt={platform.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </div>
              <span className="text-gray-700">{platform.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* 个人项目部分 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4 text-center">个人项目</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.title} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                <div className="flex justify-between">
                  <a
                    href={project.url}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    访问网站
                  </a>
                  <a
                    href={project.github}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 课程部分 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4 text-center">我的课程</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.title}
              href={`/courses/${course.slug}`}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 relative">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm">{course.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="text-center text-gray-500 text-sm py-8">
        <p>© {new Date().getFullYear()} xiaohua.run - 保留所有权利</p>
      </footer>
    </main>
  );
} 