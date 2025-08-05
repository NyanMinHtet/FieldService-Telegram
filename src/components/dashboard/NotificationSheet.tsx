import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const mockNotifications = [
  {
    id: 1,
    title: "New Task Assigned",
    description: "You have been assigned a new urgent task: 'Plumbing Emergency'.",
    time: "5m ago",
  },
  {
    id: 2,
    title: "Task Updated",
    description: "'AC Repair - Downtown Office' status changed to In Progress.",
    time: "1h ago",
  },
  {
    id: 3,
    title: "Reminder: Upcoming Task",
    description: "'Elevator Maintenance' is scheduled to start in 30 minutes.",
    time: "2h ago",
  },
];

export function NotificationSheet({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[350px] sm:w-[450px]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Here are your latest updates.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {mockNotifications.map((notification) => (
            <div key={notification.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
