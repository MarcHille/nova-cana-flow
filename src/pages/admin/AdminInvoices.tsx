
import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useInvoices } from "@/hooks/useInvoices";
import InvoiceCard from "@/components/admin/InvoiceCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Invoice, invoiceStatusColorMap } from "@/types/invoice";
import { 
  Search, 
  FileText, 
  Filter, 
  SortAsc, 
  SortDesc,
  RefreshCw,
  FileBarChart,
  Download,
  Printer,
  CreditCard
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const AdminInvoices = () => {
  const { invoices, loading, updateInvoiceStatus, markAsPaid, sendInvoice } = useInvoices();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Funktion zum Filtern und Sortieren der Rechnungen
  const getFilteredInvoices = () => {
    let filtered = [...invoices];
    
    // Statusfilter anwenden
    if (statusFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }
    
    // Suchfilter anwenden
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(term) ||
        invoice.customerName.toLowerCase().includes(term) ||
        invoice.orderId.toLowerCase().includes(term)
      );
    }
    
    // Sortierung anwenden (standardmäßig nach Ausstellungsdatum)
    filtered.sort((a, b) => {
      const dateA = new Date(a.issueDate).getTime();
      const dateB = new Date(b.issueDate).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
    
    return filtered;
  };

  const filteredInvoices = getFilteredInvoices();

  // Status in Deutsch formatieren
  const formatStatus = (status: Invoice['status']) => {
    switch (status) {
      case 'draft': return 'Entwurf';
      case 'sent': return 'Versendet';
      case 'paid': return 'Bezahlt';
      case 'overdue': return 'Überfällig';
      case 'cancelled': return 'Storniert';
      default: return status;
    }
  };

  // Datum formatieren
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Betrag formatieren
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Funktion zum Umschalten zwischen Listen- und Detailansicht
  const viewInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewMode("detail");
  };
  
  // Zurück zur Listenansicht
  const backToList = () => {
    setViewMode("list");
    setSelectedInvoice(null);
  };

  // Funktion zum Laden-Animation während die Daten geladen werden
  if (loading) {
    return (
      <AdminLayout title="Rechnungsverwaltung">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="flex justify-between mb-6">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-[450px]"></div>
        </div>
      </AdminLayout>
    );
  }

  // Detailansicht einer Rechnung
  if (viewMode === "detail" && selectedInvoice) {
    return (
      <AdminLayout title="Rechnungsdetails" backUrl="/admin/invoices">
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={backToList}
            className="mb-4"
          >
            Zurück zur Übersicht
          </Button>
        </div>
        <InvoiceCard 
          invoice={selectedInvoice} 
          onStatusUpdate={updateInvoiceStatus}
          onMarkAsPaid={markAsPaid}
          onSendInvoice={sendInvoice}
        />
      </AdminLayout>
    );
  }

  // Übersichtsstatistik generieren
  const stats = {
    total: invoices.length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
    paidAmount: invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0),
    overdueAmount: invoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0),
  };

  return (
    <AdminLayout title="Rechnungsverwaltung">
      {/* Statistik-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gesamtumsatz</p>
              <p className="text-2xl font-semibold">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <FileBarChart className="text-green-500" size={24} />
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Davon bezahlt: {formatCurrency(stats.paidAmount)}
          </div>
        </Card>
        
        <Card className="p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Offene Rechnungen</p>
              <p className="text-2xl font-semibold">{stats.sent + stats.overdue}</p>
            </div>
            <FileText className="text-blue-500" size={24} />
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Wert: {formatCurrency(stats.overdueAmount)}
          </div>
        </Card>
        
        <Card className="p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Überfällige Rechnungen</p>
              <p className="text-2xl font-semibold">{stats.overdue}</p>
            </div>
            <FileText className="text-red-500" size={24} />
          </div>
          <div className="mt-4 text-xs text-gray-500">
            {stats.overdue > 0 ? `Älteste: ${formatDate(
              invoices
                .filter(inv => inv.status === 'overdue')
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]?.dueDate
            )}` : 'Keine überfälligen Rechnungen'}
          </div>
        </Card>
        
        <Card className="p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bezahlte Rechnungen</p>
              <p className="text-2xl font-semibold">{stats.paid}</p>
            </div>
            <FileText className="text-green-500" size={24} />
          </div>
          <div className="mt-4 text-xs text-gray-500">
            {stats.paid > 0 ? `Letzte Zahlung: ${formatDate(
              invoices
                .filter(inv => inv.status === 'paid' && inv.paidDate)
                .sort((a, b) => new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime())[0]?.paidDate!
            )}` : 'Keine bezahlten Rechnungen'}
          </div>
        </Card>
      </div>

      {/* Filter- und Suchleiste */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Rechnung, Kunde oder Bestellung suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1"
          >
            {sortDirection === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
            {sortDirection === "asc" ? "Älteste zuerst" : "Neueste zuerst"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} />
            Zurücksetzen
          </Button>
        </div>
      </div>

      {/* Tabs für verschiedene Status */}
      <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="all">Alle ({stats.total})</TabsTrigger>
          <TabsTrigger value="draft">Entwürfe ({stats.draft})</TabsTrigger>
          <TabsTrigger value="sent">Versendet ({stats.sent})</TabsTrigger>
          <TabsTrigger value="paid">Bezahlt ({stats.paid})</TabsTrigger>
          <TabsTrigger value="overdue">Überfällig ({stats.overdue})</TabsTrigger>
          <TabsTrigger value="cancelled">Storniert ({invoices.filter(inv => inv.status === 'cancelled').length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Aktionsleiste */}
      <div className="flex justify-between mb-6">
        <div className="text-sm text-gray-500">
          {filteredInvoices.length} Rechnungen gefunden
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Printer size={16} />
            Drucken
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download size={16} />
            Exportieren
          </Button>
        </div>
      </div>

      {/* Rechnungstabelle */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <FileText className="mx-auto text-gray-400" size={48} />
          <h3 className="mt-4 text-lg font-medium">Keine Rechnungen gefunden</h3>
          <p className="mt-2 text-gray-500">
            Versuchen Sie andere Filteroptionen oder erstellen Sie neue Rechnungen.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rechnungsnr.</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Fällig</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
                <TableHead className="text-center">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => viewInvoiceDetails(invoice)}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        invoiceStatusColorMap[invoice.status]?.background || "bg-gray-100 dark:bg-gray-800"
                      } ${
                        invoiceStatusColorMap[invoice.status]?.text || "text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {formatStatus(invoice.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(invoice.total)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      {invoice.status === 'sent' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsPaid(invoice.id);
                          }}
                        >
                          <CreditCard size={16} />
                          <span className="sr-only">Als bezahlt markieren</span>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewInvoiceDetails(invoice);
                        }}
                      >
                        <FileText size={16} />
                        <span className="sr-only">Details anzeigen</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminInvoices;
