// src/components/forms/NewSnapshotForm.jsx
import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger, PopoverPortal } from '@radix-ui/react-popover';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { Calendar } from '../ui/Calendar';

const NewSnapshotForm = ({ onSubmit, onCancel }) => {
  const [date, setDate] = useState(new Date());
  const formRef = useRef(null); // 1. Create a ref

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(format(date, 'yyyy-MM-dd'));
  };

  return (
    // 2. Attach the ref to the form
    <form onSubmit={handleSubmit} ref={formRef}>
      <label className="block text-sm font-medium text-text-muted mb-2">
        Select a date for the new snapshot:
      </label>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full justify-start text-left font-normal flex items-center gap-2",
              "cursor-default rounded-lg bg-surface py-2 px-3 shadow-md border border-text/10",
              !date && "text-text-muted"
            )}
          >
            <CalendarDaysIcon className="h-5 w-5 text-text-muted" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </button>
        </PopoverTrigger>
        
        {/* 3. Use PopoverPortal to control the container */}
        <PopoverPortal container={formRef.current}>
          <PopoverContent
            className="w-auto p-0 z-50 bg-surface rounded-lg border border-text/10 shadow-lg"
            align="start"
            sideOffset={4}
            avoidCollisions={true} // 4. Add collision avoidance
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </PopoverPortal>
      </Popover>

      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-text/20 text-text">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-primary text-background font-bold">Create Snapshot</button>
      </div>
    </form>
  );
};

export default NewSnapshotForm;