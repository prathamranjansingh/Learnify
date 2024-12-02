import React, { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/progress";
import { Badge1, Badge2, Badge3 } from '../assets/badges';

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

  // Determine badges with images
  const badgeImages = [];
  if (completedCourses >= 2) badgeImages.push({ src: Badge1, title: "Achievement Unlocked: Beginner" });
  if (completedCourses >= 5) badgeImages.push({ src: Badge2, title: "Achievement Unlocked: Intermediate" });
  if (completedCourses >= 10) badgeImages.push({ src: Badge3, title: "Achievement Unlocked: Mastery" });

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
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {badgeImages.length > 0 ? (
              badgeImages.map((badge, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img src={badge.src} alt={badge.title} className="w-16 h-16" />
                  <p className="mt-2 text-sm text-center">{badge.title}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-3">No badges earned yet. Keep going!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
