export type EventFormat = "in-person" | "webinar";
export type EventCategory = "Business" | "Startup" | "Retail" | "Healthcare" | "Education";

export interface OutreachEvent {
  id: string;
  organization: string;
  topic: string;
  date: string; // ISO date string
  time: string;
  format: EventFormat;
  venue: string;
  category: EventCategory;
  summary: string;
  callToAction: string;
  executionNotes: string;
}

export const eventsData: OutreachEvent[] = [
  {
    id: "evt-001",
    organization: "Phoenix Chamber of Commerce",
    topic: "AI Fundamentals for Local Business",
    date: "2024-11-15",
    time: "10:00 AM - 11:30 AM",
    format: "in-person",
    venue: "Downtown Convention Center, Room 204",
    category: "Business",
    summary: "An introductory session designed for local business owners to understand how AI can streamline operations, from customer service automation to inventory management.",
    callToAction: "Sign up for a free AI readiness assessment.",
    executionNotes: "Bring physical copies of the readiness assessment. Ensure presentation is loaded on a USB drive as backup. Setup projector 30 mins prior."
  },
  {
    id: "evt-002",
    organization: "Arizona Tech Innovators",
    topic: "Scaling with Automated Workflows",
    date: "2024-11-20",
    time: "2:00 PM - 3:00 PM",
    format: "webinar",
    venue: "Zoom",
    category: "Startup",
    summary: "A deep dive into automated workflows for early-stage startups. We'll cover tool integration, data flow, and reducing manual tasks.",
    callToAction: "Download our workflow automation playbook.",
    executionNotes: "Send Zoom link reminders 24h and 1h before. Test screen sharing and audio setup. Have a team member monitor the Q&A chat."
  },
  {
    id: "evt-003",
    organization: "Southwest Retailers Association",
    topic: "Enhancing the Retail Customer Experience with AI",
    date: "2024-12-05",
    time: "9:00 AM - 10:30 AM",
    format: "in-person",
    venue: "Scottsdale Business Hub",
    category: "Retail",
    summary: "Exploring how retail businesses can leverage AI for personalized marketing, predictive inventory, and enhanced in-store experiences.",
    callToAction: "Schedule a consultation to explore custom retail AI solutions.",
    executionNotes: "Prepare retail-specific case studies. Coordinate with venue for breakfast catering."
  },
  {
    id: "evt-004",
    organization: "Desert Healthcare Network",
    topic: "Optimizing Healthcare Operations",
    date: "2024-12-12",
    time: "1:00 PM - 2:30 PM",
    format: "webinar",
    venue: "Microsoft Teams",
    category: "Healthcare",
    summary: "A specialized presentation on improving administrative efficiency in healthcare settings using modern technology and automation.",
    callToAction: "Request a demonstration of our healthcare operations platform.",
    executionNotes: "Ensure HIPAA compliance language is included in all materials. Prepare responses for common data security questions."
  },
  {
    id: "evt-005",
    organization: "Phoenix Startup Week",
    topic: "Building the Next Generation of Apps",
    date: "2024-11-28",
    time: "4:00 PM - 5:00 PM",
    format: "in-person",
    venue: "Galvanize Phoenix",
    category: "Startup",
    summary: "A technical overview of modern application architecture and how startups can build scalable, resilient products from day one.",
    callToAction: "Join our developer community Discord.",
    executionNotes: "Prepare live code demonstrations. Bring Pivital Systems swag (stickers, pens)."
  }
];
