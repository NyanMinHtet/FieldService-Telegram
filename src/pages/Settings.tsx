import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft, Settings as SettingsIcon, Bell, Shield, User, MapPin, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: {
      newTasks: true,
      scheduleChanges: true,
      urgentTasks: true,
      completionReminders: false,
    },
    preferences: {
      defaultMapApp: "google",
      autoCheckIn: false,
      showTaskNotes: true,
      darkMode: false,
    },
    profile: {
      phone: "+1 (555) 123-4567",
      email: "technician@example.com",
      emergencyContact: "+1 (555) 987-6543",
    }
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
    
    toast({
      title: "Settings Updated",
      description: `${key} ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleProfileChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value
      }
    }));
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-tasks" className="text-sm font-medium">
                New Task Assignments
              </Label>
              <Switch
                id="new-tasks"
                checked={settings.notifications.newTasks}
                onCheckedChange={(checked) => handleNotificationChange('newTasks', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="schedule-changes" className="text-sm font-medium">
                Schedule Changes
              </Label>
              <Switch
                id="schedule-changes"
                checked={settings.notifications.scheduleChanges}
                onCheckedChange={(checked) => handleNotificationChange('scheduleChanges', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="urgent-tasks" className="text-sm font-medium">
                Urgent Task Alerts
              </Label>
              <Switch
                id="urgent-tasks"
                checked={settings.notifications.urgentTasks}
                onCheckedChange={(checked) => handleNotificationChange('urgentTasks', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="completion-reminders" className="text-sm font-medium">
                Task Completion Reminders
              </Label>
              <Switch
                id="completion-reminders"
                checked={settings.notifications.completionReminders}
                onCheckedChange={(checked) => handleNotificationChange('completionReminders', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Dark Mode
              </Label>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="map-app" className="text-sm font-medium">
                Default Map Application
              </Label>
              <select
                id="map-app"
                value={settings.preferences.defaultMapApp}
                onChange={(e) => handlePreferenceChange('defaultMapApp', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="google">Google Maps</option>
                <option value="apple">Apple Maps</option>
                <option value="waze">Waze</option>
              </select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-checkin" className="text-sm font-medium">
                Auto Check-in at Location
              </Label>
              <Switch
                id="auto-checkin"
                checked={settings.preferences.autoCheckIn}
                onCheckedChange={(checked) => handlePreferenceChange('autoCheckIn', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-notes" className="text-sm font-medium">
                Show Task Notes in List
              </Label>
              <Switch
                id="show-notes"
                checked={settings.preferences.showTaskNotes}
                onCheckedChange={(checked) => handlePreferenceChange('showTaskNotes', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={settings.profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={settings.profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergency" className="text-sm font-medium">
                Emergency Contact
              </Label>
              <Input
                id="emergency"
                type="tel"
                value={settings.profile.emergencyContact}
                onChange={(e) => handleProfileChange('emergencyContact', e.target.value)}
              />
            </div>
            
            <Button onClick={handleSaveProfile} className="w-full" variant="telegram">
              Save Profile Changes
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast({ title: "Feature Coming Soon", description: "Location calibration will be available soon." })}
            >
              Calibrate GPS Location
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast({ title: "Cache Cleared", description: "Local cache has been cleared successfully." })}
            >
              Clear Local Cache
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast({ title: "Sync Complete", description: "Data synced with Odoo server." })}
            >
              Force Sync with Odoo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}