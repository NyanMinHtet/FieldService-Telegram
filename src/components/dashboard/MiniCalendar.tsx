import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Task } from "./TaskCard";

interface MiniCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  tasks: Task[];
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export function MiniCalendar({ selectedDate, onDateSelect, tasks }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(parseDate(selectedDate));

  const today = new Date();
  const selected = parseDate(selectedDate);

  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());

  const days = [];
  const current = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const getTasksForDate = (date: Date) => {
    const dateString = formatDate(date);
    return tasks.filter(task => task.scheduled_time.startsWith(dateString));
  };

  const getTaskStatusIndicator = (dateTasks: Task[]) => {
    if (dateTasks.length === 0) return null;
    
    const hasCompleted = dateTasks.some(task => task.status === 'done');
    const hasInProgress = dateTasks.some(task => task.status === 'in_progress');
    const hasLate = dateTasks.some(task => task.status === 'late');
    
    if (hasLate) return 'bg-task-late';
    if (hasInProgress) return 'bg-task-progress';
    if (hasCompleted) return 'bg-task-done';
    return 'bg-task-ready';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendar
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="p-1 h-auto"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="p-1 h-auto"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isToday = day.toDateString() === today.toDateString();
            const isSelected = day.toDateString() === selected.toDateString();
            const dateTasks = getTasksForDate(day);
            const statusIndicator = getTaskStatusIndicator(dateTasks);
            
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={`
                  relative h-8 w-8 p-0 text-xs
                  ${!isCurrentMonth ? 'text-muted-foreground/50' : ''}
                  ${isToday ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
                  ${isSelected && !isToday ? 'bg-accent text-accent-foreground' : ''}
                `}
                onClick={() => onDateSelect(formatDate(day))}
              >
                {day.getDate()}
                {statusIndicator && (
                  <div className={`absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${statusIndicator}`} />
                )}
              </Button>
            );
          })}
        </div>
        
        <div className="mt-3 flex items-center justify-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-task-ready" />
            <span className="text-muted-foreground">Ready</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-task-progress" />
            <span className="text-muted-foreground">Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-task-done" />
            <span className="text-muted-foreground">Done</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}