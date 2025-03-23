
// A simple encryption/decryption utility using AES
// Note: This is for demonstration purposes. In a real app,
// server-side encryption or a proper auth system would be more secure.

const ENCRYPTION_KEY = 'kingdom-guard-stats-secret-key-12345';

export const encryptData = (data: string): string => {
  try {
    // Simple XOR encryption for demonstration
    const encrypted = data.split('').map(char => {
      return String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(0));
    }).join('');
    
    return btoa(encrypted); // Base64 encode
  } catch (error) {
    console.error('Encryption failed', error);
    return '';
  }
};

export const decryptData = (encryptedData: string): string => {
  try {
    const data = atob(encryptedData); // Base64 decode
    
    // Simple XOR decryption
    const decrypted = data.split('').map(char => {
      return String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(0));
    }).join('');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed', error);
    return '';
  }
};
