'use client'

import Image from "next/image";
import TextPressure from "./components/common/TextPressure";
import Link from "next/link";

export default function Home() {
  // 自媒体平台数据
  const socialMedia = [
    {
      name: 'Github',
      icon: '/github.png',
      url: 'https://github.com/pengxiaohua'
    },
    {
      name: '抖音',
      icon: '/douyin.png',
      url: 'https://www.douyin.com/user/xiaohua_up'
    },
    {
      name: '小红书',
      icon: '/xiaohongshu.png',
      url: 'https://www.xiaohongshu.com/user/profile/6102837a0000000001003d5a'
    }
  ];

  // 个人项目数据
  const projects = [
    {
      title: '在线英语听写平台',
      description: '为英语学习者提供在线英语听力练习平台，包括单词、句子听写和影子跟读功能',
      image: '/listenly.png',
      url: 'https://listenly.cn',
      github: 'https://github.com/pengxiaohua/listenly'
    },
    {
      title: 'AI智能算命',
      description: '一个基于AI算命的网站，输入出生日期和时间，快速生成详细的算命结果',
      image: '/fate.png',
      url: 'https://xiaohua.run/fate',
      github: 'https://github.com/personal-website'
    },
    {
      title: '在线简历编辑平台',
      description: '在线简历编辑和生成导出的平台, 支持多种简历模板和样式',
      image: '',
      url: 'https://xiaohua.run/resume',
      github: 'https://github.com/pengxiaohua/resume-editor'
    },
  ];

  // 课程数据
  const courses = [
    {
      title: '大前端面试指南',
      description: '学习HTML、CSS和JavaScript基础，开始您的网页开发之旅',
      image: '/interview.png',
      slug: 'web-development-basics'
    },
    {
      title: 'React&Nodejs全栈开发',
      description: '从零开始学习React框架，掌握现代前端开发技能',
      image: '/full-stack.png',
      slug: 'react-fullstack'
    },
    {
      title: '人工智能应用',
      description: '探索AI技术在实际项目中的应用',
      image: '/ai-components.png',
      slug: 'ai-applications'
    }
  ];

  // 好书推荐数据
  const books = [
    {
      title: '《JavaScript高级程序设计》',
      description: '深入理解JavaScript语言的核心概念和高级特性，是前端开发者的必读之作。',
      image: '/js-advanced.png',
    },
    {
      title: '《React进阶》',
      description: '掌握React框架的深入概念和最佳实践，提升前端开发效率和代码质量。',
      image: '/react-advanced.png',
    },
    {
      title: '《Node.js实战》',
      description: '从零开始学习Node.js，掌握服务器端开发和API设计，构建高性能应用。',
      image: '/nodejs-advanced.png',
    },
  ];

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* 顶部Logo */}
      <div className="flex justify-center mb-12">
      <TextPressure
        text="XIAOHUA.RUN!"
        flex={true}
        alpha={false}
        stroke={false}
        width={true}
        weight={true}
        italic={true}
        textColor="#ffffff"
        strokeColor="#ff0000"
        minFontSize={36}
      />
      </div>

      {/* 个人简介部分 */}
      <section className="mb-12 relative">
        <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          关于我
        </h2>
        <div className="bg-[rgb(var(--card-background))] p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-[0_4px_18px_0_rgba(0,0,0,0.25)] hover:border-[#008bf8] relative overflow-hidden backdrop-blur-sm border border-opacity-10 border-white dark:border-gray-700">
          {/* 装饰性背景元素 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl transform -translate-x-20 translate-y-20"></div>
          
          {/* 内容区域 */}
          <div className="relative space-y-4">
            <p className="text-lg leading-relaxed text-white opacity-90">
              你好！我是
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 mx-1">
                全栈小华
              </span>
              ，一名充满热情的全栈开发者。
            </p>

            <p className="text-lg leading-relaxed text-white opacity-90">
              11年软件开发经验，先后在阿里巴巴、小米任职。
            </p>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/5 to-teal-500/5 rounded-xl border border-blue-200/10 dark:border-blue-900/30">
              <p className="text-lg leading-relaxed text-white opacity-90 italic">
                &quot;<b>梦想：</b>做一个纯粹的程序员，可以背着电脑，开着车，到处旅行，
                累了找一家咖啡馆坐下来，打开电脑做自己感兴趣的项目。&quot;
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                远程开发
              </span>
              <span className="px-3 py-1 text-sm rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300">
                全栈开发
              </span>
              <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                自由职业
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 自媒体账号部分 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">关注我</h2>
        <div className="flex flex-wrap justify-center gap-15">
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
              <span className="text-white underline">{platform.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* 个人项目部分 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">个人项目</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.title} className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_4px_18px_0_rgba(0,0,0,0.25)] hover:border-[#008bf8]">
              <div className="h-48 relative bg-black">
                {
                  project.image ? <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  /> :
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">Coming Soon...</div>
                }
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
                    className="text-blue-500 hover:text-blue-700 text-sm"
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
        <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">我的课程</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.title}
              // href={`/courses/${course.slug}`}
              href=''
              className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_4px_18px_0_rgba(0,0,0,0.25)] hover:border-[#008bf8] block"
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

      {/* 好书推荐部分 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">好书推荐</h2>
        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-scroll hover:pause-scroll">
            {books.map((book) => (
              <div key={book.title} className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="h-32 mb-3 flex items-center justify-center">
                  <Image
                    src={book.image}
                    alt={book.title}
                    width={128}
                    height={128}
                    className="rounded-md"
                  />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{book.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{book.description}</p>
              </div>
            ))}
                         {/* 重复书籍列表以实现无缝滚动 */}
             {books.map((book) => (
               <div key={`${book.title}-duplicate`} className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="h-32 mb-3 flex items-center justify-center">
                  <Image
                    src={book.image}
                    alt={book.title}
                    width={128}
                    height={128}
                    className="rounded-md"
                  />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{book.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{book.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="text-center text-gray-500 text-sm py-8">
        <p>© {new Date().getFullYear()} xiaohua.run - 保留所有权利</p>
      </footer>
    </main>
  );
} 