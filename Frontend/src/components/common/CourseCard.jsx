import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
const CourseCard = ({ course }) => {
  
  
  return (
    <Link to={`/courses/${course._id}`}>
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="aspect-video relative">
        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <Badge variant="secondary">{course.duration} min</Badge>
        <Badge variant="outline">{course.difficulty}</Badge>
        <Badge>{course.category}</Badge>
      </CardFooter>
    </Card>
    </Link>
  );
}

export default CourseCard;
