"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

interface DatePickerProps {
  value?: string | null;
  onSetDate: (date: Date) => void;
}

export function DatePicker({ value, onSetDate }: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined | null>(
    value ? new Date(value) : null
  );

  // Sync internal date state with external value prop
  useEffect(() => {
    if (value) {
      setDate(new Date(value));
    }
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-surface-light" align="start">
        <Calendar
          mode="single"
          selected={date!!}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            if (selectedDate) {
              onSetDate(selectedDate);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
