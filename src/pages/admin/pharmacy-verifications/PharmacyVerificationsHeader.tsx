
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  onReload: () => void;
}

const PharmacyVerificationsHeader: React.FC<Props> = ({ onReload }) => (
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-xl">Verifizierungsanfragen</CardTitle>
    <Button variant="outline" size="sm" onClick={onReload}>
      Aktualisieren
    </Button>
  </CardHeader>
);

export default PharmacyVerificationsHeader;
