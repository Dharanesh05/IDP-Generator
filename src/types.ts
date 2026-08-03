export interface StudentProfile {
  major: string;
  skills: string;
  goals: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  providerOrPlatform: string;
  description: string;
  link?: string;
  difficultyOrTime?: string;
  skillsAcquired?: string[];
  actionLabel?: string;
  isPaid?: boolean;
  priceInfo?: string;
}

export interface ComprehensiveIDP {
  summary: string;
  suggestedRoles: string[];
  certifications: RecommendationItem[];
  projects: RecommendationItem[];
  codingPractice: RecommendationItem[];
  aptitudePractice: RecommendationItem[];
  softSkills: RecommendationItem[];
  resumeImprovements: RecommendationItem[];
  interviewPrep: RecommendationItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  institution?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

