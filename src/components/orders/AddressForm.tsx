
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddressFormProps {
  type: "shipping" | "billing";
  formData: {
    shippingName?: string;
    shippingStreet?: string;
    shippingCity?: string;
    shippingPostalCode?: string;
    shippingCountry?: string;
    billingName?: string;
    billingStreet?: string;
    billingCity?: string;
    billingPostalCode?: string;
    billingCountry?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string) => (value: string) => void;
  copyShippingToBilling?: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  type,
  formData,
  onChange,
  onSelectChange,
  copyShippingToBilling,
}) => {
  const prefix = type === "shipping" ? "shipping" : "billing";
  const title = type === "shipping" ? "Shipping Address" : "Billing Address";

  return (
    <div className="glass-card p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`${prefix}Name`}>Full Name</Label>
          <Input
            id={`${prefix}Name`}
            name={`${prefix}Name`}
            value={formData[`${prefix}Name` as keyof typeof formData] || ""}
            onChange={onChange}
            placeholder="Enter your full name"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor={`${prefix}Street`}>Street Address</Label>
          <Input
            id={`${prefix}Street`}
            name={`${prefix}Street`}
            value={formData[`${prefix}Street` as keyof typeof formData] || ""}
            onChange={onChange}
            placeholder="Enter your street address"
            className="mt-1"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${prefix}City`}>City</Label>
            <Input
              id={`${prefix}City`}
              name={`${prefix}City`}
              value={formData[`${prefix}City` as keyof typeof formData] || ""}
              onChange={onChange}
              placeholder="Enter your city"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor={`${prefix}PostalCode`}>Postal Code</Label>
            <Input
              id={`${prefix}PostalCode`}
              name={`${prefix}PostalCode`}
              value={
                formData[`${prefix}PostalCode` as keyof typeof formData] || ""
              }
              onChange={onChange}
              placeholder="Enter your postal code"
              className="mt-1"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`${prefix}Country`}>Country</Label>
          <Input
            id={`${prefix}Country`}
            name={`${prefix}Country`}
            value={formData[`${prefix}Country` as keyof typeof formData] || ""}
            onChange={onChange}
            placeholder="Enter your country"
            className="mt-1"
            required
          />
        </div>

        {type === "billing" && copyShippingToBilling && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyShippingToBilling}
            className="mt-2"
          >
            Same as Shipping Address
          </Button>
        )}

        {type === "billing" && (
          <div className="mt-4">
            <Label className="mb-2 block">Payment Method</Label>
            <RadioGroup
              defaultValue="invoice"
              onValueChange={onSelectChange("paymentMethod")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="invoice" id="invoice" />
                <Label htmlFor="invoice" className="cursor-pointer">
                  Invoice
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer" className="cursor-pointer">
                  Bank Transfer
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
