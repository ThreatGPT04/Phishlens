export type Verdict = "Malicious" | "Suspicious" | "Likely Safe";

export interface RedirectAnalysis {
  has_redirect: boolean;
  visible_url: string;
  true_destination: string;
  assessment: string;
}

export interface RedFlag {
  indicator: string;
  why_it_matters: string;
}

export interface DecodedCommand {
  command_present: boolean;
  obfuscation_spotted: string;
  step_by_step: string[];
}

export interface IocCollection {
  domains: string[];
  urls: string[];
  ips: string[];
  files: string[];
  commands: string[];
}

export interface MitreTechnique {
  technique_id: string;
  name: string;
}

export interface AnalysisResult {
  verdict: Verdict;
  risk_score: number;
  attack_type: string;
  redirect_analysis: RedirectAnalysis;
  red_flags: RedFlag[];
  decoded_command: DecodedCommand;
  iocs: IocCollection;
  mitre_attack: MitreTechnique[];
  recommended_actions: string[];
  user_awareness_tip: string;
}

export interface SampleArtifact {
  id: string;
  label: string;
  category: string;
  content: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  preview: string;
  input: string;
  result: AnalysisResult;
}
