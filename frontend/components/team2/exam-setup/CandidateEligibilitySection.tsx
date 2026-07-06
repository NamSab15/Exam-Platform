'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { SearchableMultiSelect, MultiSelectOption } from './SearchableMultiSelect';

export interface EligibilityData {
  everyone: boolean;
  batches: string[];
  courses: string[];
  semesters: string[];
  students: string[];
}

interface CandidateEligibilitySectionProps {
  data: EligibilityData;
  onChange: (field: keyof EligibilityData, value: boolean | string[]) => void;
}

const BATCH_OPTIONS: MultiSelectOption[] = [
  { value: 'batch_2023', label: 'Batch of 2023' },
  { value: 'batch_2024', label: 'Batch of 2024' },
  { value: 'batch_2025', label: 'Batch of 2025' },
  { value: 'batch_2026', label: 'Batch of 2026' },
];

const COURSE_OPTIONS: MultiSelectOption[] = [
  { value: 'course_cse', label: 'B.Tech Computer Science' },
  { value: 'course_it', label: 'B.Tech Information Technology' },
  { value: 'course_mcse', label: 'M.Tech Computer Science' },
  { value: 'course_mca', label: 'MCA (Master of Computer Apps)' },
  { value: 'course_mba', label: 'MBA (Master of Business Admin)' },
];

const SEMESTER_OPTIONS: MultiSelectOption[] = Array.from({ length: 8 }).map((_, idx) => ({
  value: `sem_${idx + 1}`,
  label: `Semester ${idx + 1}`,
}));

const STUDENT_OPTIONS: MultiSelectOption[] = [
  { value: 'student_1', label: 'alice.miller@xebia.com' },
  { value: 'student_2', label: 'bob.jackson@xebia.com' },
  { value: 'student_3', label: 'charlie.davis@xebia.com' },
  { value: 'student_4', label: 'david.smith@xebia.com' },
  { value: 'student_5', label: 'emma.watson@xebia.com' },
  { value: 'student_6', label: 'frank.wright@xebia.com' },
  { value: 'student_7', label: 'grace.hopper@xebia.com' },
  { value: 'student_8', label: 'harold.finch@xebia.com' },
];

export function CandidateEligibilitySection({ data, onChange }: CandidateEligibilitySectionProps) {
  const handleToggleEveryone = (checked: boolean) => {
    onChange('everyone', checked);
    if (checked) {
      // Clear specific eligibility parameters when open to everyone
      onChange('batches', []);
      onChange('courses', []);
      onChange('semesters', []);
      onChange('students', []);
    }
  };

  return (
    <Card className="border border-border bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
      <CardContent className="p-6 space-y-6">
        <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-heading">
            5. Candidate Eligibility
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Identify the target cohort or permit general access to the examination.
          </p>
        </div>

        <div className="space-y-5">
          {/* Open to Everyone Switch */}
          <div className="flex items-center justify-between text-xs py-3.5 px-4 border border-border rounded-xl bg-zinc-50 dark:bg-zinc-900/50 select-none">
            <div className="flex flex-col">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">Open to Everyone</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                Disable restrictive criteria and make this exam accessible to all active candidates.
              </span>
            </div>
            <Switch
              id="eligibility-everyone"
              checked={data.everyone}
              onCheckedChange={handleToggleEveryone}
            />
          </div>

          {!data.everyone && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in fade-in duration-200">
              {/* Batch Select */}
              <div className="flex flex-col gap-1.5">
                <label className="section-label">Target Batch(es)</label>
                <SearchableMultiSelect
                  options={BATCH_OPTIONS}
                  selected={data.batches}
                  onChange={(selected) => onChange('batches', selected)}
                  placeholder="Select batch cohorts..."
                />
              </div>

              {/* Course Select */}
              <div className="flex flex-col gap-1.5">
                <label className="section-label">Target Course(s)</label>
                <SearchableMultiSelect
                  options={COURSE_OPTIONS}
                  selected={data.courses}
                  onChange={(selected) => onChange('courses', selected)}
                  placeholder="Select course branches..."
                />
              </div>

              {/* Semester Select */}
              <div className="flex flex-col gap-1.5">
                <label className="section-label">Target Semester(s)</label>
                <SearchableMultiSelect
                  options={SEMESTER_OPTIONS}
                  selected={data.semesters}
                  onChange={(selected) => onChange('semesters', selected)}
                  placeholder="Select academic semesters..."
                />
              </div>

              {/* Specific Students Select */}
              <div className="flex flex-col gap-1.5">
                <label className="section-label">Specific Student(s)</label>
                <SearchableMultiSelect
                  options={STUDENT_OPTIONS}
                  selected={data.students}
                  onChange={(selected) => onChange('students', selected)}
                  placeholder="Select individual emails..."
                />
              </div>
            </div>
          )}

          {data.everyone && (
            <div className="text-center p-6 border rounded-xl border-zinc-150 bg-zinc-50/30 text-xs text-muted-foreground select-none dark:border-zinc-800/80">
              🌍 No constraints configured. All students are eligible to join this exam session.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
