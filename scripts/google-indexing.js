/**
 * Google Indexing API Script for MakerSilo
 *
 * Usage:
 *   node scripts/google-indexing.js              - Submit all URLs from sitemap
 *   node scripts/google-indexing.js --url <URL>  - Submit single URL
 *   node scripts/google-indexing.js --remove <URL> - Remove URL from index
 *   node scripts/google-indexing.js --check      - Check submission status
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Configuration
const SERVICE_ACCOUNT_FILE = path.join(__dirname, '..', 'service-account.json');
const LOG_FILE = path.join(__dirname, '..', 'indexing-log.json');
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
const DAILY_QUOTA = 200; // Google's daily quota

// All site URLs (from sitemap.js)
const BASE_URL = 'https://makersilo.com';

const ALL_URLS = [
  // Static pages
  '/',
  '/tools/',
  '/symbols/',
  '/meme-maker/',
  '/wallpapers/',
  '/privacy/',
  '/terms/',

  // Text Tools
  '/tools/small-text-generator/',
  '/tools/gothic-font/',
  '/tools/glitch-text-generator/',
  '/tools/morse-code-generator/',
  '/tools/text-to-binary/',
  '/tools/bubble-font/',
  '/tools/cursive-font-generator/',
  '/tools/strikethrough-text-generator/',
  '/tools/upside-down-text/',
  '/tools/text-repeater/',
  '/tools/wide-text-generator/',
  '/tools/invisible-text/',
  '/tools/bold-text-generator/',
  '/tools/italic-text-generator/',
  '/tools/underline-text-generator/',
  '/tools/mirror-text-generator/',
  '/tools/qr-code-generator/',
  '/tools/ai-diss-track-generator/',
  '/tools/tier-list-maker/',
  '/tools/youtube-comment-picker/',
  '/tools/youtube-channel-idea-generator/',

  // Symbols
  '/symbols/heart-symbol-copy-paste/',
  '/symbols/music-symbols/',
  '/symbols/star-symbols/',
  '/symbols/arrow-symbols/',
  '/symbols/kaomoji-list/',

  // Meme Maker
  '/meme-maker/drake-meme/',
  '/meme-maker/change-my-mind/',
  '/meme-maker/bernie-sanders/',

  // Wallpapers
  '/wallpapers/preppy-wallpaper/',
  '/wallpapers/solid-color-backgrounds/',
  '/wallpapers/gradient-wallpaper-generator/',
  '/wallpapers/aesthetic-wallpaper/',
  '/wallpapers/minimalist-wallpaper/',

  // Generators
  '/generators/podcast-name-generator/',
  '/generators/band-name-generator/',
  '/generators/anime-name-generator/',
  '/generators/couple-name-generator/',
  '/generators/roblox-username-generator/',
  '/generators/gaming-name-generator/',
  '/generators/aesthetic-youtube-name-generator/',
  '/generators/youtube-name-generator/',

  // Randomizers
  '/randomizers/random-number-generator/',
  '/randomizers/coin-flip/',
  '/randomizers/dice-roller/',
  '/randomizers/random-color-generator/',
  '/randomizers/yes-or-no-wheel/',
];

// Load or create log file
function loadLog() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading log:', e.message);
  }
  return { submissions: [], lastRun: null, totalSubmitted: 0 };
}

function saveLog(log) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

// Authenticate with Google
async function authenticate() {
  if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
    console.error('❌ Service account file not found:', SERVICE_ACCOUNT_FILE);
    console.log('\nPlease download the service account JSON from Google Cloud Console');
    console.log('and save it as "service-account.json" in the project root.');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  return auth;
}

// Submit URL for indexing
async function submitUrl(auth, url, type = 'URL_UPDATED') {
  const indexing = google.indexing({ version: 'v3', auth });

  try {
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type, // URL_UPDATED or URL_DELETED
      },
    });

    return {
      success: true,
      url: url,
      type: type,
      response: response.data,
    };
  } catch (error) {
    return {
      success: false,
      url: url,
      type: type,
      error: error.message,
    };
  }
}

// Check URL status
async function checkUrlStatus(auth, url) {
  const indexing = google.indexing({ version: 'v3', auth });

  try {
    const response = await indexing.urlNotifications.getMetadata({
      url: url,
    });

    return {
      success: true,
      url: url,
      metadata: response.data,
    };
  } catch (error) {
    return {
      success: false,
      url: url,
      error: error.message,
    };
  }
}

// Sleep function for rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const log = loadLog();

  console.log('🔍 Google Indexing API - MakerSilo\n');

  // Authenticate
  const auth = await authenticate();
  console.log('✅ Authenticated with Google\n');

  // Handle single URL submission
  if (args[0] === '--url' && args[1]) {
    const url = args[1].startsWith('http') ? args[1] : BASE_URL + args[1];
    console.log(`📤 Submitting: ${url}`);

    const result = await submitUrl(auth, url, 'URL_UPDATED');

    if (result.success) {
      console.log('✅ Successfully submitted!');
      console.log('Response:', JSON.stringify(result.response, null, 2));
    } else {
      console.log('❌ Failed:', result.error);
    }

    // Log submission
    log.submissions.push({
      url: url,
      type: 'URL_UPDATED',
      success: result.success,
      timestamp: new Date().toISOString(),
    });
    saveLog(log);
    return;
  }

  // Handle URL removal
  if (args[0] === '--remove' && args[1]) {
    const url = args[1].startsWith('http') ? args[1] : BASE_URL + args[1];
    console.log(`🗑️ Removing: ${url}`);

    const result = await submitUrl(auth, url, 'URL_DELETED');

    if (result.success) {
      console.log('✅ Removal request submitted!');
    } else {
      console.log('❌ Failed:', result.error);
    }
    return;
  }

  // Handle status check
  if (args[0] === '--check') {
    console.log('📊 Checking submission status...\n');

    const urlsToCheck = args[1]
      ? [args[1].startsWith('http') ? args[1] : BASE_URL + args[1]]
      : ALL_URLS.slice(0, 5).map(u => BASE_URL + u);

    for (const url of urlsToCheck) {
      const result = await checkUrlStatus(auth, url);

      if (result.success) {
        console.log(`✅ ${url}`);
        console.log(`   Last crawled: ${result.metadata.latestUpdate?.notifyTime || 'Unknown'}`);
      } else {
        console.log(`❌ ${url}: ${result.error}`);
      }

      await sleep(500);
    }
    return;
  }

  // Batch submit all URLs
  console.log(`📋 Found ${ALL_URLS.length} URLs to submit\n`);
  console.log(`⚠️ Daily quota: ${DAILY_QUOTA} requests\n`);

  // Check today's submissions
  const today = new Date().toISOString().split('T')[0];
  const todaySubmissions = log.submissions.filter(s =>
    s.timestamp && s.timestamp.startsWith(today)
  ).length;

  console.log(`📊 Today's submissions: ${todaySubmissions}/${DAILY_QUOTA}\n`);

  if (todaySubmissions >= DAILY_QUOTA) {
    console.log('❌ Daily quota reached. Try again tomorrow.');
    return;
  }

  const remainingQuota = DAILY_QUOTA - todaySubmissions;
  const urlsToSubmit = ALL_URLS.slice(0, remainingQuota);

  console.log(`🚀 Submitting ${urlsToSubmit.length} URLs...\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < urlsToSubmit.length; i++) {
    const urlPath = urlsToSubmit[i];
    const fullUrl = BASE_URL + urlPath;

    process.stdout.write(`[${i + 1}/${urlsToSubmit.length}] ${urlPath}... `);

    const result = await submitUrl(auth, fullUrl, 'URL_UPDATED');

    if (result.success) {
      console.log('✅');
      successCount++;
    } else {
      console.log(`❌ ${result.error}`);
      failCount++;
    }

    // Log submission
    log.submissions.push({
      url: fullUrl,
      type: 'URL_UPDATED',
      success: result.success,
      timestamp: new Date().toISOString(),
      error: result.error || null,
    });

    // Rate limiting
    if (i < urlsToSubmit.length - 1) {
      await sleep(RATE_LIMIT_DELAY);
    }
  }

  // Save log
  log.lastRun = new Date().toISOString();
  log.totalSubmitted += successCount;
  saveLog(log);

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📊 Total submitted (all time): ${log.totalSubmitted}`);
  console.log('='.repeat(50));
}

main().catch(console.error);

