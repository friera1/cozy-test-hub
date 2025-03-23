
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { encryptData, decryptData } from '@/utils/crypto';
import { getCharacterStats, GameCharacterStats, GameCharacterParams } from '@/utils/gameApi';
import { toast } from 'sonner';

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
    if (!username) {
      setError('User not authenticated');
      toast.error('User not authenticated');
      return { success: false };
    }
    
    setIsLoading(true);
    setError(null);
    
    console.log('Saving game account with ID:', gameId, 'and nickname:', nickname);
    
    try {
      // Fetch stats from the API
      const params: GameCharacterParams = {
        character_id: gameId,
        nickname: nickname
      };
      
      console.log('Calling getCharacterStats with params:', params);
      const stats = await getCharacterStats(params);
      console.log('API response stats:', stats);
      
      if (!stats.success) {
        const errorMessage = stats.error || 'Failed to fetch game statistics';
        console.error(errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        return { success: false };
      }
      
      // Save the account with the stats
      const gameAccountsData = getGameAccountsData();
      const updatedData = { 
        ...gameAccountsData, 
        [username]: { gameId, nickname, stats }
      };
      
      console.log('Saving account data to localStorage:', updatedData);
      saveGameAccountsData(updatedData);
      
      toast.success('Game account information saved successfully!');
      setIsLoading(false);
      return { success: true, stats };
    } catch (error) {
      console.error('Error saving game account:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Error saving game account: ${errorMessage}`);
      setIsLoading(false);
      return { success: false };
    }
  };

  const getGameAccount = async (): Promise<GameAccount | null> => {
    if (!username) return null;
    
    console.log('Getting game account for user:', username);
    const gameAccountsData = getGameAccountsData();
    const account = gameAccountsData[username] || null;
    console.log('Retrieved account:', account);
    return account;
  };

  return {
    saveGameAccount,
    getGameAccount,
    isLoading,
    error
  };
};
