
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubstitutionWithDetails } from "@/types/substitution";
import SubstitutionStatusBadge from "./SubstitutionStatusBadge";

interface SubstitutionTableProps {
  substitutions: SubstitutionWithDetails[];
  onRowClick: (substitution: SubstitutionWithDetails) => void;
}

const SubstitutionTable: React.FC<SubstitutionTableProps> = ({
  substitutions,
  onRowClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatPeriod = (period: number) => {
    return `Period ${period}`;
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Original Teacher</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Substitute Teacher</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {substitutions.map((substitution) => (
            <TableRow
              key={substitution.id}
              className={`cursor-pointer hover:bg-muted ${
                !substitution.isAssigned ? "bg-amber-50" : ""
              }`}
              onClick={() => onRowClick(substitution)}
            >
              <TableCell>{formatDate(substitution.date)}</TableCell>
              <TableCell>{formatPeriod(substitution.period)}</TableCell>
              <TableCell>{substitution.originalTeacher.name}</TableCell>
              <TableCell>{substitution.class.name}</TableCell>
              <TableCell>{substitution.subject.name}</TableCell>
              <TableCell>
                {substitution.substituteTeacher?.name || "—"}
              </TableCell>
              <TableCell>
                <SubstitutionStatusBadge isAssigned={substitution.isAssigned} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubstitutionTable;
