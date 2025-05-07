
import React from "react";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/types/substitution";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

interface TeacherSelectorProps {
  teachers: Teacher[];
  originalTeacherId: string;
  substitutionDay: number;
  substitutionPeriod: number;
  selectedTeachers: Teacher[];
  onTeacherSelect: (teacher: Teacher) => void;
  onAssignSubstitute: (teacherId: string) => void;
  onUnassignSubstitute?: () => void;
  isSubstitutionAssigned: boolean;
  substituteTeacher?: Teacher | null;
}

const TeacherSelector: React.FC<TeacherSelectorProps> = ({
  teachers,
  originalTeacherId,
  substitutionDay,
  substitutionPeriod,
  selectedTeachers,
  onTeacherSelect,
  onAssignSubstitute,
  onUnassignSubstitute,
  isSubstitutionAssigned,
  substituteTeacher,
}) => {
  // If a substitute is already assigned, show unassign UI
  if (isSubstitutionAssigned && substituteTeacher) {
    return (
      <div className="w-full">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-medium mb-1">Currently Assigned</h3>
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md font-medium">
                  {substituteTeacher.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({substituteTeacher.subjects.join(", ")})
                </span>
              </div>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <X size={16} className="mr-1" /> Unassign Teacher
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unassign substitute teacher?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove {substituteTeacher.name} as the substitute for this class. 
                    You'll need to assign a new substitute teacher afterwards.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onUnassignSubstitute}>
                    Unassign
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              You must unassign the current substitute teacher before assigning a new one.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show regular teacher selection UI if no substitute is assigned
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
