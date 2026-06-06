# LJ.DEV — Laurence Jan's Portfolio

Dark techy portfolio built with React 19 + Vite + Three.js.

## Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **@react-three/fiber** + **@react-three/drei** — Three.js particle field
- **Framer Motion** — scroll animations + transitions
- **TanStack Router** — ready for blog routing (add when needed)
- **Tailwind CSS v3** — utility classes + design tokens
- **JetBrains Mono** + **Space Grotesk** — fonts

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build & Deploy

```bash
npm run build
# Output: /dist — drop into Vercel, Cloudflare Pages, etc.
```

## Customize

All portfolio content is in one file:

```
src/data/portfolio.ts
```

Edit `PROJECTS`, `SKILLS`, `BLOG_POSTS`, `SOCIALS`, `NAV_LINKS` — UI updates automatically.

## Three.js Particle Field

`src/components/three/ParticleField.tsx`

Key constants you can tune:
- `PARTICLE_COUNT` — more particles = denser constellation (perf cost)
- `CONNECTION_DISTANCE` — how close particles need to be to draw a line
- `SPREAD` — how wide the field spreads across the canvas

## Contact Form

`src/components/sections/ContactSection.tsx`

The form currently logs to console. Wire it up to:
- **Formspree** — free, no backend needed
- **EmailJS** — client-side email sending
- **Resend** — if you add a serverless function

## File Structure

```
src/
├── components/
│   ├── three/
│   │   └── ParticleField.tsx     ← Three.js canvas
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── BlogSection.tsx
│   │   └── ContactSection.tsx
│   └── ui/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── data/
│   └── portfolio.ts              ← all content here
├── styles/
│   └── globals.css               ← design tokens + global styles
├── App.tsx
└── main.tsx
```
