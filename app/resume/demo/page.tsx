'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Edit3, Eye, Download, Palette } from 'lucide-react'

export default function ResumeDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Markdown简历编辑器
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            功能强大的在线简历编辑器，支持实时预览、多种主题、PDF导出等功能。
            让简历制作变得简单高效。
          </p>
          <Link href="/resume">
            <Button size="lg" className="text-lg px-8 py-4">
              开始编辑简历
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* 功能特性 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Edit3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Markdown编辑</h3>
            <p className="text-gray-600">
              支持完整的Markdown语法，实时预览编辑效果
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">实时预览</h3>
            <p className="text-gray-600">
              编辑时实时显示渲染效果，所见即所得
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Palette className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">多种主题</h3>
            <p className="text-gray-600">
              提供多种主题色彩，个性化定制简历样式
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Download className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">PDF导出</h3>
            <p className="text-gray-600">
              一键导出PDF格式，完美适配打印需求
            </p>
          </div>
        </div>

        {/* 示例简历预览 */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">示例简历预览</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">小机智</h1>
                  <p className="text-gray-600">后台研发工程师</p>
                  <p className="text-gray-600">(+86)188-0123-4567 | example@qq.com</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  小
                </div>
              </div>
              
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">教育经历</h2>
                  <div className="space-y-2">
                    <p><strong>2016.09 - 2019.07</strong> 中国科学院大学计算技术研究所</p>
                    <p><strong>2012.09 - 2016.07</strong> 大连理工大学软件学院</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">项目经历</h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-gray-900">DRG 采集系统和数据分析系统</h3>
                      <p className="text-gray-600 text-sm">前端负责人 | 2018.01 - 2018.07</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">施工团队协作系统 Plate</h3>
                      <p className="text-gray-600 text-sm">项目负责人 | 2017.10 - 2017.12</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* 开始使用 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">准备开始制作你的简历了吗？</h2>
          <p className="text-gray-600 mb-8">
            免费使用，无需注册，立即开始创建专业的简历
          </p>
          <Link href="/resume">
            <Button size="lg" className="text-lg px-8 py-4">
              立即开始
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 