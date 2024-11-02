import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import FilterSidebar from '@/components/common/FilterSidebar';

import Footer from '@/components/common/Footer';
import CourseCard from '@/components/common/CourseCard';


export default function CourseListing() {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: [],
    category: [],
    duration: [],
    subject: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/courses`);
        setCourses(response.data);
        console.log(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    
    fetchCourses();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(prev[filterType])
        ? prev[filterType].includes(value)
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value]
        : value
    }));
  };

  const filteredCourses = courses.filter(course => {
    return (
      (filters.difficulty.length === 0 || filters.difficulty.includes(course.difficulty)) &&
      (filters.category.length === 0 || filters.category.includes(course.category)) &&
      (filters.duration.length === 0 || filters.duration.includes(course.duration.toString())) &&
      (filters.subject === '' || course.title.toLowerCase().includes(filters.subject.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
 

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Cambridge Institution Courses</h1>
            <p className="text-sm text-muted-foreground mt-2">
              A collection of free online arts and research courses provided by the Virtual Smithsonian
            </p>
          </div>
          
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onDifficultyChange={(value) => handleFilterChange('difficulty', value)}
              onCategoryChange={(value) => handleFilterChange('category', value)}
              onDurationChange={(value) => handleFilterChange('duration', value)}
              onSubjectChange={(value) => handleFilterChange('subject', value)}
            />
          </aside>

          <div className="space-y-6">
            <div className="lg:hidden mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <FilterSidebar
                    filters={filters}
                    onDifficultyChange={(value) => handleFilterChange('difficulty', value)}
                    onCategoryChange={(value) => handleFilterChange('category', value)}
                    onDurationChange={(value) => handleFilterChange('duration', value)}
                    onSubjectChange={(value) => handleFilterChange('subject', value)}
                  />
                </SheetContent>
              </Sheet>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
