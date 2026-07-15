const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('request', req => {
    if (req.url().includes('/api/v1/')) {
        console.log('REQ:', req.url());
        console.log('HEADERS:', JSON.stringify(req.headers()));
    }
  });

  page.on('response', res => {
    if (res.url().includes('/api/v1/')) {
        console.log('RES:', res.url(), res.status());
    }
  });

  await page.goto('http://localhost:5173/login');
  await page.fill('input[placeholder="e.g. KSP-48213"]', 'ADMIN001');
  await page.fill('input[placeholder="••••••••"]', 'Admin@123');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(3000);
  await browser.close();
})();
