import { Metadata } from 'next'
import FateForm from './components/FateForm'

export const metadata: Metadata = {
  title: '小花算命 - AI智能算命',
  description: '基于人工智能的专业算命服务',
}

export default function FatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            小花算命
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            AI智能算命，为您揭示命运密码
          </p>
        </div>
        
        <FateForm />
      </div>
    </div>
  )
} 