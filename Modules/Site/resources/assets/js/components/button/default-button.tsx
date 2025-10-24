import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-black/90",
        outline: "border border-input hover:bg-accent",
        hover: "bg-black hover:bg-black/70",
        ghost: "hover:bg-accent",
      },
      size: {
        giant: "h-14 px-7 text-large",
        large: "h-12 px-6 text-base",
        medium: "h-10 px-5 text-sm",
        small: "h-8 px-4 text-sm",
        tiny: "h-6 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  }
)

const iconVariants = cva("", {
  variants: {
    size: {
      giant: "size-5",
      large: "size-5",
      medium: "size-4",
      small: "size-4",
      tiny: "size-3",
    },
  },
  defaultVariants: {
    size: "medium",
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      // spaceX,
      asChild = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    const renderIcon = (icon: React.ReactNode) => {
      if (!icon) return null
      
      if (React.isValidElement(icon)) {
        return React.cloneElement(icon as React.ReactElement<any, any>, {
          className: cn(iconVariants({ size }), (icon.props as any).className),
        } as any)
      }
      
      return icon
    }

    // Icon only button (no children)
    const isIconOnly = (leftIcon || rightIcon) && !children
    
    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          isIconOnly && "aspect-square p-0",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {leftIcon && renderIcon(leftIcon)}
        {children}
        {rightIcon && renderIcon(rightIcon)}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }