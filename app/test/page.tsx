'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">组件测试页面</h1>
        
        <div className="space-y-8">
          {/* Button 组件测试 */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Button 组件</h2>
            <div className="flex gap-4 flex-wrap">
              <Button>默认按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="destructive">危险按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="link">链接按钮</Button>
            </div>
          </section>

          {/* Tooltip 组件测试 */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Tooltip 组件</h2>
            <TooltipProvider>
              <div className="flex gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button>悬停查看提示</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>这是一个工具提示</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </section>

          {/* Select 组件测试 */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Select 组件</h2>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="选择一个选项" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">选项 1</SelectItem>
                <SelectItem value="option2">选项 2</SelectItem>
                <SelectItem value="option3">选项 3</SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* 颜色测试 */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">颜色系统测试</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary text-primary-foreground p-4 rounded">Primary</div>
              <div className="bg-secondary text-secondary-foreground p-4 rounded">Secondary</div>
              <div className="bg-destructive text-destructive-foreground p-4 rounded">Destructive</div>
              <div className="bg-muted text-muted-foreground p-4 rounded">Muted</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 