# AI算命 - 又快又准

## 概述

这是一个基于 Next.js 15 开发的AI算命网站，使用子域名 `fate.xiaohua.run` 访问。用户可以输入出生年月日、时辰和性别，系统会调用大模型API生成个性化的命理分析报告。

## 功能特性

- 🔮 AI智能算命分析
- 📅 支持农历/公历日期选择
- 📱 响应式设计，支持手机和电脑
- 🎨 美观的渐变背景和毛玻璃效果
- ⚡ 实时API调用和结果展示
- 🔄 支持重新算命功能

## 技术栈

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- 大模型API (OpenAI/月之暗面/智谱AI等)

## 环境配置

### 1. 安装依赖

```bash
npm install openai
# 或者使用 pnpm
pnpm install openai
```

### 2. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# AI算命网站配置 - 使用月之暗面API
MOONSHOT_API_KEY=your_moonshot_api_key_here

# 或者使用其他大模型API
# OPENAI_API_KEY=your_openai_api_key_here
# ZHIPU_API_KEY=your_zhipu_api_key_here
# TONGYI_API_KEY=your_tongyi_api_key_here
```

### 3. 获取月之暗面API密钥

1. 访问 https://platform.moonshot.cn/
2. 注册并登录账户
3. 在控制台中创建API密钥
4. 将密钥复制到 `.env.local` 文件中

### 4. 功能说明

项目已经集成了月之暗面API，支持两阶段算命：

**第一阶段：袁天罡称骨算命**
- 用户输入出生信息后，系统会调用AI进行称骨算命
- 返回骨重计算过程和对应的批注诗
- 提供简要解读

**第二阶段：详细命理解读**
- 用户可以点击"查看命理详情解读"获取详细分析
- 包含健康、财运、婚姻、综合运势四个方面
- 每个方面都有详细的分析和建议

### 5. 历法说明

**农历 vs 公历的重要性**

- **农历（阴历）**：传统中国历法，基于月相变化，是传统算命的标准
- **公历（阳历）**：现代国际通用历法，基于太阳运行周期

**为什么推荐使用农历？**

1. **传统算命基础**：袁天罡称骨算法、八字命理都基于农历
2. **更准确的结果**：农历与中国传统文化和天文历法紧密结合
3. **避免转换误差**：直接使用农历可以避免公历转农历的计算误差

**公历用户无需担心**

- 如果您只知道公历日期，系统会自动转换为农历
- AI会准确处理日期转换过程
- 在结果中会显示转换后的农历日期

### 6. API调用示例

项目中的API调用代码：

```typescript
const client = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: "https://api.moonshot.cn/v1",
})

const completion = await client.chat.completions.create({
  model: "moonshot-v1-8k",
  messages: [
    {
      role: "system",
      content: "你是专业的命理大师，精通袁天罡称骨算法和传统命理学"
    },
    {
      role: "user",
      content: prompt
    }
  ],
  temperature: 0.7,
})
```

## 域名配置

### 1. DNS配置

在您的域名DNS管理中添加子域名记录：

```
类型: CNAME
主机记录: fate
记录值: xiaohua.run
```

### 2. 中间件配置

项目中的 `middleware.ts` 已经配置了 `fate` 子域名支持：

```typescript
case 'fate':
  return NextResponse.rewrite(new URL('/fate', request.url))
```

### 3. 部署配置

如果使用Vercel部署，在项目设置中添加自定义域名：
- 主域名: `xiaohua.run`
- 子域名: `fate.xiaohua.run`

## 文件结构

```
app/fate/
├── page.tsx                 # 主页面
├── components/
│   └── FateForm.tsx         # 交互式表单组件
└── README.md               # 配置说明

app/api/fate/
└── route.ts                # API路由处理
```

## 使用说明

1. 访问 `https://fate.xiaohua.run`
2. 填写出生年月日、时辰和性别
3. **选择历法类型**：
   - **农历（推荐）**：传统算命的标准方式，更准确
   - **公历（阳历）**：现代常用日期，系统会自动转换为农历
4. 点击"开始算命"按钮
5. 查看**袁天罡称骨算命**结果：
   - 如选择公历，会显示日期转换过程
   - 骨重计算过程
   - 对应的批注诗
   - 简要解读
6. 点击"查看命理详情解读"获取详细分析：
   - 健康运势分析
   - 财运投资建议
   - 婚姻感情指导
   - 综合运势预测
7. 可以在两个结果之间切换查看
8. 点击"重新算命"进行新的分析

## 开发调试

本地开发时可以使用以下方式测试：

```bash
# 启动开发服务器
npm run dev

# 在hosts文件中添加（可选）
127.0.0.1 fate.localhost
```

然后访问 `http://fate.localhost:3000` 或 `http://localhost:3000`

## 自定义配置

### 修改界面样式

编辑 `app/fate/page.tsx` 和 `app/fate/components/FateForm.tsx` 文件来自定义界面样式。

### 修改算命逻辑

编辑 `app/api/fate/route.ts` 文件中的 `generateFatePrompt` 函数来调整算命prompt。

### 添加新功能

可以在 `app/fate/` 目录下添加新的页面和组件来扩展功能。

## 注意事项

1. 确保API密钥安全，不要提交到代码仓库
2. 考虑API调用频率限制和成本
3. 可以添加用户验证和访问控制
4. 建议添加错误处理和日志记录
5. 考虑缓存机制以提高性能

## 联系方式

如有问题或建议，请联系开发者。 