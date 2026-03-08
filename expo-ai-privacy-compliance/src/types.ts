export interface DisclosureItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  imageUri?: string;
  fallbackColor?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  usageDescription: string;
  required?: boolean;
  imageSlug?: string;
}

export interface ConsentUITheme {
  primaryColor: string;
  surfaceColor: string;
  textColor: string;
  titleColor: string;
  privacyPolicyColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  borderRadius: number;
  sheetRadius: number;
  buttonRadius: number;
}

export interface ConsentUIOptions {
  theme?: Partial<ConsentUITheme>;
  showRequiredDisclosure?: boolean;
}
