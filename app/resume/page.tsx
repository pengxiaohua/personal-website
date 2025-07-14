
import Link from "next/link";

export default function ResumePage() {
  const experiences = [
    {
      company: "小米",
      position: "高级全栈工程师",
      period: "2019-2023",
      description: "负责小米生态链产品的全栈开发，包括移动端、Web端和后端服务"
    },
    {
      company: "阿里巴巴",
      position: "全栈工程师",
      period: "2015-2019",
      description: "参与淘宝、天猫核心业务开发，负责用户体验优化和性能提升"
    }
  ];

  const skills = [
    { name: "React/Next.js", level: 95 },
    { name: "Node.js", level: 90 },
    { name: "TypeScript", level: 92 },
    { name: "Python", level: 85 },
    { name: "Docker", level: 80 },
    { name: "AWS/云服务", level: 85 }
  ];

  const projects = [
    {
      name: "Listenly - 在线英语听写平台",
      description: "为英语学习者提供智能听写练习的在线平台",
      tech: ["Next.js", "Node.js", "PostgreSQL"],
      url: "https://listenly.cn"
    }
  ];

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      {/* 头部导航 */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="text-blue-500 hover:underline">
          ← 返回主页
        </Link>
      </div>

      {/* 个人信息 */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          全栈小华
        </h1>
        <p className="text-xl text-gray-600 mb-4">Senior Full Stack Developer</p>
        <div className="flex justify-center gap-4 text-sm text-gray-500">
          <span>📧 hello@xiaohua.run</span>
          <span>📱 +86 138-0000-0000</span>
          <span>📍 武汉, 中国</span>
        </div>
      </section>

      {/* 工作经验 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          工作经验
        </h2>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-[0_4px_18px_0_rgba(0,0,0,0.25)] hover:border-[#008bf8] transition-all duration-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{exp.company}</h3>
                <span className="text-sm text-gray-500">{exp.period}</span>
              </div>
              <p className="text-blue-600 mb-3">{exp.position}</p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 技能 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          技能专长
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-gray-500">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-teal-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 项目经验 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          项目经验
        </h2>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-[0_4px_18px_0_rgba(0,0,0,0.25)] hover:border-[#008bf8] transition-all duration-300">
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-700 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tech.map((tech, techIndex) => (
                  <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <a href={project.url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                查看项目 →
              </a>
            </div>
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