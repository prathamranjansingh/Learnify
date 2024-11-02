import React from 'react'

export default function CourseDescription({ description }) {
  return (
    <div className="mb-8 prose max-w-none">
      <p>{description}</p>
    </div>
  )
}