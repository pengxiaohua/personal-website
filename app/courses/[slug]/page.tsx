import Image from "next/image";
import Link from "next/link";

// 模拟课程数据
const coursesData = {
    'web-development-basics': {
        title: 'Web开发入门',
        description: '学习HTML、CSS和JavaScript基础，开始您的网页开发之旅',
        image: '/course1.jpg',
        price: '¥299',
        duration: '8周',
        level: '初级',
        chapters: [
            '第1章：HTML基础',
            '第2章：CSS样式',
            '第3章：JavaScript入门',
            '第4章：响应式设计',
            '第5章：表单与交互',
            '第6章：网站部署'
        ]
    },
    'react-fullstack': {
        title: 'React全栈开发',
        description: '从零开始学习React框架，掌握现代前端开发技能',
        image: '/course2.jpg',
        price: '¥499',
        duration: '12周',
        level: '中级',
        chapters: [
            '第1章：React基础',
            '第2章：组件与Props',
            '第3章：状态管理',
            '第4章：Hooks深入',
            '第5章：路由与导航',
            '第6章：API集成',
            '第7章：Next.js框架',
            '第8章：全栈应用开发'
        ]
    },
    'ai-applications': {
        title: '人工智能应用',
        description: '探索AI技术在实际项目中的应用，包括机器学习和自然语言处理',
        image: '/course3.jpg',
        price: '¥699',
        duration: '16周',
        level: '高级',
        chapters: [
            '第1章：AI基础概念',
            '第2章：机器学习入门',
            '第3章：自然语言处理',
            '第4章：计算机视觉',
            '第5章：AI模型部署',
            '第6章：实际项目应用',
            '第7章：AI伦理与未来发展'
        ]
    }
};

export default function CoursePage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const course = coursesData[slug as keyof typeof coursesData];

    // 如果没有找到课程，显示错误信息
    if (!course) {
        return (
            <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
                <Link href="/" className="text-blue-500 hover:underline mb-8 inline-block">
                    ← 返回首页
                </Link>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4">课程未找到</h1>
                    <p>抱歉，您查找的课程不存在。</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
            <Link href="/" className="text-blue-500 hover:underline mb-8 inline-block">
                ← 返回首页
            </Link>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-64 relative">
                    <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-gray-600 mb-6">{course.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-700">课程时长</h3>
                            <p>{course.duration}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-700">难度级别</h3>
                            <p>{course.level}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-700">价格</h3>
                            <p className="text-red-500 font-bold">{course.price}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">课程大纲</h2>
                        <ul className="space-y-2">
                            {course.chapters.map((chapter, index) => (
                                <li key={index} className="p-3 bg-gray-50 rounded-lg">
                                    {chapter}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-center">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                            立即报名
                        </button>
                    </div>
                </div>
            </div>

            <footer className="text-center text-gray-500 text-sm py-8">
                <p>© {new Date().getFullYear()} xiaohua.run - 保留所有权利</p>
            </footer>
        </main>
    );
} 