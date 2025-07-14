'use client'

import { useState } from 'react'

interface FateFormData {
  year: number | ''
  month: number | ''
  day: number | ''
  hour: string
  gender: 'male' | 'female' | ''
  calendar: 'lunar' | 'solar' // 新增：农历/公历选择
}

export default function FateForm() {
  const [formData, setFormData] = useState<FateFormData>({
    year: '',
    month: '',
    day: '',
    hour: '',
    gender: '',
    calendar: 'lunar' // 默认使用农历
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [detailedResult, setDetailedResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDetailed, setShowDetailed] = useState(false)
  const [streamingContent, setStreamingContent] = useState<string>('')
  const [isStreaming, setIsStreaming] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证表单
    if (!formData.year || !formData.month || !formData.day || !formData.hour || !formData.gender || !formData.calendar) {
      setError('请填写完整的出生信息')
      return
    }
    
    setLoading(true)
    setError(null)
    setIsStreaming(true)
    setStreamingContent('')
    setShowDetailed(false)
    
    try {
      const response = await fetch('/api/fate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, type: 'basic' }),
      })
      
      if (!response.ok) {
        throw new Error('网络请求失败')
      }
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (!reader) {
        throw new Error('无法读取响应流')
      }
      
      let buffer = ''
      let accumulatedContent = ''
      
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          break
        }
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'content') {
                accumulatedContent += data.content
                setStreamingContent(accumulatedContent)
              } else if (data.type === 'end') {
                setIsStreaming(false)
                setResult(accumulatedContent)
                setStreamingContent('')
              } else if (data.type === 'error') {
                setError(data.error || '算命失败，请重试')
                setIsStreaming(false)
                setStreamingContent('')
              }
            } catch (parseError) {
              console.error('解析SSE数据错误:', parseError)
            }
          }
        }
      }
      
    } catch {
      setError('网络错误，请检查网络连接')
      setIsStreaming(false)
      setStreamingContent('')
    } finally {
      setLoading(false)
    }
  }

  const handleDetailedAnalysis = async () => {
    setLoading(true)
    setError(null)
    setIsStreaming(true)
    setStreamingContent('')
    
    try {
      const response = await fetch('/api/fate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, type: 'detailed' }),
      })
      
      if (!response.ok) {
        throw new Error('网络请求失败')
      }
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (!reader) {
        throw new Error('无法读取响应流')
      }
      
      let buffer = ''
      let detailedContent = ''
      
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          break
        }
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'content') {
                detailedContent += data.content
                setStreamingContent(detailedContent)
              } else if (data.type === 'end') {
                setIsStreaming(false)
                setDetailedResult(detailedContent)
                setStreamingContent('')
                setShowDetailed(true)
              } else if (data.type === 'error') {
                setError(data.error || '获取详细分析失败，请重试')
                setIsStreaming(false)
                setStreamingContent('')
              }
            } catch (parseError) {
              console.error('解析SSE数据错误:', parseError)
            }
          }
        }
      }
      
    } catch {
      setError('网络错误，请检查网络连接')
      setIsStreaming(false)
      setStreamingContent('')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FateFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (result || isStreaming) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {showDetailed ? '详细命理解读' : '袁天罡称骨算命'}
            </h2>
            <p className="text-purple-200">
              {isStreaming ? '正在生成中...' : '根据您的出生信息生成的专业分析'}
            </p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <div className="prose prose-invert max-w-none">
              <div className="text-white whitespace-pre-line leading-relaxed">
                {isStreaming ? (
                  <>
                    {streamingContent}
                    <span className="inline-block w-2 h-5 bg-white animate-pulse ml-1"></span>
                  </>
                ) : (
                  showDetailed ? detailedResult : result
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!showDetailed && !isStreaming && (
                <button
                  onClick={handleDetailedAnalysis}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  {loading ? '正在生成详细解读...' : '查看命理详情解读'}
                </button>
              )}
              
              {showDetailed && !isStreaming && (
                <button
                  onClick={() => setShowDetailed(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  返回称骨结果
                </button>
              )}
              
              {!isStreaming && (
                <button
                  onClick={() => {
                    setResult(null)
                    setDetailedResult(null)
                    setShowDetailed(false)
                    setStreamingContent('')
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  重新算命
                </button>
              )}
              
              {isStreaming && (
                <div className="flex items-center justify-center space-x-2 text-white">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>AI正在分析中，请稍候...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          请填写您的基本信息
        </h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">出生年份</label>
              <select 
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
              >
                <option value="">请选择年份</option>
                {Array.from({length: 100}, (_, i) => 2024 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white mb-2">出生月份</label>
              <select 
                value={formData.month}
                onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
              >
                <option value="">请选择月份</option>
                {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>{month}月</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white mb-2">出生日期</label>
              <select 
                value={formData.day}
                onChange={(e) => handleInputChange('day', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
              >
                <option value="">请选择日期</option>
                {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}日</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white mb-2">出生时辰</label>
              <select 
                value={formData.hour}
                onChange={(e) => handleInputChange('hour', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
              >
                <option value="">请选择时辰</option>
                <option value="子时">子时(23:00-01:00)</option>
                <option value="丑时">丑时(01:00-03:00)</option>
                <option value="寅时">寅时(03:00-05:00)</option>
                <option value="卯时">卯时(05:00-07:00)</option>
                <option value="辰时">辰时(07:00-09:00)</option>
                <option value="巳时">巳时(09:00-11:00)</option>
                <option value="午时">午时(11:00-13:00)</option>
                <option value="未时">未时(13:00-15:00)</option>
                <option value="申时">申时(15:00-17:00)</option>
                <option value="酉时">酉时(17:00-19:00)</option>
                <option value="戌时">戌时(19:00-21:00)</option>
                <option value="亥时">亥时(21:00-23:00)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-white mb-2">历法选择</label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="calendar" 
                  value="lunar"
                  checked={formData.calendar === 'lunar'}
                  onChange={(e) => handleInputChange('calendar', e.target.value as 'lunar' | 'solar')}
                  className="mr-2" 
                />
                <span className="text-white">农历（传统算命推荐）</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="calendar" 
                  value="solar"
                  checked={formData.calendar === 'solar'}
                  onChange={(e) => handleInputChange('calendar', e.target.value as 'lunar' | 'solar')}
                  className="mr-2" 
                />
                <span className="text-white">公历（阳历）</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-white mb-2">性别</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="gender" 
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female')}
                  className="mr-2" 
                />
                <span className="text-white">男</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="gender" 
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female')}
                  className="mr-2" 
                />
                <span className="text-white">女</span>
              </label>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            {loading ? '正在分析命理...' : '开始算命'}
          </button>
        </form>
      </div>
    </div>
  )
} 