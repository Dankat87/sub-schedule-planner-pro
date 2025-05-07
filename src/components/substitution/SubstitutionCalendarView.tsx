
import React from "react";
import WeekCalendar from "@/components/WeekCalendar";
import { Teacher } from "@/types/substitution";

interface SubstitutionCalendarViewProps {
  substitution: {
    day: number;
    period: number;
    date: string;
  };
  overlayTeachers: Teacher[];
  classLessons?: {
    day: number;
    period: number;
    subject: string;
  }[];
}

const SubstitutionCalendarView: React.FC<SubstitutionCalendarViewProps> = ({
  substitution,
  overlayTeachers,
  classLessons = [],
}) => {
  return (
    <div className="w-full">
      <WeekCalendar
        selectedSubstitution={substitution}
        overlayTeachers={overlayTeachers}
        classLessons={classLessons}
      />
    </div>
  );
};

export default SubstitutionCalendarView;
