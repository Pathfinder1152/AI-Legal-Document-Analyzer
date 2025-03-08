import React from "react";
import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  company: [
    { name: "About Us", href: "#about" },
    { name: "Our Team", href: "#team" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
  ],
  services: [
    { name: "Document Analysis", href: "#services" },
    { name: "Legal Research", href: "#research" },
    { name: "Contract Review", href: "#contracts" },
    { name: "Compliance", href: "#compliance" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Disclaimers", href: "/disclaimers" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <Image
                src="/logo-placeholder.svg"
                alt="AI Legal Document Analysis"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="font-serif text-xl font-bold">LegalAI</span>
            </div>
            <p className="text-blue-100 text-sm">
              Transforming legal document analysis with artificial intelligence.
              Faster insights, better decisions, enhanced compliance.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-blue-200 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.03 10.03 0 01-3.11 1.184A4.92 4.92 0 0012.2 8.05a13.903 13.903 0 01-10.095-5.145 4.92 4.92 0 001.52 6.57 4.885 4.885 0 01-2.23-.615v.06a4.926 4.926 0 003.95 4.83 4.964 4.964 0 01-2.224.084 4.93 4.93 0 004.6 3.42A9.863 9.863 0 010 19.54a13.856 13.856 0 007.504 2.2c9.054 0 14-7.496 14-14 0-.214 0-.428-.015-.64A10.02 10.02 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 xl:mt-0 xl:col-span-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-blue-200 hover:text-white text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Services</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-blue-200 hover:text-white text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-blue-200 hover:text-white text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-blue-500 pt-8">
          <p className="text-sm text-blue-200 text-center">
            &copy; {new Date().getFullYear()} LegalAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
