import type { AnalysisResult, IocCollection } from '../types/phishlens';

/**
 * Defang a URL, domain, or IP string so it is never rendered as an active clickable link
 * or clickable protocol scheme.
 */
export function defangText(raw: string): string {
  if (!raw) return '';
  let out = raw.trim();
  out = out.replace(/https:\/\//gi, 'hxxps://').replace(/http:\/\//gi, 'hxxp://');
  // Replace dots in domain/IP-like tokens if not already defanged with [.]
  out = out.replace(/(?<!\[)\.(?!\])/g, '[.]');
  return out;
}

/**
 * Format all defanged IOCs into a clean, categorized plain-text block for clipboard export.
 */
export function formatIocsForClipboard(iocs: IocCollection): string {
  const sections: { title: string; items: string[] }[] = [
    { title: 'DOMAINS', items: iocs.domains },
    { title: 'URLS', items: iocs.urls },
    { title: 'IP ADDRESSES', items: iocs.ips },
    { title: 'FILES', items: iocs.files },
    { title: 'COMMANDS', items: iocs.commands },
  ];

  const nonEmpty = sections.filter((s) => s.items.length > 0);
  if (nonEmpty.length === 0) {
    return 'No Indicators of Compromise (IOCs) extracted.';
  }

  return nonEmpty
    .map((section) => {
      const lines = section.items.map((item) => `  - ${item}`);
      return `[${section.title}]\n${lines.join('\n')}`;
    })
    .join('\n\n');
}

/**
 * Generate a ready-to-paste SOC Incident Ticket in structured plain text.
 */
export function formatIncidentTicket(result: AnalysisResult): string {
  const severity =
    result.verdict === 'Malicious'
      ? 'HIGH / CRITICAL (RED FLAG)'
      : result.verdict === 'Suspicious'
        ? 'MEDIUM (AMBER WARNING)'
        : 'LOW / INFORMATIONAL (GREEN FLAG)';

  const redFlagsText =
    result.red_flags.length > 0
      ? result.red_flags
          .map((rf, idx) => `${idx + 1}. ${rf.indicator}\n   Impact: ${rf.why_it_matters}`)
          .join('\n')
      : 'None identified.';

  const mitreText =
    result.mitre_attack.length > 0
      ? result.mitre_attack.map((m) => `- ${m.technique_id}: ${m.name}`).join('\n')
      : 'None mapped.';

  const actionsText =
    result.recommended_actions.length > 0
      ? result.recommended_actions.map((a, idx) => `${idx + 1}. ${a}`).join('\n')
      : 'No immediate containment action required.';

  const redirectBlock = result.redirect_analysis.has_redirect
    ? `Redirect Detected: YES
Visible URL: ${result.redirect_analysis.visible_url || 'N/A'}
True Destination: ${result.redirect_analysis.true_destination || 'N/A'}
Assessment: ${result.redirect_analysis.assessment}`
    : `Redirect Detected: NO
Assessment: ${result.redirect_analysis.assessment || 'No redirect chain observed.'}`;

  const commandBlock = result.decoded_command.command_present
    ? `Command Present: YES
Obfuscation Spotted: ${result.decoded_command.obfuscation_spotted}
Execution Breakdown:
${result.decoded_command.step_by_step.map((s, idx) => `  ${idx + 1}. ${s}`).join('\n')}`
    : 'Command Present: NO';

  return `====================================================================
PHISHLENS SOC INCIDENT TICKET
====================================================================
TITLE: [${result.verdict.toUpperCase()}] ${result.attack_type} Triage Alert (Risk Score: ${result.risk_score}/100)
VERDICT / SEVERITY: ${result.verdict} — ${severity}
ATTACK TYPE: ${result.attack_type}
RISK SCORE: ${result.risk_score}/100

SUMMARY & RED FLAGS
--------------------------------------------------------------------
${redFlagsText}

REDIRECT & URL JUDGEMENT
--------------------------------------------------------------------
${redirectBlock}

COMMAND & PAYLOAD ANALYSIS
--------------------------------------------------------------------
${commandBlock}

DEFANGED INDICATORS OF COMPROMISE (IOCs)
--------------------------------------------------------------------
${formatIocsForClipboard(result.iocs)}

MITRE ATT&CK MAPPING
--------------------------------------------------------------------
${mitreText}

CONTAINMENT & RECOMMENDED ACTIONS
--------------------------------------------------------------------
${actionsText}

USER AWARENESS GUIDANCE
--------------------------------------------------------------------
${result.user_awareness_tip}
====================================================================`;
}
