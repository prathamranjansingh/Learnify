import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <Card key={course.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid gap-4 md:grid-cols-[240px_1fr_200px] md:gap-6">
          <div className="aspect-video overflow-hidden md:aspect-square">
            <img
              alt="Course thumbnail"
              className="object-cover w-full h-full"
              src={course.image}
            />
          </div>
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(course.rating)
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <h3 className="mt-2 text-xl font-bold">{course.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
            <div className="mt-4 flex items-center gap-4">
              <Button variant="outline" size="sm">
                Start Now
              </Button>
              <span className="text-sm text-muted-foreground">{course.duration}</span>
            </div>
          </div>
          <div className="border-t p-4 md:border-l md:border-t-0 md:p-6">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Provider:</span> {course.provider}
              </div>
              <div className="text-sm">
                <span className="font-medium">Certificate:</span> {course.certificate}
              </div>
              <div className="text-sm">
                <span className="font-medium">Level:</span> {course.level}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}