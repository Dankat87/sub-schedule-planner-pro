
import React from "react";
import { Card } from "@/components/ui/card";
import { Teacher } from "@/types/substitution";
import { CalendarXIcon, Clock, BookOpen } from "lucide-react";

interface WeekCalendarProps {
  selectedSubstitution: {
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

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  selectedSubstitution,
  overlayTeachers,
  classLessons = [],
}) => {
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = Array.from({ length: 8 }, (_, i) => i + 1);
  
  // Function to get the date for a specific day of the week
  const getDateForDay = (dayIndex: number) => {
    const date = new Date(selectedSubstitution.date);
    const dayDiff = dayIndex - selectedSubstitution.day;
    date.setDate(date.getDate() + dayDiff);
    return date.getDate();
  };

  // Check if the given teacher is available at the specified day and period
  const isTeacherAvailable = (teacher: Teacher, day: number, period: number) => {
    return teacher.availability.some(
      (a) => a.day === day && a.period === period && a.available
    );
  };

  // Check if there's a lesson for the class at the specified day and period
  const getClassLesson = (day: number, period: number) => {
    return classLessons.find(
      (lesson) => lesson.day === day && lesson.period === period
    );
  };
  
  // Check if a selected teacher has a lesson at this day and period
  // This is a new function to check for teacher lessons
  const isTeacherLesson = (day: number, period: number) => {
    if (overlayTeachers.length === 0) return false;
    
    // For this example, we'll assume a teacher has a lesson when they are NOT available
    // In a real app, you'd have actual teacher schedule data
    return overlayTeachers.some(teacher => 
      !isTeacherAvailable(teacher, day, period) &&
      // Don't mark the substitution slot as a teacher lesson
      !(day === selectedSubstitution.day && period === selectedSubstitution.period)
    );
  };

  // Generate color for each teacher (consistent across calendar)
  const getTeacherColor = (index: number) => {
    const colors = [
      "bg-blue-100 border-blue-300",
      "bg-green-100 border-green-300",
      "bg-purple-100 border-purple-300",
      "bg-pink-100 border-pink-300",
      "bg-yellow-100 border-yellow-300",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full overflow-auto">
      <div className="min-w-max">
        <div className="grid grid-cols-6 gap-1">
          {/* Time column */}
          <div className="col-span-1">
            <div className="h-14 flex items-end justify-center">
              <span className="font-medium text-sm text-gray-500">Time</span>
            </div>
            {periods.map((period) => (
              <div
                key={`time-${period}`}
                className="h-20 flex items-center justify-center border-r"
              >
                <span className="font-medium">Period {period}</span>
              </div>
            ))}
          </div>

          {/* Weekday columns */}
          {weekdays.map((day, dayIndex) => (
            <div key={day} className="col-span-1">
              <div className="h-14 flex flex-col items-center justify-center">
                <span className="font-medium">{day}</span>
                <span className="text-sm text-gray-500">{getDateForDay(dayIndex)}</span>
              </div>
              {periods.map((period) => {
                // Is this the selected substitution cell?
                const isSelectedCell = dayIndex === selectedSubstitution.day && period === selectedSubstitution.period;
                const classLesson = getClassLesson(dayIndex, period);
                const hasLesson = !!classLesson;
                const hasTeacherLesson = isTeacherLesson(dayIndex, period);
                
                return (
                  <Card
                    key={`${day}-${period}`}
                    className={`h-20 p-1 relative ${
                      !hasLesson ? "bg-gray-50" : ""
                    } ${
                      isSelectedCell ? "bg-amber-100 border-amber-300 ring-2 ring-amber-300" : ""
                    } ${
                      hasTeacherLesson ? "bg-blue-100 border-blue-200" : ""
                    }`}
                  >
                    {/* Class lesson indicator */}
                    {hasLesson && !isSelectedCell && (
                      <div className="text-xs font-medium px-1 py-0.5 bg-gray-100 rounded mb-1">
                        {classLesson.subject}
                      </div>
                    )}
                    
                    {/* Substitution needed indicator */}
                    {isSelectedCell && (
                      <div className="flex items-center space-x-1 mb-1 px-1 py-0.5 bg-amber-200 rounded text-amber-800">
                        <CalendarXIcon size={14} />
                        <span className="text-xs font-semibold">Substitution Needed</span>
                      </div>
                    )}
                    
                    {/* Teacher lesson indicator - NEW */}
                    {hasTeacherLesson && !isSelectedCell && (
                      <div className="flex items-center space-x-1 mb-1 px-1 py-0.5 bg-blue-200 rounded text-blue-800">
                        <BookOpen size={14} />
                        <span className="text-xs font-semibold">Teaching</span>
                      </div>
                    )}
                    
                    {/* Overlay teachers' availability */}
                    <div className="absolute inset-0 flex flex-col p-1 pt-8">
                      {overlayTeachers.map((teacher, index) => {
                        if (isTeacherAvailable(teacher, dayIndex, period)) {
                          return (
                            <div
                              key={teacher.id}
                              className={`text-xs mb-1 px-1 py-0.5 rounded border ${getTeacherColor(
                                index
                              )} truncate`}
                              title={teacher.name}
                            >
                              {teacher.name}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekCalendar;
