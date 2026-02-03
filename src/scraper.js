import fetch from 'node-fetch';
import robotsParser from 'robots-parser';

// 1. Identify your scraper so businesses know who is visiting
const USER_AGENT = 'NoNonsenseDirectoryBot/1.0';

async function syncBusiness(domain) {
    const rootUrl = `https://${domain}`;
    const robotsUrl = `${rootUrl}/robots.txt`;
    const bizFileUrl = `${rootUrl}/obr-business.json`;

    try {
        // 2. Respect Robots.txt
        const robotsRes = await fetch(robotsUrl);
        const robotsText = await robotsRes.text();
        const robots = robotsParser(robotsUrl, robotsText);

        if (!robots.isAllowed(bizFileUrl, USER_AGENT)) {
            console.log(`❌ Scrape disallowed by robots.txt for ${domain}`);
            return;
        }

        // 3. The "Crawl Delay" (Be polite, don't spam the server)
        const delay = robots.getCrawlDelay(USER_AGENT) || 1; // Default to 1 sec
        console.log(`🕒 Waiting ${delay}s to respect site rules...`);
        await new Promise(r => setTimeout(r, delay * 1000));

        // 4. Fetch the obr-business.json
        const response = await fetch(bizFileUrl);
        if (response.status === 200) {
            const data = await response.json();
            
            // 5. Verification Logic (The "Pulse" Check)
            const lastPulse = new Date(data.obp_metadata.last_pulse);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            if (lastPulse > oneYearAgo) {
                console.log(`✅ Success! Verified ${data.name} via ${domain}`);
                return data; // This data goes into your directory
            } else {
                console.log(`⚠️ Listing for ${data.name} is stale. Needs a Pulse.`);
            }
        } else {
            console.log(`🔍 No obr-business.json found at ${domain}`);
        }
    } catch (error) {
        console.error(`🚨 Error connecting to ${domain}:`, error.message);
    }
}

// Example usage:
syncBusiness('stonespizza.com');