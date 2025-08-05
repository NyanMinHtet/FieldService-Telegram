import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "./TaskList";
import { MiniCalendar } from "./MiniCalendar";
import { TaskDetailModal } from "./TaskDetailModal";
import { NotificationSheet } from "./NotificationSheet";
import { Task } from "./TaskCard";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Calendar, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data - TODO: Replace with API integration
const mockTasks: Task[] = [
  {
    id: 1024,
    name: "AC Repair - Downtown Office",
    customer: "TechCorp Solutions",
    address: "123 Business District, Suite 500, Downtown",
    scheduled_time: "2024-08-05T14:30:00",
    duration: "2h",
    priority: "High",
    status: "ready",
    description: "Air conditioning unit not cooling properly. Customer reports warm air from all vents. Check refrigerant levels, filters, and compressor.",
    customerPhone: "+1-555-0123"
  },
  {
    id: 1025,
    name: "Elevator Maintenance",
    customer: "Grand Plaza Hotel",
    address: "456 Hotel Boulevard, Grand Plaza",
    scheduled_time: "2024-08-05T09:00:00",
    duration: "3h",
    priority: "Medium",
    status: "in_progress",
    description: "Routine quarterly maintenance on main elevator. Inspect cables, check emergency systems, and lubricate moving parts.",
    customerPhone: "+1-555-0124"
  },
  {
    id: 1026,
    name: "Plumbing Emergency",
    customer: "Riverside Apartments",
    address: "789 River Street, Building A",
    scheduled_time: "2024-08-05T16:00:00",
    duration: "1.5h",
    priority: "Urgent",
    status: "late",
    description: "Water leak in basement affecting multiple units. Shut off water to building if necessary.",
    customerPhone: "+1-555-0125"
  },
  {
    id: 1027,
    name: "Security System Install",
    customer: "Metro Bank Branch",
    address: "321 Financial Drive, Metro Center",
    scheduled_time: "2024-08-06T10:00:00",
    duration: "4h",
    priority: "High",
    status: "ready",
    description: "Install new security cameras and access control system. Coordinate with bank security team.",
    customerPhone: "+1-555-0126"
  }
];

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNotificationSheetOpen, setIsNotificationSheetOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const todayTasks = tasks.filter(task => task.scheduled_time.startsWith(today));
  const tomorrowTasks = tasks.filter(task => task.scheduled_time.startsWith(tomorrow));
  const selectedDateTasks = tasks.filter(task => task.scheduled_time.startsWith(selectedDate));

  const handleStatusChange = (taskId: number, newStatus: Task["status"]) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: "Task Updated",
        description: `"${task.name}" status changed to ${newStatus.replace('_', ' ')}`,
      });
    }

    // TODO: Sync with Odoo API
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  useEffect(() => {
    // TODO: Set up real-time notifications and task sync
    // For now, simulate receiving a notification
    const timer = setTimeout(() => {
      // toast({
      //   title: "New Task Assigned",
      //   description: "You have been assigned a new urgent task.",
      // });
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Field Service</h1>
              <p className="text-white/80 text-sm">Odoo Task Manager</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => setIsNotificationSheetOpen(true)}>
              <Bell className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Mini Calendar */}
        <MiniCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          tasks={tasks}
        />

        {/* Task Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today" className="text-xs">
              Today ({todayTasks.length})
            </TabsTrigger>
            <TabsTrigger value="tomorrow" className="text-xs">
              Tomorrow ({tomorrowTasks.length})
            </TabsTrigger>
            <TabsTrigger value="selected" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              Selected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-4">
            <div className="h-[calc(100vh-360px)]">
              <TaskList
                tasks={todayTasks}
                title="Today's Tasks"
                date={today}
                onStatusChange={handleStatusChange}
                onTaskSelect={handleTaskSelect}
                isToday={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="tomorrow" className="mt-4">
            <div className="h-[calc(100vh-360px)]">
              <TaskList
                tasks={tomorrowTasks}
                title="Tomorrow's Tasks"
                date={tomorrow}
                onStatusChange={handleStatusChange}
                onTaskSelect={handleTaskSelect}
              />
            </div>
          </TabsContent>

          <TabsContent value="selected" className="mt-4">
            <div className="h-[calc(100vh-360px)]">
              <TaskList
                tasks={selectedDateTasks}
                title="Selected Date Tasks"
                date={selectedDate}
                onStatusChange={handleStatusChange}
                onTaskSelect={handleTaskSelect}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={handleStatusChange}
      />

      {/* Notification Sheet */}
      <NotificationSheet 
        isOpen={isNotificationSheetOpen} 
        onClose={() => setIsNotificationSheetOpen(false)} 
      />
    </div>
  );
}