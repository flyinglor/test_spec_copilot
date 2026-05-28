import type { ContactMethod } from './types';

export const contactMethods: ContactMethod[] = [
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    value: 'jordan@example.com',
    url: 'mailto:jordan@example.com',
    primary: true,
  },
  {
    id: 'github',
    type: 'github',
    label: 'GitHub',
    value: 'github.com/jordanlee',
    url: 'https://github.com/jordanlee',
    primary: false,
  },
  {
    id: 'linkedin',
    type: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/jordanlee',
    url: 'https://linkedin.com/in/jordanlee',
    primary: false,
  },
  {
    id: 'twitter',
    type: 'twitter',
    label: 'X / Twitter',
    value: '@jordan_builds',
    url: 'https://x.com/jordan_builds',
    primary: false,
  },
];

export const contactFallback = {
  heading: 'Prefer a different channel?',
  message:
    "If none of the above methods suit you, email is the most reliable way to reach me. I aim to respond within one business day.",
};
