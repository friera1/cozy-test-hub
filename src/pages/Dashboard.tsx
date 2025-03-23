
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Shield, LogOut, Save, User, Gamepad2 } from "lucide-react";
import { toast } from "sonner";
import { useGameAccount } from "@/hooks/useGameAccount";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, username } = useAuth();
  const { saveGameAccount, getGameAccount } = useGameAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [gameId, setGameId] = useState("");
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Load existing game account data if available
    const loadGameAccount = async () => {
      const accountData = await getGameAccount();
      if (accountData) {
        setGameId(accountData.gameId);
        setNickname(accountData.nickname);
      }
    };

    loadGameAccount();
  }, [isAuthenticated, navigate, getGameAccount]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveGameAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await saveGameAccount(gameId, nickname);
      toast.success("Game account information saved successfully!");
    } catch (error) {
      toast.error("Failed to save game account information");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/30">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Kingdom Guard Stats</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Logged in as <span className="font-medium text-foreground">{username}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  Game Account Details
                </CardTitle>
                <CardDescription>
                  Link your Kingdom Guard game account to track your statistics
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveGameAccount}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gameId">Game ID</Label>
                    <Input
                      id="gameId"
                      placeholder="Enter your game ID"
                      value={gameId}
                      onChange={(e) => setGameId(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      You can find your Game ID in the settings menu of Kingdom Guard
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Game Nickname</Label>
                    <Input
                      id="nickname"
                      placeholder="Enter your in-game nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <span className="flex items-center gap-2">Saving...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="h-4 w-4" /> Save Account Information
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Player Statistics
                </CardTitle>
                <CardDescription>
                  Your Kingdom Guard game statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {gameId ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-3">
                        <div className="text-sm font-medium text-muted-foreground">Level</div>
                        <div className="text-2xl font-bold">25</div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-sm font-medium text-muted-foreground">Rank</div>
                        <div className="text-2xl font-bold">Gold</div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-sm font-medium text-muted-foreground">Battles</div>
                        <div className="text-2xl font-bold">158</div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-sm font-medium text-muted-foreground">Win Rate</div>
                        <div className="text-2xl font-bold">72%</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <div className="mb-2 flex justify-center">
                      <Gamepad2 className="h-10 w-10 opacity-50" />
                    </div>
                    <p className="mb-2">No game account linked yet</p>
                    <p className="text-sm">Add your game ID to see your statistics</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
