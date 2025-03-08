"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SimpleScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string;
}

export function SimpleScrollArea({ 
  className, 
  viewportClassName,
  children,
  ...props 
}: SimpleScrollAreaProps) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <div className={cn("h-full w-full overflow-auto pr-3", viewportClassName)}>
        {children}
      </div>
    </div>
  )
}
