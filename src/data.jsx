// Shared content — pulled from resume + GitHub (incl. NSBM dev-team org)
const RK = {
  name: "Raminda Kariyawasam",
  short: "Raminda",
  handle: "@KADRDulmin",
  role: "Associate Software Engineer",
  at: "NSBM Green University",
  location: "Sri Lanka",
  email: "raminda5575@gmail.com",
  phone: "+94 75-870 29 22",
  linkedin: "https://linkedin.com/in/raminda-dulmin/",
  github: "https://github.com/KADRDulmin",
  orgGithub: "https://github.com/orgs/nsbm-dev-team/repositories",

  about: [
    "I'm a Software Engineering graduate from the University of Plymouth (class of 2025) working full-stack — from immersive 3D web apps to mobile, cloud deployments and everything in between.",
    "Right now I build tools at NSBM Green University's dev team — internal portals, AI integrations, public mobile apps. Outside the day job I tinker with React, Three.js, Flutter, Firebase and Docker.",
    "Turning caffeine into code since 2020. Currently collecting semicolons."
  ],

  timeline: [
    { year: "2025 — now", title: "Associate Software Engineer", place: "NSBM Green University", body: "Internal university systems, AI integrations, public mobile apps." },
    { year: "2022 — 2023", title: "UI Developer Intern", place: "Iplay Global", body: "Hands-on with HTML, CSS, JS and UI frameworks on client web builds." },
    { year: "2020 — 2022", title: "Infigo Developers", place: "Start-up", body: "WordPress dev + React / Angular fundamentals." },
    { year: "2022 — 2025", title: "BSc (Hons) Software Engineering", place: "University of Plymouth, UK", body: "Graduated 2025." },
    { year: "2020 — 2021", title: "IT Foundation", place: "NSBM University, Sri Lanka" }
  ],

  skills: {
    Frontend: ["React", "Angular", "Three.js", "Flutter", "React Native", "TypeScript", "Tailwind"],
    Backend: ["Node.js", "Express", "Java", "PHP", "Python", "Go"],
    "Database & Cloud": ["MongoDB", "MySQL", "PostgreSQL", "Firebase", "AWS", "GCP", "Docker"],
    Design: ["Figma", "Adobe Suite", "UX research", "Prototyping"],
    Tools: ["Git", "GitHub Actions", "Jira", "Notion", "VS Code", "Android Studio"]
  },

  // Project categories used by the filter chips in the Projects board
  projectCategories: [
    { id: "all", label: "All" },
    { id: "client", label: "Client Work" },
    { id: "nsbm", label: "NSBM Systems" },
    { id: "personal", label: "Startups & Personal" }
  ],

  // Every substantial project I've shipped. `category` drives the filter,
  // the light fields (icon/name/tag/body/stack) render the card, and the
  // rich fields (detail/features/role/org/year/links) render the modal.
  // `links` is empty where the repo is private (client / org / internal) —
  // add { label, url } here to surface a live demo or source link.
  projects: [
    // ───────────────────────── CLIENT WORK ─────────────────────────
    {
      id: "usdeed", name: "USDeedManagement", tag: "Multi-County US Deed Platform",
      category: "client", color: "sky", icon: "scroll",
      stack: ["Angular 21", "Spring Boot", "Java 21", "MySQL", "AWS", "Firebase", "Docker"],
      body: "Deed record management & public deed search across US counties, built for a title-abstract client.",
      role: "Full-Stack Engineer", org: "Leon Mineral Abstract (client)", year: "2025",
      detail: "A full-stack platform that lets county staff ingest, manage and audit official deed records while giving the public — deed researchers, attorneys, landmen and property owners — a fast, searchable way to find, save and export them. Two standalone Angular portals (admin + user) talk to a Spring Boot REST API backed by MySQL, with PDFs stored in S3 and the whole stack shipped to AWS via Docker.",
      features: [
        "Public 19-field deed search with sortable, draggable & persisted columns, sticky headers and an in-app PDF viewer",
        "Admin portal: deed CRUD, a multi-step add-record flow, and bulk CSV upload with real-time async progress tracking",
        "Saved searches and 'run sheets' — named land-title research folders you can rerun, filter by and export to Excel",
        "Firebase auth with rollback, account-credit top-ups, an immutable audit trail and a MapStruct / Liquibase data layer",
        "Deployed on AWS S3 + CloudFront (front end) and ECS via ECR (API), wired through GitHub Actions with OIDC"
      ],
      links: []
    },
    {
      id: "landman", name: "LandMan For A Day", tag: "Mineral-Rights Landman Marketplace",
      category: "client", color: "peach", icon: "map-trifold",
      stack: ["Angular 17", "Spring Boot", "Java 17", "PostgreSQL", "JWT", "Docker"],
      body: "A marketplace connecting property owners with qualified landmen for mineral-rights research.",
      role: "Full-Stack Engineer", org: "Title Data Design (client)", year: "2025",
      detail: "A platform that matches property owners with vetted 'landmen' to research and verify mineral rights. It splits into separate admin and user portals over a Spring Boot API, with JWT-secured auth, PostgreSQL persistence and a Dockerised, AWS CodeDeploy-driven pipeline.",
      features: [
        "User portal: post mineral-rights jobs, search work, multi-step landman registration and an assignments dashboard",
        "Admin portal: real-time stats, user/staff CRUD, landman qualification verification & assignment management",
        "JWT auth with HTTP interceptors, route guards, HTTP caching and lazy-loaded Angular Material routes",
        "Payment integration plus a polished full-page loading system with animated dual-circle spinners",
        "Dockerised backend with an AWS CodeDeploy (appspec.yml) CI/CD flow"
      ],
      links: []
    },
    {
      id: "lensly", name: "Lensly LK", tag: "Premium Camera Rental Platform",
      category: "client", color: "mint", icon: "camera",
      stack: ["PHP 8", "MySQL", "PHPMailer", "TCPDF", "JavaScript"],
      body: "An Apple-inspired, trilingual camera-rental management platform for a Sri Lankan business.",
      role: "Full-Stack Developer", org: "Lensly LK (client)", year: "2025",
      detail: "A production-grade camera rental system where customers browse gear, check live availability, calculate costs, sign digital agreements and track rentals — fully in English, Sinhala and Tamil. Built in PHP 8 with a microservices-style split into customer portal, admin portal and a shared backend API over one MySQL database.",
      features: [
        "Database-driven trilingual UI (English / Sinhala / Tamil) — every string localised, none hardcoded",
        "Real-time rental calculator (deposits, accessories, delivery, tax) plus an availability calendar with conflict detection",
        "Full lifecycle Pending→Approved→Active→Completed with auto invoices, staged emails and versioned digital agreements",
        "Damage tracking with photo evidence & deposit deductions; admin revenue analytics with CSV/PDF export",
        "Hardened: bcrypt, CSRF tokens, XSS escaping, rate limiting and a full before/after audit-log table"
      ],
      links: []
    },

    // ───────────────────── STARTUPS & PERSONAL ─────────────────────
    {
      id: "planzevo", name: "PlanzEvo", tag: "AI Event-Planning Platform",
      category: "personal", color: "lav", icon: "confetti",
      stack: ["Go", "AWS Lambda", "Neon Postgres", "Angular 21", "Nx", "Firebase", "AWS CDK"],
      body: "Sri Lanka's AI-powered event-planning platform — five customer suites plus a shared vendor marketplace.",
      role: "Founder / Full-Stack Engineer", org: "Startup", year: "2025 — now",
      detail: "An AI-powered event-planning product spanning five suites — WeddingPlanner, Tickets, PartyPlanner, CorporatePlanner and PlanzEvo Glow — over a shared vendor marketplace, each on its own subdomain. The backend is Go 'Lambdalith' microservices on AWS Lambda (Function URLs, no API Gateway) with a Neon Postgres data layer; the front end is an Angular 21 zoneless Nx monorepo of five portals, fronted by a separate Next.js marketing site that drives the pre-seed waitlist.",
      features: [
        "Go microservices (Clean Architecture, Chi router, sqlc + pgx, Wire DI) deployed via AWS CDK-in-Go",
        "Angular 21 signals/zoneless Nx monorepo — corporate, party, tickets, vendor & wedding portals on a shared design system",
        "Typed API client auto-generated from backend OpenAPI specs, with JWT-claim entitlement & role guards",
        "Neon Postgres + PgBouncer, an SNS/SQS event bus, Sentry and Firebase auth; en / si / ta i18n",
        "Companion Next.js 16 waitlist landing page with animated, WCAG-AA marketing sections"
      ],
      links: []
    },
    {
      id: "influencelk", name: "InfluenceLK", tag: "Influencer Collaboration Marketplace",
      category: "personal", color: "pink", icon: "handshake",
      stack: ["NestJS", "PostgreSQL", "TypeORM", "Next.js 16", "Socket.IO", "WebRTC"],
      body: "A white-label marketplace connecting Sri Lankan businesses with influencers — 'Fiverr × Upwork' with escrow.",
      role: "Founder / Full-Stack Engineer", org: "Startup", year: "2025",
      detail: "A fully white-labelable SaaS marketplace where businesses hire influencers for promotional videos through an escrow-backed flow. The backend is a NestJS modular monolith of eight service modules with in-process messaging; the front end is Next.js 16 with runtime theming pulled live from the database, so the whole platform can be rebranded without a restart.",
      features: [
        "Escrow hire flow: order → funds held → deliver → approve → payout minus commission, with wallet ledgers & reviews",
        "Live white-labeling — name, logo, colours, commission %, boost tiers & plans all editable from the admin panel",
        "Realtime Instagram-style chat (typing, seen, presence) plus 1:1 WebRTC audio/video calls via perfect-negotiation",
        "Social linking (YouTube / FB / IG / TikTok / X) with nightly stat sync & AES-256-GCM encrypted tokens",
        "A hybrid recommendation engine, membership growth mechanics, disputes with escrow freeze and admin analytics"
      ],
      links: []
    },
    {
      id: "literanet", name: "LiteraNet", tag: "Smart Library Platform",
      category: "personal", color: "sky", icon: "books",
      stack: ["Node.js", "Express", "Angular", "MongoDB", "Docker", "k6"],
      body: "A full-stack MEAN library-management platform with a clean, modern reading experience.",
      role: "Full-Stack Developer", org: "Personal project", year: "2024",
      detail: "A smart library-management platform built on the MEAN stack with a decoupled backend and Angular front end, containerised with Docker Compose and load-tested with k6 — focused on a clean, modern UX over classic catalogue and borrowing workflows.",
      features: [
        "MEAN-stack architecture (MongoDB, Express, Angular, Node) with a decoupled REST API",
        "Docker Compose orchestration for reproducible local & deploy environments",
        "k6 load-testing scripts to validate performance under concurrency",
        "A modern, responsive catalogue and borrowing experience"
      ],
      links: []
    },
    {
      id: "kitchenpal", name: "KitchenPal", tag: "Kitchen & Food Management App",
      category: "personal", color: "yellow", icon: "cooking-pot",
      stack: ["TypeScript", "Node.js", "Mobile", "MySQL"],
      body: "A kitchen and food-management app with a TypeScript/Node backend and a companion mobile client.",
      role: "Full-Stack Developer", org: "Personal project", year: "2024",
      detail: "A food and kitchen management application pairing a TypeScript/Node backend with a mobile client (KitchenPal-mobile), covering pantry, recipes and food organisation with structured backend setup, health-check tooling and a secrets generator.",
      features: [
        "TypeScript/Node backend with typed config, health-check scripts and a secrets generator",
        "A companion mobile client (KitchenPal-mobile)",
        "Kitchen / pantry and food-management workflows",
        "Structured backend setup and environment tooling"
      ],
      links: []
    },
    {
      id: "canteen", name: "Campus Canteen Ordering", tag: "Cross-Platform Lunch Ordering",
      category: "personal", color: "peach", icon: "fork-knife",
      stack: ["Flutter", "Dart", "Backend API"],
      body: "A cross-platform Flutter app for ordering lunch from the campus canteen.",
      role: "Mobile Developer", org: "Campus project", year: "2024",
      detail: "A campus canteen lunch-ordering system built in Flutter/Dart from a single codebase targeting Android, iOS, web, Windows, macOS and Linux, with its own backend for menu and order handling.",
      features: [
        "A single Flutter/Dart codebase targeting mobile, web and desktop",
        "Menu browsing and a lunch-ordering flow",
        "A dedicated backend for orders & menu data",
        "A campus-focused ordering experience"
      ],
      links: []
    },

    // ─────────────────── NSBM UNIVERSITY SYSTEMS ───────────────────
    {
      id: "nprofile", name: "UMIS Student Portal", tag: "NSBM Student Portal PWA",
      category: "nsbm", color: "mint", icon: "graduation-cap",
      stack: ["Next.js 16", "React 19", "NextAuth v5", "MySQL", "Gemini AI", "Tailwind"],
      body: "A Next.js PWA student portal for NSBM Green University with a role-gated staff area and AI features.",
      role: "Associate Software Engineer", org: "NSBM Green University", year: "2025 — now",
      detail: "Part of NSBM's UMIS ecosystem: a Next.js 16 PWA where students use a rich dashboard and staff access role-gated admin tools. It authenticates via Microsoft Entra ID SSO, ships idempotent DB migrations as code, and layers on AI, notifications and a security-monitoring subsystem — with every API route re-checking auth server-side (guarding against the CVE-2025-29927 class rather than trusting middleware).",
      features: [
        "Microsoft Entra ID SSO (NextAuth v5) with per-route server-side auth re-checks and edge middleware",
        "A cinematic MIS analytics dashboard — animated KPI cards, count-ups, SVG gauges and scroll-driven motion",
        "A security-monitoring / intrusion-detection subsystem with masked-sender SMS alerts",
        "Hall management and a student-grouping algorithm; QR scanning, PDF generation, push & email notifications",
        "Gemini AI, @tanstack/react-table, dnd-kit, Framer Motion / GSAP animation and pooled MySQL access"
      ],
      links: []
    },
    {
      id: "timetable", name: "Timetable Generator (Gen2)", tag: "CP-SAT Semester Timetabling",
      category: "nsbm", color: "sky", icon: "calendar-dots",
      stack: ["Next.js 15", "Python", "FastAPI", "OR-Tools", "MySQL", "Entra ID"],
      body: "A constraint-solver semester timetable & lecture-hall management system for NSBM.",
      role: "Associate Software Engineer", org: "NSBM Green University", year: "2025",
      detail: "A full-semester lecture-timetable generator built on Google OR-Tools CP-SAT. A Next.js 15 app owns UI, auth, RBAC and API routes, while an isolated Python FastAPI service does the CP-SAT compute only. Lecturers plan workload, the Assistant Registrar assigns modules and generates timetables, and a public dashboard shows live hall utilisation.",
      features: [
        "A CP-SAT constraint solver with documented hard constraints (H1–H11) and an explicit objective function",
        "Two-service architecture: a Next.js web app plus a private Python/FastAPI compute service behind a shared secret",
        "Reads the UMIS DB strictly read-only and writes its own app DB; hall allocation returns HTTP 409 on clash",
        "A public live hall-utilisation dashboard and role-based DVC / Registrar oversight",
        "Exhaustively documented — an Obsidian vault of 105 wikilinked notes plus architecture / security / CD specs"
      ],
      links: []
    },
    {
      id: "umis2", name: "UMIS 2.0", tag: "University System Master Spec",
      category: "nsbm", color: "lav", icon: "buildings",
      stack: ["Specification", "Architecture", "MySQL", "Security / IPDR"],
      body: "The master specification & architecture 'control tower' for NSBM's next-gen University Management Information System.",
      role: "Systems Architect / Author", org: "NSBM Green University", year: "2025",
      detail: "The governance and specification hub for UMIS 2.0 — an integrated, end-to-end university system sharing one student identity, one notification framework, one payments backbone, one document vault and one audit trail. This repo holds no product code; it is the authoritative 1,200+ line master spec, database architecture, phased build prompts, an AI-agent harness and security (IPDR) baseline that every implemented module builds against.",
      features: [
        "A master specification plus database-architecture doc governing the whole UMIS ecosystem",
        "A 'one student, one identity forever' model (Inquiry ID → permanent UMIS ID) across every module",
        "Specs for registration, academics, attendance/eligibility, exams, results, hostel, library, careers & alumni",
        "An AI-agent harness with session protocols, memory and phased implementation prompts",
        "A security / IPDR baseline, ER diagrams, maker–checker on sensitive actions and full audit trails"
      ],
      links: []
    },
    {
      id: "ragbot", name: "NSBM RAG Bot", tag: "AI Retrieval-Augmented Chatbot",
      category: "nsbm", color: "mint", icon: "robot",
      stack: ["PHP", "Gemini API", "MySQL", "Python", "JavaScript"],
      body: "An AI RAG chatbot answering student queries from a document knowledge base, embedded on nsbm.ac.lk.",
      role: "Associate Software Engineer", org: "NSBM Green University", year: "2025",
      detail: "A Retrieval-Augmented Generation chatbot that answers student questions grounded strictly in an uploaded document knowledge base, deployed as an embeddable floating widget on NSBM's live sites. Built in framework-less PHP with Google Gemini's File Search Store for cloud-side embedding and retrieval, so there is no local vector DB to run.",
      features: [
        "A RAG pipeline over Gemini File Search — admins upload PDF/Markdown, answers stay document-grounded (no hallucination)",
        "An embeddable floating widget (widget.js): desktop popup, mobile fullscreen, self-contained iframe UI",
        "Admin dashboard: drag-drop dataset manager, live session viewer, archived-chat audit & transcript viewer",
        "Security: HMAC-SHA256 request signing, CORS whitelist, MySQL rate limiting and CSP frame-ancestors headers",
        "A companion Python crawl4ai scraper that builds the knowledge base from site content"
      ],
      links: []
    },
    {
      id: "examtrack", name: "ExamTrack", tag: "Exam Verification & Attendance",
      category: "nsbm", color: "yellow", icon: "exam",
      stack: ["PHP", "MySQL", "LDAP", "PHPMailer"],
      body: "An exam identity-verification and attendance system for NSBM invigilators and the exam department.",
      role: "Associate Software Engineer", org: "NSBM Green University", year: "2024",
      detail: "An examination verification system that lets lecturers and invigilators confirm student identity and attendance during exams, and lets the examination department manage exam logistics. Built in framework-less PHP with an MVC structure, a RESTful API and LDAP authentication against the university directory.",
      features: [
        "Invigilator portal: module/date search, hall & seat lists, photo-based identity verification and attendance marking",
        "Quick jump to a student's exam profile by ID, plus pre-filled exam-offence reporting",
        "Admin portal: modules, halls, students, schedules, attendance records and reported offences",
        "LDAP authentication against the university UMIS directory, with a fallback",
        "Security-hardened: bcrypt, PDO prepared statements, session timeout and role-based access"
      ],
      links: []
    },
    {
      id: "enrollnow", name: "Enroll-Now Portal", tag: "Enrollment & Lead Management",
      category: "nsbm", color: "pink", icon: "user-plus",
      stack: ["PHP 8", "MySQL", "JWT", "Chart.js", "PHPMailer"],
      body: "A web enrollment & lead-management system where prospects apply and staff track applications.",
      role: "Associate Software Engineer", org: "NSBM Green University", year: "2024",
      detail: "A production-ready (v2.0) student enrollment and lead-management system for NSBM. Prospective students submit inquiries through a public form; staff then manage, call, track and report on applications through a JWT-secured admin dashboard with charts and multi-format reporting.",
      features: [
        "A public enrollment form with dynamic faculty→programme filtering and automated email + SMS confirmations",
        "An admin dashboard with real-time stats and Chart.js faculty / programme breakdowns",
        "Call tracking with notes/history, a status workflow (Pending / Called / Processed) and advanced search",
        "Six report types (enrollment, call activity, staff performance, faculty, daily, custom) exportable to PDF/CSV",
        "JWT auth, role-based Admin/Assistant permissions, PDO-guarded SQL and Dialog SMS integration"
      ],
      links: []
    },
    {
      id: "research", name: "Research Portal", tag: "Academic Research Management",
      category: "nsbm", color: "lav", icon: "microscope",
      stack: ["PHP", "MySQL", "LDAP", "DOI / Scopus"],
      body: "A research-paper management portal for faculty with DOI and Scopus integration.",
      role: "Associate Software Engineer", org: "NSBM Green University", year: "2024",
      detail: "An academic research-paper management portal for faculty, handling submissions and tracking with LDAP authentication, email notifications and integrations with DOI and Scopus for publication metadata.",
      features: [
        "Research-paper submission, tracking and management for faculty",
        "LDAP authentication against the university directory",
        "DOI and Scopus integrations, delivered via dedicated migrations",
        "Email notifications via PHPMailer over a MySQL backend"
      ],
      links: []
    },
    {
      id: "library", name: "Library Management Portal", tag: "Koha-Integrated Library System",
      category: "nsbm", color: "peach", icon: "book-open",
      stack: ["PHP", "Koha ILS", "Azure OAuth", "MySQL", "PHPMailer"],
      body: "A library portal integrating the Koha ILS with Microsoft / Azure single sign-on.",
      role: "Associate Software Engineer", org: "NSBM Green University", year: "2024",
      detail: "A large PHP library-management portal for NSBM that layers a modern front end and single sign-on over the open-source Koha integrated library system, covering catalogue, borrowing and member workflows plus SEO and FTP-based deployment.",
      features: [
        "Integration with the Koha open-source ILS (a dedicated Koha database)",
        "Microsoft / Azure OAuth authentication",
        "Email via PHPMailer and Composer-managed dependencies",
        "SEO implementation and FTP deployment tooling"
      ],
      links: []
    },
    {
      id: "jobportal", name: "NSBM Job Portal", tag: "Student Careers & Jobs",
      category: "nsbm", color: "sky", icon: "briefcase",
      stack: ["PHP", "MySQL", "PHPMailer", "Composer"],
      body: "A job and career portal for NSBM students with CV handling and admin tools.",
      role: "Associate Software Engineer", org: "NSBM Green University", year: "2024",
      detail: "A PHP job / career portal for NSBM students with separate student and admin areas, covering job listings, applications with CV attachment handling and templated email notifications.",
      features: [
        "Student and admin areas over a PHP + MySQL stack",
        "Job listings and applications with CV attachment handling",
        "Templated email notifications via PHPMailer",
        "Composer-managed dependencies"
      ],
      links: []
    },
    {
      id: "intranet", name: "NSBM Intranet Portal", tag: "Internal Staff Hub with SSO",
      category: "nsbm", color: "yellow", icon: "lock-key",
      stack: ["PHP", "OAuth / SSO", "MySQL"],
      body: "A single internal hub aggregating NSBM's university apps, notices and staff tools behind SSO.",
      role: "Associate Software Engineer", org: "NSBM Green University", year: "2024",
      detail: "An internal intranet portal that aggregates the university's apps, notices and staff tools behind a single OAuth / SSO login, acting as the central entry point for staff.",
      features: [
        "An OAuth / SSO authentication flow (auth, callback, routing)",
        "Aggregates internal university apps and staff tools",
        "User management for staff access",
        "A central internal hub for the NSBM ecosystem"
      ],
      links: []
    }
  ],

  heroPhotoOrder: [
    "assets/photo-suit-pose.png",
    "assets/photo-grad.png",
    "assets/photo-suit.png",
    "assets/photo-degree-looking.png"
  ],

  quickFacts: [
    "Coffee ≫ Tea",
    "Builds in React, Angular, PHP & Go",
    "Shipped 20+ products across client, university & startup work",
    "Dockerizes everything"
  ]
};

window.RK = RK;
