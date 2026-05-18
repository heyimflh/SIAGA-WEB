const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message, error.stack));
  
  await page.goto('http://localhost:5173/login');
  
  // Login as pilot
  await page.click('.role-tab:nth-child(2)');
  await page.type('#login-email', 'rizky@pilot.com');
  await page.type('#login-password', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  
  // Go to job radar
  await page.goto('http://localhost:5173/dashboard/pilot/job-radar', { waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
