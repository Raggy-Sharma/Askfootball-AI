// Maps FC26 nationality names to ISO 3166-1 alpha-2 codes.
// Extend this as you encounter more nationalities in your data.
export const COUNTRY_CODE_MAP: Record<string, string> = {
    "Netherlands": "NL",
    "Uruguay": "UY",
    "Brazil": "BR",
    "Argentina": "AR",
    "France": "FR",
    "Spain": "ES",
    "Portugal": "PT",
    "England": "GB",
    "Germany": "DE",
    "Italy": "IT",
    "Belgium": "BE",
    "Croatia": "HR",
    "Norway": "NO",
    "Poland": "PL",
    "Morocco": "MA",
    "Senegal": "SN",
    "Nigeria": "NG",
    "Egypt": "EG",
    "Japan": "JP",
    "South Korea": "KR",
    "United States": "US",
    "Mexico": "MX",
    "Colombia": "CO",
    "Ecuador": "EC",
    "Ghana": "GH",
    "Ivory Coast": "CI",
    "Denmark": "DK",
    "Sweden": "SE",
    "Switzerland": "CH",
    "Austria": "AT",
    "Serbia": "RS",
    "Ukraine": "UA",
    "Scotland": "GB",
    "Wales": "GB",
    "Turkey": "TR",
    "Algeria": "DZ",
    "Cameroon": "CM",
    "Chile": "CL",
    "Canada": "CA",
    "Australia": "AU",
  };
  
  export function getCountryCode(countryName?: string): string | null {
    if (!countryName) return null;
    return COUNTRY_CODE_MAP[countryName] ?? null;
  }