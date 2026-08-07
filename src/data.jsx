// Public portfolio content. Claims are controlled by docs/portfolio-evidence.md.
const RK = {
  name: "Raminda Kariyawasam",
  short: "Raminda",
  handle: "@KADRDulmin",
  role: "Full-Stack Software Engineer",
  currentRole: "Associate Software Engineer",
  at: "NSBM Green University",
  location: "Sri Lanka",
  email: "raminda5575@gmail.com",
  phone: "+94 75-870 29 22",
  website: "https://www.ramindak.com",
  linkedin: "https://www.linkedin.com/in/raminda-dulmin/",
  github: "https://github.com/KADRDulmin",
  portfolioSource: "https://github.com/KADRDulmin/RamindaKariyawasam",

  heroThesis: "Full-stack software engineer building AI-enabled university platforms, optimization systems, secure enterprise applications, and production infrastructure.",
  heroSupport: "At NSBM Green University, I work across TypeScript and Node.js, PHP, Java and Spring, Python, databases, cloud infrastructure, and the operational details that turn features into dependable systems.",

  about: [
    "I am a Software Engineering graduate from the University of Plymouth and an Associate Software Engineer at NSBM Green University.",
    "My work spans AI assistants, retrieval systems, constraint optimization, student and staff workflows, enterprise Java applications, mobile clients, databases, deployment, observability, and security controls.",
    "I care about the seams: identity crossing a service boundary, a solver returning an explainable conflict, a private tool refusing unsafe input, and a release that can be operated after it ships."
  ],

  timeline: [
    { year: "2025 - present", title: "Associate Software Engineer", place: "NSBM Green University", body: "Built as part of the NSBM development team across university platforms, AI integrations, optimization systems, and internal operations." },
    { year: "2022 - 2023", title: "UI Developer Intern", place: "Iplay Global", body: "Frontend implementation and API integration for client web work." },
    { year: "2020 - 2022", title: "Developer", place: "Infigo Developers", body: "Client websites and early React and Angular work in a startup environment." },
    { year: "2022 - 2025", title: "BSc (Hons) Software Engineering", place: "University of Plymouth, UK", body: "Graduated in 2025." },
    { year: "2020 - 2021", title: "IT Foundation Programme", place: "NSBM Green University, Sri Lanka" }
  ],

  quickFacts: [
    "I work comfortably from interface state to database and deployment boundaries.",
    "My recent focus is controlled AI: grounded retrieval, authenticated tools, and measurable usage.",
    "I enjoy constraint systems where correctness matters more than a plausible-looking answer.",
    "Private university and client code stays private; public claims here are source-checked."
  ],

  skills: {
    "AI & Optimization": ["Gemini function calling", "RAG / File Search", "OR-Tools CP-SAT", "Prompt and tool controls", "Local speech design"],
    "Frontend": ["React", "Next.js", "Angular", "TypeScript", "Flutter", "Responsive UI", "Accessibility"],
    "Backend & APIs": ["Node.js", "NestJS", "Express", "Java", "Spring Boot", "PHP", "Python", "FastAPI"],
    "Data & Security": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Entra ID", "OAuth / JWT", "RBAC", "Audit trails"],
    "Operations": ["Docker", "GitHub Actions", "AWS", "Linux", "Apache / Nginx", "Sentry", "Migrations", "Observability"]
  },

  projectCategories: [
    { id: "all", label: "All" },
    { id: "featured", label: "Featured" },
    { id: "nsbm", label: "NSBM systems" },
    { id: "ai", label: "AI & optimization" },
    { id: "node", label: "Node / TypeScript" },
    { id: "java", label: "Java / enterprise" },
    { id: "php", label: "PHP systems" },
    { id: "mobile", label: "Mobile / IoT" },
    { id: "independent", label: "Client / startup / personal" }
  ],

  resumeOptions: [
    { id: "original", label: "Original", note: "General full-stack profile", file: "/uploads/Resume - Raminda Kariyawasam.pdf" },
    { id: "node", label: "Node.js / TypeScript", note: "Backend, realtime, and typed systems", file: "/uploads/Resume - Raminda Kariyawasam - NodeJS TypeScript.pdf" },
    { id: "ai", label: "AI Full Stack", note: "RAG, agentic tools, and optimization", file: "/uploads/Resume - Raminda Kariyawasam - AI Full Stack.pdf" },
    { id: "java", label: "Java Enterprise", note: "Spring, data workflows, and enterprise UI", file: "/uploads/Resume - Raminda Kariyawasam - Java Enterprise.pdf" }
  ],

  projects: [
    {
      id: "greenmate", name: "UMIS Student Portal / GreenMate AI", tagline: "Authenticated AI inside a university platform",
      summary: "A Next.js student portal with a Gemini assistant that can answer questions and call controlled university-data tools without accepting identity from the model.",
      role: "Associate Software Engineer", organization: "NSBM Green University development team", period: "2025 - present", status: "Implemented", featured: true,
      categories: ["featured", "nsbm", "ai", "node"], capabilities: ["Agentic AI", "SSO", "PWA", "Usage accounting"], color: "mint", icon: "robot",
      stack: ["Next.js 16", "React 19", "TypeScript", "Gemini", "Auth.js", "MySQL"],
      architecture: ["Next.js student portal", "Authenticated Gemini tool loop", "Read-only university data tools"],
      hardProblems: ["Keep student identity server-owned across every tool call", "Expose only tools enabled by global and per-tool policy", "Persist useful cost and retention signals without weakening session ownership"],
      features: ["Function tools cover profile, results, attendance, schedules, fees, payments, and applications", "Role-gated staff surfaces, PWA behavior, notifications, and migration-backed data access"],
      security: ["Microsoft Entra SSO", "Server-side auth re-checks", "Session ownership", "Input sanitization and rate limiting"],
      operations: ["Prompt, cached, output, and model usage accounting", "Retention-aware active/deleted message handling", "Idempotent database migrations"],
      links: []
    },
    {
      id: "ragbot", name: "NSBM RAG Bot", tagline: "Document-grounded answers for university queries",
      summary: "A framework-free PHP retrieval assistant using Gemini File Search, with an embeddable widget and administrative dataset controls.",
      role: "Associate Software Engineer", organization: "NSBM Green University development team", period: "2025", status: "Implemented; rollout acceptance pending", featured: true,
      categories: ["featured", "nsbm", "ai", "php"], capabilities: ["RAG", "Embeddable widget", "Dataset admin", "Request controls"], color: "sky", icon: "chats-circle",
      stack: ["PHP", "Gemini File Search", "MySQL", "JavaScript", "Python crawler"],
      architecture: ["Floating site widget", "PHP conversation API", "Gemini managed retrieval store"],
      hardProblems: ["Ground answers in an indexed knowledge base", "Ship one widget across desktop and mobile contexts", "Keep dataset sync and usage visible to operators"],
      features: ["Desktop popup, mobile full-screen mode, and isolated iframe UI", "Dataset upload/management, session archive, transcripts, and usage reporting"],
      security: ["HMAC-signed requests", "Origin allowlist", "Sanitization", "Database-backed rate limiting"],
      operations: ["Managed retrieval-store uploads and metadata", "Crawler-assisted content preparation", "Final live knowledge-base acceptance remains an operator step"],
      links: []
    },
    {
      id: "timetable-gen2", name: "Timetable Generator Gen2", tagline: "Constraint-solved semester timetabling",
      summary: "A full-semester timetable and hall-allocation system using OR-Tools CP-SAT behind a private compute boundary.",
      role: "Associate Software Engineer", organization: "NSBM Green University development team", period: "2025", status: "Implemented", featured: true,
      categories: ["featured", "nsbm", "ai", "node"], capabilities: ["Constraint optimization", "RBAC", "Conflict handling", "Service isolation"], color: "lav", icon: "calendar-dots",
      stack: ["Next.js 15", "TypeScript", "Python", "FastAPI", "OR-Tools", "MySQL"],
      architecture: ["Next.js UI and orchestration", "Private FastAPI compute service", "Read-only UMIS + isolated app database"],
      hardProblems: ["Encode documented academic, lecturer, room, and time constraints", "Optimize a complete semester instead of a single placement", "Return explicit conflicts rather than silently overwriting allocations"],
      features: ["Lecturer workload planning and registrar generation workflow", "Public aggregate hall-utilization view and oversight roles"],
      security: ["Microsoft Entra authentication", "Role-based access", "Private service secret", "Read-only source-system access"],
      operations: ["PM2 and Apache deployment path", "Solver/API tests and CI/CD documentation", "HTTP 409 collision responses"],
      links: []
    },
    {
      id: "us-deed", name: "US Deed Management", tagline: "Multi-county deed workflow prototype",
      summary: "Two Angular portals and a Spring Boot foundation for deed search, saved research, record administration, and bulk-ingestion workflows.",
      role: "Full-Stack Engineer", organization: "Leon Mineral Abstract client team", period: "2025 - present", status: "Prototype / active development", featured: true,
      categories: ["featured", "java", "independent"], capabilities: ["Enterprise search", "Bulk workflow", "Schema evolution", "Dual portals"], color: "peach", icon: "scroll",
      stack: ["Angular 21", "TypeScript", "Spring Boot 4", "Java 21", "MySQL", "Liquibase"],
      architecture: ["Public research portal", "Administrative portal", "Spring Boot backend foundation"],
      hardProblems: ["Model a detailed multi-field deed search", "Keep long-running CSV ingestion understandable in the interface", "Evolve a county-oriented domain without claiming unfinished integrations"],
      features: ["Search UI, saved searches, run sheets, column controls, PDF workflow, and CSV progress UI", "Backend domain, migration, service, and deployment foundations"],
      security: ["Firebase authentication flow in the portals", "Role-oriented administration foundation"],
      operations: ["Build and deployment workflows are present", "Production integration and deployment remain in progress"],
      links: []
    },
    {
      id: "umis2", name: "UMIS 2.0", tagline: "University platform foundation and master architecture",
      summary: "An implemented Next.js/NestJS platform foundation paired with a broader specification for a shared university identity, services, storage, and audit model.",
      role: "Software Engineer / architecture contributor", organization: "NSBM Green University development team", period: "2025 - present", status: "Foundation in development",
      categories: ["nsbm", "node", "java"], capabilities: ["Platform architecture", "Service boundaries", "Shared auth", "Specification"], color: "yellow", icon: "buildings",
      stack: ["Next.js 14", "NestJS", "PostgreSQL", "Drizzle", "Redis", "MinIO", "Docker"],
      architecture: ["Student and staff frontends", "NestJS domain services", "PostgreSQL, Redis, and object storage"],
      hardProblems: ["Create reusable identity and authorization foundations", "Separate current code from a much larger future roadmap"],
      features: ["Implemented monorepo scaffolding, shared auth packages, services, frontends, and local infrastructure", "Master specifications cover future academic and administrative domains"],
      security: ["Shared authentication and RBAC foundations", "Security and audit requirements in the architecture set"],
      operations: ["Docker Compose development environment", "Future modules are labelled specification, not shipped product"],
      links: []
    },
    {
      id: "examtrack", name: "ExamTrack", tagline: "Internal examination operations",
      summary: "A PHP examination-management system covering schedules, halls, seating, identity checks, attendance, incidents, admissions, and reports.",
      role: "Associate Software Engineer", organization: "NSBM Green University development team", period: "2025", status: "Implemented",
      categories: ["nsbm", "php"], capabilities: ["Exam operations", "Identity checks", "Audit logs", "Reporting"], color: "pink", icon: "exam",
      stack: ["PHP", "MySQL", "LDAP", "JavaScript", "TCPDF"], architecture: ["Role-based web portal", "PHP application services", "MySQL examination records"],
      hardProblems: ["Coordinate halls, seats, schedules, lecturer assignments, and attendance", "Capture offence evidence and rescheduling state without losing traceability"],
      features: ["Student identity/photo verification, attendance, admissions, offence reporting, email, insights, and exports"],
      security: ["LDAP with controlled fallback", "Bcrypt-backed accounts", "Prepared PDO queries", "Role and audit controls"], operations: ["PDF generation", "Email notifications", "Operational reporting"], links: []
    },
    {
      id: "enroll-now", name: "Enroll-Now Portal", tagline: "Inquiry routing and follow-up workflow",
      summary: "A public inquiry and admissions follow-up system with dynamic programmes, round-robin assignment, call tracking, notes, statuses, and reporting.",
      role: "Associate Software Engineer", organization: "NSBM Green University development team", period: "2025", status: "Implemented",
      categories: ["nsbm", "php"], capabilities: ["Assignment workflow", "Admissions", "Reporting", "Messaging"], color: "mint", icon: "user-plus",
      stack: ["PHP", "MySQL", "Bootstrap", "Chart.js", "Email / SMS"], architecture: ["Public inquiry form", "Assistant workflow portal", "Administrative reporting"],
      hardProblems: ["Distribute inquiries fairly while preserving specialist handling", "Maintain a useful chronological interaction history"],
      features: ["Faculty/program selection, round-robin assignment, calls, notes, bulk reassignment, CSV/PDF, email and SMS"],
      security: ["Session/JWT role checks", "Prepared database queries"], operations: ["Assistant and admin reporting", "Planned features are excluded from the public claim"], links: []
    },
    {
      id: "research-portal", name: "Research Publications Portal", tagline: "Publication submission and review",
      summary: "An LDAP-backed portal for research publication forms, PDF submissions, researcher profiles, DOI metadata, review, and soft deletion.",
      role: "Associate Software Engineer", organization: "NSBM Green University development team", period: "2025", status: "Implemented",
      categories: ["nsbm", "php"], capabilities: ["Dynamic forms", "Document workflow", "LDAP", "Moderation"], color: "sky", icon: "article",
      stack: ["PHP", "MySQL", "LDAP", "PDF uploads", "Email"], architecture: ["Researcher submission UI", "Administrative review", "Publication and profile database"],
      hardProblems: ["Support several publication types without flattening their fields", "Keep document filenames and deletion state consistent"],
      features: ["Publication forms, PDF rename/storage, DOI field, Scholar/ORCID profiles, status emails, and soft delete"],
      security: ["LDAP access", "Server-side validation and PDF type checks"], operations: ["Scopus is recorded metadata, not a claimed API integration"], links: []
    },
    {
      id: "library-portal", name: "Library Management Portal", tagline: "Catalogue, circulation, and room booking",
      summary: "A PHP library portal for catalogue availability, borrowing and overdue state, item condition, study-room reservations, news, and administration.",
      role: "Associate Software Engineer", organization: "NSBM Green University development team", period: "2025", status: "Implemented",
      categories: ["nsbm", "php"], capabilities: ["Catalogue", "Circulation", "Reservations", "OAuth"], color: "lav", icon: "books",
      stack: ["PHP", "MySQL", "Microsoft OAuth", "JavaScript", "WebP"], architecture: ["Student catalogue portal", "Circulation and booking workflows", "Administrative content tools"],
      hardProblems: ["Keep item availability, due state, condition, and room reservations coherent", "Harden user-supplied images for public display"],
      features: ["Search/pagination, borrowing, due/overdue state, conditions, room reservations, news, and administration"],
      security: ["OAuth state checks", "Role controls", "Prepared queries", "MIME validation and WebP conversion"], operations: ["Application-level settings/search caching", "No live Koha integration claim"], links: []
    },
    {
      id: "registration-kiosk", name: "Registration Kiosk", tagline: "Resilient Android kiosk shell",
      summary: "A Flutter Android kiosk that launches on boot, keeps a registration WebView full-screen, and recovers from connectivity loss.",
      role: "Associate Software Engineer", organization: "NSBM Green University development team", period: "2025", status: "Implemented",
      categories: ["nsbm", "mobile"], capabilities: ["Kiosk mode", "Offline recovery", "Boot launch"], color: "peach", icon: "device-mobile",
      stack: ["Flutter", "Dart", "Android", "WebView"], architecture: ["Native kiosk shell", "Registration WebView", "Connectivity monitor"],
      hardProblems: ["Recover a fixed-purpose device cleanly after network loss", "Prevent accidental navigation away from the task"], features: ["Auto-launch, portrait/full-screen mode, retry, reconnect, and kiosk back behavior"], security: [], operations: ["Designed for unattended registration stations"], links: []
    },
    {
      id: "intranet", name: "NSBM Intranet", tagline: "Role-aware internal application hub",
      summary: "An internal PHP hub that organizes applications and navigation by department and role, with account and department administration.",
      role: "Associate Software Engineer", organization: "NSBM Green University development team", period: "2025", status: "Implemented",
      categories: ["nsbm", "php"], capabilities: ["Internal portal", "Role navigation", "Administration"], color: "yellow", icon: "squares-four",
      stack: ["PHP", "MySQL", "OAuth", "JavaScript"], architecture: ["Authenticated hub", "Department/role navigation", "Application directory"],
      hardProblems: ["Present different operational tools without exposing irrelevant navigation"], features: ["Application aggregation, user management, and controlled department switching"], security: ["OAuth/session checks", "Department and role controls"], operations: [], links: []
    },
    {
      id: "job-portal", name: "NSBM Job Portal", tagline: "Student recruitment workflow",
      summary: "A PHP portal for job listings, student applications, CV attachments, notifications, and administrative review.",
      role: "Associate Software Engineer", organization: "NSBM Green University development team", period: "2025", status: "Implemented",
      categories: ["nsbm", "php"], capabilities: ["Recruitment", "File workflow", "Email"], color: "mint", icon: "briefcase",
      stack: ["PHP", "MySQL", "PHPMailer", "Composer"], architecture: ["Student job portal", "Application workflow", "Administrative review"],
      hardProblems: ["Keep applicant documents and application state connected across review"], features: ["Listings, applications, CV attachments, email, and administrative controls"], security: ["Session/role controls", "Upload validation"], operations: ["Email delivery"], links: []
    },
    {
      id: "timetable-gen1", name: "Timetable Generator Gen1", tagline: "Genetic-algorithm predecessor",
      summary: "The first-generation university timetabling system, using a genetic algorithm behind a React/TypeScript and PHP application.",
      role: "Associate Software Engineer", organization: "NSBM Green University development team", period: "2025", status: "Implemented predecessor",
      categories: ["nsbm", "ai", "php"], capabilities: ["Genetic algorithm", "Timetabling", "Relational modeling"], color: "pink", icon: "calendar-check",
      stack: ["React", "TypeScript", "PHP", "MySQL", "Genetic algorithm"], architecture: ["React planning UI", "PHP backend", "Relational timetable data"],
      hardProblems: ["Search a large timetable solution space before the CP-SAT redesign"], features: ["Planning, generation, and timetable presentation"], security: [], operations: ["Presented as Gen2's predecessor, not a duplicate current system"], links: []
    },
    {
      id: "lunch-ordering", name: "Campus Lunch Ordering", tagline: "Staff ordering and canteen fulfilment",
      summary: "A Flutter and PHP workflow for staff lookup, attendance validation, lunch ordering, fulfilment confirmation, and order history.",
      role: "Software Engineer", organization: "NSBM development team project", period: "2024", status: "Implemented",
      categories: ["nsbm", "php", "mobile"], capabilities: ["Mobile workflow", "Attendance validation", "Order state"], color: "sky", icon: "fork-knife",
      stack: ["Flutter", "Dart", "PHP", "MySQL", "Secure storage"], architecture: ["Staff mobile client", "Ordering API", "Canteen fulfilment workflow"],
      hardProblems: ["Connect staff identity and attendance to an order without slowing fulfilment"], features: ["EPF lookup, attendance check, ordering, confirmation, and history"], security: ["Stored-session controls"], operations: ["Canteen-facing order handling"], links: []
    },
    {
      id: "boc-payment", name: "BOC Payment Portal", tagline: "Hosted-checkout integration workflow",
      summary: "A Next.js payment portal that creates and verifies hosted-checkout sessions, records transaction state, and produces email receipts.",
      role: "Associate Software Engineer", organization: "NSBM Green University development team", period: "2025", status: "Implemented integration",
      categories: ["nsbm", "node"], capabilities: ["Payments", "Session state", "Validation", "Receipts"], color: "lav", icon: "credit-card",
      stack: ["Next.js 14", "TypeScript", "MySQL", "Zod", "Nodemailer", "iron-session"], architecture: ["Payment form", "Server-side checkout routes", "Transaction and receipt records"],
      hardProblems: ["Reconcile browser return state with server-side verification"], features: ["Checkout creation, verification, receipts, and email"], security: ["Server-side schema validation", "Protected session state"], operations: ["Transaction and email records"], links: []
    },
    {
      id: "sdg-widget", name: "SDG Widget", tagline: "Accessible dependency-free Web Component",
      summary: "A configurable Sustainable Development Goals widget with Shadow DOM isolation, responsive layout, keyboard access, and reduced-motion behavior.",
      role: "Software Engineer", organization: "NSBM development team project", period: "2025", status: "Implemented",
      categories: ["nsbm", "node"], capabilities: ["Web Component", "Accessibility", "Responsive UI"], color: "peach", icon: "globe-hemisphere-west",
      stack: ["JavaScript", "Web Components", "Shadow DOM", "CSS"], architecture: ["Custom element", "Shadow DOM styles", "Configurable goal data"],
      hardProblems: ["Embed safely into unrelated pages without CSS collisions"], features: ["Responsive grid, canonical link fallback, labels, focus behavior, and motion preference support"], security: [], operations: ["Dependency-free distribution"], links: []
    },
    {
      id: "landman", name: "LandMan For A Day", tagline: "Mineral-rights service marketplace",
      summary: "Separate Angular user and admin portals over a Spring Boot API for jobs, qualification review, assignments, and account workflows.",
      role: "Full-Stack Engineer", organization: "Title Data Design client team", period: "2025", status: "Active development",
      categories: ["java", "independent"], capabilities: ["Marketplace", "Dual portals", "JWT", "Docker"], color: "mint", icon: "map-trifold",
      stack: ["Angular 19", "Spring Boot", "Java", "PostgreSQL", "JWT", "Docker"], architecture: ["User portal", "Administrative portal", "Spring Boot REST API"],
      hardProblems: ["Coordinate qualification, job, and assignment state across two audiences"], features: ["Job posting/search, registration, verification, user administration, assignments, and dashboard UI"],
      security: ["JWT authentication", "Route guards and interceptors"], operations: ["Docker Compose and deployment descriptors", "Presented as active development"], links: []
    },
    {
      id: "influencelk", name: "InfluenceLK", tagline: "White-label creator marketplace",
      summary: "A NestJS and Next.js marketplace foundation with escrow/wallet state, runtime branding, real-time chat and presence, and WebRTC calls.",
      role: "Founder / Full-Stack Engineer", organization: "Startup team", period: "2025 - present", status: "Product foundation implemented",
      categories: ["node", "independent"], capabilities: ["Realtime", "WebRTC", "Escrow ledger", "White-label"], color: "pink", icon: "handshake",
      stack: ["NestJS 11", "Next.js 16", "TypeScript", "PostgreSQL", "Socket.IO", "WebRTC"], architecture: ["Next.js marketplace", "NestJS modular monolith", "PostgreSQL and realtime gateway"],
      hardProblems: ["Keep escrow holds, release, refund, and disputes legible", "Negotiate peer calls safely when both sides can initiate", "Apply brand settings at runtime"],
      features: ["Wallet/escrow flows, real-time messages, typing, read/presence events, admin settings, and WebRTC perfect negotiation"],
      security: ["Authenticated socket connection", "Role-oriented administration"], operations: ["Database-driven runtime configuration"], links: []
    },
    {
      id: "kitchenpal", name: "KitchenPal", tagline: "Multi-client food-waste workflow",
      summary: "A Node, Angular, Flutter, and PostgreSQL system for stock batches, expiry alerts, recipe suggestions, approvals, sales deduction, and analytics.",
      role: "Full-Stack Engineer", organization: "Team project", period: "2025", status: "Implemented",
      categories: ["node", "mobile", "independent"], capabilities: ["Inventory", "Realtime alerts", "FIFO", "Multi-client"], color: "yellow", icon: "cooking-pot",
      stack: ["Node.js", "Express", "Angular 20", "Flutter", "PostgreSQL", "Socket.IO"], architecture: ["Flutter staff client", "Angular administration", "Express API and PostgreSQL"],
      hardProblems: ["Deduct ingredient batches in FIFO order", "Coordinate expiry alerts and approval state across clients"],
      features: ["Inventory batches, notifications, recipe suggestions, discount approval, sales deduction, and analytics"],
      security: ["JWT roles", "Helmet", "Validation middleware"], operations: ["Docker Compose", "Backend and client CI workflows"], links: []
    },
    {
      id: "planzevo", name: "PlanzEvo", tagline: "Multi-portal event-planning platform",
      summary: "An in-development event-planning platform spanning Angular/Nx portals, Go service foundations, shared vendor capabilities, and a Next.js marketing application.",
      role: "Founder / Full-Stack Engineer", organization: "Startup team", period: "2025 - present", status: "Active development",
      categories: ["node", "independent"], capabilities: ["Multi-portal", "Typed contracts", "Event architecture", "Marketing"], color: "sky", icon: "confetti",
      stack: ["Angular 21", "Nx", "Go", "PostgreSQL", "AWS CDK", "Next.js 16"], architecture: ["Angular portal monorepo", "Go service foundations", "Next.js marketing and waitlist"],
      hardProblems: ["Share a design and API contract across several event domains", "Keep active product development distinct from public promises"],
      features: ["Corporate, party, tickets, vendor, and wedding portal foundations with generated API contracts"],
      security: ["Entitlement and role guard foundations"], operations: ["Sentry integration", "Firebase hosting/deployment configuration", "Clearly labelled active development"], links: []
    },
    {
      id: "doc-assist", name: "Doc-Assist Pro", tagline: "Multi-client healthcare workflow",
      summary: "A public team project combining a Node/Express API, PostgreSQL, patient and doctor React Native clients, and an Angular admin portal.",
      role: "Full-Stack Developer", organization: "Academic team project", period: "2024", status: "Implemented team project",
      categories: ["node", "mobile", "independent"], capabilities: ["Appointments", "Recommendation workflow", "Multi-client", "Docker"], color: "lav", icon: "first-aid",
      stack: ["Node.js", "Express", "PostgreSQL", "React Native", "Angular", "Docker"], architecture: ["Patient client", "Doctor client and admin portal", "Node API and PostgreSQL"],
      hardProblems: ["Serve patient, doctor, and administrator workflows from one backend"], features: ["Appointments, medical records, prescriptions, doctor recommendation, and administration"],
      security: ["JWT-backed API flow"], operations: ["Docker Compose environment"],
      links: [{ label: "Public source", url: "https://github.com/KADRDulmin/Doc-Assist-Pro" }]
    },
    {
      id: "literanet", name: "LiteraNet", tagline: "Realtime smart-library platform",
      summary: "An Angular and Node team project for catalogue, reservations, loans, notifications, branch administration, and analytics.",
      role: "Full-Stack Developer", organization: "Academic team project", period: "2024", status: "Implemented team project",
      categories: ["node", "independent"], capabilities: ["Realtime", "Library workflow", "Load testing", "Docker"], color: "peach", icon: "book-open-text",
      stack: ["Angular 19", "Node.js", "Express", "MongoDB", "Socket.IO", "Docker"], architecture: ["Angular patron/admin UI", "Express API and realtime layer", "MongoDB and S3 assets"],
      hardProblems: ["Keep loans, due dates, reservations, and notifications coherent"], features: ["Catalogue, reservations, dashboards, realtime notifications, branches, staff, and analytics"],
      security: ["JWT authentication and access controls"], operations: ["Docker Compose", "k6 load-test assets", "Built as a team"],
      links: []
    },
    {
      id: "edustay", name: "EduStay", tagline: "Student accommodation marketplace",
      summary: "A public PHP team project connecting students, landlords, wardens, and administrators around accommodation listings and reservations.",
      role: "Full-Stack Developer", organization: "Academic team project", period: "2023", status: "Implemented team project",
      categories: ["php", "independent"], capabilities: ["Listings", "Reservations", "Map UI", "Role workflows"], color: "mint", icon: "house-line",
      stack: ["PHP", "MySQL", "JavaScript", "Maps"], architecture: ["Student and landlord portal", "Warden approval workflow", "PHP/MySQL application"],
      hardProblems: ["Coordinate listing approval and reservation state across four roles"], features: ["Property CRUD, images, map browsing, warden validation, reservations, and administration"], security: ["Role-oriented login flows"], operations: [],
      links: [{ label: "Public source", url: "https://github.com/KADRDulmin/EduStay" }]
    },
    {
      id: "bus-black-box", name: "Bus Black Box", tagline: "IoT safety and telemetry prototype",
      summary: "A paired Flutter and embedded-system team project for bus location and sensor telemetry using Firebase-backed data exchange.",
      role: "Mobile / IoT Developer", organization: "Academic team project", period: "2024", status: "Implemented prototype",
      categories: ["mobile", "independent"], capabilities: ["IoT", "Telemetry", "Flutter", "Firebase"], color: "pink", icon: "bus",
      stack: ["Flutter", "Dart", "Firebase", "NodeMCU", "GPS", "Sensors"], architecture: ["Embedded sensor device", "Firebase telemetry", "Flutter monitoring client"],
      hardProblems: ["Bring location, speed, motion, and hazard signals into one prototype workflow"], features: ["Mobile monitoring client and embedded safety-system prototype"], security: [], operations: ["Academic prototype with documented system tests"],
      links: [
        { label: "Mobile source", url: "https://github.com/KADRDulmin/Bus-Black-Box-Mobile-App" },
        { label: "IoT source", url: "https://github.com/KADRDulmin/BUS-BLACK-BOX-SECURITY-SYSTEM" }
      ]
    }
  ],

  heroPhotoOrder: [
    { src: "assets/photo-suit.png", width: 408, height: 612, alt: "Raminda Kariyawasam in a suit - professional portrait" },
    { src: "assets/photo-grad.png", width: 408, height: 612, alt: "Raminda Kariyawasam at the University of Plymouth graduation ceremony in 2025" },
    { src: "assets/photo-suit-pose.png", width: 408, height: 612, alt: "Raminda Kariyawasam in a suit" },
    { src: "assets/photo-degree-looking.png", width: 408, height: 612, alt: "Raminda Kariyawasam holding his degree certificate" }
  ]
};

// Keep the public schema explicit for every record while allowing featured
// projects to opt in where they are declared above.
RK.projects = RK.projects.map((project) => ({ featured: false, ...project }));

window.RK = RK;
