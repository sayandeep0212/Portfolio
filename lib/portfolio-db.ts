import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

export interface ProjectDoc {
  id?: string;
  title: string;
  desc: string;
  tech: string;
  developersName?: string;
  status?: string;
  period: string;
  tags?: string[];
  github?: string;
  href?: string;
  context?: string;
  order: number;
}

export interface CertificateDoc {
  id?: string;
  title: string;
  issuer: string;
  description?: string;
  year?: string;
  credentialId?: string;
  logo?: string;
  isDarkBox?: boolean;
  order: number;
}

export interface ExperienceDoc {
  id?: string;
  role: string;
  org: string;
  location?: string;
  period: string;
  bullets: string[];
  skills: string[];
  logo?: string;
  order: number;
}

export interface BlogDoc {
  id?: string;
  title: string;
  summary: string;
  tags: string[];
  readTime: string;
  href: string;
  platform: string;
  date: string;
  order: number;
}

export interface GalleryDoc {
  id?: string;
  title: string;
  desc: string;
  date: string;
  location: string;
  tag: string;
  image: string;
  order: number;
}

export interface StoryDoc {
  id?: string;
  storyName?: string;
  caption?: string;
  platform: 'linkedin' | 'instagram' | string;
  mediaUrl: string;
  linkUrl: string;
  duration?: number;
  order: number;
}

export interface ContactDoc {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: number;
  createdAtIso?: string;
  ip?: string;
}

// ==========================================
// DEFAULT SEED DATA (from Portfolio Hardcoded)
// ==========================================

export const DEFAULT_PROJECTS: ProjectDoc[] = [
  {
    title: 'VibeForge 1.0 Hackathon’s Website',
    period: 'Feb 2026 – Present',
    context: 'vibeforge-1-0.tech',
    href: 'https://vibeforge-1-0.tech',
    desc: 'Official website for GameLiminals’ 12-hour inter-college hackathon at Adamas University, with account creation, team registration and Razorpay payments.',
    developersName: 'Developed by Sayandeep Pradhan · Tech Lead',
    tech: 'React.js · Next.js · Razorpay',
    status: 'In Production',
    tags: ['Next.js', 'FinTech', 'Hackathon', 'Razorpay'],
    order: 1,
  },
  {
    title: 'GameLiminals Web Ecosystem & Event Portal',
    period: 'Dec 2025 – Present',
    context: 'gameliminals.vercel.app',
    href: 'https://gameliminals.vercel.app',
    desc: 'Adamas University’s game development club platform: a responsive website, secure event registration, admin dashboard and Python/Streamlit email automation. Mobile app in development.',
    developersName: 'Developed by Sayandeep Pradhan · Technical Lead',
    tech: 'HTML · CSS · Vanilla JavaScript · Next.js · React.js · TypeScript · Tailwind CSS · Python · Streamlit',
    status: 'Active',
    tags: ['Web Platform', 'TypeScript', 'Python', 'Automation'],
    order: 2,
  },
  {
    title: 'Brief AI — The CEO Morning Briefing Platform',
    period: 'Mar 2026 – Apr 2026',
    context: 'briefai.co.in',
    href: 'https://briefai.co.in',
    desc: 'AI-powered briefings for Indian executives and entrepreneurs, combining daily market insights, portfolio tracking, curated news, VC highlights and customizable alerts.',
    developersName: 'Developers: Sayandeep Pradhan, Samiran and Surajit',
    tech: 'JavaScript · Next.js',
    status: 'Beta',
    tags: ['AI SaaS', 'Next.js', 'FastAPI'],
    order: 3,
  },
  {
    title: 'Media Island',
    period: 'Open Source',
    context: 'sayandeep0212/Media-Island',
    github: 'https://github.com/sayandeep0212/Media-Island',
    desc: 'A Windows dynamic-island-style media companion with a Chrome extension, live audio waveforms and playback controls. Includes a mobile remote PWA with Firebase or local Wi-Fi pairing.',
    developersName: 'Designed and developed by Sayandeep Pradhan',
    tech: 'Electron · Chrome Extension · PWA · Firebase',
    status: 'Open Source',
    tags: ['Electron', 'Chrome Extension', 'PWA', 'Desktop'],
    order: 4,
  },
  {
    title: 'SightLine — AI-Assisted Accessibility & Repository Inspector',
    period: 'Team Project',
    context: 'Private project',
    desc: 'A cross-platform developer tool performing automated WCAG accessibility audits, real-time code smells detection, and generating actionable remediation reports.',
    developersName: 'Developers: Sayandeep Pradhan & Collaborators',
    tech: 'Next.js · TypeScript · Python · FastAPI · Tailwind CSS',
    status: 'Completed',
    tags: ['AI', 'Accessibility', 'Python', 'FastAPI'],
    order: 5,
  },
];

export const DEFAULT_CERTIFICATES: CertificateDoc[] = [
  {
    title: 'Oracle AI Database Certified Foundation Associate',
    issuer: 'Oracle',
    logo: '/assets/icons/oracle-logo.svg',
    year: '2026',
    credentialId: 'ORCL-AI-948192',
    description: 'Foundational certification demonstrating expertise in AI Vector Search, Autonomous Database workloads, and cloud database administration.',
    isDarkBox: false,
    order: 1,
  },
  {
    title: 'Cybersecurity Analyst Job Simulation',
    issuer: 'Tata (via Forage)',
    logo: '/assets/icons/tata-logo.svg',
    year: '2025',
    credentialId: 'FORAGE-TATA-7419',
    description: 'Comprehensive simulation focusing on real-world threat analysis, IAM vulnerability triage, vulnerability patching, and SIEM security logging.',
    isDarkBox: false,
    order: 2,
  },
  {
    title: 'Cybersecurity Fundamentals',
    issuer: 'IBM',
    logo: '/assets/icons/ibm-logo.svg',
    year: '2025',
    credentialId: 'IBM-SKILLSBUILD-8219',
    description: 'Core security domains: network penetration vectors, defense-in-depth, cryptography essentials, and incident response lifecycles.',
    isDarkBox: false,
    order: 3,
  },
  {
    title: 'Build Intelligent Chatbots with OpenAI API',
    issuer: 'Skyy Skill Academy',
    logo: '/assets/icons/skyy-logo.svg',
    year: '2025',
    credentialId: 'SKYY-OPENAI-3108',
    description: 'Hands-on engineering curriculum covering OpenAI chat completions, prompt architecture, memory retention, and function calling workflows.',
    isDarkBox: false,
    order: 4,
  },
  {
    title: 'Android Bug Bounty Hunting: Hunt Like a Rat',
    issuer: 'EC-Council',
    logo: '/assets/icons/eccouncil-logo.svg',
    year: '2025',
    credentialId: 'ECC-BB-29104',
    description: 'Mobile vulnerability analysis: reverse engineering APKs, intent spoofing, hardcoded token extraction, and mobile API testing using Frida & Jadx.',
    isDarkBox: true,
    order: 5,
  },
  {
    title: 'HTML & CSS Bootcamp',
    issuer: 'LetsUpgrade',
    logo: '/assets/icons/letsupgrade-logo.svg',
    year: '2024',
    credentialId: 'LU-BOOTCAMP-2024',
    description: 'Comprehensive foundations of responsive layout engineering, flexbox, CSS grid, accessibility, and semantic markup.',
    isDarkBox: false,
    order: 6,
  },
];

export const DEFAULT_EXPERIENCE: ExperienceDoc[] = [
  {
    role: 'Tech Lead & Full Stack Developer',
    org: 'GameLiminals - Adamas Game Dev Club',
    period: 'Dec 2025 - Present',
    location: 'Kolkata, India',
    logo: '/assets/exp-gameliminals.webp',
    bullets: [
      'Serving as the Main Website & App Developer of the club, responsible for designing, building, and maintaining the main digital platforms.',
      'Managing the core database, backend services, and leading technical projects for the organization.',
    ],
    skills: ['NextJS', 'TypeScript', 'NodeJS', 'TailwindCSS'],
    order: 1,
  },
  {
    role: 'Student Ambassador',
    org: 'Google Student Ambassador',
    period: 'Jun 2026 - Present',
    location: 'Campus Chapter',
    logo: '/assets/exp-gsa.webp',
    bullets: [
      'Representing Google on campus and fostering the student developer community.',
      'Coordinating workshops, technical talks, and spreading awareness of Google Developer tools.',
    ],
    skills: ['Community Building', 'Leadership', 'Google Cloud'],
    order: 2,
  },
  {
    role: 'Student Ambassador',
    org: 'eDC (Entrepreneurship Development Cell) IIT Delhi',
    period: 'Dec 2025 - Feb 2026',
    location: 'IIT Delhi Chapter',
    logo: '/assets/exp-edc.webp',
    bullets: [
      'Promoted entrepreneurship programs and workshops hosted by eDC IIT Delhi.',
      'Facilitated communications between IIT Delhi\'s cell and students in the region.',
    ],
    skills: ['Community Outreach', 'Startup Ecosystem'],
    order: 3,
  },
];

export const DEFAULT_BLOGS: BlogDoc[] = [
  {
    title: 'Git and GitHub Explained Easily: Commands, GitHub Tips, Account Setup, and CI/CD with a Relationship Example',
    date: 'Jun 19, 2024',
    readTime: '30 min read',
    platform: 'Medium',
    href: 'https://medium.com/@sayandeep0212/git-and-github-explained-easily-commands-github-tips-account-setup-and-ci-cd-with-a-3bda0c21aad6',
    summary: 'Git and GitHub are two tools every developer should understand. Many beginners think Git and GitHub are the same, but they are different. A comprehensive, beginner-friendly guide breaking down Git commands, SSH key setup, GitHub tips, and CI/CD automation with real-world relationship analogies.',
    tags: [
      'Git And Github Explain',
      'Essential Git Commands',
      'Ssh Key Set',
      'Ci Cd Pipeline',
      'Github Actions',
    ],
    order: 1,
  },
];

export const DEFAULT_GALLERY: GalleryDoc[] = [
  {
    title: 'AU Gamedev Nova 2k25 — 1st Place Victory',
    desc: 'Our game development team, Noctrail Interactives, clinching the 1st Place award for "Echoes: The Curse" built on Godot engine.',
    date: '2025',
    location: 'Adamas University',
    tag: 'Hackathon Win',
    image: '/assets/hero-banner.webp',
    order: 1,
  },
  {
    title: 'GameLiminals Technical Community Meetup',
    desc: 'Leading club planning, discussing microservice architectures, and structuring the technical tracks for upcoming events.',
    date: '2026',
    location: 'Tech Hub',
    tag: 'Community',
    image: '/assets/hero-banner-dark.webp',
    order: 2,
  },
  {
    title: 'Google Student Ambassador Community Sessions',
    desc: 'Facilitating student developer workshops on Gemini API, modern Web APIs, and open-source contribution roadmaps.',
    date: '2026',
    location: 'Campus Auditorium',
    tag: 'Leadership',
    image: '/assets/hero-banner-light.webp',
    order: 3,
  },
  {
    title: 'VibeForge 1.0 12-Hour Hackathon Launch',
    desc: 'The official kickoff of VibeForge 1.0, connecting hundreds of student developers, designers, and innovators.',
    date: '2026',
    location: 'Kolkata, IN',
    tag: 'Production',
    image: '/assets/footer-banner.webp',
    order: 4,
  },
];

export const DEFAULT_STORIES: StoryDoc[] = [
  {
    storyName: 'Git & GitHub Complete Guide',
    caption: 'Git and GitHub Explained Easily: Commands, tips, account setup, and CI/CD with real-world analogies.',
    platform: 'linkedin',
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1080&auto=format&fit=crop',
    linkUrl: 'https://medium.com/@sayandeep0212/git-and-github-explained-easily-commands-github-tips-account-setup-and-ci-cd-with-a-3bda0c21aad6',
    duration: 6,
    order: 1,
  },
  {
    storyName: 'GameLiminals Tech Ecosystem',
    caption: 'Tech Lead @ GameLiminals — building immersive digital experiences, fluid interfaces, and scalable platforms.',
    platform: 'linkedin',
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1080&auto=format&fit=crop',
    linkUrl: 'https://gameliminals.vercel.app',
    duration: 6,
    order: 2,
  },
  {
    storyName: 'VibeForge 1.0 Hackathon',
    caption: 'VibeForge 1.0 — empowering next-generation developer hackathons and creative engineering.',
    platform: 'instagram',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1080&auto=format&fit=crop',
    linkUrl: 'https://vibeforge-1-0.tech',
    duration: 6,
    order: 3,
  },
];

// Helper to seed all collections
export async function seedInitialCollections(): Promise<{ success: boolean; counts: Record<string, number> }> {
  const counts: Record<string, number> = {
    projects: 0,
    certificates: 0,
    experience: 0,
    blogs: 0,
    gallery: 0,
    stories: 0,
  };

  const seedCollection = async <T extends { order: number }>(colName: string, items: T[]) => {
    const colRef = collection(db, colName);
    const existing = await getDocs(colRef);
    if (existing.empty) {
      for (const item of items) {
        await addDoc(colRef, item);
        counts[colName] = (counts[colName] || 0) + 1;
      }
    } else {
      counts[colName] = existing.size;
    }
  };

  await seedCollection('projects', DEFAULT_PROJECTS);
  await seedCollection('certificates', DEFAULT_CERTIFICATES);
  await seedCollection('experience', DEFAULT_EXPERIENCE);
  await seedCollection('blogs', DEFAULT_BLOGS);
  await seedCollection('gallery', DEFAULT_GALLERY);
  await seedCollection('stories', DEFAULT_STORIES);

  return { success: true, counts };
}

