import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import CourseHeader from '@/components/common/CourseHeader'
import CourseDescription from '@/components/common/CourseDescription'
import CourseContent from '@/components/common/CourseContent'
import { useToast } from '@/hooks/use-toast'

export default function CourseDetail() {
  const [course, setCourse] = useState(null)
  const { courseId } = useParams()
  const { toast } = useToast()

  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/courses/${courseId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}, // Only add the header if token exists
        });
        setCourse(response.data.course);
        setIsEnrolled(response.data.isEnrolled);
      } catch (error) {
        console.error("Error fetching course details", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage
      
      if (!token) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "You need to be logged in to enroll.",
        })
        return;
      }
  
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      toast({
        title: "Enrolled successfully!",
        description: "You have successfully enrolled in the course.",
      })
    } catch (error) {
      console.error('Failed to enroll:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to enroll. Please try again.",
      })
    }
  };
  

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
                {!isEnrolled ? (
  <Button className="w-full" onClick={handleEnroll}>Enroll Now</Button>
) : (
  <Button className="w-full" disabled>Already Enrolled</Button>
)}

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}