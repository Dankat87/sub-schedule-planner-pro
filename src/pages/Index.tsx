
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SubstitutionTable from "@/components/SubstitutionTable";
import SubstitutionDetailModal from "@/components/SubstitutionDetailModal";
import { SubstitutionWithDetails, Teacher } from "@/types/substitution";
import {
  getAllSubstitutionsWithDetails,
  getTeacherById,
  substitutions,
  teachers
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [allSubstitutions, setAllSubstitutions] = useState<SubstitutionWithDetails[]>([]);
  const [filteredSubstitutions, setFilteredSubstitutions] = useState<SubstitutionWithDetails[]>([]);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [selectedSubstitution, setSelectedSubstitution] = useState<SubstitutionWithDetails | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load all substitutions with details
    const substitutionsWithDetails = getAllSubstitutionsWithDetails();
    setAllSubstitutions(substitutionsWithDetails);
    setFilteredSubstitutions(substitutionsWithDetails);
  }, []);

  // Filter substitutions when the filter toggle changes
  useEffect(() => {
    if (showOpenOnly) {
      setFilteredSubstitutions(
        allSubstitutions.filter((sub) => !sub.isAssigned)
      );
    } else {
      setFilteredSubstitutions(allSubstitutions);
    }
  }, [showOpenOnly, allSubstitutions]);

  const handleSubstitutionClick = (substitution: SubstitutionWithDetails) => {
    setSelectedSubstitution(substitution);
  };

  const handleCloseModal = () => {
    setSelectedSubstitution(null);
  };

  const handleAssignSubstitute = (substitutionId: string, substituteTeacherId: string) => {
    // In a real app, this would make an API call to update the assignment
    // For now, we'll update our local state
    
    const updatedSubstitutions = allSubstitutions.map(sub => {
      if (sub.id === substitutionId) {
        const substituteTeacher = getTeacherById(substituteTeacherId);
        return {
          ...sub,
          substituteTeacher,
          substituteTeacherId,
          isAssigned: true
        };
      }
      return sub;
    });
    
    setAllSubstitutions(updatedSubstitutions);
    
    // Show success toast
    const subDetails = allSubstitutions.find(s => s.id === substitutionId);
    const teacher = getTeacherById(substituteTeacherId);
    
    if (subDetails && teacher) {
      toast({
        title: "Substitute Assigned",
        description: `${teacher.name} has been assigned to ${subDetails.class.name} - ${subDetails.subject.name}`,
      });
    }
  };
  
  const handleUnassignSubstitute = (substitutionId: string) => {
    // In a real app, this would make an API call to update the assignment
    // For now, we'll update our local state
    const subToUpdate = allSubstitutions.find(s => s.id === substitutionId);
    
    if (subToUpdate && subToUpdate.substituteTeacher) {
      const teacherName = subToUpdate.substituteTeacher.name;
      const className = subToUpdate.class.name;
      const subjectName = subToUpdate.subject.name;
      
      const updatedSubstitutions = allSubstitutions.map(sub => {
        if (sub.id === substitutionId) {
          return {
            ...sub,
            substituteTeacher: null,
            substituteTeacherId: null,
            isAssigned: false
          };
        }
        return sub;
      });
      
      setAllSubstitutions(updatedSubstitutions);
      
      // If the substitution we're updating is the selected one,
      // update that as well
      if (selectedSubstitution?.id === substitutionId) {
        setSelectedSubstitution(prev => 
          prev ? {
            ...prev,
            substituteTeacher: null,
            substituteTeacherId: null,
            isAssigned: false
          } : null
        );
      }
      
      toast({
        title: "Substitute Unassigned",
        description: `${teacherName} has been removed from ${className} - ${subjectName}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            School Substitution Planner
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="open-filter"
              checked={showOpenOnly}
              onCheckedChange={setShowOpenOnly}
            />
            <Label htmlFor="open-filter">Show open substitutions only</Label>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {filteredSubstitutions.length} substitutions found
          </div>
        </div>
        
        <SubstitutionTable
          substitutions={filteredSubstitutions}
          onRowClick={handleSubstitutionClick}
        />
        
        <SubstitutionDetailModal
          substitution={selectedSubstitution}
          allTeachers={teachers}
          onClose={handleCloseModal}
          onAssignSubstitute={handleAssignSubstitute}
          onUnassignSubstitute={handleUnassignSubstitute}
        />
      </main>
    </div>
  );
};

export default Index;
