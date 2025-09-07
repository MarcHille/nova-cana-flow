
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface UserSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: string;
  onRoleFilterChange: (role: string) => void;
  showPendingFilter?: boolean;
}

const UserSearchFilter: React.FC<UserSearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleFilterChange,
  showPendingFilter = false
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Benutzer suchen (E-Mail, Name, Apotheke, Ort...)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <Select value={selectedRole} onValueChange={onRoleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Rolle filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Benutzer</SelectItem>
              <SelectItem value="admin">Administratoren</SelectItem>
              <SelectItem value="pharmacist">Apotheker</SelectItem>
              <SelectItem value="user">Standard Benutzer</SelectItem>
              {showPendingFilter && (
                <SelectItem value="pending">Ausstehende Verifizierungen</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UserSearchFilter;
