// src/components/forms/NewSnapshotForm.jsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils'; 
import { Calendar } from '../ui/Calendar';

const NewSnapshotForm = ({ onSubmit, onCancel }) => {
  const [date, setDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(format(date, 'yyyy-MM-dd'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-text-muted mb-2">
        Select a date for the new snapshot:
      </label>
      
      <Popover>
        <PopoverTrigger asChild>
          <button
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
        <PopoverContent className="w-auto p-0 z-20 bg-surface rounded-lg border border-text/10 shadow-lg" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-text/20 text-text">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-primary text-background font-bold">Create Snapshot</button>
      </div>
    </form>
  );
};

export default NewSnapshotForm;