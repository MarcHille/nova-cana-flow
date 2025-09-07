
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Invoice, invoiceStatusColorMap } from "@/types/invoice";
import { Send, FileClock, CreditCard, FileEdit, Download, Printer } from "lucide-react";

interface InvoiceCardProps {
  invoice: Invoice;
  onStatusUpdate: (invoiceId: string, status: Invoice['status']) => void;
  onMarkAsPaid: (invoiceId: string) => void;
  onSendInvoice: (invoiceId: string) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ 
  invoice, 
  onStatusUpdate, 
  onMarkAsPaid, 
  onSendInvoice
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>Rechnung {invoice.invoiceNumber}</span>
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {invoice.customerName}
            </p>
          </div>
          <Badge 
            className={`${
              invoiceStatusColorMap[invoice.status]?.background || "bg-gray-100 dark:bg-gray-800"
            } ${
              invoiceStatusColorMap[invoice.status]?.text || "text-gray-800 dark:text-gray-300"
            }`}
          >
            {invoice.status === 'draft' && 'Entwurf'}
            {invoice.status === 'sent' && 'Versendet'}
            {invoice.status === 'paid' && 'Bezahlt'}
            {invoice.status === 'overdue' && 'Überfällig'}
            {invoice.status === 'cancelled' && 'Storniert'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-1">Ausstellungsdatum</h4>
            <p className="text-sm">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-1">Fälligkeitsdatum</h4>
            <p className="text-sm">{formatDate(invoice.dueDate)}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-1">Betrag</h4>
            <p className="text-lg font-semibold">{formatCurrency(invoice.total)}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Rechnungsposten</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="p-2 text-left">Artikel</th>
                  <th className="p-2 text-center">Menge</th>
                  <th className="p-2 text-right">Einzelpreis</th>
                  <th className="p-2 text-right">Gesamt</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                    <td className="p-2 text-right">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800 font-medium">
                <tr>
                  <td colSpan={3} className="p-2 text-right">Zwischensumme:</td>
                  <td className="p-2 text-right">{formatCurrency(invoice.subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-2 text-right">MwSt. (19%):</td>
                  <td className="p-2 text-right">{formatCurrency(invoice.tax)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-2 text-right font-bold">Gesamtbetrag:</td>
                  <td className="p-2 text-right font-bold">{formatCurrency(invoice.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-1">Rechnungsadresse</h4>
          <p className="text-sm">
            {invoice.customerName}<br />
            {invoice.customerAddress.street}<br />
            {invoice.customerAddress.postalCode} {invoice.customerAddress.city}<br />
            {invoice.customerAddress.country}
          </p>
        </div>

        {invoice.notes && (
          <div>
            <h4 className="text-sm font-semibold mb-1">Anmerkungen</h4>
            <p className="text-sm">{invoice.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2 pt-2 border-t">
        {invoice.status === 'draft' && (
          <>
            <Button 
              variant="invoice" 
              onClick={() => onSendInvoice(invoice.id)}
              className="flex gap-2"
            >
              <Send size={16} />
              Rechnung versenden
            </Button>
            <Button 
              variant="outline"
              onClick={() => onStatusUpdate(invoice.id, 'cancelled')}
            >
              Stornieren
            </Button>
          </>
        )}
        
        {invoice.status === 'sent' && (
          <>
            <Button 
              variant="invoice" 
              onClick={() => onMarkAsPaid(invoice.id)}
              className="flex gap-2"
            >
              <CreditCard size={16} />
              Als bezahlt markieren
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onStatusUpdate(invoice.id, 'overdue')}
              className="flex gap-2"
            >
              <FileClock size={16} />
              Als überfällig markieren
            </Button>
          </>
        )}
        
        {invoice.status === 'overdue' && (
          <Button 
            variant="invoice" 
            onClick={() => onMarkAsPaid(invoice.id)}
            className="flex gap-2"
          >
            <CreditCard size={16} />
            Als bezahlt markieren
          </Button>
        )}

        <Button 
          variant="outline" 
          className="flex gap-2"
          onClick={() => window.print()}
        >
          <Printer size={16} />
          Drucken
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex gap-2"
        >
          <Download size={16} />
          PDF herunterladen
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceCard;
