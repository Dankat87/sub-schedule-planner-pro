
import React from "react";
import { Card } from "@/components/ui/card";
import { Teacher } from "@/types/substitution";

interface WeekCalendarProps {
  selectedSubstitution: {
    day: number;
    period: number;
    date: string;
  };
  overlayTeachers: Teacher[];
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  selectedSubstitution,
  overlayTeachers,
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
                
                return (
                  <Card
                    key={`${day}-${period}`}
                    className={`h-20 p-1 relative ${
                      isSelectedCell ? "bg-amber-100 border-amber-300" : ""
                    }`}
                  >
                    {isSelectedCell && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <span className="font-bold">NEEDED</span>
                      </div>
                    )}
                    
                    {/* Overlay teachers' availability */}
                    <div className="absolute inset-0 flex flex-col p-1">
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
