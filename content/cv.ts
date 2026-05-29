import type { CVEntry, SkillGroup } from './types';

export const cvEntries: CVEntry[] = [
  {
    id: 'exp-01',
    type: 'experience',
    role: 'Senior Software Engineer',
    organization: 'Acme Corp',
    startDate: '2022-03',
    endDate: null,
    description:
      'Led development of a real-time analytics dashboard serving 50k+ daily users. Migrated legacy monolith to microservices architecture, reducing deployment time by 70%. Mentored a team of three junior engineers.',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'exp-02',
    type: 'experience',
    role: 'Software Engineer',
    organization: 'Bright Labs',
    startDate: '2020-06',
    endDate: '2022-02',
    description:
      'Built and maintained customer-facing APIs consumed by mobile and web clients. Implemented CI/CD pipelines that cut the release cycle from weekly to daily. Drove adoption of TypeScript across the entire backend service layer.',
    skills: ['Python', 'Django', 'React', 'Docker', 'PostgreSQL'],
  },
  {
    id: 'exp-03',
    type: 'experience',
    role: 'Junior Developer',
    organization: 'StartupXYZ',
    startDate: '2018-09',
    endDate: '2020-05',
    description:
      'Full-stack development across an e-commerce platform. Owned the checkout flow redesign that increased conversion rate by 12%. Integrated third-party payment and shipping APIs.',
    skills: ['JavaScript', 'Vue.js', 'Node.js', 'MySQL'],
  },
  {
    id: 'edu-01',
    type: 'education',
    role: 'B.Sc. Computer Science',
    organization: 'State University',
    startDate: '2014-09',
    endDate: '2018-06',
    description:
      'Graduated with Honors. Focused on algorithms, distributed systems, and software engineering principles. Senior thesis on adaptive load balancing in distributed key-value stores.',
    skills: ['Algorithms', 'Data Structures', 'Distributed Systems'],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'Bash'],
  },
  {
    label: 'Frameworks',
    items: ['React', 'Next.js', 'Node.js', 'Django', 'Express'],
  },
  {
    label: 'Infrastructure',
    items: ['Docker', 'AWS', 'Nginx', 'CI/CD', 'Linux'],
  },
  {
    label: 'Data',
    items: ['PostgreSQL', 'Redis', 'MongoDB', 'GraphQL', 'REST'],
  },
];
