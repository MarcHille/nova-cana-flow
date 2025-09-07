
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Save, User, Lock } from "lucide-react";

const AccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die neuen Passwörter stimmen nicht überein.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Fehler",
        description: "Das neue Passwort muss mindestens 8 Zeichen lang sein.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Erfolg",
        description: "Ihr Passwort wurde erfolgreich geändert.",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      console.error("Fehler beim Ändern des Passworts:", error);
      toast({
        title: "Fehler",
        description: error.message || "Das Passwort konnte nicht geändert werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Kontoinformationen
          </CardTitle>
          <CardDescription>
            Ihre grundlegenden Kontodaten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input 
              id="email" 
              value={user?.email || ""} 
              disabled 
              className="bg-gray-50" 
            />
            <p className="text-xs text-gray-500">Die E-Mail-Adresse kann nicht geändert werden.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="userId">Benutzer-ID</Label>
            <Input 
              id="userId" 
              value={user?.id || ""} 
              disabled 
              className="bg-gray-50 font-mono text-xs" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Passwort ändern
          </CardTitle>
          <CardDescription>
            Ändern Sie Ihr Anmelde-Passwort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Neues Passwort</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="pr-10"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Neues Passwort bestätigen</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pr-10"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>Das Passwort muss mindestens 8 Zeichen lang sein.</p>
              <p>Empfohlen: Verwenden Sie eine Kombination aus Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen.</p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin" />
                  Passwort wird geändert...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Passwort ändern
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
