<<<<<<< HEAD

=======
>>>>>>> b01b3e35df346770f63206eb2370ec9184a585ef
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

<<<<<<< HEAD
import { cn } from "@/shared/utils"
=======
import { cn } from "@/lib/utils"
>>>>>>> b01b3e35df346770f63206eb2370ec9184a585ef

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
