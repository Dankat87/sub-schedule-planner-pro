
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";

interface SubstitutionStatusBadgeProps {
  isAssigned: boolean;
}

const SubstitutionStatusBadge: React.FC<SubstitutionStatusBadgeProps> = ({ isAssigned }) => {
  return isAssigned ? (
    <Badge className="bg-assigned hover:bg-assigned/90">
      <CheckIcon size={14} className="mr-1" /> Assigned
    </Badge>
  ) : (
    <Badge variant="outline" className="border-open text-open">
      Open
    </Badge>
  );
};

export default SubstitutionStatusBadge;
