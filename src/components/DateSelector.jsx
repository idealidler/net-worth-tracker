// src/components/DateSelector.jsx
import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

const DateSelector = ({ data, selectedIndex, onSelect }) => {
  const selected = data[selectedIndex];

  return (
    <Listbox value={selectedIndex} onChange={onSelect}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-surface py-2 pl-3 pr-10 text-left shadow-md border border-text/10 focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-white/75 sm:text-sm">
          <span className="flex items-center">
            <CalendarDaysIcon className="h-5 w-5 text-text-muted" aria-hidden="true" />
            <span className="ml-2 block truncate text-text">{selected?.date}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-text-muted" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-surface py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {data.map((dataPoint, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-primary/20 text-primary' : 'text-text'
                  }`
                }
                value={index}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {dataPoint.date}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default DateSelector;