"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/ui/section";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast-hook";
import { updateUserProfile } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      await updateUserProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email
      });
      
      // Refresh user data
      await refreshUser();
      
      showToast({
        title: 'Success',
        description: 'Your profile has been updated successfully.',
        type: 'success',
      });
      
      setIsEditing(false);
    } catch (err) {
      showToast({
        title: 'Error',
        description: 'Failed to update your profile. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      showToast({
        title: 'Error',
        description: 'New passwords do not match. Please try again.',
        type: 'error',
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await updateUserProfile({
        current_password: formData.currentPassword,
        new_password: formData.newPassword
      });
      
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      showToast({
        title: 'Success',
        description: 'Your password has been updated successfully.',
        type: 'success',
      });
    } catch (err) {
      showToast({
        title: 'Error',
        description: 'Failed to update your password. Please verify your current password is correct.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast({
        title: 'Success',
        description: 'You have been signed out successfully.',
        type: 'success',
      });
    } catch (err) {
      showToast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-12">
        <Section>
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-serif font-bold text-primary">Your Profile</h1>
              <Button variant="outline" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Summary Card */}
              <Card className="border-border/30">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-blue-600/20 mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-600">
                        {user ? (user.first_name?.[0] || "") + (user.last_name?.[0] || "") : ""}
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-1">
                      {user ? `${user.first_name || ""} ${user.last_name || ""}` : ""}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-3">{user?.email}</p>
                    <div className="w-full border-t border-border mt-6 pt-4 text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Username</span>
                        <span>{user?.username}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" className="w-full" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Profile Details Card */}
              <Card className="border-border/30 md:col-span-2">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            name="firstName"
                            value={formData.firstName} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            name="lastName"
                            value={formData.lastName} 
                            onChange={handleInputChange} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">First Name</p>
                          <p className="font-medium">{user?.first_name || "Not set"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Last Name</p>
                          <p className="font-medium">{user?.last_name || "Not set"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                {isEditing && (
                  <CardFooter>
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={isSaving} 
                      className="ml-auto"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {/* Password Change Card */}
              <Card className="border-border/30 md:col-span-3">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          name="currentPassword"
                          type="password" 
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          name="newPassword"
                          type="password" 
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          name="confirmPassword"
                          type="password" 
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        disabled={isSaving} 
                      >
                        {isSaving ? "Updating..." : "Change Password"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>
      </div>
    </ProtectedRoute>
  );
}
