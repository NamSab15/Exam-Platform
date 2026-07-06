import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  Clock,
  FileEdit,
  Copy,
  Trash2,
  Link2,
  CheckSquare,
  CircleDot,
  Code2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Question, QuestionType, QuestionDifficulty } from '@/types/team2/question';

interface QuestionRowProps {
  question: Question;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: (id: string) => void;
  onDeleteClick: (q: Question) => void;
}

export function QuestionRow({
  question,
  isSelected,
  onSelect,
  onDuplicate,
  onDeleteClick,
}: QuestionRowProps) {
  const router = useRouter();
  const isRetired = question.status === 'Retired';

  const renderTypeCell = (type: QuestionType, difficulty: QuestionDifficulty) => {
    let TypeIcon = Code2;
    let typeName = 'PQ';

    if (type === 'MCQ') {
      TypeIcon = CircleDot;
      typeName = 'MCQ';
    } else if (type === 'MRQ') {
      TypeIcon = CheckSquare;
      typeName = 'MRQ';
    }

    return (
      <div className="flex flex-col items-start gap-1 select-none">
        <div className="flex items-center gap-1.5 font-heading text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <TypeIcon className="h-3.5 w-3.5 text-zinc-500" />
          <span>{typeName}</span>
        </div>
        <span
          className={cn(
            'text-[9px] font-extrabold uppercase tracking-wider',
            difficulty === 'Easy' && 'text-teal-600 dark:text-teal-400',
            difficulty === 'Medium' && 'text-amber-600 dark:text-amber-400',
            difficulty === 'Hard' && 'text-purple-600 dark:text-purple-400',
            difficulty === 'Expert' && 'text-rose-600 dark:text-rose-400'
          )}
        >
          {difficulty}
        </span>
      </div>
    );
  };

  return (
    <tr
      className={cn(
        'hover:bg-zinc-50/50 transition-colors group dark:hover:bg-zinc-900/20',
        isSelected && 'bg-secondary/20 dark:bg-zinc-800/30'
      )}
    >
      {/* Checkbox */}
      <td className="py-5 px-4 align-top">
        <input
          type="checkbox"
          aria-label={`Select ${question.title}`}
          checked={isSelected}
          onChange={onSelect}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-primary focus-visible:ring-2 focus-visible:ring-primary/50"
        />
      </td>

      {/* Question & Meta */}
      <td className="py-5 px-4 align-top space-y-2">
        <div className="flex items-start gap-2 flex-wrap">
          <Link
            href={`/question-editor?id=${question.id}`}
            className={cn(
              'font-heading font-semibold hover:underline text-sm md:text-base leading-snug',
              isRetired
                ? 'text-zinc-400 line-through dark:text-zinc-500'
                : 'text-primary dark:text-purple-400'
            )}
          >
            {question.title}
          </Link>
          <span className="text-[10px] font-bold text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded leading-none">
            {question.version}
          </span>
        </div>

        {/* Badges and tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {question.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-1.5 py-0">
              {tag}
            </Badge>
          ))}
          {question.refCount > 0 && (
            <Link
              href="#"
              className="flex items-center gap-1 text-[10px] font-semibold text-[#510047] hover:underline dark:text-purple-300 ml-1"
            >
              <Link2 className="h-3 w-3" />
              Ref: {question.refCount}
            </Link>
          )}
        </div>
      </td>

      {/* Type & Difficulty */}
      <td className="py-5 px-4 align-top">
        {renderTypeCell(question.type, question.difficulty)}
      </td>

      {/* Status */}
      <td className="py-5 px-4 align-top">
        <Badge
          variant={
            question.status === 'Published'
              ? 'published'
              : question.status === 'Draft'
              ? 'draft'
              : 'retired'
          }
          showDot
          className="py-0.5 px-2"
        >
          {question.status}
        </Badge>
      </td>

      {/* Actions */}
      <td className="py-5 px-4 align-top text-right">
        <div className="flex items-center justify-end gap-1.5">
          {isRetired ? (
            <>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => router.push(`/candidate-preview?id=${question.id}`)}
                title="Preview question as candidate"
                className="text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                title="Version History"
                className="text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => router.push(`/question-editor?id=${question.id}`)}
                title="Edit question config"
                className="text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <FileEdit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDuplicate(question.id)}
                title="Duplicate config"
                className="text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDeleteClick(question)}
            title="Delete question permanently"
            className="text-zinc-400 hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
