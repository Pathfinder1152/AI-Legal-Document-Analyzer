"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";

export default function DisclaimersPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="p-8 shadow-md">
        <h1 className="text-3xl font-serif font-bold mb-8 text-primary">Disclaimers</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-muted-foreground mb-4">Last Updated: May 18, 2025</p>
          
          <Alert className="bg-yellow-50 border-yellow-200 mb-8">
            <AlertTitle className="text-yellow-800">Important Notice</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Please read these disclaimers carefully before using the LegalAI service.
            </AlertDescription>
          </Alert>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">1. Not Legal Advice</h2>
            <p>
              LegalAI provides an AI-powered document analysis tool that helps understand and extract information 
              from legal documents. However, the information provided through our service is not legal advice and 
              should not be construed as such.
            </p>
            <p className="mt-3">
              Our AI technology analyzes documents based on patterns and language, but cannot replace the judgment, 
              reasoning, and expertise of qualified legal professionals. The information provided is for general 
              informational and educational purposes only.
            </p>
            <p className="mt-3">
              You should always consult with a qualified attorney regarding any specific legal questions or matters. 
              No attorney-client relationship is created through the use of our service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">2. AI Limitations</h2>
            <p>
              While we strive to provide accurate and helpful information, our AI technology has inherent limitations:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>It may not recognize or properly interpret all legal nuances or context-dependent meanings</li>
              <li>It may occasionally provide incomplete or inaccurate analyses of complex legal language</li>
              <li>It cannot assess the legal implications of documents in the context of your specific situation</li>
              <li>Its analyses may not account for recent legal developments or jurisdiction-specific variations in law</li>
            </ul>
            <p className="mt-3">
              We continuously work to improve our AI capabilities, but users should exercise appropriate caution 
              and judgment when relying on the information provided.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">3. No Warranty</h2>
            <p>
              The LegalAI service is provided on an "AS IS" and "AS AVAILABLE" basis, without warranties of any kind, 
              either express or implied, including but not limited to:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Warranties of merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Accuracy or completeness of information</li>
            </ul>
            <p className="mt-3">
              We do not guarantee that the service will be uninterrupted, timely, secure, or error-free, or that 
              defects in the service will be corrected. The service may be subject to limitations, delays, and other 
              problems inherent in the use of the internet and electronic communications.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">4. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, LegalAI and its affiliates, officers, employees, 
              agents, partners, and licensors will not be liable for any indirect, incidental, special, consequential, 
              or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible 
              losses, resulting from:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Your use of or inability to use the service</li>
              <li>Any actions or decisions made in reliance on information obtained through our service</li>
              <li>Unauthorized access to or alteration of your data</li>
              <li>Statements or conduct of any third party on our service</li>
              <li>Any other matter relating to the service</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">5. Document Security and Confidentiality</h2>
            <p>
              While we implement reasonable security measures to protect the documents you upload to our service, 
              no system can guarantee absolute security. We cannot ensure or warrant the security of any information 
              you transmit to us.
            </p>
            <p className="mt-3">
              You should always consider the sensitivity of the documents you upload to our service and assess 
              whether the use of our service is appropriate for particularly sensitive or confidential information.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">6. Third-Party Links and Services</h2>
            <p>
              Our service may contain links to third-party websites or services that are not owned or controlled 
              by LegalAI. We have no control over, and assume no responsibility for, the content, privacy policies, 
              or practices of any third-party websites or services.
            </p>
            <p className="mt-3">
              You acknowledge and agree that LegalAI shall not be responsible or liable, directly or indirectly, 
              for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance 
              on any such content, goods, or services available on or through any such websites or services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">7. Jurisdictional Issues</h2>
            <p>
              LegalAI is based in the United States and primarily designed for users in the United States. The 
              service may not be appropriate or available for use in other locations. If you access the service 
              from outside the United States, you do so on your own initiative and are responsible for compliance 
              with local laws.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">8. Modifications to Service</h2>
            <p>
              We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) 
              with or without notice. We will not be liable to you or any third party for any modification, price change, 
              suspension, or discontinuance of the service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">9. Contact Information</h2>
            <p>
              If you have any questions about these disclaimers, please contact us at:
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
