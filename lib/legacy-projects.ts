export type CaseStudy = { title: string; status: string; subtitle: string; challenge: string; approach: string; solution: string; outcome: string };
export type Project = CaseStudy & { slug: string; category: string; description: string; year: string };

export const projects: readonly Project[] = [
  {
    "title": "Bar OS Dashboard",
    "status": "Active Development",
    "subtitle": "Operations, finance and reporting platform",
    "challenge": "Managing multiple venues requires visibility across sales, labour costs, purchasing, supplier performance and profitability. Existing reporting processes relied on manually reviewing spreadsheets and gathering information from multiple sources, making it difficult to identify trends and make timely decisions.",
    "approach": "The platform was designed around the operational workflows used in day-to-day venue management. Rather than recreating traditional accounting reports, the system focuses on the metrics most relevant to operational decision-making.",
    "solution": "Bar OS combines financial, operational and purchasing data into a single dashboard experience. Features include revenue tracking, labour monitoring, purchasing analysis, supplier intelligence, margin reporting, comparative performance views and data quality monitoring.",
    "outcome": "The result is a platform that improves visibility, supports decision-making and reduces time spent compiling reports.",
    "slug": "bar-os",
    "category": "Interface System",
    "description": "Hospitality operating dashboard for revenue, costs, suppliers, margins and management overview.",
    "year": "2026"
  },
  {
    "title": "Rummy 500",
    "status": "Active Development",
    "subtitle": "Cross-device score tracking application",
    "challenge": "Traditional scorekeeping methods create friction during gameplay. Paper score sheets are difficult to share, error-prone and impossible to synchronise between devices.",
    "approach": "The project focused heavily on interaction design and usability. Every action was evaluated through the lens of reducing friction and minimising interruptions to gameplay.",
    "solution": "Features include live score tracking, multi-player support, round history, undo functionality, game statistics and cross-device synchronisation.",
    "outcome": "The project demonstrates product thinking, interaction design and real-time application architecture while solving a specific user problem through thoughtful UX design.",
    "slug": "rummy-500",
    "category": "Product UI",
    "description": "Cross-device score tracking and game management application.",
    "year": "2026"
  },
  {
    "title": "Product Dashboard",
    "status": "Live",
    "subtitle": "Pricing and supplier intelligence",
    "challenge": "Product information was fragmented across multiple systems and spreadsheets, making it difficult to compare pricing, identify opportunities and maintain consistency.",
    "approach": "The platform was designed around quick access to information and efficient search workflows. Visual hierarchy and information density were carefully balanced to support fast decision-making.",
    "solution": "Features include product search, supplier comparison, pricing analysis, cost breakdowns and purchasing intelligence.",
    "outcome": "The dashboard provides a central source of truth for product information and purchasing decisions.",
    "slug": "product-dashboard",
    "category": "Dashboard",
    "description": "Pricing, supplier and purchasing intelligence platform.",
    "year": "2026"
  },
  {
    "title": "Employee App",
    "status": "Concept",
    "subtitle": "Internal hospitality operations platform",
    "challenge": "Operational information is often spread across messaging platforms, documents and informal communication channels.",
    "approach": "The application was designed as a single destination for employees, combining communication, documentation and operational workflows within a mobile-first experience.",
    "solution": "Features include news and updates, employee handbook, task management, inventory tools, shift information and internal communication.",
    "outcome": "The project explores how internal software can improve operational consistency and employee experience.",
    "slug": "employee-app",
    "category": "Internal Platform",
    "description": "Internal hospitality operations and communication platform.",
    "year": "2026"
  },
  {
    "title": "Portfolio Website",
    "status": "Live",
    "subtitle": "Design system, typography and interaction design",
    "challenge": "Most portfolio websites prioritise visual effects over clarity. The goal was to create a site that feels distinctive while maintaining a strong focus on content and readability.",
    "approach": "The design process centred around typography, layout systems, motion principles and visual hierarchy.",
    "solution": "Features include a custom design system, responsive layouts, motion design, parallax interactions and a reusable case study framework.",
    "outcome": "The portfolio serves as both a showcase of projects and a demonstration of design, development and product thinking.",
    "slug": "portfolio",
    "category": "Web Design",
    "description": "Design system, typography and interaction design.",
    "year": "2026"
  }
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectNeighbours(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) return undefined;
  return { previous: projects[(index - 1 + projects.length) % projects.length], next: projects[(index + 1) % projects.length] };
}
