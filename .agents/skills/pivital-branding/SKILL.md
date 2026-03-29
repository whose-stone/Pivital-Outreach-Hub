# Pivital.AI Brand Guidelines

When working on any Pivital.AI UI, copy, or design task, apply these brand guidelines consistently.

---

## 1. Color Palette

### Primary Colors
| Name | Hex | Usage |
|---|---|---|
| Deep Forest Green | `#001F17` | Primary dark background, hero sections |
| Forest Green | `#004435` | Card backgrounds, secondary dark surfaces |
| Mint Accent | `#B2FFE6` | Borders, highlights, emphasis, hover glows |
| Teal | `#00A4A6` | CTA buttons, links, active states |

### Supporting Colors
| Name | Hex | Usage |
|---|---|---|
| Soft Teal Glow | `rgba(0, 164, 166, 0.15)` | Hover shadows, diagram node glow |
| Mint Glow | `rgba(178, 255, 230, 0.12)` | Card hover glow |

### Neutrals
| Name | Hex | Usage |
|---|---|---|
| White | `#FFFFFF` | Primary text on dark backgrounds |
| Light Gray | `#E5E7EB` | Secondary text, captions |
| Medium Gray | `#6B7280` | Muted text, metadata |
| Off-Black | `#111111` | Text on light backgrounds (rare) |

### Color Rules
- Always use dark backgrounds (`#001F17` or `#004435`) as the primary canvas
- Mint (`#B2FFE6`) is for accents and emphasis only — never as a large fill
- Teal (`#00A4A6`) is the action/interactive color
- High contrast between background and text is required at all times

---

## 2. Typography

### Primary Typeface
**Inter** (or Inter Variable)
- Clean, modern, highly legible
- Works well for technical and enterprise audiences
- Matches the tone of "engineering-first" systems
- Import: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`

### Monospace Typeface
**JetBrains Mono** (preferred) or IBM Plex Mono
- Used for: code snippets, schemas, RAG diagrams, technical labels, phase identifiers
- Import: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap`

### Type Scale
| Element | Size | Weight | Notes |
|---|---|---|---|
| H1 | 56–72px | Bold (700) | Hero headlines |
| H2 | 36–48px | Semibold (600) | Section titles |
| H3 | 24–32px | Semibold (600) | Card titles, subsections |
| Body | 16–18px | Regular (400) | Body copy |
| Caption/Label | 12–14px | Medium (500) | Labels, metadata |
| Mono | 14–16px | Regular (400) | Code, schemas, phase identifiers |

### Typography Rules
- Never use decorative or serif typefaces
- Headlines should be concise and declarative (1–2 lines max)
- Use sentence case for body, title case for headlines only
- Maintain generous line-height (1.5–1.6 for body, 1.1–1.2 for headlines)

---

## 3. Layout & Spacing

### Section Spacing
| Context | Value |
|---|---|
| Between major sections | 120px vertical |
| Between header and body | 48px |
| Between paragraphs | 24px |
| Between UI elements | 16px |

### Section Structure Pattern
Every content section should follow this structure:
1. **Bold headline** — declarative, 1–2 lines
2. **Short, high-impact subhead** — supporting context
3. **Three to four supporting bullets** — specific, operational
4. **A diagram or visual anchor** — node network, flow diagram, or phase card

### Grid & Layout
- Max content width: 1200px
- Side padding: 24px (mobile), 48px (tablet), 80px (desktop)
- Use CSS Grid for section layouts; Flexbox for component internals
- Sections should feel spacious — never cramped

---

## 4. Card Components

Cards are the primary UI component for organizing information.

### Use Cards For
- Phases (Phase 1, Phase 2, etc.)
- Deliverables
- Modules
- Pricing tiers
- Feature highlights

### Card Specifications
```css
background: #001F17 or #004435;
border: 1px solid #B2FFE6;
border-radius: 6px–8px;
padding: 24px–32px;
transition: box-shadow 0.2s ease;

/* Hover state */
box-shadow: 0 0 16px rgba(178, 255, 230, 0.2);
```

### Phase Card Structure
```
[Mono label]   Phase 1 · Discovery & Blueprint
[H3 title]     Data Infrastructure Audit
[Body text]    Source mapping, data audit, business rule
               documentation, policy validation framework…
[Optional CTA] Learn More →
```

### Card Rules
- Always use dark card backgrounds on dark page backgrounds
- Mint border is required — it defines the card boundary
- Hover state must show a mint or teal glow (never a hard shadow)
- Icon or diagram inside card should use mint/teal color only

---

## 5. Tone & Voice

### Voice Principles
- **Direct** — "We build the data backbone."
- **Technical but human** — uses engineering language without alienating non-engineers
- **Confident, not hype-driven** — no superlatives or buzzwords
- **Operationally grounded** — tied to real-world, production concerns

### Writing Style
- Short sentences (10–15 words preferred)
- Declarative statements, not questions
- Engineering and operational metaphors
- Specific > vague at all times

### Approved Metaphors & Phrases
- "5 AM rush" (production reliability under pressure)
- "always-on" (continuous availability)
- "zero ambiguity" (data precision)
- "plumbing" (infrastructure metaphor)
- "control plane" (operational control metaphor)
- "backbone" (foundational infrastructure)

### Examples of Good Copy
- "Deployment is not a flip of a switch."
- "When the brain glitches at 5 AM, Pivital fixes the plumbing."
- "One Intelligent Agent. Every HR Answer. Zero Hallucinations."
- "Pivital builds the data infrastructure that makes AI trustworthy in production."

### Words to Avoid
- Revolutionary, game-changing, cutting-edge, next-gen
- Seamlessly, effortlessly, magically
- Unlock, leverage, synergy
- Supercharge, turbocharge

---

## 6. Messaging Framework

### Primary Tagline
> **Engineering the Backbone of Intelligent Automation**

### Tagline Variants
- "AI That Works at 5 AM"
- "Zero-Hallucination AI Infrastructure"
- "Correctness First. Reliability Always."
- "Agentic Systems Built for the Real World"

### Value Pillars
1. **Correctness First** — outputs are validated against source data, not hallucinated
2. **Operational Reliability** — production-grade systems that run 24/7
3. **Zero-Hallucination Architecture** — RAG pipelines grounded in verified data
4. **Scalable Infrastructure** — designed to grow with the organization
5. **Transparent, Auditable Systems** — every output is traceable

### Positioning Statement
Pivital.AI builds the data infrastructure that makes AI trustworthy in production. Not AI demos — AI systems that work reliably at scale, grounded in your data, validated by your policies, and auditable end-to-end.

---

## 7. Agentic Web Development Identity

### Definition
**Agentic Web Development** = Websites that are not static pages, but operational agents connected to your data, policies, and infrastructure.

### Core Principles
- Every page is a live interface to your data systems
- Every component is backed by retrieval, validation, and policy logic
- Every interaction is grounded, auditable, and correct
- The website becomes a control plane, not a brochure

### Visual Representation
Use these motifs to convey agentic identity:
- **Node networks** — interconnected circular nodes with thin mint lines
- **Data flow diagrams** — directional arrows, labeled edges
- **RAG pipeline visualizations** — retrieval → augmentation → generation flow
- **Policy validation flows** — decision trees with validation checkpoints
- **"Blueprint" and "infrastructure" motifs** — grid overlays, technical line art

### Diagram Style
```
Line color:     #B2FFE6 (mint), thin (1–1.5px)
Node style:     Rounded circles or rectangles, filled #004435, mint border
Glow:           Soft teal glow on active nodes (rgba(0, 164, 166, 0.3))
Labels:         JetBrains Mono, 12–14px, white or mint
Arrows:         Thin, directional, mint colored
```

---

## 8. Web Components for pivital.ai

### Hero Section
```
Background:     #001F17 (deep forest green)
Symbol:         Large neural "P" logo — gradient from teal to mint
Headline:       "Engineering the Backbone of Intelligent Automation"  (H1, white, bold)
Subhead:        "Agentic Web Development & AI Infrastructure"  (H2, mint, semibold)
CTA Button:     "Build Your Blueprint"  (teal background, white text, 8px radius)
Visual:         Animated node network in background
```

### Navigation
```
Background:     #001F17 with subtle blur/frosted glass on scroll
Logo:           Left-aligned, white "PIVITAL" text with gradient symbol
Links:          White, medium weight, mint on hover
CTA:            Teal button, right-aligned
```

### Phase Cards (Structured Content)
Follow the deck structure:
```
Phase 1 · Discovery & Blueprint
  Source mapping, data audit, business rule documentation,
  policy validation framework setup

Phase 2 · Data Infrastructure Build
  RAG pipeline construction, embedding configuration,
  retrieval optimization, hallucination testing

Phase 3 · Agent Deployment
  Production deployment, monitoring setup,
  feedback loop integration

Phase 4 · Optimization & Scale
  Performance tuning, accuracy improvements,
  enterprise scaling
```

### CTA Sections
- Dark background with mint border accent
- Headline: short, declarative, action-oriented
- Single primary CTA button in teal
- No secondary clutter

---

## 9. Logo Usage Rules

### Logo Components
- **Symbol**: Neural "P" — gradient from teal (`#00A4A6`) to mint (`#B2FFE6`)
- **Wordmark**: "PIVITAL" in white, clean sans-serif
- **Lock-up**: Symbol left, wordmark right

### Do
- Use on dark backgrounds only (`#001F17` or `#004435`)
- Maintain gradient integrity of the symbol
- Keep clear space equal to the symbol height on all sides
- Use white "PIVITAL" wordmark text

### Don't
- Recolor or alter the gradient of the symbol
- Place on busy, light, or patterned backgrounds
- Stretch, warp, or distort any part of the logo
- Add drop shadows, glows, or effects to the logo itself
- Use logo smaller than 24px symbol height

---

## 10. Brand Applications

### Web
- Dark UI throughout (`#001F17` base)
- High contrast mint accents for interactivity
- Animated node networks in hero and feature sections
- RAG pipeline and data flow diagrams to explain product
- Phase cards for structured content (services, pricing)
- Pricing tables with dark card backgrounds and mint borders

### Slide Decks
- Same spacing system as web (120px section, 48px header/body)
- Dark slide backgrounds (`#001F17`)
- Mint for emphasis, bullets, and highlighted text
- Neural "P" watermark at low opacity in background
- Card system for deliverables and phase breakdowns

### Print
- Solid teal or black backgrounds
- Avoid gradients except in the logo itself
- White text only
- Mint accents sparingly for hierarchy

---

## 11. Quick Reference Checklist

Before delivering any Pivital.AI UI or copy, verify:

- [ ] Dark background (`#001F17` or `#004435`) is the base
- [ ] All interactive elements use teal (`#00A4A6`)
- [ ] Accents and borders use mint (`#B2FFE6`)
- [ ] Typeface is Inter (body/headlines) and JetBrains Mono (code/labels)
- [ ] Copy is direct, declarative, and free of buzzwords
- [ ] Cards have dark backgrounds + thin mint borders + rounded corners
- [ ] Hover states show mint or teal glow (not hard shadows)
- [ ] Section spacing follows: 120px / 48px / 24px / 16px hierarchy
- [ ] Logo only appears on dark backgrounds with correct gradient
- [ ] Diagrams use thin mint lines, rounded nodes, soft teal glow
