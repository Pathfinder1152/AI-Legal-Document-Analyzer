"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="p-8 shadow-md">
        <h1 className="text-3xl font-serif font-bold mb-8 text-primary">Privacy Policy</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-muted-foreground mb-4">Last Updated: May 18, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">1. Introduction</h2>
            <p>
              Welcome to LegalAI. We respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you use our AI-powered legal document analysis service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-2">2.1 Personal Information</h3>
            <p>We may collect personal information that you provide directly to us, including:</p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Payment and billing information</li>
              <li>Professional information (such as job title, company name)</li>
              <li>Communication preferences</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2 mt-4">2.2 Document Information</h3>
            <p>
              When you upload documents for analysis, we collect and process the content of those
              documents to provide our services. This may include:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Text content of legal documents</li>
              <li>Metadata associated with documents</li>
              <li>Information about document structure, parties, dates, and terms</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2 mt-4">2.3 Usage Information</h3>
            <p>
              We automatically collect certain information about how you interact with our service, including:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>IP address and device information</li>
              <li>Browser type and settings</li>
              <li>System and usage activity</li>
              <li>Interaction with features, pages, and services</li>
              <li>Query and search terms</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and analyze legal documents</li>
              <li>Develop new features and services</li>
              <li>Authenticate users and prevent fraud</li>
              <li>Communicate with you about our services</li>
              <li>Respond to your requests and inquiries</li>
              <li>Send administrative and service-related notifications</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. These 
              measures include:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Encryption of sensitive data at rest and in transit</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication procedures</li>
              <li>Secure data storage practices</li>
              <li>Staff training on data protection</li>
            </ul>
            <p>
              While we strive to protect your information, no method of transmission over the Internet or 
              electronic storage is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined 
              in this Privacy Policy, unless a longer retention period is required or permitted by law. 
              Document data may be retained to provide and improve our services, comply with legal obligations, 
              and enforce our agreements.
            </p>
            <p className="mt-3">
              You may request deletion of your account and associated data at any time. Some information may 
              be retained in our backup systems or as required by law.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">6. Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your data:</p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Restrict or object to certain processing activities</li>
              <li>Data portability</li>
              <li>Withdraw consent where applicable</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@legalai.com.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">7. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by 
              an updated "Last Updated" date and will be effective as soon as it is accessible. We encourage 
              you to review this Privacy Policy frequently to be informed of how we are protecting your information.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">8. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our practices, please contact us at:
            </p>
            <p className="mt-3">
              <strong>Email:</strong> privacy@legalai.com<br />
              <strong>Address:</strong> LegalAI Headquarters, 123 Tech Park, Innovation City, CA 94103
            </p>
          </section>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <Link href="/" className="text-primary hover:text-primary-dark font-medium">
            ← Back to Home
          </Link>
        </div>
      </Card>
    </main>
  );
}
