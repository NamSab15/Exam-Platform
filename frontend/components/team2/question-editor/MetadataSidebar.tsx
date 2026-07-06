import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Question, CognitiveLevel, QuestionDifficulty } from '@/types/team2/question';

interface MetadataSidebarProps {
  question: Question;
  newTopicTag: string;
  setNewTopicTag: (val: string) => void;
  newSkillTag: string;
  setNewSkillTag: (val: string) => void;
  onUpdateField: <K extends keyof Question>(field: K, value: Question[K]) => void;
  onAddTopicTag: () => void;
  onRemoveTopicTag: (tag: string) => void;
  onAddSkillTag: () => void;
  onRemoveSkillTag: (skill: string) => void;
}

export function MetadataSidebar({
  question,
  newTopicTag,
  setNewTopicTag,
  newSkillTag,
  setNewSkillTag,
  onUpdateField,
  onAddTopicTag,
  onRemoveTopicTag,
  onAddSkillTag,
  onRemoveSkillTag,
}: MetadataSidebarProps) {
  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cognitive-level" className="section-label">Cognitive Level (Bloom&apos;s)</label>
          <select
            id="cognitive-level"
            value={question.cognitiveLevel}
            onChange={(e) => onUpdateField('cognitiveLevel', e.target.value as CognitiveLevel)}
            className="form-select"
          >
            <option value="Remembering">Remembering</option>
            <option value="Understanding">Understanding</option>
            <option value="Applying">Applying</option>
            <option value="Analyzing">Analyzing</option>
            <option value="Evaluating">Evaluating</option>
            <option value="Creating">Creating</option>
          </select>
        </div>

        {/* Evaluation Rules */}
        <div className="space-y-4">
          <span className="section-label block border-b border-zinc-100 pb-1.5 dark:border-zinc-800/60">
            Evaluation Rules
          </span>

          <div className="grid grid-cols-2 gap-4">
            {/* Base Points */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                Base Points
              </span>
              <Input
                type="number"
                value={question.basePoints}
                onChange={(e) => onUpdateField('basePoints', parseInt(e.target.value) || 0)}
                className="text-sm dark:bg-zinc-900"
              />
            </div>

            {/* Negative Marking */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none">
                Negative Marking (%)
              </span>
              <Input
                type="number"
                value={question.negativeMarking}
                onChange={(e) => onUpdateField('negativeMarking', parseInt(e.target.value) || 0)}
                className="text-sm dark:bg-zinc-900"
              />
            </div>
          </div>

          {/* Partial Marking Toggle */}
          <div className="flex items-center justify-between text-xs py-1 select-none">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Partial Marking</span>
            <Switch
              checked={question.partialMarking}
              onCheckedChange={(checked) => onUpdateField('partialMarking', checked)}
            />
          </div>
        </div>

        {/* Difficulty selector */}
        <div className="space-y-2 select-none">
          <span className="section-label block">Difficulty Level</span>
          <div className="grid grid-cols-4 gap-1" role="group" aria-label="Difficulty level">
            {['Easy', 'Medium', 'Hard', 'Expert'].map((diff) => {
              const isSelected = question.difficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onUpdateField('difficulty', diff as QuestionDifficulty)}
                  className={cn(
                    'h-8 rounded-lg border px-1 text-center text-[10px] font-bold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
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

        {/* Topic tags list */}
        <div className="space-y-2">
          <span className="section-label block">Topic Tags</span>

          <div className="flex flex-wrap items-center gap-1.5">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-xs font-semibold gap-1">
                {tag}
                <X
                  onClick={() => onRemoveTopicTag(tag)}
                  className="h-3 w-3 text-zinc-400 hover:text-foreground cursor-pointer shrink-0"
                />
              </Badge>
            ))}
          </div>

          {/* Add Tag row */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <Input
              value={newTopicTag}
              onChange={(e) => setNewTopicTag(e.target.value)}
              placeholder="Add topic..."
              className="h-8 text-xs dark:bg-zinc-900"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAddTopicTag();
                }
              }}
            />
            <Button variant="outline" onClick={onAddTopicTag} className="h-8 text-xs px-2 shadow-none">
              + Add
            </Button>
          </div>
        </div>

        {/* Skill tags list */}
        <div className="space-y-2">
          <span className="section-label block">Skill Tags</span>

          <div className="flex flex-wrap items-center gap-1.5">
            {(question.skills || []).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="px-2 py-0.5 text-xs font-semibold gap-1 bg-purple-50/5 text-purple-700 border-purple-200 dark:text-purple-400 dark:border-purple-800"
              >
                {skill}
                <X
                  onClick={() => onRemoveSkillTag(skill)}
                  className="h-3 w-3 text-zinc-400 hover:text-foreground cursor-pointer shrink-0"
                />
              </Badge>
            ))}
          </div>

          {/* Add Skill row */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <Input
              value={newSkillTag}
              onChange={(e) => setNewSkillTag(e.target.value)}
              placeholder="Add skill..."
              className="h-8 text-xs dark:bg-zinc-900"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAddSkillTag();
                }
              }}
            />
            <Button variant="outline" onClick={onAddSkillTag} className="h-8 text-xs px-2 shadow-none">
              + Add
            </Button>
          </div>
        </div>

        {/* Default Grading Mode */}
        <div className="flex flex-col gap-1.5 border-t border-zinc-100 pt-4 dark:border-zinc-800/60">
          <label htmlFor="grading-mode" className="section-label">Default Grading Mode</label>
          <select
            id="grading-mode"
            value={question.defaultGradingMode}
            onChange={(e) => onUpdateField('defaultGradingMode', e.target.value)}
            className="form-select"
          >
            <option value="Exact String Match">Exact String Match</option>
            <option value="Option Matching">Option Matching</option>
            <option value="Token Matching">Token Matching</option>
            <option value="Custom Validator Script">Custom Validator Script</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
