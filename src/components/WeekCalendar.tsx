import React from "react";
import { Card } from "@/components/ui/card";
import { Teacher } from "@/types/substitution";
import { CalendarXIcon, BookOpen } from "lucide-react";

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

  // Mock data for teacher lessons - in a real app, this would come from an API
  const getTeacherLessonInfo = (day: number, period: number) => {
    // Only called for teacher lessons, so we can assume at least one teacher is not available
    // Generate some mock data for display purposes
    const classNames = ["10A", "9B", "11C", "8D", "12A"];
    const rooms = ["Room 101", "Room 203", "Lab A", "Gym", "Music Hall"];
    
    // Find all teachers who are busy at this time
    const busyTeachers = overlayTeachers.filter(teacher => 
      !isTeacherAvailable(teacher, day, period) &&
      !(day === selectedSubstitution.day && period === selectedSubstitution.period)
    );
    
    if (busyTeachers.length === 0) return null;
    
    // For real implementation, you would fetch actual data
    // For now, we'll use deterministic "random" data based on day and period
    const teacherIndex = busyTeachers[0].id.charCodeAt(0) % 5;
    const classIndex = (day + period) % 5;
    
    return {
      teacher: busyTeachers[0].name,
      className: classNames[classIndex],
      room: rooms[(day + period + teacherIndex) % 5]
    };
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
                const teacherLessonInfo = hasTeacherLesson ? getTeacherLessonInfo(dayIndex, period) : null;
                
                return (
                  <Card
                    key={`${day}-${period}`}
                    className={`h-20 p-1 relative ${
                      !hasLesson ? "bg-gray-50" : ""
                    } ${
                      isSelectedCell ? "bg-amber-100 border-amber-300 ring-2 ring-amber-300" : ""
                    } ${
                      hasTeacherLesson ? "bg-blue-700 border-blue-800 text-white" : ""
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
                    
                    {/* Teacher lesson indicator - Updated with class and room info */}
                    {hasTeacherLesson && teacherLessonInfo && !isSelectedCell && (
                      <div className="flex flex-col space-y-1 mb-1 p-1">
                        <div className="flex items-center space-x-1">
                          <BookOpen size={14} className="text-white" />
                          <span className="text-xs font-semibold text-white">Teaching</span>
                        </div>
                        <div className="text-xs text-white font-medium">
                          {teacherLessonInfo.className}
                        </div>
                        <div className="text-xs text-white">
                          {teacherLessonInfo.room}
                        </div>
                      </div>
                    )}
                    
                    {/* We remove the teacher availability display since we only want 
                        to show where teachers are teaching, not where they're free */}
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
