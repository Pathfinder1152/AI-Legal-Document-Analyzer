"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }
    
    try {
      // Here you would make an API call to reset the password using the token
      // For demo purposes, we'll just simulate a delay
      await new Promise(r => setTimeout(r, 1000));
      setSuccess(true);
      
      // Redirect to sign in page after 2 seconds
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
      
    } catch (err) {
      setError("Failed to reset password. The token might be invalid or expired.");
    } finally {
      setIsLoading(false);
    }
  };

  // If no token provided, show an error
  if (!token) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-12">
        <Card className="shadow-lg border-border/50 w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Invalid Reset Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-500/10 border border-red-500/50 rounded-md p-4 text-sm text-red-500">
              <p className="font-medium">The password reset link is invalid or expired.</p>
              <p className="mt-1">Please request a new password reset link.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/auth/forgot-password">Request New Reset Link</Link>
            </Button>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background py-12">
      <Container className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center">
                <Image src="/logo-placeholder.svg" alt="LegalAI Logo" width={48} height={48} className="mr-2" />
                <span className="text-2xl font-serif font-bold text-primary">LegalAI</span>
              </div>
            </Link>
          </div>
          
          <Card className="shadow-lg border-border/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3 mb-4 text-sm text-red-500">
                  {error}
                </div>
              )}
              
              {success ? (
                <div className="bg-green-500/10 border border-green-500/50 rounded-md p-4 text-sm text-green-500">
                  <p className="font-medium">Password reset successful!</p>
                  <p className="mt-1">You will be redirected to the sign in page shortly...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col items-center justify-center gap-2 p-6 pt-0">
              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Back to sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </Container>
    </div>
  );
}