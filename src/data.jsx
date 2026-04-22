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
    Backend: ["Node.js", "Express", "Java", "PHP", "Python"],
    "Database & Cloud": ["MongoDB", "MySQL", "Firebase", "AWS", "GCP", "Docker"],
    Design: ["Figma", "Adobe Suite", "UX research", "Prototyping"],
    Tools: ["Git", "GitHub Actions", "Jira", "Notion", "VS Code", "Android Studio"]
  },

  // Flagship featured projects
  projects: [
    {
      id: "roometry", name: "Roometry3D", tag: "Immersive 3D Interior Design",
      color: "mint", stack: ["React", "Three.js", "Firebase", "Node.js"],
      body: "Real-time 3D web app for designers, clients and furniture specialists to visualize and edit interior spaces with photorealistic lighting.",
      link: "https://github.com/Shaveen-Balasooriya/Roometry3D", icon: "🪑"
    },
    {
      id: "fmt", name: "First Mineral Title", tag: "Leon County Deed Search, Texas",
      color: "sky", stack: ["Angular", "TypeScript", "Java", "Docker"],
      body: "Indexing, search & management across 1.8M+ official deed records. Powerful filters, real-time previews, built for scale.",
      link: "#", icon: "📜"
    },
    {
      id: "docassist", name: "Doc-Assist Pro", tag: "Modern Healthcare Assistant",
      color: "pink", stack: ["React Native", "Angular", "Node.js", "Docker"],
      body: "Full-stack healthcare platform with patient & doctor mobile apps, admin portal, AI doctor-recommendations and smart scheduling.",
      link: "https://github.com/KADRDulmin/Doc-Assist-Pro", icon: "🩺"
    },
    {
      id: "literanet", name: "LiteraNet", tag: "Smart Library Management",
      color: "lav", stack: ["MongoDB", "Express", "Angular", "Node.js"],
      body: "Full-stack MEAN-stack library platform with Docker-based deployment and a clean, modern UX.",
      link: "#", icon: "📚"
    },
    {
      id: "busbox", name: "Bus Black Box", tag: "IoT Bus Safety System",
      color: "peach", stack: ["IoT", "Mobile", "Firebase"],
      body: "A black-box & security system for public buses — paired mobile app plus hardware logger.",
      link: "https://github.com/KADRDulmin/Bus-Black-Box-Mobile-App", icon: "🚌"
    },
    {
      id: "edustay", name: "EduStay", tag: "Student Housing Near NSBM",
      color: "yellow", stack: ["Web", "PHP", "MySQL"],
      body: "Bridges NSBM Green University students and nearby accommodation options around campus.",
      link: "https://github.com/KADRDulmin/EduStay", icon: "🏠"
    },
    {
      id: "vday", name: "2026 V-Day", tag: "Playful web micro-site",
      color: "pink", stack: ["HTML", "CSS", "JS"],
      body: '"Will you be my valentine?" — a playful Yes/No web experience with escape-the-button antics.',
      link: "https://github.com/KADRDulmin/2026-vday", icon: "💌"
    }
  ],

  // Projects built during tenure at NSBM Green University (from nsbm-dev-team org)
  nsbmProjects: [
    { name: "ExamTrack", body: "Exam scheduling & tracking system for academic staff — manage sittings, invigilation & results.", icon: "📝", color: "yellow" },
    { name: "NSBM RAG Bot", body: "Retrieval-augmented AI assistant answering student questions from university knowledge bases.", icon: "🤖", color: "mint" },
    { name: "NDB–NSBM", body: "Partner banking integration portal connecting NSBM services with NDB systems.", icon: "🏦", color: "sky" },
    { name: "Student Portal", body: "Central student dashboard — profile, courses, timetable, results, notices & quick actions.", icon: "🎓", color: "pink" },
    { name: "NSBM Registration App", body: "Enrollment & registration app for new intakes with document upload and payment flow.", icon: "🧾", color: "lav" },
    { name: "Faculty Letter System", body: "Automates generation, approval and issuance of official faculty letters.", icon: "✉️", color: "peach" },
    { name: "NSBM Mobile App", body: "Public-facing mobile app for students — announcements, timetables, events & campus info.", icon: "📱", color: "yellow" },
    { name: "Research Portal", body: "Publication & research management hub for faculty — submissions, tracking, analytics.", icon: "🔬", color: "mint" },
    { name: "Lunch Ordering System (Web)", body: "Canteen pre-order website — browse menus, place orders, pay from the portal.", icon: "🍱", color: "sky" },
    { name: "Canteen Lunch App", body: "Mobile companion for canteen pre-ordering with collection slots & notifications.", icon: "🥡", color: "pink" },
    { name: "Canteen Lunch Ordering Site", body: "Admin + student site for lunch pre-orders with real-time kitchen queue.", icon: "🍜", color: "lav" },
    { name: "NSBM Job Portal", body: "Campus careers board connecting students and alumni with employer opportunities.", icon: "💼", color: "peach" },
    { name: "Internal Exam Payments", body: "Secure portal for students to pay exam-related fees with reconciliation.", icon: "💳", color: "yellow" },
    { name: "Predatory Journals Search", body: "Search engine helping researchers identify and avoid predatory academic journals.", icon: "🛡️", color: "mint" },
    { name: "Enrollment Predictor", body: "ML tool forecasting enrollment numbers from historical intake patterns.", icon: "📈", color: "sky" },
    { name: "Enroll-Now Portal", body: "Self-service enrollment portal for incoming students with guided steps.", icon: "✅", color: "pink" },
    { name: "Library Management Portal", body: "Catalogue, borrowing, reservations & fines for the NSBM library.", icon: "📚", color: "lav" },
    { name: "NSBM Intranet Portal", body: "Single internal hub aggregating university apps, notices and staff tools.", icon: "🏛️", color: "peach" },
    { name: "Degree Analysis", body: "Analytics dashboard visualizing student performance and degree outcomes.", icon: "📊", color: "yellow" },
    { name: "Student Identification App", body: "Digital student ID with QR verification for campus access and services.", icon: "🆔", color: "mint" },
    { name: "Semester Timetable", body: "Timetable builder & viewer for students and lecturers with conflict checking.", icon: "🗓️", color: "sky" },
    { name: "IntraServe", body: "Internal service-request system for staff — IT, maintenance, admin requests.", icon: "🛠️", color: "pink" },
    { name: "Exam Management", body: "End-to-end exam ops — papers, halls, invigilators and results workflow.", icon: "🧮", color: "lav" },
    { name: "Survey Report Generator", body: "Generate polished PDF/CSV reports from survey data automatically.", icon: "📑", color: "peach" },
    { name: "ASE NSBM Website", body: "Official site for the Association of Software Engineering chapter at NSBM.", icon: "🌐", color: "yellow" }
  ],

  heroPhotoOrder: [
    "assets/photo-suit-pose.png",
    "assets/photo-grad.png",
    "assets/photo-suit.png",
    "assets/photo-degree-looking.png"
  ],

  quickFacts: [
    "Coffee ≫ Tea",
    "Builds in React, Angular & Three.js",
    "Shipped 20+ internal campus tools",
    "Dockerizes everything twice"
  ]
};

window.RK = RK;
