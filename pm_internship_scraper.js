import puppeteer from 'puppeteer';
import fs from 'fs/promises';

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapePMInternships() {
    let browser;
    try {
        console.log('Launching browser. Please login manually when the window opens...');
        
        // Launch a visible browser so the user can log in
        browser = await puppeteer.launch({
            headless: false, // We need to see the browser to log in
            defaultViewport: null,
            args: ['--start-maximized']
        });

        const page = await browser.newPage();
        
        // Change timeout to wait longer for manual login
        await page.setDefaultNavigationTimeout(0); 
        await page.setDefaultTimeout(0);

        // 1. Navigate to the login page
        console.log('Navigating to PM Internship login page...');
        await page.goto('https://pminternship.mca.gov.in/login/', { waitUntil: 'networkidle2' });

        console.log('----------------------------------------------------');
        console.log('PLEASE LOG IN MANUALLY IN THE BROWSER WINDOW.');
        console.log('Once you log in, navigate to the "Search Internships" or relevant listings page.');
        console.log('Waiting for the listings to appear...');
        console.log('----------------------------------------------------');

        // Prepare to store intercepted data
        let internshipsData = [];

        // Try to intercept API responses if they are plain JSON, 
        // sometimes sites send encrypted data, so we also rely on DOM scraping below
        page.on('response', async (response) => {
            const url = response.url();
            
            // Adjust this URL match based on what the actual internship API URL is after login
            if (url.includes('/mca-api/') && url.includes('internship') && url.includes('search')) {
                try {
                    const json = await response.json();
                    console.log('Intercepted Internship API Response!');
                    
                    // Push to data array
                    internshipsData.push(json);
                    
                    // Save incrementally
                    await fs.writeFile('pm_internships_api_raw.json', JSON.stringify(internshipsData, null, 2));
                } catch (e) {
                    // Might not be standard JSON, or might be encrypted payload
                }
            }
        });

        // 2. Wait for user to bypass login and reach a dashboard/internships page
        // Let's prompt user to hit 'Enter' in the console when they are on the internships page
        // For automation, we wait for a specific container that holds the internship cards.
        // Since we don't know the exact class name, we'll wait for user input or just poll the page
        
        await new Promise((resolve) => {
            console.log("Press Ctrl+C to stop the script, or keep scrolling in the browser to collect data.");
            
            // Periodically scrape the DOM to get any visible internship cards
            const scrapeInterval = setInterval(async () => {
                if (page.isClosed()) {
                    clearInterval(scrapeInterval);
                    return resolve();
                }

                try {
                    // Try to extract data from the DOM dynamically
                    const pageData = await page.evaluate(() => {
                        // Look for typical internship card structures
                        // This uses generic heuristics - adapt selectors based on actual page structure
                        const textContents = document.body.innerText;
                        
                        // We can look for cards. Typically they might be in a grid or list
                        let cards = Array.from(document.querySelectorAll('.card, [class*="card"], [class*="item"], tr'));
                        
                        let extracted = cards.map(c => c.innerText.trim()).filter(text => text.length > 50 && (text.includes('Internship') || text.includes('Stipend')));
                        
                        return { extracted };
                    });

                    if (pageData.extracted && pageData.extracted.length > 0) {
                        await fs.writeFile('pm_internships_dom_data.json', JSON.stringify(pageData.extracted, null, 2));
                    }

                } catch (err) {
                    // Page might be navigating
                }
            }, 5000); // Check every 5 seconds
        });

    } catch (error) {
        console.error('Error during PM Internship scraping:', error);
    } finally {
        if (browser) {
            console.log('Closing browser...');
            // await browser.close(); 
        }
    }
}

// Start the scraper
scrapePMInternships();
