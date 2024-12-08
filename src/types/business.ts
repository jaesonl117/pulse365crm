export enum BusinessIndustry {
  INSURANCE = 'Insurance',
  MORTGAGE = 'Mortgage',
  RETAIL = 'Retail',
  SERVICE = 'Service',
  MANUFACTURING = 'Manufacturing',
  TECHNOLOGY = 'Technology',
  OTHER = 'Other'
}

export interface Address {
  street: string;
  street2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  placeId?: string;
}

export interface BusinessDetails {
  industry: BusinessIndustry;
  taxId: string;
  address: Address;
}