import React from 'react'
import { type LucideIcon } from 'lucide-react'

interface ProcessStepProps {
  icons: LucideIcon[]
  title: string
  description: string
}

export function ProcessStep({ icons, title, description }: ProcessStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex space-x-2">
        {icons.map((Icon, index) => (
          <div key={index} className="text-white bg-indigo-600 p-3 rounded-full">
            <Icon size={24} />
          </div>
        ))}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

