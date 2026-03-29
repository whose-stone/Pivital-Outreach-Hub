import React, { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Types ───────────────────────────────────────────────────────────────────

export type EventFormat = "in-person" | "webinar";

export interface OutreachEvent {
  id: string;
  organization: string;
  topic: string;
  date: string;
  time: string;
  format: EventFormat;
  venue: string;
  category: string;
  summary: string;
  callToAction: string;
  executionNotes: string;
  createdAt?: string;
}

export interface Audience {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  mission?: string | null;
  clientType?: string | null;
  createdAt?: string;
}

export interface Topic {
  id: string;
  name: string;
  createdAt?: string;
}

// ─── API helpers ─────────────────────────────────────────────────────────────

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface EventContextType {
  events: OutreachEvent[];
  eventsLoading: boolean;
  categories: string[];
  audiences: Audience[];
  audiencesLoading: boolean;
  topics: Topic[];
  topicsLoading: boolean;

  addEvent: (event: Omit<OutreachEvent, "id" | "createdAt">) => Promise<void>;
  updateEvent: (id: string, event: Partial<Omit<OutreachEvent, "id" | "createdAt">>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  addAudience: (data: Omit<Audience, "id" | "createdAt">) => Promise<void>;
  updateAudience: (id: string, data: Partial<Omit<Audience, "id" | "createdAt">>) => Promise<void>;
  deleteAudience: (id: string) => Promise<void>;

  addTopic: (name: string) => Promise<void>;
  updateTopic: (id: string, name: string) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;

  // legacy compatibility helpers (by name)
  addCategory: (name: string) => Promise<void>;
  updateCategory: (oldName: string, newName: string) => Promise<void>;
  deleteCategory: (name: string) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function EventProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();

  const { data: eventsData = [], isLoading: eventsLoading } = useQuery<OutreachEvent[]>({
    queryKey: ["/api/events"],
    queryFn: () => apiRequest("/api/events"),
  });

  const { data: audiencesData = [], isLoading: audiencesLoading } = useQuery<Audience[]>({
    queryKey: ["/api/audiences"],
    queryFn: () => apiRequest("/api/audiences"),
  });

  const { data: topicsData = [], isLoading: topicsLoading } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
    queryFn: () => apiRequest("/api/topics"),
  });

  // ─── Event mutations ──────────────────────────────────────────────────────
  const createEventMut = useMutation({
    mutationFn: (event: Omit<OutreachEvent, "id" | "createdAt">) =>
      apiRequest<OutreachEvent>("/api/events", { method: "POST", body: JSON.stringify(event) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/events"] }),
  });

  const updateEventMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<OutreachEvent, "id" | "createdAt">> }) =>
      apiRequest<OutreachEvent>(`/api/events/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/events"] }),
  });

  const deleteEventMut = useMutation({
    mutationFn: (id: string) =>
      apiRequest<void>(`/api/events/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/events"] }),
  });

  // ─── Audience mutations ────────────────────────────────────────────────────
  type AudienceData = Omit<Audience, "id" | "createdAt">;

  const createAudienceMut = useMutation({
    mutationFn: (data: AudienceData) =>
      apiRequest<Audience>("/api/audiences", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/audiences"] }),
  });

  const updateAudienceMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AudienceData> }) =>
      apiRequest<Audience>(`/api/audiences/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/audiences"] }),
  });

  const deleteAudienceMut = useMutation({
    mutationFn: (id: string) =>
      apiRequest<void>(`/api/audiences/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/audiences"] }),
  });

  // ─── Topic mutations ────────────────────────────────────────────────────────
  const createTopicMut = useMutation({
    mutationFn: (name: string) =>
      apiRequest<Topic>("/api/topics", { method: "POST", body: JSON.stringify({ name }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/topics"] }),
  });

  const updateTopicMut = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      apiRequest<Topic>(`/api/topics/${id}`, { method: "PATCH", body: JSON.stringify({ name }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/topics"] }),
  });

  const deleteTopicMut = useMutation({
    mutationFn: (id: string) =>
      apiRequest<void>(`/api/topics/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/topics"] }),
  });

  // ─── Derived data ──────────────────────────────────────────────────────────

  const categories = audiencesData.map((a) => a.name);

  // Legacy by-name helpers for old code that uses category names
  const addCategory = (name: string) => createAudienceMut.mutateAsync({ name });
  const updateCategory = (oldName: string, newName: string) => {
    const aud = audiencesData.find((a) => a.name === oldName);
    if (!aud) return Promise.resolve();
    return updateAudienceMut.mutateAsync({ id: aud.id, data: { name: newName } });
  };
  const deleteCategory = (name: string) => {
    const aud = audiencesData.find((a) => a.name === name);
    if (!aud) return Promise.resolve();
    return deleteAudienceMut.mutateAsync(aud.id);
  };

  return (
    <EventContext.Provider value={{
      events: eventsData,
      eventsLoading,
      categories,
      audiences: audiencesData,
      audiencesLoading,
      topics: topicsData,
      topicsLoading,

      addEvent: (e) => createEventMut.mutateAsync(e),
      updateEvent: (id, data) => updateEventMut.mutateAsync({ id, data }),
      deleteEvent: (id) => deleteEventMut.mutateAsync(id),

      addAudience: (data) => createAudienceMut.mutateAsync(data),
      updateAudience: (id, data) => updateAudienceMut.mutateAsync({ id, data }),
      deleteAudience: (id) => deleteAudienceMut.mutateAsync(id),

      addTopic: (name) => createTopicMut.mutateAsync(name),
      updateTopic: (id, name) => updateTopicMut.mutateAsync({ id, name }),
      deleteTopic: (id) => deleteTopicMut.mutateAsync(id),

      addCategory,
      updateCategory,
      deleteCategory,
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must be used within an EventProvider");
  return context;
}
