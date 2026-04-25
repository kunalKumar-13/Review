# Review

A beautiful, animated web app that generates a comprehensive visual review of any GitHub user's profile — stats, languages, contributions, top repositories, and more.

🔗 **Live Demo:** [https://github-proflie-review.vercel.app](https://github-proflie-review.vercel.app/)

## Features

- **Dynamic GitHub Profile Search** — Enter any GitHub username and get an instant animated review
- **Animated Hero Section** — SVG background paths with smooth entrance animations
- **Floating Stat Cards** — Stars, commits, PRs, issues, followers & public repos with float animations
- **Language Breakdown** — Animated donut chart showing top programming languages by repo size
- **3D Scroll Dashboard** — A full profile dashboard rendered inside a ContainerScroll 3D perspective card
- **Activity Insights** — Commits-by-hour bar chart and profile summary grid
- **Download as PDF** — One-click PDF export of the entire profile review
- **Fully Responsive** — Dark-mode-first design that looks great on all screen sizes

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **PDF Export:** html-to-image + jsPDF
- **API:** GitHub REST API v3 (unauthenticated)

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
git clone https://github.com/kunalKumar-13/Review.git
cd Review
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

## Deployment

This app is deployed on **Vercel**. Simply connect your GitHub repo to [Vercel](https://vercel.com) for automatic deployments on every push.

## Author

**Kunal Kumar** — [@kunalKumar-13](https://github.com/kunalKumar-13)
