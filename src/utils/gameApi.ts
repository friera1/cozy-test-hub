
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
  try {
    // Step 1: Generate token
    const token = await generateToken(params);
    if (!token) {
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
  const paramsStr = JSON.stringify(params);
  const paramsBase64 = btoa(toBinaryStr(paramsStr));
  const sign = hmacSHA256(paramsStr, API_SECRET);

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

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.lite_token || null;
  } catch (error) {
    console.error('Token generation error:', error);
    return null;
  }
};

// Get character information using the token
const getCharacterInfo = async (token: string): Promise<GameCharacterStats> => {
  try {
    const url = `${API_BASE_URL}/tgs/gateway2/oap/character/info?lite_token=${encodeURIComponent(token)}&client_id=${CLIENT_ID}`;
    
    const response = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const metaInfo = JSON.parse(data.meta_info);
    
    const power = metaInfo.power;
    const maxPower = metaInfo.maxPower;
    
    return {
      server: data.server_id,
      level: metaInfo.cityLvl,
      power: numberFormat(power),
      maxPower: numberFormat(maxPower),
      hiddenPower: numberFormat(maxPower - power),
      success: true
    };
  } catch (error) {
    console.error('Character info error:', error);
    throw error;
  }
};
