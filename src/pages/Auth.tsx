
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Shield, UserPlus, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get('loginUsername') as string;
    const password = formData.get('loginPassword') as string;
    
    try {
      const success = await login(username, password);
      if (success) {
        toast.success("Login successful!");
        navigate('/dashboard');
      } else {
        toast.error("Invalid username or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get('registerUsername') as string;
    const password = formData.get('registerPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    try {
      const success = await register(username, password);
      if (success) {
        toast.success("Registration successful! You can now login.");
      } else {
        toast.error("Username already exists");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Kingdom Guard Stats</h1>
          <p className="text-muted-foreground mt-2">Track your in-game performance</p>
        </div>
        
        <Card className="border-none shadow-lg">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Login to access your game statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginUsername">Username</Label>
                    <Input 
                      id="loginUsername" 
                      name="loginUsername" 
                      placeholder="Enter your username" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loginPassword">Password</Label>
                    <Input 
                      id="loginPassword" 
                      name="loginPassword" 
                      type="password" 
                      placeholder="Enter your password" 
                      required 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">Logging in...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" /> Login
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>Register to start tracking your stats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="registerUsername">Username</Label>
                    <Input 
                      id="registerUsername" 
                      name="registerUsername" 
                      placeholder="Choose a username" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <Input 
                      id="registerPassword" 
                      name="registerPassword" 
                      type="password" 
                      placeholder="Create a password" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      placeholder="Confirm your password" 
                      required 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">Registering...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" /> Register
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
