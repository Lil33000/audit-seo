export interface AnalysisResult {
  success: boolean;
  payload?: string;
  error?: string;
}
export interface Audit {
  audit_id: string;
  client_name: string;
  website_url: string;
  performance_score: number;
  files_analyzed?: any[];
  competitor_urls?: string[];
  analysis_date: string;
  
}
