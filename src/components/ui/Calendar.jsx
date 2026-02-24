// src/components/ui/Calendar.jsx
import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils"; 
import { DayPicker } from "react-day-picker";

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 font-sans", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-2 relative items-center mb-4",
        caption_label: "text-base font-bold text-text tracking-wide",
        nav: "space-x-1 flex items-center",
        nav_button: "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-text/5 rounded-xl flex items-center justify-center transition-colors",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-2",
        head_row: "flex w-full mb-2",
        head_cell: "text-text-muted rounded-md w-10 font-semibold text-[0.8rem] uppercase tracking-wider",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        // Base day styling: Crisp text, modern rounded corners, and a beautiful hover effect
        day: "h-10 w-10 p-0 font-medium rounded-xl hover:bg-primary/15 hover:text-primary transition-all text-text",
        // Selected day: Pops out with the primary color and a shadow
        day_selected: "bg-primary text-background hover:bg-primary hover:text-background focus:bg-primary focus:text-background font-bold shadow-md transform scale-105",
        // Today: Subtle highlight so you know where you are, but doesn't distract from the selected day
        day_today: "bg-primary/5 text-primary font-bold",
        // Outside days: Visible but faded back into the background
        day_outside: "text-text-muted opacity-40 hover:opacity-70",
        day_disabled: "text-text-muted opacity-20 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-primary/10 aria-selected:text-text",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-5 w-5 text-text" />,
        IconRight: ({ ...props }) => <ChevronRightIcon className="h-5 w-5 text-text" />,
      }}
      {...props}
    />
  );
}

export { Calendar };