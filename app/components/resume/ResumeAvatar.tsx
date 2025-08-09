'use client'

import React from 'react'

interface ResumeAvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const ResumeAvatar: React.FC<ResumeAvatarProps> = ({
  src,
  alt = '头像',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }

  const defaultAvatar = (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg ${className}`}>
      {alt.charAt(0).toUpperCase()}
    </div>
  )

  if (!src) {
    return defaultAvatar
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 ${className}`}
      onError={(e) => {
        // 如果图片加载失败，显示默认头像
        const target = e.target as HTMLImageElement
        target.style.display = 'none'
        target.parentElement?.appendChild(defaultAvatar)
      }}
    />
  )
}

export default ResumeAvatar 