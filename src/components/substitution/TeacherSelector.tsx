
import React from "react";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/types/substitution";

interface TeacherSelectorProps {
  teachers: Teacher[];
  originalTeacherId: string;
  substitutionDay: number;
  substitutionPeriod: number;
  selectedTeachers: Teacher[];
  onTeacherSelect: (teacher: Teacher) => void;
  onAssignSubstitute: (teacherId: string) => void;
}

const TeacherSelector: React.FC<TeacherSelectorProps> = ({
  teachers,
  originalTeacherId,
  substitutionDay,
  substitutionPeriod,
  selectedTeachers,
  onTeacherSelect,
  onAssignSubstitute,
}) => {
  return (
    <div className="w-full">
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium mb-4">Available Teachers</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {teachers.map((teacher) => {
            const isAvailable = teacher.id !== originalTeacherId && 
              teacher.availability.some(
                a => a.day === substitutionDay && 
                    a.period === substitutionPeriod && 
                    a.available
              );
            const isSelected = selectedTeachers.some((t) => t.id === teacher.id);
            
            return (
              <Button
                key={teacher.id}
                variant={isSelected ? "default" : "outline"}
                className={`w-full h-auto py-2 px-3 justify-start ${
                  isAvailable 
                    ? "border-green-500 bg-green-50 hover:bg-green-100" 
                    : "text-gray-500 hover:text-gray-700"
                } ${isSelected ? "ring-2 ring-offset-1 bg-green-800 hover:bg-green-700" : ""}`}
                onClick={() => isAvailable ? onTeacherSelect(teacher) : null}
                disabled={!isAvailable}
              >
                <div className="flex flex-col items-start text-left">
                  <span className={`${isAvailable ? "font-medium" : "font-normal"} ${isSelected ? "text-white" : ""}`}>
                    {teacher.name}
                  </span>
                  <span className={`text-xs truncate max-w-full ${isSelected ? "text-white/90" : ""}`}>
                    {teacher.subjects.join(", ")}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Action buttons for selected teachers */}
      {selectedTeachers.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedTeachers.map(teacher => (
            <Button 
              key={teacher.id}
              onClick={() => onAssignSubstitute(teacher.id)}
              className="bg-green-800 hover:bg-green-700"
            >
              Assign {teacher.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherSelector;
