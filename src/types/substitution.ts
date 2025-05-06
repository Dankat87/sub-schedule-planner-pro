
export interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  availability: Availability[];
}

export interface Availability {
  day: number; // 0-4 for Monday to Friday
  period: number; // Period number (1-8)
  available: boolean;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Substitution {
  id: string;
  originalTeacherId: string;
  classId: string;
  subjectId: string;
  substituteTeacherId?: string;
  date: string; // ISO string
  day: number; // 0-4 for Monday to Friday
  period: number; // Period number (1-8)
  isAssigned: boolean;
}

export interface SubstitutionWithDetails {
  id: string;
  originalTeacher: Teacher;
  class: Class;
  subject: Subject;
  substituteTeacher?: Teacher;
  date: string; // ISO string
  day: number; // 0-4 for Monday to Friday
  period: number; // Period number (1-8)
  isAssigned: boolean;
}
