export enum AppView {
  DASHBOARD = 'DASHBOARD',
  AUDIT = 'AUDIT',
  KEYWORDS = 'KEYWORDS',
  CONTENT = 'CONTENT',
  LOCAL_SEO = 'LOCAL_SEO',
  BACKLINKS = 'BACKLINKS',
  ONBOARDING = 'ONBOARDING'
}

export interface BusinessProfile {
  websiteUrl: string;
  businessName: string;
  industry: string;
  location: string;
  primaryKeywords: string;
  competitors: string;
}

export interface SeoIssue {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'NOTICE';
  category: 'ON_PAGE' | 'TECHNICAL';
  title: string;
  description: string;
  recommendation: string;
  fixed?: boolean;
}

export interface KeywordData {
  keyword: string;
  intent: 'Transactional' | 'Informational' | 'Local' | 'Navigational';
  volume: string; // Simulated volume
  difficulty: number;
}

export interface BlogPost {
  title: string;
  content: string; // HTML or Markdown
  status: 'DRAFT' | 'GENERATED';
}

export interface AuditResult {
  score: number;
  issues: SeoIssue[];
  summary: string;
}

export interface FullSeoPlan {
  audit?: AuditResult;
  keywords?: KeywordData[];
  localStrategy?: string;
  backlinkStrategy?: string;
}