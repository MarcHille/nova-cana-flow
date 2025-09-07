
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalInvoices: number;
  loading: boolean;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalInvoices: 0,
    loading: true
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true }));

        // Produkte zählen
        const { count: productsCount, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (productsError) {
          console.error('Error fetching products count:', productsError);
        }

        // Bestellungen zählen
        const { count: ordersCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        if (ordersError) {
          console.error('Error fetching orders count:', ordersError);
        }

        // Benutzer zählen über RPC-Funktion
        let usersCount = 0;
        try {
          const { data: usersData, error: usersError } = await supabase.rpc(
            'get_users_with_roles',
            { _limit: 1000, _offset: 0 }
          );

          if (usersError) {
            console.error('Error fetching users count:', usersError);
          } else {
            usersCount = usersData?.length || 0;
          }
        } catch (error) {
          console.error('Error calling get_users_with_roles:', error);
        }

        // Rechnungen - derzeit noch keine Tabelle, daher 0
        const invoicesCount = 0; // TODO: Implementieren wenn invoices Tabelle existiert

        setStats({
          totalProducts: productsCount || 0,
          totalOrders: ordersCount || 0,
          totalUsers: usersCount,
          totalInvoices: invoicesCount,
          loading: false
        });

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast({
          title: "Fehler",
          description: "Dashboard-Statistiken konnten nicht geladen werden.",
          variant: "destructive"
        });
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [toast]);

  const refreshStats = () => {
    setStats(prev => ({ ...prev, loading: true }));
    // Trigger useEffect durch dependency change würde komplizierter sein,
    // daher direkter Aufruf der fetch-Funktion
    setTimeout(() => {
      window.location.reload(); // Einfache Lösung für Refresh
    }, 100);
  };

  return { ...stats, refreshStats };
};
