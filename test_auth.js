const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let authHeader = null;
  page.on('request', request => {
    if (request.url().includes('/api/v1/reports/generate') && request.method() === 'POST') {
      const headers = request.headers();
      if (headers['authorization']) {
        authHeader = headers['authorization'];
      }
    }
  });

  await page.goto('http://localhost:5173/login');
  await page.waitForSelector('[placeholder="e.g. KSP-48213"]');
  await page.fill('[placeholder="e.g. KSP-48213"]', 'ADMIN001');
  await page.fill('[placeholder="••••••••"]', 'Admin@123');
  
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]')
  ]);

  await page.goto('http://localhost:5173/reports');
  await page.waitForTimeout(2000);
  
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api/v1/reports/generate')),
    page.click('button:has-text("Generate Report")')
  ]);

  console.log('--- NETWORK CONFIRMATION ---');
  if (authHeader) {
    console.log('POST /reports/generate Request Authorization Header:', authHeader);
    console.log('Result: SUCCESS');
  } else {
    console.log('POST /reports/generate Request Authorization Header: MISSING');
    console.log('Result: FAILURE');
  }

  await browser.close();
})();
