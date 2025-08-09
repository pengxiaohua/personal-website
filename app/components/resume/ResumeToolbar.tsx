'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Minus,
  Type,
  Download,
  Upload,
  Palette,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Github
} from 'lucide-react'

interface ResumeToolbarProps {
  onBold: () => void
  onItalic: () => void
  onUnderline: () => void
  onBulletList: () => void
  onNumberedList: () => void
  onLink: () => void
  onImage: () => void
  onDivider: () => void
  onFontSize: (size: string) => void
  onThemeChange: (theme: string) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onExport: () => void
  onImport: () => void
  currentFontSize: string
  currentTheme: string
  currentZoom: number
}

const ResumeToolbar: React.FC<ResumeToolbarProps> = ({
  onBold,
  onItalic,
  onUnderline,
  onBulletList,
  onNumberedList,
  onLink,
  onImage,
  onDivider,
  onFontSize,
  onThemeChange,
  onZoomIn,
  onZoomOut,
  onExport,
  onImport,
  currentFontSize,
  currentTheme,
  currentZoom
}) => {
  const themes = [
    { value: 'default', label: '默认' },
    { value: 'blue', label: '蓝色' },
    { value: 'green', label: '绿色' },
    { value: 'purple', label: '紫色' },
    { value: 'orange', label: '橙色' }
  ]

  const fontSizes = [
    { value: '12', label: '12px' },
    { value: '14', label: '14px' },
    { value: '16', label: '16px' },
    { value: '18', label: '18px' },
    { value: '20', label: '20px' },
    { value: '24', label: '24px' }
  ]

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
        {/* 左侧：标题和模板选择 */}
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-800">Markdown简历</h1>
          <Select value="template1" onValueChange={() => {}}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="选择模板" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="template1">模板1 普通</SelectItem>
              <SelectItem value="template2">模板2 专业</SelectItem>
              <SelectItem value="template3">模板3 创意</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 中间：编辑工具 */}
        <div className="flex items-center space-x-1">
          {/* 表格 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>插入表格</TooltipContent>
          </Tooltip>

          {/* 图片 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onImage}>
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>插入图片</TooltipContent>
          </Tooltip>

          {/* 链接 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onLink}>
                <Link className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>插入链接</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* 缩放 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>缩小</TooltipContent>
          </Tooltip>

          <span className="text-sm text-gray-600 min-w-[3rem] text-center">{Math.round(currentZoom * 100)}%</span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>放大</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* 帮助 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>帮助</TooltipContent>
          </Tooltip>
        </div>

        {/* 右侧：文本格式和导出 */}
        <div className="flex items-center space-x-1">
          {/* 字体大小 */}
          <Select value={currentFontSize} onValueChange={onFontSize}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 文本格式 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBold}>
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>加粗</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onItalic}>
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>斜体</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onUnderline}>
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>下划线</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBulletList}>
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>无序列表</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNumberedList}>
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>有序列表</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* 文本对齐 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>左对齐</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h12" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>居中对齐</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h6" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>右对齐</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* 分割线 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDivider}>
                <Minus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>分割线</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* 主题选择 */}
          <Select value={currentTheme} onValueChange={onThemeChange}>
            <SelectTrigger className="w-24">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* 导入导出 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onImport}>
                <Upload className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>导入</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onExport}>
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>导出PDF</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Github className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>GitHub</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default ResumeToolbar 