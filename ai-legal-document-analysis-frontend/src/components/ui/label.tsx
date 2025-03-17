"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Extend HTMLLabelElement attributes to ensure htmlFor is properly typed
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
