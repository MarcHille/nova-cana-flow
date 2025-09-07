
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface UserInfoTableProps {
  email: string;
  name?: string;
  organization?: string;
  role?: string;
  editMode: boolean;
  editedName: string;
  editedOrganization: string;
  onNameChange: (value: string) => void;
  onOrganizationChange: (value: string) => void;
}

export const UserInfoTable: React.FC<UserInfoTableProps> = ({
  email,
  name,
  organization,
  role,
  editMode,
  editedName,
  editedOrganization,
  onNameChange,
  onOrganizationChange
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={2}>Kontaktinformationen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">E-Mail</TableCell>
          <TableCell>{email}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Name</TableCell>
          <TableCell>
            {editMode ? (
              <Input 
                value={editedName} 
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Name eingeben..."
              />
            ) : (
              editedName || name || '-'
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Organisation</TableCell>
          <TableCell>
            {editMode ? (
              <Input 
                value={editedOrganization} 
                onChange={(e) => onOrganizationChange(e.target.value)}
                placeholder="Organisation eingeben..."
              />
            ) : (
              editedOrganization || organization || '-'
            )}
          </TableCell>
        </TableRow>
        {role && (
          <TableRow>
            <TableCell className="font-medium">Rolle</TableCell>
            <TableCell>{role}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
