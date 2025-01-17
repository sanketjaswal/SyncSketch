import { v4 as uuidv4 } from "uuid";

// Generate a 6-digit code
export const generateSixDigitCode = () => {
    const uuid = uuidv4(); // Generate a UUID
    const code = parseInt(uuid.replace(/-/g, '').slice(0, 6), 16); // Convert the first 6 hex digits to a number
    return code.toString().padStart(6, '0'); // Ensure it's 6 digits, padding with zeros if needed
}
