import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Phone, Navigation, CheckCircle, Circle, PlayCircle } from "lucide-react";

export interface Task {
  id: number;
  name: string;
  customer: string;
  address: string;
  scheduled_time: string;
  duration: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "ready" | "in_progress" | "done" | "late";
  description?: string;
  customerPhone?: string;
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: number, status: Task["status"]) => void;
  onTaskSelect: (task: Task) => void;
}

const priorityColors = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-warning/20 text-warning",
  High: "bg-danger/20 text-danger",
  Urgent: "bg-danger text-danger-foreground"
};

const statusConfig = {
  ready: { color: "task-ready", icon: Circle, label: "Ready" },
  in_progress: { color: "task-progress", icon: PlayCircle, label: "In Progress" },
  done: { color: "task-done", icon: CheckCircle, label: "Done" },
  late: { color: "task-late", icon: Circle, label: "Late" }
};

export function TaskCard({ task, onStatusChange, onTaskSelect }: TaskCardProps) {
  const statusInfo = statusConfig[task.status];
  const StatusIcon = statusInfo.icon;

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getNextStatus = (currentStatus: Task["status"]): Task["status"] => {
    switch (currentStatus) {
      case "ready": return "in_progress";
      case "in_progress": return "done";
      case "done": return "ready";
      case "late": return "in_progress";
      default: return "ready";
    }
  };

  return (
    <Card 
      className="mb-3 cursor-pointer hover:shadow-md transition-all duration-200 border-l-4"
      style={{ borderLeftColor: `hsl(var(--${statusInfo.color}))` }}
      onClick={() => onTaskSelect(task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-base mb-1 line-clamp-2">{task.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{task.customer}</p>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Badge className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatTime(task.scheduled_time)} • {task.duration}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{task.address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 p-2 h-auto"
            style={{ color: `hsl(var(--${statusInfo.color}))` }}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, getNextStatus(task.status));
            }}
          >
            <StatusIcon className="w-4 h-4" />
            <span className="text-xs font-medium">{statusInfo.label}</span>
          </Button>

          <div className="flex gap-1">
            {task.customerPhone && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:${task.customerPhone}`);
                }}
              >
                <Phone className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-auto"
              onClick={(e) => {
                e.stopPropagation();
                const url = `https://maps.google.com/maps?q=${encodeURIComponent(task.address)}`;
                window.open(url, '_blank');
              }}
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}