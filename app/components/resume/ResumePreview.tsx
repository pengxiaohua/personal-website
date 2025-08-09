'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import ResumeAvatar from './ResumeAvatar'

interface ResumePreviewProps {
  content: string
  theme: string
  fontSize: string
  zoom: number
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  content,
  theme,
  fontSize,
  zoom
}) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'blue':
        return 'bg-blue-50 text-blue-900'
      case 'green':
        return 'bg-green-50 text-green-900'
      case 'purple':
        return 'bg-purple-50 text-purple-900'
      case 'orange':
        return 'bg-orange-50 text-orange-900'
      default:
        return 'bg-white text-gray-900'
    }
  }

  const getThemeAccent = () => {
    switch (theme) {
      case 'blue':
        return 'text-blue-600 border-blue-200'
      case 'green':
        return 'text-green-600 border-green-200'
      case 'purple':
        return 'text-purple-600 border-purple-200'
      case 'orange':
        return 'text-orange-600 border-orange-200'
      default:
        return 'text-gray-600 border-gray-200'
    }
  }

  return (
    <div 
      className={`min-h-screen p-8 ${getThemeStyles()}`}
      style={{ 
        fontSize: `${fontSize}px`,
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
        width: `${100 / zoom}%`
      }}
    >
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          {/* 头像区域 */}
          <div className="flex justify-end mb-6">
            <ResumeAvatar alt="小机智" size="lg" />
          </div>
          
          <div className={`prose prose-lg max-w-none ${getThemeAccent()}`}>
            <ReactMarkdown
              components={{
              h1: ({ children }) => (
                <h1 className={`text-3xl font-bold mb-4 ${getThemeAccent()}`}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className={`text-2xl font-semibold mb-3 mt-6 ${getThemeAccent()}`}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className={`text-xl font-medium mb-2 mt-4 ${getThemeAccent()}`}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-3 leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-3 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-3 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic">
                  {children}
                </em>
              ),
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  className={`text-blue-600 hover:text-blue-800 underline ${getThemeAccent()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <img 
                  src={src} 
                  alt={alt} 
                  className="max-w-full h-auto rounded-lg shadow-md my-4"
                />
              ),
              hr: () => (
                <hr className={`border-t-2 my-6 ${getThemeAccent()}`} />
              ),
              blockquote: ({ children }) => (
                <blockquote className={`border-l-4 pl-4 italic ${getThemeAccent()}`}>
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse border border-gray-300">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-300 px-4 py-2">
                  {children}
                </td>
              )
            }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumePreview 