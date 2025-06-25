"use client";

import * as React from "react";
import {
  Card,
  CardContent,
} from "@/atoms/card";
import { Calendar } from "@/atoms/calendar";

export function SchedulePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex h-full flex-col">
      <Card className="flex-1">
        <CardContent className="h-full p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="h-full w-full"
            classNames={{
              months: "flex flex-col sm:flex-row h-full space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4 flex-1 flex flex-col",
              table: "w-full border-collapse space-y-1 flex-1",
              head_row: "flex",
              row: "flex w-full mt-2",
              day: "h-full w-full p-0 font-normal aria-selected:opacity-100",
              cell: "h-auto text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
