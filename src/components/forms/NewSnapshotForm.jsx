// src/components/forms/NewSnapshotForm.jsx
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const NewSnapshotForm = ({ onSubmit, onCancel }) => {
  // Initialize to today
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  
  // viewDate controls which month the calendar is currently showing
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // --- Calendar Engine Math ---
  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const generateGrid = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = [];

    // 1. Fill Leading Days (Previous Month)
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push({
        date: new Date(year, month - 1, daysInPrevMonth - firstDayOfMonth + i + 1),
        isCurrentMonth: false
      });
    }

    // 2. Fill Current Month Days
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // 3. Fill Trailing Days (Next Month) to guarantee exactly 42 slots (6 rows)
    const remaining = 42 - grid.length;
    for (let i = 1; i <= remaining; i++) {
      grid.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return grid;
  };

  // Utility to format date for Firebase (YYYY-MM-DD) avoiding timezone shifts
  const getFormattedDateString = (d) => {
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  };

  const isSameDay = (d1, d2) => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(getFormattedDateString(selectedDate));
  };

  const calendarDays = generateGrid();
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-3">
          <CalendarDaysIcon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-text-muted text-sm font-medium">Select a date for this financial snapshot.</h3>
      </div>

      {/* 1% Upgrade: The Premium Custom Calendar Grid */}
      <div className="bg-background border border-text/10 rounded-2xl p-4 shadow-sm w-full max-w-sm mx-auto select-none">
        
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4 px-1">
          <button 
            type="button" 
            onClick={handlePrevMonth}
            className="p-1.5 text-text-muted hover:text-text hover:bg-text/5 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-extrabold text-text tracking-wide">
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </h2>
          <button 
            type="button" 
            onClick={handleNextMonth}
            className="p-1.5 text-text-muted hover:text-text hover:bg-text/5 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {/* Weekday Labels */}
          {weekDays.map(day => (
            <div key={day} className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
              {day}
            </div>
          ))}

          {/* Day Buttons */}
          {calendarDays.map((dayObj, index) => {
            const isSelected = isSameDay(dayObj.date, selectedDate);
            const isToday = isSameDay(dayObj.date, today);

            // Dynamic class generation based on the 2026 SaaS design tokens
            let buttonClasses = "w-9 h-9 mx-auto flex items-center justify-center text-sm rounded-lg transition-all ";
            
            if (isSelected) {
              buttonClasses += "bg-primary text-background font-bold shadow-md scale-105";
            } else if (isToday) {
              buttonClasses += "text-primary font-extrabold bg-primary/10 hover:bg-primary/20";
            } else if (!dayObj.isCurrentMonth) {
              buttonClasses += "text-text-muted/30 font-medium hover:bg-text/5";
            } else {
              buttonClasses += "text-text font-semibold hover:bg-text/5";
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setSelectedDate(dayObj.date);
                  // Optional UX tweak: auto-switch to the month of the clicked leading/trailing day
                  if (!dayObj.isCurrentMonth) setViewDate(new Date(dayObj.date.getFullYear(), dayObj.date.getMonth(), 1));
                }}
                className={buttonClasses}
              >
                {dayObj.date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <div className="text-xs font-semibold text-text-muted">
          Selected: <span className="font-mono text-text">{getFormattedDateString(selectedDate)}</span>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-text/5">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-5 py-2.5 rounded-xl text-text-muted hover:bg-text/5 font-semibold transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-5 py-2.5 bg-primary text-background rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
        >
          Create Snapshot
        </button>
      </div>
    </form>
  );
};

export default NewSnapshotForm;