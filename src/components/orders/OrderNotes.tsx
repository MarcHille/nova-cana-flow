
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OrderNotesProps {
  notes: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const OrderNotes: React.FC<OrderNotesProps> = ({ notes, onChange }) => {
  return (
    <div className="glass-card p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Anmerkungen zur Bestellung
      </h3>
      <div>
        <Label htmlFor="notes">Besondere Anweisungen oder Anmerkungen</Label>
        <Textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={onChange}
          placeholder="Hier können Sie besondere Anweisungen oder Anmerkungen zu Ihrer Bestellung hinterlassen."
          className="mt-1 resize-none h-32"
        />
      </div>
    </div>
  );
};

export default OrderNotes;
