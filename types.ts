export interface Report {
  id: string;
  timestamp: number;
  description: string;
  category: ReportCategory;
  location: string;
  image?: string; // Base64
  authenticityScore: number;
  aiAnalysis?: string;
  txHash: string; // Blockchain transaction hash
  ipfsCid: string; // IPFS Content Identifier
  status: 'Pending' | 'Verified' | 'Flagged';
}

export enum ReportCategory {
  ACCIDENT = 'Accident',
  ILLEGAL_ACTIVITY = 'Illegal Activity',
  ABUSE = 'Abuse',
  INFRASTRUCTURE = 'Infrastructure',
  OTHER = 'Other',
}

export interface AnalysisResult {
  score: number;
  category: string;
  summary: string;
  isAuthentic: boolean;
}