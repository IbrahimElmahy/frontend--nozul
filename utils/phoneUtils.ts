import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export const detectCountryCode = (phoneNumber: string): CountryCode | undefined => {
    try {
        // Ensure the number starts with + if missing, though typically input might have it or not.
        // libphonenumber-js generally expects + for international parsing if no default country is provided.
        const textToCheck = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

        const parsed = parsePhoneNumberFromString(textToCheck);
        if (parsed && parsed.country) {
            return parsed.country;
        }
    } catch (e) {
        // ignore validity errors during typing
    }
    return undefined;
};
