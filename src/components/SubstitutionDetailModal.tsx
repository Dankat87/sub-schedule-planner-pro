
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubstitutionWithDetails, Teacher } from "@/types/substitution";
import WeekCalendar from "./WeekCalendar";
import TeacherList from "./TeacherList";
import { Button } from "@/components/ui/button";
import SubstitutionStatusBadge from "./SubstitutionStatusBadge";

interface SubstitutionDetailModalProps {
  substitution: SubstitutionWithDetails | null;
  allTeachers: Teacher[];
  onClose: () => void;
  onAssignSubstitute: (
    substitutionId: string, 
    substituteTeacherId: string
  ) => void;
}

const SubstitutionDetailModal: React.FC<SubstitutionDetailModalProps> = ({
  substitution,
  allTeachers,
  onClose,
  onAssignSubstitute,
}) => {
  const [overlayTeachers, setOverlayTeachers] = useState<Teacher[]>([]);
  
  if (!substitution) return null;

  // Mock class lessons data - In a real app, this would come from an API
  const classLessons = [
    // Monday
    { day: 0, period: 1, subject: "Math" },
    { day: 0, period: 2, subject: "English" },
    { day: 0, period: 4, subject: substitution.subject.name },
    { day: 0, period: 6, subject: "History" },
    // Tuesday
    { day: 1, period: 2, subject: "Physics" },
    { day: 1, period: 3, subject: substitution.subject.name },
    { day: 1, period: 5, subject: "Art" },
    { day: 1, period: 7, subject: "PE" },
    // Wednesday
    { day: 2, period: 1, subject: "Chemistry" },
    { day: 2, period: 3, subject: "Math" },
    { day: 2, period: 4, subject: substitution.subject.name },
    { day: 2, period: 6, subject: "Biology" },
    // Thursday
    { day: 3, period: 2, subject: "English" },
    { day: 3, period: 4, subject: "History" },
    { day: 3, period: 5, subject: substitution.subject.name },
    { day: 3, period: 7, subject: "Music" },
    // Friday
    { day: 4, period: 1, subject: "Geography" },
    { day: 4, period: 3, subject: "Math" },
    { day: 4, period: 5, subject: "PE" },
    { day: 4, period: 6, subject: substitution.subject.name },
    // Add the selected substitution lesson if not already included
    { 
      day: substitution.day, 
      period: substitution.period, 
      subject: substitution.subject.name 
    },
  ];

  // Remove duplicates
  const uniqueClassLessons = classLessons.filter(
    (lesson, index, self) =>
      index ===
      self.findIndex(
        (l) => l.day === lesson.day && l.period === lesson.period
      )
  );

  const handleTeacherClick = (teacher: Teacher) => {
    setOverlayTeachers((current) => {
      const isSelected = current.some((t) => t.id === teacher.id);
      
      if (isSelected) {
        return current.filter((t) => t.id !== teacher.id);
      } else {
        return [...current, teacher];
      }
    });
  };

  const handleAssignSubstitute = (teacherId: string) => {
    onAssignSubstitute(substitution.id, teacherId);
    onClose();
  };

  // Filter for available teachers based on subject and time slot
  const availableTeachers = allTeachers.filter(teacher => 
    teacher.id !== substitution.originalTeacher.id &&
    teacher.availability.some(
      a => a.day === substitution.day && 
           a.period === substitution.period && 
           a.available
    )
  );

  return (
    <Dialog open={!!substitution} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              Substitution Details - {substitution.class.name} - {substitution.subject.name}
            </div>
            <SubstitutionStatusBadge isAssigned={substitution.isAssigned} />
          </DialogTitle>
          <DialogDescription>
            Original Teacher: {substitution.originalTeacher.name}
          </DialogDescription>
        </DialogHeader>

        {/* Content area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Calendar column (takes 2/3 of space) */}
          <div className="md:col-span-2 overflow-auto">
            <WeekCalendar
              selectedSubstitution={substitution}
              overlayTeachers={overlayTeachers}
              classLessons={uniqueClassLessons}
            />
          </div>

          {/* Teacher list column (takes 1/3 of space) */}
          <div className="md:col-span-1 flex flex-col">
            <TeacherList
              teachers={availableTeachers}
              selectedTeachers={overlayTeachers}
              onTeacherClick={handleTeacherClick}
            />

            {/* Assignment actions */}
            <div className="mt-6 border-t pt-4">
              <h4 className="font-medium mb-2">Assign Substitute</h4>
              {overlayTeachers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Select a teacher from the list to view their schedule and assign them
                </p>
              ) : (
                <div className="space-y-2">
                  {overlayTeachers.map(teacher => (
                    <Button 
                      key={teacher.id} 
                      className="w-full"
                      onClick={() => handleAssignSubstitute(teacher.id)}
                    >
                      Assign {teacher.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubstitutionDetailModal;
