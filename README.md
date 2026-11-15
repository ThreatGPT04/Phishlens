# PhishLens

A static phishing and ClickFix triage console for SOC analysts. Paste a suspicious email, URL or command and get a red/amber/green verdict with a plain-English explanation.

Built at the Google Build with AI Bootcamp (Bengaluru) using Google AI Studio, Antigravity, Stitch and the Gemini API.

## What it does
- Verdict and 0-100 risk gauge (Red / Amber / Green flag)
- Redirect chain analysis from pasted URLs and OAuth links
- Decodes obfuscated PowerShell / Base64 ClickFix commands into plain English
- Red flags, defanged IOCs (one-click copy) and MITRE ATT&CK mapping
- Response playbook and incident ticket generator
- 3 built-in synthetic scenarios: ClickFix lure, credential phishing, open redirect

## Safety
Static analysis only. Nothing is fetched or executed. All sample data is synthetic (example.invalid domains).

## Tech
TypeScript, React + Vite frontend, Node server (`server.ts`) calling the Gemini API server-side so the key never reaches the browser.

## Run locally
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`
3. Start the dev server (see the scripts in `package.json`)

## Disclaimer
A learning project. AI verdicts can be wrong, so always verify with your own tools and processes.
