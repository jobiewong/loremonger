import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

interface DatePickerProps {
  initialValue?: Date;
  onChange?: (date: Date | undefined) => void;
  required?: boolean;
}

export function DatePicker({
  initialValue,
  required = false,
  onChange,
  ...props
}: React.ComponentProps<typeof Button> & DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialValue);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={cn(
            "data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal",
            props.className
          )}
          {...props}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(e: Date | undefined) => {
            setDate(e);
            onChange?.(e);
          }}
          required={required}
        />
      </PopoverContent>
    </Popover>
  );
}
