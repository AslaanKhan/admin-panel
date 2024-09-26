"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return; // If the date is undefined, exit early

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null); // Reset end date if starting a new range
    } else if (startDate && !endDate && date >= startDate) {
      setEndDate(date);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start w-fit text-left font-normal",
            !startDate && !endDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {startDate && endDate
            ? `${format(startDate, "PPP")} - ${format(endDate, "PPP")}`
            : <span>Pick a date range</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={startDate || undefined} // Ensure it's either a Date or undefined
          onSelect={handleDateSelect}
          initialFocus
        />
        <Calendar
          mode="single"
          selected={endDate || undefined} // Ensure it's either a Date or undefined
          onSelect={handleDateSelect}
          initialFocus
          className="mt-4" // Add some spacing
        />
      </PopoverContent>
    </Popover>
  );
}
