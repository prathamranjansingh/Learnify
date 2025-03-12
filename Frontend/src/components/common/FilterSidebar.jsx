import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FilterSidebar = ({ filters, onDifficultyChange, onCategoryChange, onDurationChange, onSubjectChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Difficulty</h3>
          {["Beginner", "Intermediate", "Advanced"].map(difficulty => (
            <div key={difficulty} className="flex items-center space-x-2">
              <Checkbox
                id={`difficulty-${difficulty}`}
                checked={filters.difficulty.includes(difficulty)}
                onCheckedChange={() => onDifficultyChange(difficulty)}
              />
              <Label htmlFor={`difficulty-${difficulty}`}>{difficulty}</Label>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Category</h3>
          {["Programming", "Science", "Technology", "Humanities"].map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.category.includes(category)}
                onCheckedChange={() => onCategoryChange(category)}
              />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Duration</h3>
          {["150", "180", "300"].map(duration => (
            <div key={duration} className="flex items-center space-x-2">
              <Checkbox
                id={`duration-${duration}`}
                checked={filters.duration.includes(duration)}
                onCheckedChange={() => onDurationChange(duration)}
              />
              <Label htmlFor={`duration-${duration}`}>{duration} min</Label>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Course</h3>
          <Input
            type="text"
            placeholder="Search by course"
            value={filters.subject}
            onChange={(e) => onSubjectChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default FilterSidebar;
