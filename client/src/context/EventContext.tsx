import React, { createContext, useContext, useState, ReactNode } from "react";
import { eventsData as initialEvents, OutreachEvent, EventCategory } from "@/data/events";

interface EventContextType {
  events: OutreachEvent[];
  categories: string[];
  addEvent: (event: Omit<OutreachEvent, "id">) => void;
  updateEvent: (id: string, event: Partial<OutreachEvent>) => void;
  deleteEvent: (id: string) => void;
  addCategory: (category: string) => void;
  updateCategory: (oldCategory: string, newCategory: string) => void;
  deleteCategory: (category: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<OutreachEvent[]>(initialEvents);
  
  // Extract initial categories from data and add standard ones
  const [categories, setCategories] = useState<string[]>(
    Array.from(new Set([...initialEvents.map((e) => e.category), "Business", "Startup", "Retail", "Healthcare", "Education"]))
  );

  const addEvent = (newEvent: Omit<OutreachEvent, "id">) => {
    const event: OutreachEvent = {
      ...newEvent,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      category: newEvent.category as EventCategory,
    };
    setEvents((prev) => [...prev, event]);
  };

  const updateEvent = (id: string, updatedFields: Partial<OutreachEvent>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updatedFields } : event))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
    }
  };

  const updateCategory = (oldCategory: string, newCategory: string) => {
    setCategories((prev) => prev.map(c => c === oldCategory ? newCategory : c));
    // Also update any events that used this category
    setEvents((prev) => prev.map(e => e.category === oldCategory ? { ...e, category: newCategory as EventCategory } : e));
  };

  const deleteCategory = (category: string) => {
    setCategories((prev) => prev.filter(c => c !== category));
  };

  return (
    <EventContext.Provider value={{ events, categories, addEvent, updateEvent, deleteEvent, addCategory, updateCategory, deleteCategory }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
}
