
import { useAuth } from '@/hooks/useAuth';
import { encryptData, decryptData } from '@/utils/crypto';

interface GameAccount {
  gameId: string;
  nickname: string;
}

export const useGameAccount = () => {
  const { username } = useAuth();

  const getGameAccountsData = (): Record<string, GameAccount> => {
    const encryptedData = localStorage.getItem('gameAccountsData');
    if (!encryptedData) return {};
    
    try {
      const decrypted = decryptData(encryptedData);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to decrypt game accounts data', error);
      return {};
    }
  };

  const saveGameAccountsData = (data: Record<string, GameAccount>) => {
    const encrypted = encryptData(JSON.stringify(data));
    localStorage.setItem('gameAccountsData', encrypted);
  };

  const saveGameAccount = async (gameId: string, nickname: string): Promise<boolean> => {
    if (!username) return false;
    
    const gameAccountsData = getGameAccountsData();
    const updatedData = { 
      ...gameAccountsData, 
      [username]: { gameId, nickname }
    };
    
    saveGameAccountsData(updatedData);
    return true;
  };

  const getGameAccount = async (): Promise<GameAccount | null> => {
    if (!username) return null;
    
    const gameAccountsData = getGameAccountsData();
    return gameAccountsData[username] || null;
  };

  return {
    saveGameAccount,
    getGameAccount,
  };
};
