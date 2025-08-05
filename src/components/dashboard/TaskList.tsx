import { TaskCard, Task } from "./TaskCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  title: string;
  date: string;
  onStatusChange: (taskId: number, status: Task["status"]) => void;
  onTaskSelect: (task: Task) => void;
  isToday?: boolean;
}

export function TaskList({ tasks, title, date, onStatusChange, onTaskSelect, isToday = false }: TaskListProps) {
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <CalendarDays className="w-4 h-4" />
            <span>{formatDate(date)}</span>
          </div>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="mb-1">
            {completedTasks}/{totalTasks} Done
          </Badge>
          {isToday && totalTasks > 0 && (
            <div className="text-xs text-muted-foreground">
              {Math.round((completedTasks / totalTasks) * 100)}% Complete
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onTaskSelect={onTaskSelect}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No tasks scheduled</h3>
              <p className="text-sm text-muted-foreground">
                {isToday ? "You're all caught up for today!" : "No tasks for this date."}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}