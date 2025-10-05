import Image from 'next/image'
import React from 'react'
import EmptyStateImg from '@/public/images/empty-state.png'

type EmptyStateProps = {
  message: string
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <Image
        src={EmptyStateImg}
        alt="No data"
        width={120}
        height={120}
        className="opacity-70 mb-4"
      />
      <p className="text-lg font-medium">{message}</p>
    </div>
  )
}

export default EmptyState