const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: 'AIzaSyCDj368Z1jP3M9SVR-ahFNysy_KAYJnGjQ',
  authDomain: 'portfolio-2b013.firebaseapp.com',
  projectId: 'portfolio-2b013',
  storageBucket: 'portfolio-2b013.firebasestorage.app',
  messagingSenderId: '956892800374',
  appId: '1:956892800374:web:2ac65c0596e65738210657',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const DEFAULT_PROJECTS = [
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

const DEFAULT_CERTIFICATES = [
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

const DEFAULT_EXPERIENCE = [
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

const DEFAULT_BLOGS = [
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

const DEFAULT_GALLERY = [
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

async function seed() {
  const email = process.argv[2] || 'sayandeep0212@gmail.com';
  const password = process.argv[3];

  if (password) {
    console.log(`Authenticating as ${email}...`);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Authenticated successfully!');
    } catch (err) {
      console.error('❌ Authentication failed:', err.message);
      process.exit(1);
    }
  } else {
    console.log('⚠️ Running without auth credentials. Writes will require Firestore write permissions.');
  }

  console.log('--- STARTING FIRESTORE PORTFOLIO DATA SEED ---');

  const seedCol = async (name, items) => {
    try {
      const snap = await getDocs(collection(db, name));
      if (snap.empty) {
        console.log(`Seeding ${items.length} items to ${name}...`);
        for (const item of items) {
          await addDoc(collection(db, name), item);
        }
        console.log(`✅ ${name} seeded successfully.`);
      } else {
        console.log(`ℹ️ ${name} already has ${snap.size} documents.`);
      }
    } catch (err) {
      console.error(`❌ Failed to seed ${name}:`, err.message);
    }
  };

  await seedCol('projects', DEFAULT_PROJECTS);
  await seedCol('certificates', DEFAULT_CERTIFICATES);
  await seedCol('experience', DEFAULT_EXPERIENCE);
  await seedCol('blogs', DEFAULT_BLOGS);
  await seedCol('gallery', DEFAULT_GALLERY);

  console.log('--- FINISHED SEED PROCESS ---');
}

seed().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
