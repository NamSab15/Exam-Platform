'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export interface TimingData {
  duration: number; // in minutes
  startDate: string; // ISO or local datestring
  endDate: string;
  timeZone: string;
}

interface TimingSectionProps {
  data: TimingData;
  onChange: (field: keyof TimingData, value: string | number) => void;
}

const TIMEZONES = [
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
  { value: 'EST', label: 'Eastern Standard Time (EST - GMT-5)' },
  { value: 'CET', label: 'Central European Time (CET - GMT+1)' },
  { value: 'IST', label: 'Indian Standard Time (IST - GMT+5:30)' },
  { value: 'SGT', label: 'Singapore Standard Time (SGT - GMT+8)' },
  { value: 'JST', label: 'Japan Standard Time (JST - GMT+9)' },
];

export function TimingSection({ data, onChange }: TimingSectionProps) {
  return (
    <Card className="border border-border bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
      <CardContent className="p-6 space-y-6">
        <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-heading">
            2. Timing Windows
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure examination periods, durations, and geographical zones.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Duration */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exam-duration" className="section-label">
                Duration (Minutes) <span className="text-destructive">*</span>
              </label>
              <Input
                id="exam-duration"
                type="number"
                min={1}
                placeholder="e.g. 120"
                value={data.duration || ''}
                onChange={(e) => onChange('duration', parseInt(e.target.value) || 0)}
                className="text-sm dark:bg-zinc-900"
                required
              />
            </div>

            {/* Time Zone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exam-timezone" className="section-label">
                Time Zone
              </label>
              <select
                id="exam-timezone"
                value={data.timeZone}
                onChange={(e) => onChange('timeZone', e.target.value)}
                className="form-select"
              >
                <option value="">Select Time Zone</option>
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exam-start-date" className="section-label">
                Start Date & Time
              </label>
              <Input
                id="exam-start-date"
                type="datetime-local"
                value={data.startDate}
                onChange={(e) => onChange('startDate', e.target.value)}
                className="text-sm dark:bg-zinc-900"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exam-end-date" className="section-label">
                End Date & Time
              </label>
              <Input
                id="exam-end-date"
                type="datetime-local"
                value={data.endDate}
                onChange={(e) => onChange('endDate', e.target.value)}
                className="text-sm dark:bg-zinc-900"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
