"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Notification, NotificationContextType } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Load from local storage once
  useEffect(() => {
    const saved = localStorage.getItem("chokho_notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse notifications", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage only AFTER initialized
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("chokho_notifications", JSON.stringify(notifications));
    }
  }, [notifications, isInitialized]);

  const addNotification = useCallback((notif: Omit<Notification, "id" | "timestamp" | "read">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotif: Notification = {
      ...notif,
      id,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev].slice(0, 50)); // Keep last 50

    // Trigger toast
    toast({
      title: notif.title,
      description: notif.description,
      variant: notif.type === "error" ? "destructive" : "default",
    });

    return id;
  }, [toast]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, clearAll, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
