"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { registerServiceWorker, requestNotificationPermission, subscribeUserToPush } from "@/lib/notifications"

export default function NotificationSetup() {
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    // Check if notifications are already set up
    const notificationsSetup = localStorage.getItem('notificationsSetup');
    
    if (!notificationsSetup) {
      // Wait a bit before showing the prompt
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleEnableNotifications = async () => {
    try {
      // Register service worker
      await registerServiceWorker();
      
      // Request permission
      const permissionGranted = await requestNotificationPermission();
      
      if (permissionGranted) {
        // Subscribe to push notifications
        const subscription = await subscribeUserToPush();
        
        if (subscription) {
          // In a real app, you would send this subscription to your server
          console.log('User subscribed to push notifications:', subscription);
          
          // Mark as set up
          localStorage.setItem('notificationsSetup', 'true');
        }
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
    } finally {
      setShowPrompt(false);
    }
  };
  
  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enable Notifications</DialogTitle>
          <DialogDescription>
            Get timely reminders about your smoking schedule, breathing exercises, and progress updates.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Cigarette Timer Notifications</h3>
              <p className="text-sm text-gray-500">Get notified when you can smoke or when to skip for more XP.</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M8.56 2.9A7 7 0 0 1 19 9v4" />
                  <path d="M19 12v1a3 3 0 0 1-3 3h-1" />
                  <path d="M3 13a7 7 0 0 1 7-7" />
                  <circle cx="12" cy="17" r="3" />
                  <line x1="12" y1="17" x2="12" y2="17.01" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Breathing Exercise Reminders</h3>
                <p className="text-sm text-gray-500">Daily reminders to complete your breathing exercises.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.setItem('notificationsSetup', 'false');
              setShowPrompt(false);
            }}
            className="flex-1"
          >
            Not Now
          </Button>
          <Button 
            onClick={handleEnableNotifications}
            className="flex-1"
          >
            Enable
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

