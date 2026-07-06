'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface SearchableMultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchableMultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  disabled = false,
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const filteredOptions = options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredValues = filteredOptions.map((opt) => opt.value);
    const newSelected = Array.from(new Set([...selected, ...filteredValues]));
    onChange(newSelected);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const filteredOptions = options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredValues = filteredOptions.map((opt) => opt.value);
    onChange(selected.filter((value) => !filteredValues.includes(value)));
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLabels = selected
    .map((val) => options.find((opt) => opt.value === val)?.label)
    .filter(Boolean) as string[];

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Area */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex min-h-9 w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-sm transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:bg-zinc-800 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50 bg-zinc-50 dark:bg-zinc-900',
          isOpen && 'border-primary ring-1 ring-primary'
        )}
      >
        <div className="flex flex-wrap gap-1 items-center max-w-[90%]">
          {selectedLabels.length === 0 ? (
            <span className="text-muted-foreground select-none">{placeholder}</span>
          ) : (
            selected.map((val) => {
              const label = options.find((opt) => opt.value === val)?.label || val;
              return (
                <Badge
                  key={val}
                  variant="secondary"
                  className="px-1.5 py-0.5 text-xs font-semibold flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
                >
                  {label}
                  <X
                    className="h-3 w-3 hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(selected.filter((item) => item !== val));
                    }}
                  />
                </Badge>
              );
            })
          )}
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 z-40 w-full rounded-xl border border-border bg-white p-2 shadow-xl dark:bg-zinc-950 animate-in fade-in duration-100 zoom-in-95">
          {/* Search box */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-xs focus-visible:ring-1 focus-visible:ring-primary dark:bg-zinc-900"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-between border-b border-zinc-100 pb-1.5 mb-1.5 px-1 text-[10px] text-zinc-500 font-semibold select-none dark:border-zinc-800">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-primary hover:underline cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-muted-foreground hover:underline cursor-pointer"
            >
              Clear Checked
            </button>
          </div>

          {/* Options list */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 select-none">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-xs text-center text-muted-foreground">No options found.</div>
            ) : (
              filteredOptions.map((option) => {
                const isChecked = selected.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleToggleOption(option.value)}
                    className={cn(
                      'flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900',
                      isChecked && 'bg-zinc-50/80 text-primary dark:bg-zinc-900/80 font-medium'
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isChecked && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
