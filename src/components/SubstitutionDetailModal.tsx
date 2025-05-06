
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubstitutionWithDetails, Teacher } from "@/types/substitution";
import SubstitutionStatusBadge from "./SubstitutionStatusBadge";
import TeacherSelector from "./substitution/TeacherSelector";
import SubstitutionDetails from "./substitution/SubstitutionDetails";
import SubstitutionCalendarView from "./substitution/SubstitutionCalendarView";

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
    // Add the selected substitution lesson
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

        {/* Main layout */}
        <div className="flex flex-col gap-6 flex-1 overflow-hidden">
          {/* First row - Teacher selection */}
          <TeacherSelector 
            teachers={allTeachers}
            originalTeacherId={substitution.originalTeacher.id}
            substitutionDay={substitution.day}
            substitutionPeriod={substitution.period}
            selectedTeachers={overlayTeachers}
            onTeacherSelect={handleTeacherClick}
            onAssignSubstitute={handleAssignSubstitute}
          />
          
          {/* Second row - Calendar and details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            {/* Calendar view (takes 2/3 of space) */}
            <div className="md:col-span-2">
              <SubstitutionCalendarView 
                substitution={substitution}
                overlayTeachers={overlayTeachers}
                classLessons={uniqueClassLessons}
              />
            </div>
            
            {/* Substitution details (takes 1/3 of space) */}
            <div className="md:col-span-1">
              <SubstitutionDetails
                day={substitution.day}
                period={substitution.period}
                date={substitution.date}
                className={substitution.class.name}
                subjectName={substitution.subject.name}
                originalTeacherName={substitution.originalTeacher.name}
                isAssigned={substitution.isAssigned}
                substituteTeacherName={substitution.substituteTeacher?.name}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubstitutionDetailModal;
