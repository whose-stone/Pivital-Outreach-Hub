import React, { createContext, useContext, useState, ReactNode } from "react";
import { eventsData as initialEvents, OutreachEvent, EventCategory } from "@/data/events";

interface EventContextType {
  events: OutreachEvent[];
  categories: string[];
  topics: string[];
  addEvent: (event: Omit<OutreachEvent, "id">) => void;
  updateEvent: (id: string, event: Partial<OutreachEvent>) => void;
  deleteEvent: (id: string) => void;
  addCategory: (category: string) => void;
  updateCategory: (oldCategory: string, newCategory: string) => void;
  deleteCategory: (category: string) => void;
  addTopic: (topic: string) => void;
  updateTopic: (oldTopic: string, newTopic: string) => void;
  deleteTopic: (topic: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<OutreachEvent[]>(initialEvents);
  
  // Extract initial categories and topics from data
  const [categories, setCategories] = useState<string[]>(
    Array.from(new Set([...initialEvents.map((e) => e.category), "Business", "Startup", "Retail", "Healthcare", "Education"]))
  );

  const [topics, setTopics] = useState<string[]>(
    Array.from(new Set([...initialEvents.map((e) => e.topic)]))
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
    setEvents((prev) => prev.map(e => e.category === oldCategory ? { ...e, category: newCategory as EventCategory } : e));
  };

  const deleteCategory = (category: string) => {
    setCategories((prev) => prev.filter(c => c !== category));
  };

  const addTopic = (topic: string) => {
    if (!topics.includes(topic)) {
      setTopics((prev) => [...prev, topic]);
    }
  };

  const updateTopic = (oldTopic: string, newTopic: string) => {
    setTopics((prev) => prev.map(t => t === oldTopic ? newTopic : t));
    setEvents((prev) => prev.map(e => e.topic === oldTopic ? { ...e, topic: newTopic } : e));
  };

  const deleteTopic = (topic: string) => {
    setTopics((prev) => prev.filter(t => t !== topic));
  };

  return (
    <EventContext.Provider value={{ 
      events, categories, topics, 
      addEvent, updateEvent, deleteEvent, 
      addCategory, updateCategory, deleteCategory,
      addTopic, updateTopic, deleteTopic
    }}>
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
