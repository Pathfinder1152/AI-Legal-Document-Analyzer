"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function CookiePolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="p-8 shadow-md">
        <h1 className="text-3xl font-serif font-bold mb-8 text-primary">Cookie Policy</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-muted-foreground mb-4">Last Updated: May 18, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">1. Introduction</h2>
            <p>
              This Cookie Policy explains how LegalAI ("we", "us", or "our") uses cookies and similar 
              technologies to recognize you when you visit our website and use our services. It explains 
              what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">2. What Are Cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
              Cookies are widely used by website owners to make their websites work efficiently and provide reporting information.
            </p>
            <p className="mt-3">
              Cookies set by the website owner (in this case, LegalAI) are called "first-party cookies." 
              Cookies set by parties other than the website owner are called "third-party cookies." Third-party 
              cookies enable third-party features or functionality to be provided on or through the website 
              (e.g., advertising, interactive content, and analytics).
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">3. Types of Cookies We Use</h2>
            <h3 className="text-xl font-medium mb-2">3.1 Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly and cannot be switched off in our systems. 
              They are usually only set in response to actions made by you which amount to a request for services, such as 
              setting your privacy preferences, logging in, or filling in forms.
            </p>
            <p className="mt-2">
              Examples of essential cookies we use:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Authentication cookies that help us identify you when you're logged in</li>
              <li>Session cookies that enable the service to function properly</li>
              <li>Security cookies that help maintain the security of our services</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2 mt-4">3.2 Functional Cookies</h3>
            <p>
              These cookies allow us to remember choices you make (such as your username, language, or region) 
              and provide enhanced, personalized features. They may also be used to provide services you have asked for.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">3.3 Performance/Analytics Cookies</h3>
            <p>
              These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. 
              They help us know which pages are the most and least popular and see how visitors move around the site.
            </p>
            <p className="mt-2">
              We use analytics providers such as Google Analytics, which set cookies to help us analyze how users use the site.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">3.4 Marketing Cookies</h3>
            <p>
              These cookies may be set through our site by our advertising partners. They may be used by those companies 
              to build a profile of your interests and show you relevant advertisements on other sites.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">4. How to Control Cookies</h2>
            <p>
              You can control and manage cookies in various ways. Please keep in mind that removing or blocking 
              cookies can negatively impact your user experience and parts of our website may no longer be fully accessible.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">4.1 Browser Controls</h3>
            <p>
              Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version. You can obtain up-to-date information about blocking and deleting cookies via these links:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:text-primary-dark" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-primary hover:text-primary-dark" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-primary hover:text-primary-dark" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-primary hover:text-primary-dark" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2 mt-4">4.2 Our Cookie Preferences Tool</h3>
            <p>
              You can also control cookies by clicking on the "Cookie Preferences" link in the footer of our website.
              This allows you to accept or decline different types of cookies.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">5. Cookies We Use</h2>
            <table className="min-w-full border-collapse border border-gray-300 my-4">
              <thead>
                <tr className="bg-primary-50">
                  <th className="py-2 px-4 border border-gray-300 text-left">Cookie Name</th>
                  <th className="py-2 px-4 border border-gray-300 text-left">Purpose</th>
                  <th className="py-2 px-4 border border-gray-300 text-left">Duration</th>
                  <th className="py-2 px-4 border border-gray-300 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border border-gray-300">sessionid</td>
                  <td className="py-2 px-4 border border-gray-300">Authentication session</td>
                  <td className="py-2 px-4 border border-gray-300">Session</td>
                  <td className="py-2 px-4 border border-gray-300">Essential</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border border-gray-300">csrftoken</td>
                  <td className="py-2 px-4 border border-gray-300">CSRF protection</td>
                  <td className="py-2 px-4 border border-gray-300">1 year</td>
                  <td className="py-2 px-4 border border-gray-300">Essential</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border border-gray-300">ui_theme</td>
                  <td className="py-2 px-4 border border-gray-300">User interface preference</td>
                  <td className="py-2 px-4 border border-gray-300">1 year</td>
                  <td className="py-2 px-4 border border-gray-300">Functional</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border border-gray-300">_ga</td>
                  <td className="py-2 px-4 border border-gray-300">Google Analytics</td>
                  <td className="py-2 px-4 border border-gray-300">2 years</td>
                  <td className="py-2 px-4 border border-gray-300">Analytics</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border border-gray-300">_gid</td>
                  <td className="py-2 px-4 border border-gray-300">Google Analytics</td>
                  <td className="py-2 px-4 border border-gray-300">24 hours</td>
                  <td className="py-2 px-4 border border-gray-300">Analytics</td>
                </tr>
              </tbody>
            </table>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">6. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes to the cookies we use or for 
              other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly 
              to stay informed about our use of cookies and related technologies.
            </p>
            <p className="mt-3">
              The date at the top of this Cookie Policy indicates when it was last updated.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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
