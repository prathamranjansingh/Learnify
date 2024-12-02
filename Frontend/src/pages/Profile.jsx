import React, { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/progress";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });
      setUserProfile(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load profile data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return <p className="text-center py-8">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">{error}</p>;
  }

  const { name, email, avatar, completedCourses, totalCourses, courses } = userProfile;
  const completionPercentage = (completedCourses / totalCourses) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <img
              src={avatar || "https://via.placeholder.com/100"}
              alt={name}
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="text-gray-500">{email}</p>
              {completedCourses > 0 && (
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
              {completedCourses} out of {totalCourses} courses completed
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
