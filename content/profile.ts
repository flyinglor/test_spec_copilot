import type { Profile } from './types';

export const profile: Profile = {
  name: 'Jordan Lee',
  role: 'Full-Stack Engineer',
  tagline: 'Building things that matter, with code that lasts.',
  bio: `I'm a full-stack engineer with 6+ years of experience shipping production software across web, API, and data systems. I care deeply about developer experience, performance, and building products that people actually want to use.

My work spans everything from high-throughput APIs and distributed systems to pixel-perfect front-ends. I thrive at the intersection of design and engineering — where a well-architected system meets an experience that simply feels right.

When I'm not writing code, I'm contributing to open source, writing about software design, or hunting for the perfect espresso.`,
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Python',
    'PostgreSQL',
    'Docker',
    'AWS',
    'GraphQL',
    'REST APIs',
  ],
  interests: ['Open Source', 'System Design', 'Technical Writing', 'Coffee'],
  location: 'San Francisco, CA',
  available: true,
};
