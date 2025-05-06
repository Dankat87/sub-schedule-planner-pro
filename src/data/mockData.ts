
import { Class, Subject, Substitution, Teacher } from "../types/substitution";

export const teachers: Teacher[] = [
  {
    id: "1",
    name: "John Smith",
    subjects: ["math", "physics"],
    availability: Array.from({ length: 5 }, (_, day) => 
      Array.from({ length: 8 }, (_, period) => ({
        day,
        period: period + 1,
        available: Math.random() > 0.3
      }))
    ).flat()
  },
  {
    id: "2",
    name: "Mary Johnson",
    subjects: ["english", "history"],
    availability: Array.from({ length: 5 }, (_, day) => 
      Array.from({ length: 8 }, (_, period) => ({
        day,
        period: period + 1,
        available: Math.random() > 0.3
      }))
    ).flat()
  },
  {
    id: "3",
    name: "Robert Davis",
    subjects: ["chemistry", "biology"],
    availability: Array.from({ length: 5 }, (_, day) => 
      Array.from({ length: 8 }, (_, period) => ({
        day,
        period: period + 1,
        available: Math.random() > 0.3
      }))
    ).flat()
  },
  {
    id: "4",
    name: "Sarah Wilson",
    subjects: ["art", "music"],
    availability: Array.from({ length: 5 }, (_, day) => 
      Array.from({ length: 8 }, (_, period) => ({
        day,
        period: period + 1,
        available: Math.random() > 0.3
      }))
    ).flat()
  },
  {
    id: "5",
    name: "David Thompson",
    subjects: ["physical education", "health"],
    availability: Array.from({ length: 5 }, (_, day) => 
      Array.from({ length: 8 }, (_, period) => ({
        day,
        period: period + 1,
        available: Math.random() > 0.3
      }))
    ).flat()
  },
  {
    id: "6",
    name: "Elizabeth Brown",
    subjects: ["math", "computer science"],
    availability: Array.from({ length: 5 }, (_, day) => 
      Array.from({ length: 8 }, (_, period) => ({
        day,
        period: period + 1,
        available: Math.random() > 0.3
      }))
    ).flat()
  },
  {
    id: "7",
    name: "Michael Jones",
    subjects: ["english", "drama"],
    availability: Array.from({ length: 5 }, (_, day) => 
      Array.from({ length: 8 }, (_, period) => ({
        day,
        period: period + 1,
        available: Math.random() > 0.3
      }))
    ).flat()
  },
];

export const classes: Class[] = [
  { id: "1", name: "10A", grade: "10" },
  { id: "2", name: "10B", grade: "10" },
  { id: "3", name: "11A", grade: "11" },
  { id: "4", name: "11B", grade: "11" },
  { id: "5", name: "12A", grade: "12" },
  { id: "6", name: "12B", grade: "12" },
];

export const subjects: Subject[] = [
  { id: "1", name: "Mathematics" },
  { id: "2", name: "English" },
  { id: "3", name: "Physics" },
  { id: "4", name: "Chemistry" },
  { id: "5", name: "Biology" },
  { id: "6", name: "History" },
  { id: "7", name: "Geography" },
  { id: "8", name: "Art" },
  { id: "9", name: "Music" },
  { id: "10", name: "Physical Education" },
  { id: "11", name: "Computer Science" },
];

// Generate random dates for the current week
const getRandomDate = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Get the Monday
  
  const randomDay = Math.floor(Math.random() * 5); // 0-4 for Mon-Fri
  const result = new Date(monday);
  result.setDate(monday.getDate() + randomDay);
  
  return {
    date: result.toISOString(),
    day: randomDay
  };
};

// Generate substitutions
export const substitutions: Substitution[] = Array.from({ length: 20 }, (_, i) => {
  const { date, day } = getRandomDate();
  const period = Math.floor(Math.random() * 8) + 1; // 1-8
  const isAssigned = Math.random() > 0.4;
  
  return {
    id: (i + 1).toString(),
    originalTeacherId: teachers[Math.floor(Math.random() * teachers.length)].id,
    classId: classes[Math.floor(Math.random() * classes.length)].id,
    subjectId: subjects[Math.floor(Math.random() * subjects.length)].id,
    substituteTeacherId: isAssigned ? teachers[Math.floor(Math.random() * teachers.length)].id : undefined,
    date,
    day,
    period,
    isAssigned
  };
});

// Helper function to get teacher by ID
export const getTeacherById = (id: string): Teacher | undefined => {
  return teachers.find(teacher => teacher.id === id);
};

// Helper function to get class by ID
export const getClassById = (id: string): Class | undefined => {
  return classes.find(cls => cls.id === id);
};

// Helper function to get subject by ID
export const getSubjectById = (id: string): Subject | undefined => {
  return subjects.find(subject => subject.id === id);
};

// Helper function to get substitution details
export const getSubstitutionWithDetails = (substitution: Substitution) => {
  const originalTeacher = getTeacherById(substitution.originalTeacherId);
  const cls = getClassById(substitution.classId);
  const subject = getSubjectById(substitution.subjectId);
  const substituteTeacher = substitution.substituteTeacherId 
    ? getTeacherById(substitution.substituteTeacherId) 
    : undefined;
  
  if (!originalTeacher || !cls || !subject) {
    throw new Error(`Invalid substitution data for ID: ${substitution.id}`);
  }
  
  return {
    id: substitution.id,
    originalTeacher,
    class: cls,
    subject,
    substituteTeacher,
    date: substitution.date,
    day: substitution.day,
    period: substitution.period,
    isAssigned: substitution.isAssigned
  };
};

// Helper function to get all substitutions with details
export const getAllSubstitutionsWithDetails = () => {
  return substitutions.map(getSubstitutionWithDetails);
};

// Get the current week's Monday date
export const getCurrentWeekMonday = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Get the Monday
  monday.setHours(0, 0, 0, 0);
  return monday;
};
