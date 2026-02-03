# Open Business Record (OBR) v1.0

**The "No-Nonsense" ecosystem for local business data.**

---

## The Problem

Small business data is broken. It is trapped behind walled gardens like Google, Yelp, and Facebook, filled with "zombie listings" for closed shops, and manipulated by advertising spend. For AI agents and developers, scraping this data is a nightmare of broken HTML and outdated information.

## The Solution: A Complete Ecosystem

OBR is more than a file format; it is a decentralized discovery loop that ensures businesses own their **Source of Truth**. The ecosystem consists of four integrated pillars:

- **The Standard (obr-business.json)** — A lightweight JSON-LD file leveraging Schema.org with a mandatory "Annual Pulse" to ensure data is active.
- **The 60-Second Form** — A dead-simple generator that turns basic business info into a valid OBR record.
- **Managed Hosting** — A home for businesses without their own websites, providing a permanent URL and a clean, indexable profile.
- **The Reference Scraper** — An open-source tool for developers to build high-speed, ad-free local directories without paying for expensive API keys.

---

## How It Works

| Component | Role |
|-----------|------|
| **The Form** | Owners use the web generator to create their record in under a minute. |
| **The Hosting** | Records are hosted at `<your domain>/.well-known/obr-business.json` or on our managed registry. |
| **The Pulse** | Every 365 days, owners update the `last_pulse` timestamp to remain "Active". |
| **The Index** | Smart scrapers verify index these clean JSON files to build a local, regional, or even, global index. |

---

## The Spec (v1.0)

OBR records are **JSON-LD**. The standard extends [Schema.org/LocalBusiness](https://schema.org/LocalBusiness) and adds an `obr_metadata` block.

### Example Record

```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Stone's Pizza",
  "url": "https://index.openbusinessrecord.org/r/stones-pizza",
  "address": "123 Main St, Chicago, IL 60601",
  "telephone": "+13125550199",
  "email": "hello@stonespizza.com",
  "obr_metadata": {
    "protocol": "OBR-v1.0",
    "last_pulse": "2026-02-01",
    "hosting": "registry",
    "whatsapp": "+13125550199",
    "status": "active"
  }
}
```

### Required Fields

- **`@context`** — Must be `"https://schema.org"`.
- **`@type`** — Valid Schema.org type (e.g. `LocalBusiness`, `Store`).
- **`name`** — Official business name.
- **`address`** — Physical location.
- **`telephone`** — Public phone number.
- **`obr_metadata`**
  - **`protocol`** — `"OBR-v1.0"`.
  - **`last_pulse`** — ISO-8601 date (must be less than 365 days old).
  - **`hosting`** — `"registry"` (for hosted listings) or `"self-hosted"`.
  - **`status`** — `"active"` or `"hibernated"`.

---

## Why Developers & Owners Love It

- **No API Keys** — Access local data without paying a "Google Maps Tax".
- **LLM-Ready** — Clean JSON is the native language of AI agents and modern scrapers.
- **Verified Activity** - OBR scrapers are smart enough to use the last_pulse timestamp and cross-verification techniques to ensure every indexed business is currently active.
- **Zero-Config for Owners** — No website? No problem. Use our free hosting to get a verified digital presence.
- **Anti-Spam** — Domain verification ensures only legitimate businesses receive "Gold" trust badges.

---

## Why It's Better (and Safer)

### For Owners: Transparency > Obscurity

- **Direct-to-Customer** — By emphasizing `whatsapp` in the metadata, you move conversations to platforms with superior built-in spam blocking.
- **Zero-Config Hosting** — No website? Use our registry to get a verified digital presence in 60 seconds.
- **Control** — You own the `obr-business.json` file. If you make updates, scrapers will automatically pick up the changes.

### Why This Protects the Owner

By making the file transparent and easy to parse, you protect the owner from the aggressive "brute-force" scraping common today.

- **Efficiency** — A good bot finds `/.well-known/obr-business.json` via `robots.txt`, gets the facts, and leaves.
- **Reduced Noise** — No full-site crawl; less server load, fewer accidental security blocks.

---

## Get Started

| Resource | Description |
|----------|--------------|
| [**Create Your Record**](docs/how-it-works.html) | Use the 60-second form to generate and host your `obr-business.json`. |
| [**Reference Scraper**](src/scraper.js) | Download the Node.js tool to start indexing OBR data. |
| [**Browse the Directory**](index.html#directory) | See the first OBR-compliant local index in action. |
