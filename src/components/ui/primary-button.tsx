"use client";
import React from "react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/shared/utils";

export default function PrimaryButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        "bg-primary text-white hover:bg-primary/90",
        className
      )}
      {...props}
    />
  );
}
