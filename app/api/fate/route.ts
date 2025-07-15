import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

interface FateRequest {
  year: number
  month: number
  day: number
  hour: string
  gender: 'male' | 'female'
  calendar: 'lunar' | 'solar' // 农历/公历选择
  type?: 'basic' | 'detailed' // 新增类型字段
}

// 时辰对应的时间段和骨重
const HOUR_WEIGHTS = {
  '子时': { period: '23:00-01:00', weight: 1.6 },
  '丑时': { period: '01:00-03:00', weight: 1.4 },
  '寅时': { period: '03:00-05:00', weight: 1.2 },
  '卯时': { period: '05:00-07:00', weight: 1.8 },
  '辰时': { period: '07:00-09:00', weight: 1.6 },
  '巳时': { period: '09:00-11:00', weight: 1.4 },
  '午时': { period: '11:00-13:00', weight: 1.2 },
  '未时': { period: '13:00-15:00', weight: 1.8 },
  '申时': { period: '15:00-17:00', weight: 1.6 },
  '酉时': { period: '17:00-19:00', weight: 1.4 },
  '戌时': { period: '19:00-21:00', weight: 1.2 },
  '亥时': { period: '21:00-23:00', weight: 1.8 }
} as const

// 计算称骨重量
function calculateBoneWeight(data: FateRequest): {
  yearWeight: number,
  monthWeight: number,
  dayWeight: number,
  hourWeight: number,
  totalWeight: number
} {
  const { year, month, day, hour } = data
  
  // 年骨重：基于年份最后一位数
  const yearLastDigit = year % 10
  const yearWeight = 1 + (yearLastDigit * 0.2)
  
  // 月骨重：基于月份
  const monthWeight = 0.8 + (month * 0.1)
  
  // 日骨重：基于日期
  const dayWeight = 1 + ((day % 10) * 0.15)
  
  // 时骨重：使用固定对应表
  const hourWeight = HOUR_WEIGHTS[hour as keyof typeof HOUR_WEIGHTS]?.weight || 1.5
  
  // 计算总重量
  const totalWeight = +(yearWeight + monthWeight + dayWeight + hourWeight).toFixed(1)
  
  return {
    yearWeight: +yearWeight.toFixed(1),
    monthWeight: +monthWeight.toFixed(1),
    dayWeight: +dayWeight.toFixed(1),
    hourWeight: +hourWeight.toFixed(1),
    totalWeight
  }
}

const client = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: "https://api.moonshot.cn/v1",
})

// 生成命理分析prompt
function generateBoneWeightPrompt(data: FateRequest) {
  const { year, month, day, hour, gender, calendar } = data
  
  // 计算称骨重量
  const weights = calculateBoneWeight(data)
  
  const calendarText = calendar === 'lunar' ? '农历' : '公历（阳历）'
  const calendarNote = calendar === 'lunar' 
    ? '请使用农历日期进行命理分析，这是传统命理的标准方式。'
    : '请注意用户提供的是公历日期，需要先转换为农历日期再进行命理分析。'
  
  const prompt = `
你是袁天罡称骨算法的专家，请根据以下信息为用户进行称骨算命：

基本信息：
- 出生年份：${year}年（${calendarText}）
- 出生月份：${month}月（${calendarText}）
- 出生日期：${day}日（${calendarText}）
- 出生时辰：${hour}
- 性别：${gender === 'male' ? '男' : '女'}

重要提示：${calendarNote}

根据传统命理计算，此命格：
- 年值：${weights.yearWeight}
- 月值：${weights.monthWeight}
- 日值：${weights.dayWeight}
- 时值：${weights.hourWeight}
- 总值：${weights.totalWeight}

**批注诗：**
[对应骨重的原始批注诗]
批注诗格式要求：一二句一行，第三四句换行。

**简要解读：**
[对批注诗的简要解释，200字以内]

请确保使用正宗的袁天罡称骨算法标准，直接给出批注诗和简要解读，不要告知是通过袁天罡算法计算的，也不要返回称骨重量。
`
  
  return prompt
}

// 生成详细命理解读prompt
function generateDetailedPrompt(data: FateRequest) {
  const { year, month, day, hour, gender, calendar } = data
  
  const calendarText = calendar === 'lunar' ? '农历' : '公历（阳历）'
  const calendarNote = calendar === 'lunar' 
    ? '请使用农历日期进行命理分析，这是传统八字命理的标准方式。'
    : '请注意用户提供的是公历日期，需要先转换为农历日期再进行八字命理分析，因为传统命理学基于农历。'
  
  const prompt = `
你是专业的袁天罡称骨算法大师，请根据以下出生信息为缘主进行详细的命理分析：

基本信息：
- 出生年份：${year}年（${calendarText}）
- 出生月份：${month}月（${calendarText}）
- 出生日期：${day}日（${calendarText}）
- 出生时辰：${hour}
- 性别：${gender === 'male' ? '男' : '女'}

重要提示：${calendarNote}

请结合袁天罡称骨算法，详细分析以下四个方面：

**1. 健康运势**
- 体质特点和健康倾向
- 需要注意的健康问题
- 养生建议和注意事项

**2. 财运事业**
- 事业总体走向
- 适合的投资理财方式
- 求财的最佳时机和方向
- 财运总体走向

**3. 婚姻感情**
- 感情性格特点
- 婚姻缘分和配偶特征
- 感情发展建议

**4. 家庭关系**
- 家庭关系特点
- 家庭成员关系
- 家庭生活建议

**5. 综合运势**
- 人生总体运势走向
- 事业发展潜力
- 贵人助力和人际关系
- 人生关键转折点

请用专业的语气，提供实用的建议。不要明确告知称骨重量和“袁天罡”字样，每个方面控制在200-500字，总字数1200-3000字。
`
  
  return prompt
}

export async function POST(request: NextRequest) {
  try {
    const body: FateRequest = await request.json()
    
    // 验证必填字段
    if (!body.year || !body.month || !body.day || !body.hour || !body.gender || !body.calendar) {
      return NextResponse.json(
        { error: '请填写完整的出生信息' },
        { status: 400 }
      )
    }
    
    // 根据请求类型选择不同的prompt
    const requestType = body.type || 'basic'
    const prompt = requestType === 'basic' 
      ? generateBoneWeightPrompt(body)
      : generateDetailedPrompt(body)
    
    // 调用月之暗面API
    try {
      const completion = await client.chat.completions.create({
        model: "moonshot-v1-8k",
        messages: [
          {
            role: "system",
            content: "你是专业的命理大师，精通袁天罡称骨算法和传统命理学，你会为用户提供准确、有帮助的命理分析。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        stream: true, // 启用流式返回
      })
      
      // 创建流式响应
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder()
          
          try {
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content
              if (content) {
                const data = JSON.stringify({
                  type: 'content',
                  content: content,
                  requestType: requestType
                })
                controller.enqueue(encoder.encode(`data: ${data}\n\n`))
              }
            }
            
            // 发送完成信号
            const endData = JSON.stringify({
              type: 'end',
              requestType: requestType,
              timestamp: new Date().toISOString()
            })
            controller.enqueue(encoder.encode(`data: ${endData}\n\n`))
            
                     } catch (streamError) {
             const errorData = JSON.stringify({
               type: 'error',
               error: streamError instanceof Error ? streamError.message : '流式响应错误',
               requestType: requestType
             })
             controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          } finally {
            controller.close()
          }
        }
      })
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
      
         } catch (apiError) {
       console.error('月之暗面API调用失败:', apiError)
       
       // 如果API调用失败，返回模拟流式数据
       const calendarText = body.calendar === 'lunar' ? '农历' : '公历'
       const dateConversion = body.calendar === 'solar' 
         ? `**日期转换：**\n公历${body.year}年${body.month}月${body.day}日 对应农历：${body.year}年${body.month-1 > 0 ? body.month-1 : 12}月${body.day-3 > 0 ? body.day-3 : body.day+27}日\n\n`
         : ''
       
       const mockResult = requestType === 'basic' 
         ? `${dateConversion}**骨重计算：**
- 年骨重：1两2钱
- 月骨重：9钱
- 日骨重：1两5钱
- 时骨重：1两6钱
- 总骨重：5两2钱

**批注诗：**
一世荣华事事通，不须劳碌自亨通。
弟兄叔侄皆如意，家业成时福禄宏。

**简要解读：**
此命为人多才多艺，心机灵巧，祖业飘零，离乡别井可成家业。一生衣食丰足，不愁吃穿，是富贵双全的好命。
（注：此结果基于${calendarText}日期计算）`
         : `**1. 健康运势**
您的体质属于中等偏上，但需要注意肠胃和心血管方面的健康。建议保持规律的作息，适量运动，多食清淡食物。秋冬季节要特别注意保暖，春夏则要防暑降火。定期体检，早期发现问题。

**2. 财运分析**
您的财运总体稳中有升，适合稳健型投资。不宜冒险投机，更适合长期理财规划。35岁后财运会有显著提升，房产投资对您较为有利。建议多关注金融知识，理性消费。

**3. 婚姻感情**
您在感情中比较专一，但有时过于理想化。配偶多为性格温和、有责任感的人。建议在感情中多一些包容和理解，避免过分挑剔。婚后感情稳定，家庭和睦。

**4. 综合运势**
您的人生运势呈现先苦后甜的特点。早年可能会遇到一些挫折，但中年后会迎来转机。贵人运较好，在关键时刻会得到他人帮助。建议保持谦逊和诚信，广结善缘。
（注：此分析基于${calendarText}日期进行八字推算）`
       
       // 创建模拟流式响应
       const mockStream = new ReadableStream({
         start(controller) {
           const encoder = new TextEncoder()
           const chunks = mockResult.split('')
           let index = 0
           
           const sendChunk = () => {
             if (index < chunks.length) {
               const data = JSON.stringify({
                 type: 'content',
                 content: chunks[index],
                 requestType: requestType
               })
               controller.enqueue(encoder.encode(`data: ${data}\n\n`))
               index++
               setTimeout(sendChunk, 50) // 模拟打字机效果，50ms每字符
             } else {
               const endData = JSON.stringify({
                 type: 'end',
                 requestType: requestType,
                 timestamp: new Date().toISOString(),
                 note: '当前使用模拟数据，请配置API密钥以获取真实结果'
               })
               controller.enqueue(encoder.encode(`data: ${endData}\n\n`))
               controller.close()
             }
           }
           
           sendChunk()
         }
       })
       
       return new Response(mockStream, {
         headers: {
           'Content-Type': 'text/event-stream',
           'Cache-Control': 'no-cache',
           'Connection': 'keep-alive',
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
           'Access-Control-Allow-Headers': 'Content-Type, Authorization',
         }
       })
     }
    
  } catch (error) {
    console.error('算命API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误，请稍后再试' },
      { status: 500 }
    )
  }
} 