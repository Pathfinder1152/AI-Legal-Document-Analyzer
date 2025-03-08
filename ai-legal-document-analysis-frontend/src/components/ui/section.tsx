import React from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  withContainer?: boolean;
}

export const Section = ({ id, className = "", children, withContainer = true }: SectionProps) => {
  const content = withContainer ? <Container>{children}</Container> : children;
  
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      {content}
    </section>
  );
};

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  badge?: string;
}

export const SectionHeader = ({ title, description, badge, className = "" }: SectionHeaderProps) => {
  return (
    <div className={cn("text-center mb-16", className)}>
      {badge && (
        <span className="inline-block text-blue-600 font-semibold mb-2">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-primary">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};
