"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock user data - in a real app, this would come from an API or auth provider
  const [userData, setUserData] = useState({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Corporate Counsel",
    organization: "Acme Legal, Inc.",
    joined: "January 2023",
    plan: "Professional"
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call with delay
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // In a real app, you would clear auth tokens/cookies here
    router.push("/signin");
  };

  return (
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
                      {userData.name.split(' ').map(name => name[0]).join('')}
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold mb-1">{userData.name}</h2>
                  <p className="text-muted-foreground text-sm mb-3">{userData.email}</p>
                  <div className="bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                    {userData.plan} Plan
                  </div>
                  <div className="w-full border-t border-border mt-6 pt-4 text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Member since</span>
                      <span>{userData.joined}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role</span>
                      <span>{userData.role}</span>
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
                  Update your personal details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                        <Input 
                          id="name" 
                          value={userData.name} 
                          onChange={(e) => setUserData({...userData, name: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={userData.email} 
                          onChange={(e) => setUserData({...userData, email: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="role" className="text-sm font-medium">Job Title</label>
                        <Input 
                          id="role" 
                          value={userData.role} 
                          onChange={(e) => setUserData({...userData, role: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="organization" className="text-sm font-medium">Organization</label>
                        <Input 
                          id="organization" 
                          value={userData.organization} 
                          onChange={(e) => setUserData({...userData, organization: e.target.value})} 
                        />
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                        <p className="font-medium">{userData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Job Title</p>
                        <p className="font-medium">{userData.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Organization</p>
                        <p className="font-medium">{userData.organization}</p>
                      </div>
                    </div>
                    <div className="border-t border-border mt-4 pt-4">
                      <p className="text-sm text-muted-foreground mb-1">Security</p>
                      <Link 
                        href="/change-password" 
                        className="text-blue-500 hover:text-blue-400 text-sm"
                      >
                        Change Password
                      </Link>
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

            {/* Usage Stats Card */}
            <Card className="border-border/30 md:col-span-3">
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>
                  Your document analysis activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-card rounded-lg p-4 text-center border border-border/30">
                    <p className="text-3xl font-bold text-primary">24</p>
                    <p className="text-sm text-muted-foreground mt-1">Documents Analyzed</p>
                  </div>
                  <div className="bg-card rounded-lg p-4 text-center border border-border/30">
                    <p className="text-3xl font-bold text-primary">3</p>
                    <p className="text-sm text-muted-foreground mt-1">Active Projects</p>
                  </div>
                  <div className="bg-card rounded-lg p-4 text-center border border-border/30">
                    <p className="text-3xl font-bold text-primary">145</p>
                    <p className="text-sm text-muted-foreground mt-1">AI Queries</p>
                  </div>
                  <div className="bg-card rounded-lg p-4 text-center border border-border/30">
                    <p className="text-3xl font-bold text-primary">72%</p>
                    <p className="text-sm text-muted-foreground mt-1">Plan Usage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
