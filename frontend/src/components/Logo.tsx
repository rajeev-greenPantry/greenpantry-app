import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`logo-container ${className}`}>
      {/* Logo Icon */}
      <img
        src="/GreenPantry logo.png"
        alt="GreenPantry Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>
          GreenPantry
        </span>
      )}
    </div>
  )
}

export default Logo