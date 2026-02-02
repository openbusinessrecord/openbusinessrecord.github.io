// api/save-record.js
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const OWNER = 'openbusinessrecord';
const REPO = 'openbusinessrecord.github.io';

export default async function handler(req, res) {

    const origin = req.headers.origin || '';
    const allowed = ['https://openbusinessrecord.github.io', 'https://openbusinessrecord.org', 'http://localhost:3000', 'http://127.0.0.1:5500'];
    if (allowed.some(o => origin === o || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')))
        res.setHeader('Access-Control-Allow-Origin', origin);
    else
        res.setHeader('Access-Control-Allow-Origin', 'https://openbusinessrecord.org');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  let record;
  try {
    record = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }
  if (!record || typeof record.name !== 'string' || !record.name.trim()) {
    return res.status(400).json({ error: 'Missing or invalid business name.' });
  }

  const slug = record.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
  const fileName = `${slug}.json`;
  const branchName = `submission-${slug}-${Date.now()}`;
  const websiteLink = record.url ? `[Check Website](${record.url})` : '_No URL provided_';

  try {
    // 1. Get the SHA of the latest commit on 'main' to branch off from
    const mainBranch = await octokit.repos.getBranch({ owner: OWNER, repo: REPO, branch: 'main' });
    const mainSha = mainBranch.data.commit.sha;

    // 2. Create a new branch
    await octokit.git.createRef({
      owner: OWNER, repo: REPO,
      ref: `refs/heads/${branchName}`,
      sha: mainSha
    });

    // 3. Commit the file to the NEW branch
    const content = Buffer.from(JSON.stringify(record, null, 2)).toString('base64');
    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER, repo: REPO,
      path: `records/${fileName}`,
      message: `OBR Submission: ${record.name}`,
      content: content,
      branch: branchName
    });

    // 4. Open a Pull Request
    const pr = await octokit.pulls.create({
      owner: OWNER, repo: REPO,
      title: `🚨 New OBR Record: ${record.name}`,
      head: branchName,
      base: 'main',
      body: `Reviewing new business registration for **${record.name}**.\n\n${websiteLink}`
    });

    return res.status(200).json({ success: true, pr_url: pr.data.html_url });
  } catch (error) {
    console.error('save-record error:', error?.response?.data || error?.message || error);
    const msg = error?.response?.data?.message || error?.message || 'System failed to create submission.';
    return res.status(500).json({ error: msg });
  }
}