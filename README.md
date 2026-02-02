# Open Business Record (OBR) v1.0

**The "No-Nonsense" standard for local business data.**

---

## The Problem

Small business data is broken. It is trapped behind walled gardens (Google, Yelp, Facebook), filled with "zombie listings" for closed shops, and manipulated by advertising spend. For AI agents and modern developers, scraping this data is a nightmare of broken HTML and outdated information.

## The Solution

OBR is an open, lightweight metadata standard that allows businesses to own their **Source of Truth**. It leverages the existing Schema.org vocabulary and adds a mandatory **Annual Pulse**—ensuring that every listing in an OBR-compliant directory is verified and active.

---

## How It Works

OBR operates on a **Decentralized Discovery** model.

| Step | Description |
|------|-------------|
| **The Card** | Businesses generate a `business.json` file (JSON-LD). |
| **The Anchor** | The file is hosted at the root of their domain (e.g., `stonespizza.com/business.json`) or a community node. |
| **The Pulse** | Every 365 days, the owner updates the `last_pulse` timestamp. |
| **The Index** | Scrapers (respecting `robots.txt`) index these files to build ad-free, high-speed local directories. |

---

## The Spec (v1.0)

OBR records are **JSON-LD**. The standard extends [Schema.org/LocalBusiness](https://schema.org/LocalBusiness) (and subtypes such as `Restaurant`, `Store`, etc.) and adds an `obr_metadata` block.

### Example

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

- **`@context`** — `"https://schema.org"`
- **`@type`** — Schema.org type (e.g. `LocalBusiness`, `Restaurant`, `Store`)
- **`name`** — Official business name
- **`address`** — Physical location
- **`telephone`** — Public phone number
- **`obr_metadata`**
  - **`protocol`** — `"OBR-v1.0"`
  - **`last_pulse`** — ISO-8601 date (must be &lt; 365 days old)
  - **`hosting`** — `"registry"` \| `"self-hosted"` (where the record is served from)
  - **`status`** — `"active"` \| `"hibernated"`

### Recommended Fields

- **`url`** — Canonical URL for the listing (e.g. directory or business site)
- **`email`** — Public email (handle via obfuscation on the frontend)
- **`obr_metadata.whatsapp`** — For direct-to-customer messaging without intermediary apps

---

## Why Developers Love It

- **No API Keys** — Access local data without paying a "Google Maps Tax"
- **LLM-Ready** — Clean JSON is the native language of AI agents
- **Low Overhead** — 1,000,000 business listings occupy less than 500MB of storage

---

## Anti-Spam & Trust

- **Domain Verification** — Only files hosted on a TLD (top-level domain) can receive a "Gold" trust badge
- **Crawler Ethics** — OBR scrapers MUST respect `robots.txt` and include a `Crawl-Delay`

---

## Get Started

| Resource | Description |
|----------|-------------|
| [**Generator**](docs/index.html) | Use our web form to create your `business.json` |
| [**Scraper**](#) | Download our Node.js reference scraper |
| [**Directory**](#) | View the first OBR-compliant local index |
