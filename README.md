# 🛡️ Avengerse: Client Requirements & Project Brief

> 🚀 **Quick Navigation & Usage Guides**:
> - 📖 **Developer Guide / How to Use (English)**: [HOW_TO_USE_EN.md](HOW_TO_USE_EN.md)
> - 🇧🇩 **ব্যবহার নির্দেশিকা (বাংলা গাইড)**: [HOW_TO_USE_BN.md](HOW_TO_USE_BN.md)
> - 📚 **ফোল্ডার ও ফাইল পরিচিতি (A to Z Guide)**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
> - 🤖 **Global Agent Rules**: [AGENTS.md](AGENTS.md)
> - ⚙️ **Project Tech Stack Config**: [project.config.md](project.config.md)
>
> ⚡ **সেশন কন্টিনিউয়েশন প্রম্পট (Next Session Command)**:
> নতুন চ্যাট উইন্ডো খুলে শুধু এই এক লাইন বলুন:
> ```text
> planning/updateplanning.md পড়ে পরবর্তী টাস্ক শুরু করো।
> ```
>
> **Avengerse Protocol — Source of Truth**:
> 1. This document (`README.md`) is the **Single Source of Truth** for client requirements.
> 2. Fill out the sections below to describe the client's project. The Chief Orchestrator (`iron_man`) will read this file to coordinate Jarvis, Friday, Edith, Thor, Thanos, and Ultron.
> 3. **Zero-Assumption Policy**: AI agents must never invent client requirements. Unanswered details must be preserved under **Section 8 (Open Questions)** and tracked in `planning/open-questions.md`.

---

## 1. Project Information

- **Project Name**: [e.g., Apex CRM / NovaFlow / PulseHealth]
- **Project Description**: [Comprehensive overview of what the application does]
- **Business Domain**: [e.g., Healthcare, FinTech, E-commerce, EdTech, SaaS]
- **Client / Company Information**: [Client Name, Company, Industry, Country]
- **Target Audience**: [Who are the end-users? e.g., Operations managers, general consumers, field agents]
- **Business Objectives**: 
  - [Objective 1: e.g., Automate client onboarding within 3 minutes]
  - [Objective 2: e.g., Reduce manual invoicing effort by 80%]
  - [Objective 3: e.g., Support multi-currency checkout]

---

## 2. Functional Requirements

> Each requirement should have an identifiable ID (e.g., `REQ-F-001`).

- **REQ-F-001 (Authentication & Onboarding)**: [e.g., Users can register with email/password or Google OAuth with email verification]
- **REQ-F-002 (Role-Based Access Control)**: [e.g., Support distinct roles: SuperAdmin, Admin, Member with specific permission tiers]
- **REQ-F-003 (Core Dashboard)**: [e.g., Summary cards, real-time KPI metrics, recent activity feeds]
- **REQ-F-004 (Resource Management)**: [e.g., CRUD operations for products/items with filtering, search, pagination]
- **REQ-F-005 (Notifications)**: [e.g., In-app notifications and email alerts for critical system events]
- **REQ-F-006 (File Uploads & Media)**: [e.g., Profile picture and document attachments with size limits]
- **REQ-F-007 (Search & Filtering)**: [e.g., Full-text search and multi-criteria filters with URL query persistence]
- **REQ-F-008 (Billing & Payments)**: [e.g., Stripe subscription integration with tier-based usage limits]
- **REQ-F-009 (Reports & Export)**: [e.g., Export table data to CSV and PDF summaries]

---

## 3. Non-Functional Requirements

> Describe expectations clearly. Do not invent arbitrary SLAs when not supplied by the client.

- **Performance**: [e.g., P95 API response time < 200ms under standard load, Core Web Vitals score > 90]
- **Scalability**: [e.g., Support 5,000 DAU initially, horizontally scalable backend via Docker]
- **Security**: [e.g., JWT with HTTP-only cookies, role-based guard authorization, OWASP Top 10 compliance]
- **Accessibility**: [e.g., Target WCAG 2.2 AA compliance, keyboard navigation, accessible color contrast]
- **Availability**: [e.g., 99.9% uptime expectation during business hours]
- **Maintainability**: [e.g., Clean modular TypeScript architecture, strict type checking, comprehensive test suite]
- **Data Retention & Privacy**: [e.g., Retain audit logs for 90 days, GDPR compliance for account deletion]
- **Auditability**: [e.g., Log admin actions with timestamps, user IDs, and changed attributes]

---

## 4. Technology Preferences

> Confirmed technical preferences. Detailed stack choices are recorded in `project.config.md`.

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, Modular Domain Architecture
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cache / Messaging**: Redis
- **Mobile (Optional)**: Flutter (Dart) — [Specify if required or N/A]
- **Hosting / Infrastructure**: Docker, Nginx, Linux VPS / Cloud (TBD)

---

## 5. Design References

- **Figma URL(s)**: [Paste Figma link here or indicate "No Figma - build using Jarvis Design System"]
- **Reference Websites / Inspirations**: [e.g., linear.app, stripe.com/dashboard, airbnb.com]
- **Brand Colors**:
  - **Primary**: [e.g., `#4f46e5` (Indigo-600)]
  - **Secondary / Accent**: [e.g., `#06b6d4` (Cyan-500)]
  - **Background Style**: [e.g., Clean light theme with dark mode toggle]
- **Typography Preference**: [e.g., Inter / Plus Jakarta Sans / Roboto]
- **Logos & Assets**: [Location in `input/` or external CDN link]
- **Existing Design Systems**: [e.g., Shadcn UI / Radix Primitives]

---

## 6. External Integrations

> List third-party services. **NEVER** store API secrets or production credentials in this document.

- **Payment Provider**: [e.g., Stripe / LemonSqueezy / None]
- **Email Service**: [e.g., Resend / SendGrid / Postmark]
- **Authentication Provider**: [e.g., NextAuth.js / Supabase Auth / Custom JWT]
- **Object Storage**: [e.g., AWS S3 / Cloudflare R2 / MinIO]
- **Analytics & Tracking**: [e.g., PostHog / Google Analytics / Plausible]
- **Third-Party APIs**: [List any external partner APIs]

---

## 7. Project Constraints

- **Budget & Infrastructure Limits**: [e.g., Single VPS deployment or serverless free/low-tier]
- **Delivery Milestones**: [e.g., MVP in 4 weeks, Production Release in 8 weeks]
- **Existing Systems / Legacy Data**: [e.g., Existing SQL database to migrate or fresh start]
- **Browser Support**: [e.g., Latest 2 versions of Chrome, Firefox, Safari, Edge]
- **Mobile Platform Requirements**: [e.g., Android & iOS (if Flutter enabled)]
- **Compliance Requirements**: [e.g., GDPR / HIPAA / PCI-DSS / Standard web privacy]

---

## 8. Open Questions

> Unanswered questions requiring client confirmation. Iron Man must preserve these and not invent assumptions.

1. [Open Question 1: e.g., Should users be able to invite team members before verifying email?]
2. [Open Question 2: e.g., Which payment currencies must be supported at launch?]
3. [Open Question 3: e.g., Are social logins (Google, GitHub) required for MVP?]
