import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from '@/components/ui/progress';

// Mock user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://via.placeholder.com/100",
  completedCourses: 2,
  totalCourses: 5,
};

// Mock course data
const courses = [
  { id: 1, name: "Introduction to React", progress: 100 },
  { id: 2, name: "Advanced JavaScript", progress: 100 },
  { id: 3, name: "Node.js Fundamentals", progress: 60 },
  { id: 4, name: "CSS Mastery", progress: 30 },
  { id: 5, name: "Python for Beginners", progress: 0 },
];

const ProfilePage = () => {
  const completionPercentage = (user.completedCourses / user.totalCourses) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              {user.completedCourses > 0 && (
                <Badge className="mt-2" variant="secondary">
                  Course Completer
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Course Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between">
              <span>Overall Progress</span>
              <span>{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={completionPercentage} className="w-full" />
            <p className="mt-2 text-sm text-gray-500">
              {user.completedCourses} out of {user.totalCourses} courses completed
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{course.name}</h3>
                  <Progress value={course.progress} className="mt-2 w-full" />
                </div>
                <span className="ml-4 text-sm font-medium">{course.progress}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

