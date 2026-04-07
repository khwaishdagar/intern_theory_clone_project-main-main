import puppeteer from 'puppeteer';

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapePivotTable(headless = false, onBrowser = null) {
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
            headless,
            defaultViewport: {
                width: 1920,
                height: 1080
            },
            args: ['--start-maximized'],
            protocolTimeout: 120000 // Increased timeout to 2 minutes
        });

        if (typeof onBrowser === 'function') {
            try { onBrowser(browser); } catch (_) {}
        }

        const page = await browser.newPage();
        
        // Set longer timeout for navigation
        await page.setDefaultNavigationTimeout(60000);
        await page.setDefaultTimeout(60000);
        
        // Navigate to the Power BI report
        const powerBiUrl = 'https://app.powerbi.com/view?r=eyJrIjoiYTk2ZmY3MzYtMWQyMS00OWFjLThkZTctZjJiYjgyNzY3NmM1IiwidCI6IjgyYjY5ZGM0LTU3NGEtNDdkZi05NTk4LTRlMTczNGViOGNhMiJ9&pageName=ReportSection170acb8b2144957c001e';
        
        console.log('Navigating to Power BI report...');
        await page.goto(powerBiUrl, {
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        // Wait for Power BI to load
        console.log('Waiting for Power BI report to load...');
        await page.waitForSelector('.pivotTable', {
            timeout: 60000
        });

        // Wait for content to load
        console.log('Waiting for content to render...');
        await delay(5000);

        // Handle the location city filter
        console.log('Handling location city filter...');
        await page.evaluate(async () => {
            // Click the dropdown to open it
            const dropdown = document.querySelector('div[aria-label="Location City"]');
            if (dropdown) {
                dropdown.click();
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Find the ABILENE checkbox and uncheck it
                const items = Array.from(document.querySelectorAll('.slicerItemContainer'));
                const abileneItem = items.find(item => 
                    item.querySelector('.slicerText')?.textContent.trim() === 'ABILENE'
                );

                if (abileneItem) {
                    abileneItem.click();
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

                // Click outside to close dropdown
                document.querySelector('.pivotTable').click();
            }
        });

        // Wait for filter to apply
        console.log('Waiting for filter to apply...');
        await delay(5000);

        // Break down scrolling into smaller chunks
        console.log('Starting incremental scroll and data collection...');
        const allData = [];
        let hasMoreData = true;
        let scrollAttempts = 0;
        const maxScrollAttempts = 20; // Safety limit

        while (hasMoreData && scrollAttempts < maxScrollAttempts) {
            scrollAttempts++;
            console.log(`\nScroll attempt ${scrollAttempts}...`);

            // Extract data from current view
            const newData = await page.evaluate(async () => {
                const scrollViewport = document.querySelector('.mid-viewport');
                if (!scrollViewport) return { rows: [], hasMore: false };

                // Get current scroll position and heights
                const currentScroll = scrollViewport.scrollTop;
                const viewportHeight = scrollViewport.clientHeight;
                const totalHeight = scrollViewport.scrollHeight;

                // Extract visible rows
                const rows = Array.from(document.querySelectorAll('.row'))
                    .map(row => {
                        const cells = Array.from(row.querySelectorAll('[role="rowheader"], [role="gridcell"]'))
                            .filter(cell => !cell.classList.contains('visually-hidden'))
                            .map(cell => cell.textContent.replace(/\s+/g, ' ').trim());
                        return cells;
                    })
                    .filter(row => row.length >= 4);

                // Scroll down by 75% of viewport height
                const scrollAmount = Math.floor(viewportHeight * 0.75);
                const newPosition = currentScroll + scrollAmount;
                scrollViewport.scrollTo(0, newPosition);

                // Wait for content to load
                await new Promise(resolve => setTimeout(resolve, 2000));

                return {
                    rows,
                    hasMore: newPosition < totalHeight,
                    currentPosition: newPosition
                };
            });

            if (newData.rows.length > 0) {
                console.log(`Found ${newData.rows.length} rows in current view`);
                
                // Add only unique rows
                newData.rows.forEach(row => {
                    const rowKey = row.join('|');
                    if (!allData.some(existing => existing.join('|') === rowKey)) {
                        allData.push(row);
                    }
                });
                
                console.log(`Total unique rows collected: ${allData.length}`);
            } else {
                console.log('No new rows found in current view');
            }

            hasMoreData = newData.hasMore;
            
            // Wait between scrolls
            await delay(2000);
        }

        console.log(`\nScroll complete. Total rows collected: ${allData.length}`);

        // Process and format the data with better validation
        console.log('Processing extracted data...');
        const formattedData = allData
            .filter(row => row.length >= 4) // Must have minimum required fields
            .map(row => {
                // Clean up currency values
                const cleanCurrency = (value) => {
                    if (!value) return '0';
                    const num = value.replace(/[$,]/g, '').trim();
                    return isNaN(parseFloat(num)) ? '0' : num;
                };

                // Clean up room count
                const cleanRoomCount = (value) => {
                    if (!value) return 0;
                    // Extract numbers, handle negative values
                    const match = value.match(/-?\d+/);
                    if (!match) return 0;
                    const num = parseInt(match[0]);
                    return isNaN(num) ? 0 : num;
                };

                // Clean up ZIP code
                const cleanZip = (value) => {
                    if (!value) return '';
                    // Look for 5-digit ZIP code pattern
                    const zipMatch = value.match(/\b\d{5}\b/);
                    if (zipMatch) return zipMatch[0];
                    // Look for 3-4 digit codes that might be partial ZIPs
                    const shortZipMatch = value.match(/\b\d{3,4}\b/);
                    return shortZipMatch ? shortZipMatch[0] : '';
                };

                // Try to identify columns based on content patterns
                let locationZip = '', address = '', city = '', roomCount = 0;
                let revenueData = {
                    january: '0',
                    february: '0',
                    march: '0',
                    april: '0',
                    q1Total: '0',
                    q2Total: '0',
                    yearTotal: '0'
                };

                // First pass: Look for ZIP code and address
                row.forEach((cell, index) => {
                    const value = cell.trim();
                    
                    // Check for ZIP code pattern
                    if (value.match(/^\d{3,5}$/)) {
                        locationZip = cleanZip(value);
                    }
                    // Look for address pattern (contains numbers and street-related words)
                    else if (
                        value.match(/\d+.*(?:ST|DR|LN|RD|AVE|BLVD|PKW?Y|WAY|CIR|CT|PL|TRL|STREET|DRIVE|LANE|ROAD|AVENUE|BOULEVARD|PARKWAY)/i) &&
                        !value.includes('$')
                    ) {
                        if (!address) {
                            address = value;
                            // Check if ZIP is embedded in address
                            const embeddedZip = value.match(/\b\d{5}\b/);
                            if (embeddedZip && !locationZip) {
                                locationZip = embeddedZip[0];
                            }
                        }
                    }
                });

                // Second pass: Look for city and room count
                row.forEach((cell, index) => {
                    const value = cell.trim();
                    
                    // Look for room count (typically follows certain patterns)
                    if (value.match(/^(?:\d+|NO\.)?\s*ROOMS?:?\s*\d+$/i) || value.match(/^\d+$/)) {
                        roomCount = cleanRoomCount(value);
                    }
                    // Look for city name (typically all caps, no numbers)
                    else if (
                        value.match(/^[A-Z\s\-&]+$/) && 
                        !value.includes('$') && 
                        value !== address &&
                        !value.match(/^(TOTAL|ROOMS?|NO|NUMBER)$/i)
                    ) {
                        city = value;
                    }
                    // Look for revenue values
                    else if (value.includes('$') || value.match(/^-?\d+(\.\d{2})?$/)) {
                        // Assign revenue values based on position from the end
                        const revenueFields = ['january', 'february', 'march', 'april', 'q1Total', 'q2Total', 'yearTotal'];
                        const fieldIndex = index - (row.length - revenueFields.length);
                        if (fieldIndex >= 0 && fieldIndex < revenueFields.length) {
                            revenueData[revenueFields[fieldIndex]] = cleanCurrency(value);
                        }
                    }
                });

                // Validation and cleanup
                if (address) {
                    // Extract ZIP from address if not found elsewhere
                    if (!locationZip) {
                        const zipFromAddr = address.match(/\b\d{5}\b/);
                        if (zipFromAddr) {
                            locationZip = zipFromAddr[0];
                            // Remove ZIP from address
                            address = address.replace(zipFromAddr[0], '').trim();
                        }
                    }

                    // Clean up address
                    address = address
                        .replace(/\s+/g, ' ')
                        .replace(/,$/, '')
                        .trim();

                    return {
                        locationZip,
                        address,
                        city,
                        roomCount,
                        revenue: revenueData
                    };
                }
                return null;
            })
            .filter(row => row !== null);

        // Additional validation pass
        const validatedData = formattedData.map(row => {
            // Check for missing ZIP in similar addresses
            if (!row.locationZip) {
                const similar = formattedData.find(other => 
                    other.address === row.address && 
                    other.locationZip && 
                    other.locationZip.match(/^\d{5}$/)
                );
                if (similar) {
                    row.locationZip = similar.locationZip;
                }
            }

            // Check for missing room count in similar properties
            if (!row.roomCount) {
                const similar = formattedData.find(other =>
                    other.address === row.address &&
                    other.roomCount > 0
                );
                if (similar) {
                    row.roomCount = similar.roomCount;
                }
            }

            return row;
        });

        // Log extraction statistics
        console.log(`Raw rows found: ${allData.length}`);
        console.log(`Formatted rows: ${validatedData.length}`);
        console.log(`Rows with ZIP codes: ${validatedData.filter(row => row.locationZip).length}`);
        console.log(`Rows with room counts: ${validatedData.filter(row => row.roomCount > 0).length}`);

        // Create city summary with improved validation
        const citySummary = Array.from(new Set(validatedData.map(row => row.city)))
            .filter(city => city)
            .map(city => {
                const locationsInCity = validatedData.filter(row => row.city === city);
                const totalRooms = locationsInCity.reduce((sum, loc) => sum + (loc.roomCount || 0), 0);

                return {
                    city,
                    totalLocations: locationsInCity.length,
                    totalRooms,
                    addresses: locationsInCity.map(loc => ({
                        zip: loc.locationZip,
                        address: loc.address,
                        roomCount: loc.roomCount,
                        revenue: loc.revenue
                    }))
                };
            })
            .sort((a, b) => b.totalLocations - a.totalLocations);

        // Save data to files
        console.log('Saving data...');
        const fs = await import('fs/promises');
        
        await fs.writeFile('powerbi_data.json', JSON.stringify(validatedData, null, 2));
        console.log('Full data saved to powerbi_data.json');

        await fs.writeFile('city_summary.json', JSON.stringify(citySummary, null, 2));
        console.log('City summary saved to city_summary.json');

        // Output city summary
        console.log('\nUnique Cities Summary:');
        citySummary.forEach(city => {
            console.log(`\n${city.city}:`);
            console.log(`- Total Locations: ${city.totalLocations}`);
            console.log(`- Total Rooms: ${city.totalRooms}`);
            console.log('- Addresses:');
            city.addresses.forEach(addr => {
                console.log(`  * ${addr.address} (${addr.zip}) - ${addr.roomCount} rooms`);
                console.log(`    Revenue Q1: ${addr.revenue.january}, Q2: ${addr.revenue.february}`);
            });
        });

        console.log(`\nTotal unique cities found: ${citySummary.length}`);

    } catch (error) {
        console.error('Error during scraping:', error);
    } finally {
        if (browser) {
            console.log('Closing browser...');
            await browser.close();
        }
    }
}

// Run the scraper
export { scrapePivotTable }; 