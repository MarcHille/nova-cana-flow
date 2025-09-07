
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import UserRoleManager from "@/components/admin/UserRoleManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  // Ensure only admins can access this page
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAdmin, loading, navigate]);
  
  if (loading) {
    return (
      <AdminLayout title="Benutzerverwaltung">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Benutzerverwaltung">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            Benutzerverwaltung
          </CardTitle>
          <CardDescription>
            Erstellen und verwalten Sie Benutzerkonten und deren Berechtigungen.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <UserRoleManager onError={setError} />
    </AdminLayout>
  );
};

export default AdminUsers;
