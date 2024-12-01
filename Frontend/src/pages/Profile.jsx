import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, Clock, Star, Award, PlayCircle } from "lucide-react";
import Image from "next/image";

const BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

export default function AccountPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/details`);
        setUserData(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!userData) {
    return <p>No user data available.</p>;
  }

  const { name, email, stats, enrolledCourses, recommendedCourses } = userData;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{name}</h1>
          <p className="text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Courses Enrolled" value={stats.totalCoursesEnrolled} icon={Book} />
        <StatCard title="Hours Learned" value={stats.totalHoursLearned} icon={Clock} />
        <StatCard title="Avg. Course Rating" value={stats.averageCourseRating.toFixed(1)} icon={Star} />
        <StatCard title="Certificates Earned" value={stats.certificatesEarned} icon={Award} />
      </div>

      <h2 className="text-2xl font-semibold mb-4">My Learning</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {enrolledCourses.map((course: any) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Recommended for you</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendedCourses.map((course: any) => (
          <RecommendedCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: number | string; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <Image
          src={course.imageUrl}
          alt={course.title}
          width={250}
          height={150}
          className="w-full h-32 object-cover mb-4 rounded"
        />
        <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
        <Progress value={course.progress} className="h-2 mb-2" />
        <div className="flex justify-between text-sm">
          <span>{course.progress}% complete</span>
          <span>{course.completedLectures}/{course.totalLectures} lectures</span>
        </div>
        <Button className="w-full mt-4">
          <PlayCircle className="mr-2 h-4 w-4" /> Continue Learning
        </Button>
      </CardContent>
    </Card>
  );
}

function RecommendedCourseCard({ course }: { course: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <Image
          src={course.imageUrl}
          alt={course.title}
          width={250}
          height={150}
          className="w-full h-32 object-cover mb-4 rounded"
        />
        <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 text-yellow-400 mr-1" />
          <span className="text-sm font-medium">4.7</span>
          <span className="text-sm text-muted-foreground ml-1">(1,234 ratings)</span>
        </div>
        <Badge variant="secondary" className="mb-2">Bestseller</Badge>
        <Button variant="outline" className="w-full mt-2">Add to cart</Button>
      </CardContent>
    </Card>
  );
}
