'use client'

import React, { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import ResumeToolbar from '@/components/resume/ResumeToolbar'
import ResumePreview from '@/components/resume/ResumePreview'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Eye, Edit3, Save } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// 动态导入Markdown编辑器以避免SSR问题
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
)

// 默认简历内容
const defaultResumeContent = `# 小机智

## 联系方式
- **电话:** (+86)188-0123-4567
- **邮箱:** example@qq.com
- **求职意向:** 后台研发工程师

## 教育经历

### 2016.09 - 2019.07
- **学校:** 中国科学院大学计算技术研究所
- **专业:** 计算机系统结构
- **学位:** 硕士
- **排名:** Rank:10%

### 2012.09 - 2016.07
- **学校:** 大连理工大学软件学院
- **专业:** 软件工程(日语强化)
- **学位:** 学士
- **排名:** Rank:5%

## 个人博客
- [Blog](https://example.com) 和 [GitHub](https://github.com/example)
- 部署于 GitHub Pages, 包含精选文章、演示文稿, 阅读量20W左右的CSDN博客
- [技术词汇读音 awesome-pronunciation](https://github.com/example/awesome-pronunciation) 和 [GitHub 年度报告 github-annual-report](https://github.com/example/github-annual-report)

## 实习经历

### 2017.01 - 2017.06 IBM 中国研究院(CRL)-认知医疗部
**区块链医疗平台研发**

- IBM 认知医疗数据共享平台,共享实验数据和机器学习模型,辅助诊断与学术研究
- 完成2个区块链网络平台搭建,包括SDK和Chaincode 开发,RESTful API 封装
- **相关技术:** Hyperleger Fabric / Node.js / Golang

## 项目经历

### 2018.01 - 2018.07 DRG 采集系统和数据分析系统
**前端负责人**

- 完成 DRG采集系统设计,完成DRG数据分析系统设计和其前端开发与部署工作
- 实验室横向课题,采集医疗数据,通过数据分析为国家医保投入做技术支持和追溯
- **相关技术:** Spring/Vue.js / DevOps

### 2017.10 - 2017.12 施工团队协作系统 Plate
**项目负责人**

- 土木工程管理平台,用来帮助施工人员进行现场照片采集,任务发布和工程管理
- 完成原型设计,数据库设计,网站脚手架搭建,响应式布局实现和网站部署等工作
- **相关技术:** Node.js/Git/MySQL

### 2017.07 - 2017.10 国家互联网应急中心云平台管理系统
**模块负责人**

- 平台负责管理服务器设备中的虚拟机、数据库和容器等资源,还包括计费和预警
`

export default function ResumePage() {
  const [content, setContent] = useState(defaultResumeContent)
  const [fontSize, setFontSize] = useState('16')
  const [theme, setTheme] = useState('default')
  const [zoom, setZoom] = useState(1)
  const [isEditing, setIsEditing] = useState(true)
  const previewRef = useRef<HTMLDivElement>(null)

  // 工具栏功能处理函数
  const handleBold = () => {
    const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = content.substring(start, end)
      const newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end)
      setContent(newText)
    }
  }

  const handleItalic = () => {
    const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = content.substring(start, end)
      const newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end)
      setContent(newText)
    }
  }

  const handleUnderline = () => {
    const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = content.substring(start, end)
      const newText = content.substring(0, start) + `<u>${selectedText}</u>` + content.substring(end)
      setContent(newText)
    }
  }

  const handleBulletList = () => {
    const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const newText = content.substring(0, start) + '- ' + content.substring(start)
      setContent(newText)
    }
  }

  const handleNumberedList = () => {
    const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const newText = content.substring(0, start) + '1. ' + content.substring(start)
      setContent(newText)
    }
  }

  const handleLink = () => {
    const url = prompt('请输入链接地址:')
    const text = prompt('请输入链接文本:')
    if (url && text) {
      const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
      if (textarea) {
        const start = textarea.selectionStart
        const newText = content.substring(0, start) + `[${text}](${url})` + content.substring(start)
        setContent(newText)
      }
    }
  }

  const handleImage = () => {
    const url = prompt('请输入图片地址:')
    const alt = prompt('请输入图片描述:')
    if (url) {
      const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
      if (textarea) {
        const start = textarea.selectionStart
        const newText = content.substring(0, start) + `![${alt || ''}](${url})` + content.substring(start)
        setContent(newText)
      }
    }
  }

  const handleDivider = () => {
    const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const newText = content.substring(0, start) + '\n---\n' + content.substring(start)
      setContent(newText)
    }
  }

  const handleFontSize = (size: string) => {
    setFontSize(size)
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5))
  }

  const handleExport = async () => {
    if (previewRef.current) {
      try {
        const canvas = await html2canvas(previewRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        })
        
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgWidth = 210
        const pageHeight = 295
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        let position = 0

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }

        pdf.save('resume.pdf')
      } catch (error) {
        console.error('导出PDF失败:', error)
        alert('导出PDF失败，请重试')
      }
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.txt'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setContent(content)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 工具栏 */}
      <ResumeToolbar
        onBold={handleBold}
        onItalic={handleItalic}
        onUnderline={handleUnderline}
        onBulletList={handleBulletList}
        onNumberedList={handleNumberedList}
        onLink={handleLink}
        onImage={handleImage}
        onDivider={handleDivider}
        onFontSize={handleFontSize}
        onThemeChange={handleThemeChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onExport={handleExport}
        onImport={handleImport}
        currentFontSize={fontSize}
        currentTheme={theme}
        currentZoom={zoom}
      />

      {/* 模式切换按钮 */}
      <div className="flex justify-center space-x-4 p-4 bg-white border-b border-gray-200">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <Edit3 className="h-4 w-4" />
                <span>编辑模式</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>切换到编辑模式</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={!isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(false)}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>预览模式</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>切换到预览模式</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={handleSave}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>保存</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>保存为Markdown文件</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 主要内容区域 */}
      <div className="flex h-[calc(100vh-140px)]">
        {isEditing ? (
          <>
            {/* 编辑区域 */}
            <div className="w-1/2 border-r border-gray-200">
              <div className="h-full">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  height="100%"
                  preview="edit"
                  className="border-0"
                />
              </div>
            </div>
            
            {/* 预览区域 */}
            <div className="w-1/2 overflow-auto">
              <div ref={previewRef}>
                <ResumePreview
                  content={content}
                  theme={theme}
                  fontSize={fontSize}
                  zoom={zoom}
                />
              </div>
            </div>
          </>
        ) : (
          /* 全屏预览模式 */
          <div className="w-full overflow-auto">
            <div ref={previewRef}>
              <ResumePreview
                content={content}
                theme={theme}
                fontSize={fontSize}
                zoom={zoom}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
