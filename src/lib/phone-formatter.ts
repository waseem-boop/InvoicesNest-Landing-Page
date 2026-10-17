import { AsYouType, CountryCode, getCountryCallingCode } from 'libphonenumber-js';

// Backward compatibility schema for any potential imports
interface PhoneRule {
    code: string;
    country: string;
    iso2: string;
    groups: number[];
    usaBrackets?: boolean;
    usaDash?: boolean;
    maxDigits: number;
}

export const PHONE_RULES: PhoneRule[] = [];

export function getPhoneRule(raw: string): null {
    return null;
}

export function formatPhone(raw: string): string {
    const asYouType = new AsYouType(guessCountryCode());
    return asYouType.input(raw);
}

/**
 * Guess the user's country code based on their browser settings (timezone, language)
 */
export function guessCountryCode(): CountryCode {
    if (typeof window === 'undefined') return 'US';
    
    // 1. Try to get country from Intl.Locale (modern browsers)
    try {
        const lang = navigator.language || (navigator.languages && navigator.languages[0]);
        if (lang) {
            const locale = new Intl.Locale(lang);
            const region = locale.region;
            if (region) return region.toUpperCase() as CountryCode;
        }
    } catch (e) {}

    // 2. Try to get country from Timezone (highly reliable fallback)
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) {
            const lowerTz = tz.toLowerCase();
            if (lowerTz.includes('karachi')) return 'PK';
            if (lowerTz.includes('kolkata') || lowerTz.includes('calcutta')) return 'IN';
            if (lowerTz.includes('jerusalem') || lowerTz.includes('tel_aviv')) return 'IL';
            if (lowerTz.includes('london')) return 'GB';
            if (lowerTz.includes('dubai')) return 'AE';
            if (lowerTz.includes('riyadh')) return 'SA';
            if (lowerTz.includes('dhaka')) return 'BD';
            if (lowerTz.includes('kathmandu')) return 'NP';
            if (lowerTz.includes('colombo')) return 'LK';
            if (lowerTz.includes('singapore')) return 'SG';
            if (lowerTz.includes('kuala_lumpur')) return 'MY';
            if (lowerTz.includes('jakarta')) return 'ID';
            if (lowerTz.includes('istanbul')) return 'TR';
            if (lowerTz.includes('sydney') || lowerTz.includes('melbourne')) return 'AU';
            if (lowerTz.includes('auckland')) return 'NZ';
            if (lowerTz.includes('tokyo')) return 'JP';
            if (lowerTz.includes('seoul')) return 'KR';
            if (lowerTz.includes('shanghai')) return 'CN';
            if (lowerTz.includes('sao_paulo')) return 'BR';
            if (lowerTz.includes('mexico')) return 'MX';
            if (lowerTz.includes('buenos_aires')) return 'AR';
            if (lowerTz.includes('paris')) return 'FR';
            if (lowerTz.includes('berlin')) return 'DE';
            if (lowerTz.includes('rome')) return 'IT';
            if (lowerTz.includes('madrid')) return 'ES';
            if (lowerTz.includes('amsterdam')) return 'NL';
            if (lowerTz.includes('brussels')) return 'BE';
            if (lowerTz.includes('zurich')) return 'CH';
            if (lowerTz.includes('vienna')) return 'AT';
            if (lowerTz.includes('copenhagen')) return 'DK';
            if (lowerTz.includes('stockholm')) return 'SE';
            if (lowerTz.includes('oslo')) return 'NO';
            if (lowerTz.includes('warsaw')) return 'PL';
        }
    } catch (e) {}

    // 3. Fallback based on language prefix
    try {
        const lang = navigator.language || (navigator.languages && navigator.languages[0]);
        if (lang) {
            const prefix = lang.slice(0, 2).toLowerCase();
            const langMap: { [key: string]: CountryCode } = {
                'ur': 'PK',
                'hi': 'IN',
                'he': 'IL',
                'bn': 'BD',
                'ar': 'SA',
                'ja': 'JP',
                'ko': 'KR',
                'zh': 'CN',
                'fr': 'FR',
                'de': 'DE',
                'it': 'IT',
                'es': 'ES',
                'nl': 'NL',
                'ru': 'RU',
            };
            if (langMap[prefix]) return langMap[prefix];
        }
    } catch (e) {}

    return 'US'; // Default fallback
}

/**
 * Backward compatibility: returns the raw clean number without prefix manipulation
 */
export function detectLocalNumber(raw: string, guessedCountry: CountryCode = guessCountryCode()): string {
    return raw.trim();
}

/**
 * Handle phone input change — formats value as they type based on the guessed country
 */
export function handlePhoneInput(raw: string): string {
    if (!raw) return '';
    const guessedCountry = guessCountryCode();
    const asYouType = new AsYouType(guessedCountry);
    return asYouType.input(raw);
}

/** Get placeholder for a given country code */
export function getPhonePlaceholder(countryCode: string): string {
    const cleanedCode = countryCode.replace('+', '');
    let callingCode = cleanedCode;
    try {
        if (cleanedCode.length === 2) {
            callingCode = getCountryCallingCode(cleanedCode as CountryCode);
        }
    } catch (e) {}
    return `+${callingCode} 000 000 0000`;
}
