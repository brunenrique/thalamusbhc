"use client";
import { cn } from "@/shared/utils";
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3;
}
export default function Heading({ level = 1, className, ...props }: HeadingProps) {
  const Tag = (`h${level}`) as keyof JSX.IntrinsicElements;
  const sizes: Record<number, string> = {
    1: "text-3xl",
    2: "text-2xl",
    3: "text-xl",
  };
  return <Tag className={cn("font-headline font-bold", sizes[level], className)} {...props} />;
}
