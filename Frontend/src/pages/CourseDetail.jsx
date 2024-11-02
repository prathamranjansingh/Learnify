import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import CourseHeader from '@/components/common/CourseHeader'
import CourseDescription from '@/components/common/CourseDescription'
import CourseContent from '@/components/common/CourseContent'

export default function CourseDetail() {
  const [course, setCourse] = useState(null)
  const { courseId } = useParams()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/courses/${courseId}`)
        setCourse(response.data)
        console.log(course);
        
      } catch (error) {
        console.error('Failed to fetch course:', error)
      }
    }
    fetchCourse()
  }, [courseId])

  const handleEnroll = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/courses/${courseId}/enroll`)
      alert('Enrolled successfully!')
    } catch (error) {
      console.error('Failed to enroll:', error)
      alert('Failed to enroll. Please try again.')
    }
  }

  if (!course) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <CourseHeader title={course.title} />
          <CourseDescription description={course.description} />
          <CourseContent course={course} />
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {course.duration} minutes
                    </p>
                  </div>
                </div>
                <Button className="w-full" onClick={handleEnroll}>Enroll Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}