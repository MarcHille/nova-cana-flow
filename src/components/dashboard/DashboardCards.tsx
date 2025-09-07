
import React from "react";
import ProductsCard from "./cards/ProductsCard";
import OrdersCard from "./cards/OrdersCard";
import AdminCard from "./cards/AdminCard";
import RoleBasedUserCard from "./cards/RoleBasedUserCard";
import FormulationGuideCard from "./cards/FormulationGuideCard";
import { useAuthentication } from "@/hooks/useAuthentication";

const DashboardCards = () => {
  const { isAdmin, isPharmacist, isVerifiedPharmacist } = useAuthentication();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <ProductsCard />
      <OrdersCard />
      
      {/* Karte für Formulierungshilfe */}
      <FormulationGuideCard />
      
      {/* Admin-Karte nur anzeigen, wenn der Benutzer ein Administrator ist */}
      {isAdmin && <AdminCard />}
      
      <RoleBasedUserCard />
    </div>
  );
};

export default DashboardCards;
