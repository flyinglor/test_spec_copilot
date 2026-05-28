import type { Project } from './types';

export const projects: Project[] = [
  {
    id: 'proj-01',
    title: 'FlowBoard',
    description:
      'A real-time collaborative Kanban board with WebSocket sync, drag-and-drop lanes, and team permission controls. Used by 3 small teams in closed beta.',
    tags: ['TypeScript', 'React', 'Node.js', 'WebSockets', 'PostgreSQL'],
    url: 'https://github.com/jordanlee/flowboard',
    liveUrl: null,
    featured: true,
    year: 2024,
  },
  {
    id: 'proj-02',
    title: 'Spectral CLI',
    description:
      'A developer tool for auditing REST API response shapes against OpenAPI specs. Supports CI integration and generates structured diff reports for regression detection.',
    tags: ['TypeScript', 'Node.js', 'CLI', 'OpenAPI'],
    url: 'https://github.com/jordanlee/spectral-cli',
    liveUrl: null,
    featured: true,
    year: 2024,
  },
  {
    id: 'proj-03',
    title: 'Terrace',
    description:
      'A minimal static-site generator built around Markdown and a single JSON config file. Zero runtime dependencies. Generates a full site in under 200 ms.',
    tags: ['Go', 'CLI', 'Markdown', 'Static Sites'],
    url: 'https://github.com/jordanlee/terrace',
    liveUrl: 'https://terrace.dev',
    featured: false,
    year: 2023,
  },
  {
    id: 'proj-04',
    title: 'PricePulse',
    description:
      'Price-tracking browser extension that monitors Amazon product pages and sends alerts when a price drops below a user-set threshold.',
    tags: ['JavaScript', 'Browser Extension', 'Chrome API'],
    url: 'https://github.com/jordanlee/pricepulse',
    liveUrl: null,
    featured: false,
    year: 2023,
  },
  {
    id: 'proj-05',
    title: 'logship',
    description:
      'Lightweight log-aggregation agent that ships structured logs from local applications to S3-compatible storage without any external runtime dependencies.',
    tags: ['Go', 'AWS S3', 'CLI', 'Logging'],
    url: 'https://github.com/jordanlee/logship',
    liveUrl: null,
    featured: false,
    year: 2022,
  },
];
