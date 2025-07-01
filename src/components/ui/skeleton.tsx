<<<<<<< HEAD

import { cn } from "@/shared/utils"
=======
import { cn } from "@/lib/utils"
>>>>>>> b01b3e35df346770f63206eb2370ec9184a585ef

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
