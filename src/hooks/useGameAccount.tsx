
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { encryptData, decryptData } from '@/utils/crypto';
import { getCharacterStats, GameCharacterStats, GameCharacterParams } from '@/utils/gameApi';

export interface GameAccount {
  gameId: string;
  nickname: string;
  stats?: GameCharacterStats;
}

export const useGameAccount = () => {
  const { username } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const saveGameAccount = async (gameId: string, nickname: string): Promise<{ success: boolean; stats?: GameCharacterStats }> => {
    if (!username) return { success: false };
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch stats from the API
      const params: GameCharacterParams = {
        character_id: gameId,
        nickname: nickname
      };
      
      const stats = await getCharacterStats(params);
      
      if (!stats.success) {
        setError(stats.error || 'Failed to fetch game statistics');
        return { success: false };
      }
      
      // Save the account with the stats
      const gameAccountsData = getGameAccountsData();
      const updatedData = { 
        ...gameAccountsData, 
        [username]: { gameId, nickname, stats }
      };
      
      saveGameAccountsData(updatedData);
      
      setIsLoading(false);
      return { success: true, stats };
    } catch (error) {
      console.error('Error saving game account:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setIsLoading(false);
      return { success: false };
    }
  };

  const getGameAccount = async (): Promise<GameAccount | null> => {
    if (!username) return null;
    
    const gameAccountsData = getGameAccountsData();
    return gameAccountsData[username] || null;
  };

  return {
    saveGameAccount,
    getGameAccount,
    isLoading,
    error
  };
};
