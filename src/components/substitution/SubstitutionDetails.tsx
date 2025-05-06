
import React from "react";
import { Card } from "@/components/ui/card";
import { CalendarX } from "lucide-react";
import SubstitutionStatusBadge from "@/components/SubstitutionStatusBadge";

interface SubstitutionDetailsProps {
  day: number;
  period: number;
  date: string;
  className: string;
  subjectName: string;
  originalTeacherName: string;
  isAssigned: boolean;
  substituteTeacherName?: string;
}

const SubstitutionDetails: React.FC<SubstitutionDetailsProps> = ({
  day,
  period,
  date,
  className,
  subjectName,
  originalTeacherName,
  isAssigned,
  substituteTeacherName,
}) => {
  // Get the dates for the week
  const getDateString = () => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="p-4 h-full">
      <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
        <CalendarX className="text-amber-600" size={20} />
        <span>Substitution Details</span>
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm text-muted-foreground">Date</h4>
          <p className="font-medium">{getDateString()}</p>
        </div>
        
        <div>
          <h4 className="text-sm text-muted-foreground">Period</h4>
          <p className="font-medium">Period {period}</p>
        </div>

        <div>
          <h4 className="text-sm text-muted-foreground">Class</h4>
          <p className="font-medium">{className}</p>
        </div>

        <div>
          <h4 className="text-sm text-muted-foreground">Subject</h4>
          <p className="font-medium">{subjectName}</p>
        </div>

        <div>
          <h4 className="text-sm text-muted-foreground">Original Teacher</h4>
          <p className="font-medium">{originalTeacherName}</p>
        </div>

        <div>
          <h4 className="text-sm text-muted-foreground">Status</h4>
          <div className="mt-1">
            <SubstitutionStatusBadge isAssigned={isAssigned} />
          </div>
        </div>
        
        {substituteTeacherName && (
          <div>
            <h4 className="text-sm text-muted-foreground">Assigned To</h4>
            <p className="font-medium">{substituteTeacherName}</p>
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
  );
};

export default SubstitutionDetails;
