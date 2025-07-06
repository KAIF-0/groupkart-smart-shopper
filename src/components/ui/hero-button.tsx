import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const heroButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-gradient-primary text-primary-foreground shadow-button hover:shadow-glow hover:scale-105 active:scale-95",
        secondary: "bg-gradient-secondary text-secondary-foreground shadow-button hover:shadow-glow hover:scale-105 active:scale-95",
        outline: "border-2 border-primary text-primary bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95",
        ghost: "text-primary hover:bg-primary/10 hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-11 px-8 py-2",
        sm: "h-9 rounded-md px-6",
        lg: "h-14 rounded-lg px-12 text-base",
        xl: "h-16 rounded-xl px-16 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface HeroButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof heroButtonVariants> {}

const HeroButton = React.forwardRef<HTMLButtonElement, HeroButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(heroButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
HeroButton.displayName = "HeroButton"

export { HeroButton, heroButtonVariants }