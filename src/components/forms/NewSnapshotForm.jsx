// src/components/forms/NewSnapshotForm.jsx
import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger, PopoverPortal } from '@radix-ui/react-popover';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { Calendar } from '../ui/Calendar';

const NewSnapshotForm = ({ onSubmit, onCancel }) => {
  const [date, setDate] = useState(new Date());
  const formRef = useRef(null); 

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(format(date, 'yyyy-MM-dd'));
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-text-muted mb-3">
          Select a date for your new snapshot:
        </label>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left font-medium transition-all outline-none",
                "bg-background border border-text/10 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20",
                !date ? "text-text-muted" : "text-text"
              )}
            >
              <CalendarDaysIcon className="h-6 w-6 text-primary" />
              {date ? format(date, "MMMM d, yyyy") : <span>Pick a date</span>}
            </button>
          </PopoverTrigger>
          
          <PopoverPortal container={formRef.current}>
            <PopoverContent
              className="w-auto p-2 z-50 bg-surface rounded-2xl border border-text/10 shadow-xl overflow-hidden"
              align="start"
              sideOffset={8}
              avoidCollisions={true} 
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (selectedDate) setDate(selectedDate);
                }}
                initialFocus
                className="bg-transparent"
              />
            </PopoverContent>
          </PopoverPortal>
        </Popover>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-medium text-text-muted hover:bg-text/5 hover:text-text transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-background font-bold hover:bg-primary-dark hover:shadow-lg transition-all transform hover:-translate-y-0.5">
          Create Snapshot
        </button>
      </div>
    </form>
  );
};

export default NewSnapshotForm;