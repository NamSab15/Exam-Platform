'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Edit2, Check, X, FileText, CheckCircle2, Award, ListCollapse } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ExamSection {
  id: string;
  name: string;
  questionType: string;
  numQuestions: number;
  marks: number;
}

interface SectionsManagerProps {
  sections: ExamSection[];
  onChange: (sections: ExamSection[]) => void;
}

const QUESTION_TYPES = ['MCQ', 'MRQ', 'Programming', 'Mixed'];

export function SectionsManager({ sections, onChange }: SectionsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for adding/editing
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('MCQ');
  const [formNumQuestions, setFormNumQuestions] = useState(5);
  const [formMarks, setFormMarks] = useState(10);

  const handleStartAdd = () => {
    setFormName(`Section ${String.fromCharCode(65 + sections.length)}`); // e.g. Section A, Section B
    setFormType('MCQ');
    setFormNumQuestions(5);
    setFormMarks(10);
    setEditingId(null);
    setIsAdding(true);
  };

  const handleStartEdit = (section: ExamSection) => {
    setFormName(section.name);
    setFormType(section.questionType);
    setFormNumQuestions(section.numQuestions);
    setFormMarks(section.marks);
    setIsAdding(false);
    setEditingId(section.id);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formName.trim()) return;

    if (isAdding) {
      const newSection: ExamSection = {
        id: `sec_${Date.now()}`,
        name: formName,
        questionType: formType,
        numQuestions: formNumQuestions,
        marks: formMarks,
      };
      onChange([...sections, newSection]);
      setIsAdding(false);
    } else if (editingId) {
      onChange(
        sections.map((sec) =>
          sec.id === editingId
            ? {
                ...sec,
                name: formName,
                questionType: formType,
                numQuestions: formNumQuestions,
                marks: formMarks,
              }
            : sec
        )
      );
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    onChange(sections.filter((sec) => sec.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  return (
    <Card className="border border-border bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-heading">
              4. Exam Sections
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set up structures, question category allocations, and marks weight distribution.
            </p>
          </div>
          {!isAdding && !editingId && (
            <Button
              type="button"
              onClick={handleStartAdd}
              size="sm"
              className="gap-1 bg-primary text-white hover:bg-primary/95 text-xs h-8 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Section
            </Button>
          )}
        </div>

        {/* Section editing / adding form */}
        {(isAdding || editingId) && (
          <div className="p-4 rounded-xl border-2 border-primary/20 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4 animate-in fade-in duration-200 select-none">
            <h3 className="text-xs font-bold text-primary tracking-wider uppercase">
              {isAdding ? 'Create New Section' : 'Edit Section Details'}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Section Name */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                  Section Name
                </span>
                <Input
                  type="text"
                  placeholder="e.g. MCQ Technical"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="text-xs h-8.5 bg-white dark:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>

              {/* Question Type */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                  Question Type
                </span>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="form-select h-8.5 text-xs bg-white dark:bg-zinc-900"
                >
                  {QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type} Questions
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of questions */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                  Number of Questions
                </span>
                <Input
                  type="number"
                  min={1}
                  value={formNumQuestions}
                  onChange={(e) => setFormNumQuestions(parseInt(e.target.value) || 0)}
                  className="text-xs h-8.5 bg-white dark:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>

              {/* Marks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                  Section Marks Allocation
                </span>
                <Input
                  type="number"
                  min={0}
                  value={formMarks}
                  onChange={(e) => setFormMarks(parseInt(e.target.value) || 0)}
                  className="text-xs h-8.5 bg-white dark:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="text-xs h-8 px-3 cursor-pointer"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                className="bg-primary text-white hover:bg-primary/95 text-xs h-8 px-3 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Save Section
              </Button>
            </div>
          </div>
        )}

        {/* Sections List */}
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800 select-none">
            <ListCollapse className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2" />
            <p className="text-xs font-semibold text-zinc-500">No sections added yet.</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Add at least one section to structuralize the exam scoring.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className={cn(
                  'flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-zinc-150 bg-white shadow-sm dark:bg-zinc-900/40 dark:border-zinc-800/80 transition-all select-none hover:border-zinc-300 dark:hover:border-zinc-750',
                  editingId === section.id && 'border-primary dark:border-primary'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-purple-50 text-primary flex items-center justify-center dark:bg-purple-950/20 shrink-0 mt-0.5">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                      {section.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded dark:bg-zinc-800 dark:text-zinc-400">
                        {section.questionType} Questions
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                        {section.numQuestions} Qs
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-0.5">
                        <Award className="h-3 w-3" />
                        {section.marks} Marks
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 mt-3 sm:mt-0 pt-2.5 sm:pt-0 border-t border-zinc-50 sm:border-0 dark:border-zinc-900">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(section)}
                    className="p-1.5 rounded-lg border border-border text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition-colors dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
                    title="Edit section"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(section.id)}
                    className="p-1.5 rounded-lg border border-border text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                    title="Delete section"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
