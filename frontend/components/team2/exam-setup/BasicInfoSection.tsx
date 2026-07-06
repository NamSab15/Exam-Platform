'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface BasicInfoData {
  name: string;
  description: string;
  subject: string;
  course: string;
  semester: string;
  type: string;
  difficulty: string;
}

interface BasicInfoSectionProps {
  data: BasicInfoData;
  onChange: (field: keyof BasicInfoData, value: string) => void;
}

const SUBJECTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Comm.',
  'Mechanical Engineering',
  'Mathematics',
  'Data Science',
];

const COURSES = [
  'B.Tech Computer Science',
  'B.Tech Information Technology',
  'M.Tech Computer Science',
  'MCA (Master of Computer Apps)',
  'MBA (Master of Business Admin)',
];

const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

const EXAM_TYPES = [
  'Midterm Assessment',
  'End Semester Exam',
  'Weekly Quiz',
  'Practice Assessment',
  'Placement Diagnostic',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];

export function BasicInfoSection({ data, onChange }: BasicInfoSectionProps) {
  return (
    <Card className="border border-border bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
      <CardContent className="p-6 space-y-6">
        <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-heading">
            1. Basic Exam Information
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure primary descriptor keys, academic contexts, and targets.
          </p>
        </div>

        <div className="space-y-4">
          {/* Exam Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="exam-name" className="section-label">
              Exam Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="exam-name"
              type="text"
              placeholder="e.g. Data Structures & Algorithms End Sem"
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="text-sm dark:bg-zinc-900"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="exam-description" className="section-label">
              Description
            </label>
            <textarea
              id="exam-description"
              placeholder="Provide clear instructions, policies, and guidelines for the students taking this examination..."
              value={data.description}
              onChange={(e) => onChange('description', e.target.value)}
              className="form-textarea min-h-[90px] text-sm resize-none dark:bg-zinc-900"
            />
          </div>

          {/* Two column grid for Subject/Course and Semester/Type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exam-subject" className="section-label">
                Subject
              </label>
              <select
                id="exam-subject"
                value={data.subject}
                onChange={(e) => onChange('subject', e.target.value)}
                className="form-select"
              >
                <option value="">Select Subject</option>
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exam-course" className="section-label">
                Course
              </label>
              <select
                id="exam-course"
                value={data.course}
                onChange={(e) => onChange('course', e.target.value)}
                className="form-select"
              >
                <option value="">Select Course</option>
                {COURSES.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exam-semester" className="section-label">
                Semester
              </label>
              <select
                id="exam-semester"
                value={data.semester}
                onChange={(e) => onChange('semester', e.target.value)}
                className="form-select"
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Type */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exam-type" className="section-label">
                Exam Type
              </label>
              <select
                id="exam-type"
                value={data.type}
                onChange={(e) => onChange('type', e.target.value)}
                className="form-select"
              >
                <option value="">Select Exam Type</option>
                {EXAM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulty pills */}
          <div className="space-y-2 select-none pt-1">
            <span className="section-label block">Target Difficulty Level</span>
            <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="Exam difficulty level">
              {DIFFICULTIES.map((diff) => {
                const isSelected = data.difficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onChange('difficulty', diff)}
                    className={cn(
                      'h-8.5 rounded-lg border px-1 text-center text-[10px] font-bold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer',
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-white text-muted-foreground hover:bg-zinc-50 dark:bg-zinc-800'
                    )}
                  >
                    {diff === 'Medium' ? 'Med' : diff === 'Expert' ? 'Exp' : diff}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
