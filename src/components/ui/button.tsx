
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import * as Sentry from '@sentry/nextjs'
import logger from '@/lib/logger'
import { cva, type VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"

import { cn } from "@/shared/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary: "bg-primary text-white hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  quick?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading, quick, onClick, children, ...props },
    ref
  ) => {
    const hasSingleValidChild =
      React.Children.count(children) === 1 &&
      React.isValidElement(children) &&
      (children as React.ReactElement).type !== React.Fragment;

    if (asChild && !hasSingleValidChild) {
      const err = new Error(
        "Button with asChild expects a single React element child that is not a Fragment. Rendering a default <button> instead."
      )
      Sentry.captureException(err)
      logger.error({ action: 'button_asChild_error', meta: { error: err } })
    }

    const Comp = asChild && hasSingleValidChild ? Slot : "button"
    const [checked, setChecked] = React.useState(false)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (quick) {
        setChecked(true)
        setTimeout(() => setChecked(false), 1500)
      }
      onClick?.(e)
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "opacity-50 cursor-not-allowed"
        )}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {children}
        {/* Render the Check icon only if Comp is 'button' (i.e., not asChild) and checked is true */}
        {Comp === "button" && checked && <Check className="h-4 w-4 text-green-600" />}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
