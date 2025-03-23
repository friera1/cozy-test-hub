
import { sha256 } from 'js-sha256';

// API Configuration
const API_SECRET = '20f7b2cf273b085bd1fc0e2463dba668';
const API_BASE_URL = 'https://5c7021242c10k1d2.tap4hub.com:10443';
const CLIENT_ID = 'k1d2:oap.1.0.0';

// Helper functions
const toBinaryStr = (str: string): string => {
  const encoder = new TextEncoder();
  const charCodes = encoder.encode(str);
  return String.fromCharCode(...charCodes);
};

const hmacSHA256 = (message: string, key: string): string => {
  return sha256.hmac(key, message);
};

const numberFormat = (number: number, decimals = 0, decPoint = '.', thousandsSep = '.'): string => {
  const formattedNumber = parseFloat(String(number)).toFixed(decimals);
  let parts = formattedNumber.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  return parts.join(decPoint);
};

export interface GameCharacterParams {
  character_id: string;
  nickname: string;
}

export interface GameCharacterStats {
  server: string;
  level: number;
  power: string;
  maxPower: string;
  hiddenPower: string;
  success: boolean;
  error?: string;
}

// Get character stats from the API
export const getCharacterStats = async (params: GameCharacterParams): Promise<GameCharacterStats> => {
  console.log('Fetching character stats with params:', params);
  try {
    // Step 1: Generate token
    const token = await generateToken(params);
    if (!token) {
      console.error('Failed to generate token');
      return {
        server: '',
        level: 0,
        power: '0',
        maxPower: '0',
        hiddenPower: '0',
        success: false,
        error: 'Failed to generate token'
      };
    }

    console.log('Token generated successfully');

    // Step 2: Get character info using token
    return await getCharacterInfo(token);
  } catch (error) {
    console.error('Error fetching character stats:', error);
    return {
      server: '',
      level: 0,
      power: '0',
      maxPower: '0',
      hiddenPower: '0',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Generate a token for API access
const generateToken = async (params: GameCharacterParams): Promise<string | null> => {
  console.log('Generating token with params:', params);
  const paramsStr = JSON.stringify(params);
  const paramsBase64 = btoa(toBinaryStr(paramsStr));
  const sign = hmacSHA256(paramsStr, API_SECRET);

  console.log('Encoded payload:', paramsBase64);
  console.log('Sign:', sign);

  const formData = new FormData();
  formData.append('encoded_payload', paramsBase64);
  formData.append('sign', sign);

  try {
    const response = await fetch(
      `${API_BASE_URL}/tgs/gateway2/character/litetoken?client_id=${CLIENT_ID}`,
      {
        method: 'POST',
        body: formData
      }
    );

    console.log('Token API response status:', response.status);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Token API response data:', data);
    
    if (!data.lite_token) {
      console.error('No lite_token in response:', data);
      return null;
    }
    
    return data.lite_token;
  } catch (error) {
    console.error('Token generation error:', error);
    return null;
  }
};

// Get character information using the token
const getCharacterInfo = async (token: string): Promise<GameCharacterStats> => {
  console.log('Getting character info with token:', token);
  try {
    const url = `${API_BASE_URL}/tgs/gateway2/oap/character/info?lite_token=${encodeURIComponent(token)}&client_id=${CLIENT_ID}`;
    
    console.log('Character info API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET'
    });

    console.log('Character info API response status:', response.status);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Character info API response data:', data);
    
    if (!data.meta_info) {
      console.error('No meta_info in response:', data);
      return {
        server: '',
        level: 0,
        power: '0',
        maxPower: '0',
        hiddenPower: '0',
        success: false,
        error: 'Invalid response from server'
      };
    }
    
    const metaInfo = JSON.parse(data.meta_info);
    console.log('Parsed meta_info:', metaInfo);
    
    const power = metaInfo.power || 0;
    const maxPower = metaInfo.maxPower || 0;
    
    return {
      server: data.server_id || '',
      level: metaInfo.cityLvl || 0,
      power: numberFormat(power),
      maxPower: numberFormat(maxPower),
      hiddenPower: numberFormat(maxPower - power),
      success: true
    };
  } catch (error) {
    console.error('Character info error:', error);
    return {
      server: '',
      level: 0,
      power: '0',
      maxPower: '0',
      hiddenPower: '0',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error fetching character info'
    };
  }
};
