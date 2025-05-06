
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Teacher } from "@/types/substitution";
import { Button } from "@/components/ui/button";

interface TeacherListProps {
  teachers: Teacher[];
  selectedTeachers: Teacher[];
  onTeacherClick: (teacher: Teacher) => void;
}

const TeacherList: React.FC<TeacherListProps> = ({
  teachers,
  selectedTeachers,
  onTeacherClick,
}) => {
  const isTeacherSelected = (teacherId: string) => {
    return selectedTeachers.some((t) => t.id === teacherId);
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="font-medium mb-2">Available Substitute Teachers</h3>
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-4">
          {teachers.map((teacher) => (
            <Button
              key={teacher.id}
              variant={isTeacherSelected(teacher.id) ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onTeacherClick(teacher)}
            >
              <div className="flex flex-col items-start">
                <span>{teacher.name}</span>
                <span className="text-xs text-muted-foreground">
                  {teacher.subjects.join(", ")}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TeacherList;
