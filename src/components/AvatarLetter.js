import React from 'react'
import { CAvatar } from '@coreui/react'

const AvatarLetter = ({ name = '', lastName = '', src, color = 'primary', textColor = 'white', size = 'md' }) => {
  const initials = `${(name || '').trim()[0] || ''}${(lastName || '').trim()[0] || ''}`.toUpperCase()

  const sizeMap = {
    'sm': { width: '32px', height: '32px', fontSize: '0.75rem' },
    'md': { width: '48px', height: '48px', fontSize: '1rem' },
    'lg': { width: '64px', height: '64px', fontSize: '1.25rem' },
    'xl': { width: '90px', height: '90px', fontSize: '1.8rem' }
  }

  const customStyle = sizeMap[size] || sizeMap['md']

  if (src) {
    return <CAvatar src={src} style={{ width: customStyle.width, height: customStyle.height }} className="shadow-sm" />
  }

  return (
    <div
      className={`rounded-circle d-flex align-items-center justify-content-center bg-${color} text-${textColor} shadow-sm fw-bold`}
      style={{
        width: customStyle.width,
        height: customStyle.height,
        fontSize: customStyle.fontSize,
        letterSpacing: '0.5px',
        border: '2px solid white'
      }}
    >
      {initials || 'U'}
    </div>
  )
}

export default AvatarLetter
