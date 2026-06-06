import imsPreview from '@/assets/projects/ims-preview.webp'
import kpiPreview from '@/assets/projects/kpi-preview.webp'
import mindaridePreview from '@/assets/projects/mindaride-preview.webp'

export const NAV_LINKS = [
  { label: 'HOME', href: '#home', active: true },
  { label: 'ABOUT', href: '#about' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'BLOG', href: '#blog' },
  { label: 'CONTACT', href: '#contact' },
]

export const PROJECTS = [
  {
    id: 'mindaride',
    label: 'transit - maps - supabase',
    name: 'MindaRide',
    description:
      'Mindanao-focused intercity bus travel web app. Real route data, OSRM road routing, dynamic schedules, and fare info - built for actual commuters.',
    tags: ['React 19', 'TypeScript', 'Supabase', 'OSRM', 'TanStack'],
    url: 'https://mindaride.online',
    status: 'live',
    previewImage: mindaridePreview,
    previewAlt: 'MindaRide homepage preview with bus route hero',
  },
  {
    id: 'ims',
    label: 'hr - ojt - tracking',
    name: 'Internship Management System',
    description:
      'OJT tracking platform for students and supervisors. Time logging, activity feed, and project management - Svelte 5 + Google Sheets backend.',
    tags: ['Svelte 5', 'Vite', 'Google Apps Script', 'Google Sheets'],
    url: 'https://script.google.com/macros/s/AKfycbwyUDOp8pRephiqYVBXZAHGLhS6Ju-2g5XgUBCZG6LLiL047kP1euq1qM9u-Ahf1-q9/exec',
    status: 'live',
    previewImage: imsPreview,
    previewAlt: 'Internship Management System login screen preview',
  },
  {
    id: 'kpi-monitoring',
    label: 'dashboard - kpi - sheets',
    name: 'TSI KPI Dashboard',
    description:
      'Google Apps Script web dashboard for monitoring submarine cable system KPIs. Reads configured Google Sheets data for Dashboard, SEA-US, Palau, IPOP, FSM, EMCS, and Planned Maintenance modules.',
    tags: ['Apps Script', 'Google Sheets', 'Bootstrap', 'GSAP'],
    url: '#',
    status: 'active',
    previewImage: kpiPreview,
    previewAlt: 'TSI KPI Dashboard performance overview preview',
  },
]

export const SKILLS = {
  frontend: ['React 19', 'TypeScript', 'Svelte 5', 'Angular', 'Vue.js', 'jQuery', 'Tailwind CSS', 'Three.js', 'Framer Motion'],
  backend: ['Node.js', 'Laravel', 'Supabase', 'PostgreSQL', 'Google Apps Script', 'Google Sheets API', 'REST APIs'],
  tools: ['Vite', 'Git', 'GitHub', 'Vercel', 'Cloudflare', 'OSRM', 'Mapbox', 'Leaflet'],
  mobile: ['React Native', 'Flutter', 'Dart', 'Android Studio'],
}

export const BLOG_POSTS = [
  {
    id: 'osrm-integration',
    date: '2026-05',
    tag: 'devlog',
    title: 'Replacing straight-line polylines with real road routing using OSRM',
    excerpt: 'How I integrated a self-hosted OSRM instance into MindaRide to get actual road paths instead of crow-fly lines between stopovers.',
    readTime: '5 min',
  },
  {
    id: 'svelte5-runes',
    date: '2026-04',
    tag: 'tutorial',
    title: 'Svelte 5 runes vs stores - what actually changed and why it matters',
    excerpt: 'A practical breakdown of the new reactivity model in Svelte 5, from the perspective of someone migrating an existing project.',
    readTime: '7 min',
  },
  {
    id: 'supabase-auth',
    date: '2026-03',
    tag: 'devlog',
    title: 'Adding Google OAuth + Magic Link auth to a Vite app with Supabase',
    excerpt: 'Step by step: setting up Supabase Auth, handling the callback route in TanStack Router, and protecting pages without a mess.',
    readTime: '6 min',
  },
]

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/RenXenoverse11' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/laurence-jan-bagaan-812ba33b7/' },
  { label: 'Upwork', href: 'https://www.upwork.com/freelancers/~01c91551d88f9a1a24?mp_source=share' },
  { label: 'Email', href: 'mailto:laurencejan1431@gmail.com' },
  { label: 'Facebook', href: 'https://web.facebook.com/renxen11/' },
]
