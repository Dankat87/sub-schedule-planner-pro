
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
import { Card } from "@/components/ui/card";
import { CalendarX } from "lucide-react";

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

  // Get the dates for the week
  const getDateString = (dayIndex: number) => {
    const date = new Date(substitution.date);
    const dayDiff = dayIndex - substitution.day;
    date.setDate(date.getDate() + dayDiff);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

        {/* New layout - First row with teacher selection */}
        <div className="flex flex-col gap-6 flex-1 overflow-hidden">
          {/* First row - Teacher selection with highlighting */}
          <div className="w-full">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-4">Available Teachers</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {allTeachers.map((teacher) => {
                  const isAvailable = teacher.id !== substitution.originalTeacher.id && 
                    teacher.availability.some(
                      a => a.day === substitution.day && 
                           a.period === substitution.period && 
                           a.available
                    );
                  const isSelected = overlayTeachers.some((t) => t.id === teacher.id);
                  
                  return (
                    <Button
                      key={teacher.id}
                      variant={isSelected ? "default" : "outline"}
                      className={`w-full h-auto py-2 px-3 justify-start ${
                        isAvailable 
                          ? "border-green-500 bg-green-50 hover:bg-green-100" 
                          : "text-gray-500 hover:text-gray-700"
                      } ${isSelected ? "ring-2 ring-offset-1" : ""}`}
                      onClick={() => isAvailable ? handleTeacherClick(teacher) : null}
                      disabled={!isAvailable}
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className={`${isAvailable ? "font-medium" : "font-normal"}`}>
                          {teacher.name}
                        </span>
                        <span className="text-xs truncate max-w-full">
                          {teacher.subjects.join(", ")}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Action buttons for selected teachers */}
            {overlayTeachers.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {overlayTeachers.map(teacher => (
                  <Button 
                    key={teacher.id}
                    onClick={() => handleAssignSubstitute(teacher.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Assign {teacher.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {/* Second row - Calendar and details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            {/* Calendar view (takes 2/3 of space) */}
            <div className="md:col-span-2 overflow-auto">
              <WeekCalendar
                selectedSubstitution={substitution}
                overlayTeachers={overlayTeachers}
                classLessons={uniqueClassLessons}
              />
            </div>
            
            {/* Substitution details (takes 1/3 of space) */}
            <div className="md:col-span-1 overflow-auto">
              <Card className="p-4 h-full">
                <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                  <CalendarX className="text-amber-600" size={20} />
                  <span>Substitution Details</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground">Date</h4>
                    <p className="font-medium">{getDateString(substitution.day)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-muted-foreground">Period</h4>
                    <p className="font-medium">Period {substitution.period}</p>
                  </div>

                  <div>
                    <h4 className="text-sm text-muted-foreground">Class</h4>
                    <p className="font-medium">{substitution.class.name}</p>
                  </div>

                  <div>
                    <h4 className="text-sm text-muted-foreground">Subject</h4>
                    <p className="font-medium">{substitution.subject.name}</p>
                  </div>

                  <div>
                    <h4 className="text-sm text-muted-foreground">Original Teacher</h4>
                    <p className="font-medium">{substitution.originalTeacher.name}</p>
                  </div>

                  <div>
                    <h4 className="text-sm text-muted-foreground">Status</h4>
                    <div className="mt-1">
                      <SubstitutionStatusBadge isAssigned={substitution.isAssigned} />
                    </div>
                  </div>
                  
                  {substitution.substituteTeacher && (
                    <div>
                      <h4 className="text-sm text-muted-foreground">Assigned To</h4>
                      <p className="font-medium">{substitution.substituteTeacher.name}</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">Instructions</h4>
                    <p className="text-sm text-muted-foreground">
                      Select a teacher from the list above to view their schedule and availability.
                      Green highlighted teachers are available for this time slot.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubstitutionDetailModal;
