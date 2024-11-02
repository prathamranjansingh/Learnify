import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import FilterSidebar from '@/components/common/FilterSidebar';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';



// Mock data for courses (unchanged)
const coursesData = [
  // ... (keep the existing course data)
];

export default function CourseListing() {
  const [courses, setCourses] = useState(coursesData);
  const [filters, setFilters] = useState({
    level: [],
    duration: [],
    subject: '',
  });

  const handleLevelChange = (level) => {
    setFilters(prev => ({
      ...prev,
      level: prev.level.includes(level)
        ? prev.level.filter(l => l !== level)
        : [...prev.level, level],
    }));
  };

  const handleDurationChange = (duration) => {
    setFilters(prev => ({
      ...prev,
      duration: prev.duration.includes(duration)
        ? prev.duration.filter(d => d !== duration)
        : [...prev.duration, duration],
    }));
  };

  const handleSubjectChange = (subject) => {
    setFilters(prev => ({ ...prev, subject }));
  };

  const filteredCourses = courses.filter(course => {
    return (
      (filters.level.length === 0 || filters.level.includes(course.level)) &&
      (filters.duration.length === 0 || filters.duration.includes(course.duration)) &&
      (filters.subject === '' || course.title.toLowerCase().includes(filters.subject.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Smithsonian Institution Courses</h1>
            <p className="text-sm text-muted-foreground">
              A collection of free online arts and research courses provided by the Virtual Smithsonian
            </p>
          </div>
          <img
            src="https://via.placeholder.com/120x40"
            alt="Smithsonian Logo"
            className="h-10 w-auto"
          />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[240px_1fr]">
          <aside className="hidden md:block">
            <FilterSidebar
              filters={filters}
              onLevelChange={handleLevelChange}
              onDurationChange={handleDurationChange}
              onSubjectChange={handleSubjectChange}
            />
          </aside>

          <div className="space-y-4">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <FilterSidebar 
                    filters={filters}
                    onLevelChange={handleLevelChange}
                    onDurationChange={handleDurationChange}
                    onSubjectChange={handleSubjectChange}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}