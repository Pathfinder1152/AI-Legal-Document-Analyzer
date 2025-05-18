"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="p-8 shadow-md">
        <h1 className="text-3xl font-serif font-bold mb-8 text-primary">Terms of Service</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-muted-foreground mb-4">Last Updated: May 18, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">1. Agreement to Terms</h2>
            <p>
              Welcome to LegalAI. These Terms of Service ("Terms") govern your access to and use of the LegalAI 
              website, applications, and services ("Services"). By accessing or using our Services, you agree
              to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
            </p>
            <p className="mt-3">
              Please read these Terms carefully. They constitute a legal agreement between you and LegalAI.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">2. Service Description</h2>
            <p>
              LegalAI provides AI-powered legal document analysis and management services, including but not limited to:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Document upload and storage</li>
              <li>AI-assisted document analysis</li>
              <li>Text extraction and processing</li>
              <li>Legal clause identification and classification</li>
              <li>Interactive Q&A with document content</li>
              <li>Document comparison and version tracking</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of our Services at any time, 
              with or without notice to you.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">3. User Accounts</h2>
            <p>
              To access certain features of our Services, you may be required to register for an account. 
              You agree to provide accurate, current, and complete information during the registration process
              and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="mt-3">
              You are responsible for safeguarding your account credentials and for all activities that occur
              under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
            <p className="mt-3">
              We reserve the right to disable any user account if, in our opinion, you have violated any
              provision of these Terms.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">4. User Content</h2>
            <h3 className="text-xl font-medium mb-2">4.1 Content Ownership</h3>
            <p>
              You retain ownership of any content (including documents and data) that you upload to our Services
              ("User Content"). By uploading User Content, you grant us a non-exclusive, worldwide, royalty-free
              license to use, store, process, and display your User Content solely for the purposes of providing
              and improving our Services.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">4.2 Content Restrictions</h3>
            <p>You agree not to upload User Content that:</p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Infringes any third-party intellectual property or other rights</li>
              <li>Contains software viruses or any other harmful code</li>
              <li>Is unlawful, defamatory, obscene, or otherwise objectionable</li>
              <li>Violates these Terms or any applicable laws or regulations</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">5. Intellectual Property</h2>
            <p>
              Our Services and their contents, features, and functionality (including but not limited to all
              information, software, text, displays, images, and audio) are owned by LegalAI and are protected
              by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="mt-3">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly
              perform, republish, download, store, or transmit any of our proprietary materials, except as
              permitted by these Terms.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">6. Subscription and Payment</h2>
            <p>
              Certain features of our Services may be offered on a subscription basis. By subscribing to our
              Services, you agree to pay all fees associated with your chosen subscription plan.
            </p>
            <p className="mt-3">
              We may change our subscription plans and pricing at any time. We will notify you of any changes
              in pricing before they affect your subscription.
            </p>
            <p className="mt-3">
              Subscriptions will automatically renew unless canceled by you before the renewal date. You may
              cancel your subscription at any time through your account settings or by contacting us.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">7. Disclaimers and Limitations</h2>
            <h3 className="text-xl font-medium mb-2">7.1 No Legal Advice</h3>
            <p>
              Our Services are not a substitute for professional legal advice. The analysis and insights
              provided by our AI systems should not be construed as legal advice. We recommend consulting
              with qualified legal counsel for specific legal matters.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">7.2 Service Availability</h3>
            <p>
              We strive to provide uninterrupted Services, but we do not guarantee that our Services will be
              available at all times. Services may be temporarily unavailable due to maintenance, system failures,
              or other reasons beyond our control.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">7.3 Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by applicable law, LegalAI and its affiliates, officers, employees,
              agents, partners, and licensors will not be liable for any indirect, incidental, special, consequential,
              or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from your access to or use of or inability to access or use the Services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">8. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California,
              without regard to its conflict of law provisions.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. If we make material changes, we will notify
              you by email or through a notice on our website prior to the changes becoming effective. Your continued
              use of our Services after the effective date of the revised Terms indicates your acceptance of the changes.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-3">
              <strong>Email:</strong> legal@legalai.com<br />
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
