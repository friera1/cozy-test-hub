
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { ArrowLeft, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/30 px-6 text-center">
      <div className="mb-6">
        <Shield className="h-16 w-16 text-primary mx-auto" />
      </div>
      <h1 className="text-8xl font-bold mb-6 text-primary">404</h1>
      <div className="max-w-md space-y-4 mb-8">
        <h2 className="text-3xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
      </div>
      <AnimatedButton 
        href={isAuthenticated ? "/dashboard" : "/"} 
        icon={<ArrowLeft size={18} />} 
        iconPosition="left"
      >
        {isAuthenticated ? "Return to Dashboard" : "Return to Login"}
      </AnimatedButton>
      
      {/* Background decorative elements */}
      <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -left-20 bottom-40 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl"></div>
    </div>
  );
};

export default NotFound;
