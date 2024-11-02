import React from 'react'

export default function CourseHeader({ title }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  )
}