export interface Company {
  Name: string;
  EmailAddress: string;
  DocumentsEmailAddress?: string | null;
  Country?: string;
  Address: string;
  Phone: string;
  Fax?: string | null;
  Title?: string;
  CorporateNumber: string;
  English_Name?: string | null;
  English_Address?: string | null;
  English_Country?: string | null;
  English_Phone?: string | null;
  English_Fax?: string | null;
  English_Title?: string | null;
  CompanyType?: number;
  Logo?: string | null;
  Website?: string;
}
