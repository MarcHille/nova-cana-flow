
import { PharmacyVerification } from "./types";

export const parseContactDetails = (jsonData: any): PharmacyVerification['contact_details'] => {
  try {
    if (typeof jsonData === 'string') {
      const parsed = JSON.parse(jsonData);
      return {
        name: parsed.name || '',
        address: parsed.address || '',
        city: parsed.city || '',
        postalCode: parsed.postalCode || '',
        phone: parsed.phone || '',
        contactPerson: parsed.contactPerson,
        email: parsed.email,
      };
    } else if (jsonData && typeof jsonData === 'object') {
      return {
        name: (jsonData as any).name || '',
        address: (jsonData as any).address || '',
        city: (jsonData as any).city || '',
        postalCode: (jsonData as any).postalCode || '',
        phone: (jsonData as any).phone || '',
        contactPerson: (jsonData as any).contactPerson,
        email: (jsonData as any).email,
      };
    }
    return {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
    };
  } catch (error) {
    console.error("Error parsing contact details:", error);
    return {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
    };
  }
};
