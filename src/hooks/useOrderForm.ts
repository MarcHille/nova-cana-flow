
import { useState } from "react";

interface OrderFormData {
  shippingName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  billingName: string;
  billingStreet: string;
  billingCity: string;
  billingPostalCode: string;
  billingCountry: string;
  paymentMethod: string;
  notes: string;
}

/**
 * Hook for order form state and handlers
 */
export const useOrderForm = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    shippingName: "",
    shippingStreet: "",
    shippingCity: "",
    shippingPostalCode: "",
    shippingCountry: "Germany",
    billingName: "",
    billingStreet: "",
    billingCity: "",
    billingPostalCode: "",
    billingCountry: "Germany",
    paymentMethod: "invoice",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const copyShippingToBilling = () => {
    setFormData({
      ...formData,
      billingName: formData.shippingName,
      billingStreet: formData.shippingStreet,
      billingCity: formData.shippingCity,
      billingPostalCode: formData.shippingPostalCode,
      billingCountry: formData.shippingCountry,
    });
  };

  return {
    formData,
    handleInputChange,
    handleSelectChange,
    copyShippingToBilling,
  };
};
