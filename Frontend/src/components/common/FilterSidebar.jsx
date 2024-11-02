import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterSidebar({ filters, onLevelChange, onDurationChange, onSubjectChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-semibold">Level</h3>
        <div className="space-y-2">
          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={level.toLowerCase()}
                checked={filters.level.includes(level)}
                onCheckedChange={() => onLevelChange(level)}
              />
              <label htmlFor={level.toLowerCase()}>{level}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold">Duration</h3>
        <div className="space-y-2">
          {['2-3 hours', '4-6 hours', '6-8 hours'].map((duration) => (
            <div key={duration} className="flex items-center space-x-2">
              <Checkbox
                id={duration.replace(' ', '-')}
                checked={filters.duration.includes(duration)}
                onCheckedChange={() => onDurationChange(duration)}
              />
              <label htmlFor={duration.replace(' ', '-')}>{duration}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold">Subject</h3>
        <Select onValueChange={onSubjectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="art">Art & Design</SelectItem>
            <SelectItem value="history">History</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}