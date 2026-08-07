# Portfolio evidence matrix

This matrix is the claim-control record for the public portfolio and targeted resumes. It records only safe, public-facing conclusions from inspected source trees. Private repositories remain unlinked, and backup folders are not counted as separate projects.

| Project | Context | Evidence inspected | Public treatment | Status / link decision |
| --- | --- | --- | --- | --- |
| UMIS Student Portal / GreenMate AI | NSBM team | `nprofile` architecture and AI-chat domain docs plus route/tool source | Authenticated Gemini function-calling assistant, server-owned student identity, per-tool controls, rate limiting, token/cost accounting, retention-aware chat history | Implemented; private, no source link |
| NSBM RAG Bot | NSBM team | `nsbm-rag-bot` PHP, widget, admin, security, and implementation progress | Gemini File Search grounding, embeddable widget, dataset administration, signed requests, allowlisted origins, database-backed rate limiting | Implemented; knowledge-base rollout/acceptance noted separately; private |
| Timetable Generator Gen2 | NSBM team | `Sem_Timetable_Generation_Gen2` README, architecture, solver, API and deployment docs | Next.js orchestration, isolated FastAPI/OR-Tools CP-SAT compute, documented constraints, read-only UMIS access, collision handling | Implemented; private |
| UMIS 2.0 | NSBM team | `UMIS 2.0` monorepo plus `UMIS-2.0-Docs` architecture/specification set | Distinguishes implemented Next.js/NestJS/PostgreSQL/Redis/MinIO foundation from future system specification | Foundation in development; private |
| ExamTrack | NSBM team | ExamTrack PHP source, schema and workflow code | LDAP/database fallback auth, attendance, halls/seating, identity/photo checks, incidents, schedules, admissions and reporting | Implemented; private |
| Enroll-Now Portal | NSBM team | inquiry-management PHP source and schema | Public inquiries, faculty/program routing, round-robin assignment, call history, notes, status reporting and exports | Implemented; private |
| Research Publications Portal | NSBM team | research-portal PHP source and migrations | LDAP access, publication-type forms, PDF submission, DOI and self-reported Scopus metadata, profile links and moderation | Implemented; private |
| Library Management Portal | NSBM team | library-portal PHP source, schema and authentication/upload code | Catalogue availability, borrowing/due state, condition, rooms, news/admin, Microsoft OAuth and role checks | Implemented; no live Koha-integration claim; private |
| Registration Kiosk | NSBM team | `NSBM-RegistrationApp` Flutter and Android source | Full-screen WebView kiosk, boot launch, portrait mode, offline retry and reconnection | Implemented; private |
| NSBM Intranet | NSBM team | `NSBM-Intranet` PHP source | Department/role navigation, application directory, user administration and department switching | Implemented; private |
| NSBM Job Portal | NSBM team | job-portal PHP source, schema and mail/upload code | Job listings, student applications, CV attachments and administrative workflow | Implemented; private |
| Timetable Generator Gen1 | NSBM team | Gen1 React/TypeScript, PHP and genetic-algorithm source | Earlier genetic-algorithm timetable implementation; presented as predecessor, not duplicated with Gen2 | Implemented predecessor; private |
| Campus Lunch Ordering | NSBM team | Flutter canteen application and PHP companion source | Staff lookup, attendance verification, ordering, fulfilment confirmation and order history | Implemented; private |
| BOC Payment Portal | NSBM team | `ipg-boc` Next.js routes, session, validation, database and hosted-checkout code | Hosted-checkout session/verification workflow and receipt/email handling | Implemented integration; private |
| SDG Widget | NSBM team | Web Component source | Dependency-free Shadow DOM widget with responsive layout, accessibility labels and reduced-motion support | Implemented; private |
| US Deed Management | Client team | `USDeedManagement` README, portals, backend foundation and workflows | Angular multi-county search/admin portals plus Spring Boot/Java foundation; no production/deployment claim | Prototype / active development; private |
| LandMan For A Day | Client team | `landman-for-a-day` portals, Spring Boot source, compose and README | Separate Angular portals over a Spring Boot/PostgreSQL API for landman jobs, qualification and assignment workflows | Active development; private |
| InfluenceLK | Startup/team | NestJS/Next.js source including socket, escrow, wallet, theming and WebRTC modules | Modular backend, runtime white-label settings, escrow ledger states, real-time chat/presence and WebRTC perfect negotiation | Implemented product foundation; private |
| KitchenPal | Team project | `KitchenPal_New` Node, Angular, Flutter, PostgreSQL, Docker and test source | Multi-client inventory, expiry notification, FIFO sales deduction, approval flow and analytics | Implemented team project; private |
| PlanzEvo | Startup/team | Angular/Nx portals, Go services/docs and Next.js marketing application | Multi-portal event-planning platform and shared vendor architecture; presented as in development | Active development; private |
| Doc-Assist Pro | Academic team | Public repository structure and README | Node/Express/PostgreSQL API, two React Native clients, Angular administration, appointments and recommendation workflow | Implemented team project; public repository |
| LiteraNet | Academic team | `C:\xampp\htdocs\LiteraNet` source/README | Angular/Node/MongoDB library workflows, Socket.IO notifications, Docker and k6 assets | Implemented team project; advertised repository is not anonymously accessible, so no link |
| EduStay | Academic team | Public PHP repository and README | Accommodation listings, reservations, map view and landlord/warden/student/admin roles | Implemented team project; public repository |
| Bus Black Box | Academic team | Public Flutter and IoT repositories/documentation | Paired Flutter monitoring client and sensor-based IoT prototype using Firebase-backed telemetry | Implemented prototype; two public repositories |

## Explicitly excluded or softened

- Backup/copy folders are evidence sources only and never separate catalogue entries.
- Applicant Portal and the static student-portal prototype lack enough implementation evidence for a substantive card.
- Payment receipt archives and the incomplete NDB prototype are excluded.
- Unsupported volume, performance, user-count, uptime, revenue and project-total claims are removed.
- US Deed Management is described as a prototype/in-progress system, not a deployed production platform.
- UMIS 2.0 clearly separates implemented foundation from architecture/specification.
- Research Portal does not claim a live Scopus API integration; its Scopus value is user-recorded metadata.
- Library Portal does not claim a live Koha integration.
- NSBM, client and startup repositories are intentionally unlinked.
