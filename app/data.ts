export type Experience = {
  role: string;
  company: string;
  place: string;
  period: string;
  points: string[];
};

export type Project = {
  slug: string;
  title: string;
  period: string;
  img: string;
  /** Real screenshots: show in original colors, without the grayscale and scanline treatment of placeholders. */
  original?: boolean;
  points: string[];
};

export const SITE_TITLE = "Metodius Frenaldy Vasti Valentino | Software Engineer";

export const ROLES = ["Software Engineer", "Full Stack Developer", "AI Enthusiast", "Project Management"];

export const TECH_LOGOS = [
  { slug: "php", name: "PHP" },
  { slug: "laravel", name: "Laravel" },
  { slug: "javascript", name: "JavaScript" },
  { slug: "react", name: "React" },
  { slug: "nextdotjs", name: "Next.js" },
  { slug: "angular", name: "Angular" },
  { slug: "mysql", name: "MySQL" },
  { slug: "tailwindcss", name: "Tailwind CSS" },
  { slug: "nestjs", name: "Nest.js" },
  { slug: "html5", name: "HTML5" },
  { slug: "pwa", name: "Progressive Web Apps" },
];

export const SKILLS = [
  { title: "Backend", span: "md:col-span-5", items: ["PHP", "Laravel", "REST API", "Nest.js"] },
  {
    title: "Frontend",
    span: "md:col-span-7",
    items: ["HTML", "CSS", "JavaScript", "React.js", "Next.js", "Angular", "Tailwind CSS", "PWA"],
  },
  { title: "Database", span: "md:col-span-3", items: ["MySQL", "SQL"] },
  {
    title: "Practices",
    span: "md:col-span-5",
    items: ["SDLC", "Code Review", "AI-Assisted Development", "Client and Stakeholder Communication"],
  },
  {
    title: "Integration",
    span: "md:col-span-4",
    items: ["Third-party API integration", "Idempotency and race-condition handling"],
  },
];

export const EXPERIENCE: Experience[] = [
  {
    role: "IT Tech Lead",
    company: "PT Humobar Global Indonesia",
    place: "Jakarta, Indonesia",
    period: "June 2025 - Present",
    points: [
      "Lead a team of 5 developers in designing, building and maintaining internal ERP systems (inventory, purchasing, financing and HRIS) used by 1,000+ employees.",
      "Assign tasks, give technical direction and run code reviews to keep code quality and development standards consistent.",
      "Work with stakeholders and cross-department teams to turn business requirements into technical solutions.",
      "Cut monthly user-reported issue tickets from 50+ to around 15 (about 70%, excluding new feature requests) by analyzing recurring problems and shipping permanent fixes and optimizations.",
      "Stabilize legacy ERP systems: centralized sales report calculation logic across the system, fixed third-party integration flows (Shopee, Grab, Supplier Portal) for data consistency, and added idempotency controls to prevent race conditions across modules.",
    ],
  },
  {
    role: "Software Engineer",
    company: "PT Humobar Global Indonesia",
    place: "Jakarta, Indonesia",
    period: "Sep 2024 - June 2025",
    points: [
      "Developed and maintained modules of the inventory, purchasing, financing and HRIS systems with Laravel, PHP and Angular on MySQL.",
      "Owned the Supplier Registration (legacy), Promotion Registration (legacy), Resignation Request and Loan modules end to end, from requirements to deployment and maintenance, for 1,000+ users and suppliers, including third-party data integration.",
      "Built user permission management for the HRIS PWA used by different entities of the company.",
      "Gathered requirements directly with other departments and managers, earning the trust to own tasks without management acting as an intermediary.",
    ],
  },
  {
    role: "Full Stack Developer (Internship)",
    company: "PT Sebangku Jaya Abadi",
    place: "Yogyakarta, Indonesia",
    period: "Feb 2024 - Jun 2024",
    points: [
      "Developed the NaZMalogy Learning Management System and the NaZMa Office company profile website as part of a team.",
      "Ran user testing of NaZMalogy with 80 university students.",
      "Deployed NaZMalogy on a VPS to improve site speed and capacity for concurrent access.",
      "Completed the Product Requirement Document (PRD) for NaZMalogy after development.",
    ],
  },
  {
    role: "Junior Research and Consultant TECHNO (Internship)",
    company: "PT Gemilang Media Wisatama",
    place: "Yogyakarta, Indonesia",
    period: "Jul 2023 - Dec 2023",
    points: [
      "Improved the company website appearance and user experience based on team discussions.",
      "Added an e-commerce feature for marketing tour packages, with CRUD for managing tour package data.",
      "Deployed the optimized and new features to hosting.",
      "Served as IT Support (Consultant) for projects with company partners.",
      "Received the Most Contributor award for the Junior Research and Consultant division.",
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    slug: "exhibition-quiz-portal",
    title: "University Exhibition Quiz and Analytics Portal",
    period: "May 2026 - Jun 2026",
    img: "/images/projects/quiz-banner.webp",
    original: true,
    points: [
      "Built a web-based quiz for a university exhibition where high-school students answer questions and receive a suggested study program.",
      "Stored quiz submissions in a database and built an admin portal to view results filtered by school and submission time.",
      "Added dashboard charts showing major distribution per school, for example which majors are most and least popular among students from a given school.",
      "Implemented an export feature so admins can download the submission report as an Excel file.",
    ],
  },
  {
    slug: "blockchain-medical-record",
    title: "Blockchain-Based Electronic Medical Record",
    period: "Aug 2024 - May 2025, lecturer research project",
    img: "/images/projects/medical-banner.webp",
    original: true,
    points: [
      "Developed a prototype electronic medical record system for a lecturer's research, storing patient data on a blockchain so records are transparent, verifiable and tamper-proof.",
      "Implemented patient-controlled access management: other parties such as hospitals or doctors can view the full medical record only with the patient's permission.",
      "Integrated examination, patient scheduling and medical report modules into one centralized system.",
    ],
  },
  {
    slug: "laundry-queue-system",
    title: "Real-Time Self-Service Laundry Queue System",
    period: "Feb 2024 - Jul 2024",
    img: "/images/projects/laundry-banner.webp",
    original: true,
    points: [
      "Built a real-time queue system for self-service laundry, with server-side queue management handled by a Supervisor.",
      "Developed a RESTful API for integration with the front end.",
      "Built a Progressive Web Application (PWA) to improve the daily user experience.",
    ],
  },
  {
    slug: "wedding-invitation",
    title: "Digital Wedding Invitation Website",
    period: "Mar 2024 - May 2024",
    img: "/images/projects/wedding-banner.webp",
    original: true,
    points: [
      "Built a personalised wedding invitation with React and Vite that greets each guest by name, read from the invitation link, on an envelope-style cover.",
      "Designed a scene-by-scene flow, from an opening verse to the couple's profiles and families, with animated transitions and batik-inspired ornaments.",
      "Presented the holy matrimony and reception schedules with venue addresses and direct links to each location on the map.",
      "Deployed the site on Vercel so every guest receives their own shareable link.",
    ],
  },
];
