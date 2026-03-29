export interface AdminConfig {
  githubToken?: string;
  githubUsername?: string;
  linkedinToken?: string;
  linkedinPageId?: string;
  twitterApiKey?: string;
  twitterApiSecret?: string;
  twitterAccessToken?: string;
  twitterAccessTokenSecret?: string;
}

export interface WebsiteContent {
  heroTitle: string;
  heroTagline: string;
  aboutDescription: string;
  servicesDescription: string;
  founder: string;
  coFounder: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}
