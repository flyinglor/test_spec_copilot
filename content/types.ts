export interface Profile {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  skills: string[];
  interests: string[];
  location: string;
  available: boolean;
}

export interface CVEntry {
  id: string;
  type: 'experience' | 'education';
  role: string;
  organization: string;
  /** YYYY-MM */
  startDate: string;
  /** YYYY-MM or null for current */
  endDate: string | null;
  description: string;
  skills: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  url: string | null;
  liveUrl: string | null;
  featured: boolean;
  year: number;
}

export interface ContactMethod {
  id: string;
  type: 'email' | 'github' | 'linkedin' | 'twitter' | 'other';
  label: string;
  value: string;
  url: string;
  primary: boolean;
}
