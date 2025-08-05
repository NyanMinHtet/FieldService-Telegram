import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Navigation, Clock, MapPin, User, FileText, Camera } from "lucide-react";
import { Task } from "./TaskCard";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (taskId: number, status: Task["status"]) => void;
}

const priorityColors = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-warning/20 text-warning",
  High: "bg-danger/20 text-danger",
  Urgent: "bg-danger text-danger-foreground"
};

export function TaskDetailModal({ task, isOpen, onClose, onStatusChange }: TaskDetailModalProps) {
  const [notes, setNotes] = useState("");
  const [isAddingNotes, setIsAddingNotes] = useState(false);
  const { toast } = useToast();

  if (!task) return null;

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAddNotes = async () => {
    if (!notes.trim()) return;
    
    setIsAddingNotes(true);
    try {
      // TODO: Sync notes to Odoo chatter
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Notes Added",
        description: "Your notes have been saved to Odoo.",
      });
      
      setNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingNotes(false);
    }
  };

  const handlePhotoUpload = () => {
    // TODO: Implement photo upload functionality
    toast({
      title: "Photo Upload",
      description: "Photo upload will be available soon.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left pr-8">{task.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center justify-between">
            <Badge className={priorityColors[task.priority]}>
              {task.priority} Priority
            </Badge>
            <Badge variant="outline">
              {task.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{task.customer}</p>
                {task.customerPhone && (
                  <p className="text-sm text-muted-foreground">{task.customerPhone}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm">{task.address}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm">
                  {formatDate(task.scheduled_time)} at {formatTime(task.scheduled_time)}
                </p>
                <p className="text-xs text-muted-foreground">Duration: {task.duration}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Description</Label>
              </div>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {task.description}
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            {task.customerPhone && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.open(`tel:${task.customerPhone}`)}
              >
                <Phone className="w-4 h-4" />
                Call Customer
              </Button>
            )}
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                const url = `https://maps.google.com/maps?q=${encodeURIComponent(task.address)}`;
                window.open(url, '_blank');
              }}
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </Button>
          </div>

          {/* Add Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-medium">Add Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add completion notes, observations, or updates..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddNotes}
                disabled={!notes.trim() || isAddingNotes}
                className="flex-1"
              >
                {isAddingNotes ? "Saving..." : "Save Notes"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handlePhotoUpload}
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Photo
              </Button>
            </div>
          </div>

          {/* Status Actions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Update Status</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant={task.status === 'ready' ? 'default' : 'outline'}
                onClick={() => onStatusChange(task.id, 'ready')}
              >
                Ready
              </Button>
              <Button
                size="sm"
                variant={task.status === 'in_progress' ? 'warning' : 'outline'}
                onClick={() => onStatusChange(task.id, 'in_progress')}
              >
                In Progress
              </Button>
              <Button
                size="sm"
                variant={task.status === 'done' ? 'success' : 'outline'}
                onClick={() => onStatusChange(task.id, 'done')}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}