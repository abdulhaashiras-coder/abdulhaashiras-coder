import fs from 'fs';
import https from 'https';
import path from 'path';

const badges = [
  { name: 'python', url: 'https://img.shields.io/badge/-Python-07111F?style=for-the-badge&logo=python&logoColor=22D3EE' },
  { name: 'pytorch', url: 'https://img.shields.io/badge/-PyTorch-07111F?style=for-the-badge&logo=pytorch&logoColor=22D3EE' },
  { name: 'tensorflow', url: 'https://img.shields.io/badge/-TensorFlow-07111F?style=for-the-badge&logo=tensorflow&logoColor=22D3EE' },
  { name: 'scikit-learn', url: 'https://img.shields.io/badge/-Scikit--Learn-07111F?style=for-the-badge&logo=scikit-learn&logoColor=22D3EE' },
  { name: 'typescript', url: 'https://img.shields.io/badge/-TypeScript-07111F?style=for-the-badge&logo=typescript&logoColor=22D3EE' },
  { name: 'nextjs', url: 'https://img.shields.io/badge/-Next.js-07111F?style=for-the-badge&logo=next.js&logoColor=22D3EE' },
  
  { name: 'antigravity', url: 'https://img.shields.io/badge/-Antigravity-07111F?style=for-the-badge&logoColor=22D3EE' },
  { name: 'claude', url: 'https://img.shields.io/badge/-Claude-07111F?style=for-the-badge&logo=anthropic&logoColor=22D3EE' },
  { name: 'stitch', url: 'https://img.shields.io/badge/-Stitch-07111F?style=for-the-badge&logoColor=22D3EE' },
  { name: 'manus', url: 'https://img.shields.io/badge/-Manus-07111F?style=for-the-badge&logoColor=22D3EE' },
  { name: 'lovable', url: 'https://img.shields.io/badge/-Lovable-07111F?style=for-the-badge&logoColor=22D3EE' },
  { name: 'git', url: 'https://img.shields.io/badge/-Git-07111F?style=for-the-badge&logo=git&logoColor=22D3EE' },
  { name: 'github', url: 'https://img.shields.io/badge/-GitHub-07111F?style=for-the-badge&logo=github&logoColor=22D3EE' },

  { name: 'social-github', url: 'https://img.shields.io/badge/GitHub-h4ash--abdul-07111F?style=for-the-badge&logo=github&logoColor=22D3EE&labelColor=07111F' },
  { name: 'social-linkedin', url: 'https://img.shields.io/badge/LinkedIn-haash--abdul-07111F?style=for-the-badge&logo=linkedin&logoColor=22D3EE&labelColor=07111F' },
  { name: 'social-leetcode', url: 'https://img.shields.io/badge/LeetCode-h4ash__abdul-07111F?style=for-the-badge&logo=leetcode&logoColor=22D3EE&labelColor=07111F' },
];

fs.mkdirSync('assets/badges', { recursive: true });

async function downloadBadge(badge) {
  return new Promise((resolve, reject) => {
    https.get(badge.url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Add a cyan border (for-the-badge height is 28)
        const border = `<rect x="0" y="0" width="100%" height="28" fill="none" stroke="#22D3EE" stroke-width="2"/>`;
        data = data.replace('</svg>', border + '\n</svg>');
        fs.writeFileSync(`assets/badges/${badge.name}.svg`, data);
        console.log(`Saved ${badge.name}.svg`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const badge of badges) {
    await downloadBadge(badge);
  }
}

main();
