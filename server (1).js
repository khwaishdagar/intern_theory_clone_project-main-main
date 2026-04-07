import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import os from 'os';
import cron from 'node-cron';
import { exec } from 'child_process';
import { spawn } from 'child_process';
import { initTables, insertData, getScrapingStats, getProperties, pool } from './db/index.js';
import { getAllProperties, getScraperStats, clearSQLiteDatabase } from './db/sqlite.js';
import { importExistingData } from './scripts/import_existing_data.js';

// Helper function to automatically dump scraped data to database
async function autoInsertToDatabase(scraperType, dataFilePath, socket = null) {
    try {
        if (!dataFilePath || !fsSync.existsSync(dataFilePath)) {
            console.log(`⚠️ No data file found for ${scraperType} to insert to database`);
            return;
        }

        const fileName = path.basename(dataFilePath);
        const raw = await fs.readFile(dataFilePath, 'utf8');
        const payload = JSON.parse(raw);

        const tableNameMap = {
            rcm1: 'rcm1',
            cbredealflow: 'cbredealflow',
            rankmyhotel: 'rankmyhotel'
        };

        const table = tableNameMap[scraperType];
        if (!table) {
            console.log(`⚠️ Unsupported scraper type for auto-insert: ${scraperType}`);
            return;
        }

        const result = await insertData(table, payload, fileName);
        console.log(`🗄️ Auto-inserted ${result.inserted} properties from ${fileName} to database`);
        
        if (socket) {
            socket.emit('progress', {
                type: 'database',
                message: `🗄️ Auto-inserted ${result.inserted} properties to database`,
                timestamp: new Date().toISOString(),
                scraper: scraperType
            });
        }

        return result;
    } catch (error) {
        console.error(`Auto-insert to database failed for ${scraperType}:`, error.message);
        if (socket) {
            socket.emit('progress', {
                type: 'database',
                message: `⚠️ Auto-insert failed: ${error.message}`,
                timestamp: new Date().toISOString(),
                scraper: scraperType
            });
        }
    }
}

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

/* ---------- PDF Parser Service Auto-Start (optional) ---------- */
if (process.env.START_PDF_DOCKER !== '0') {
    try {
        const composeFile = join(__dirname, 'pdf_parser_docker-compose.yml');
        console.log('🛠️  Starting/Ensuring PDF Parser services via Docker...');
        exec(`docker compose -f "${composeFile}" up -d --build`, (err, stdout, stderr) => {
            if (err) {
                console.error('⚠️  Failed to start PDF Parser services:', err.message);
                return;
            }
            if (stdout) console.log(stdout.trim());
            if (stderr) console.log(stderr.trim());
            console.log('✅ PDF Parser services are up (backend:8000, ocr:8002, ghostscript:8001)');
        });
    } catch (serviceError) {
        console.error('⚠️  Could not initialize PDF Parser services:', serviceError.message);
    }
} else {
    console.log('ℹ️  Skipping Docker startup for PDF Parser services (START_PDF_DOCKER=0)');
}
/* --------------------------------------------------- */

/* ---------- Local Python services (no-Docker) ---------- */
if (process.env.START_PDF_DOCKER === '0') {
    const services = [
        {
            name: 'pdf-backend',
            cmd: 'python',
            args: ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000', '--reload'],
            cwd: join(__dirname, 'pdf_parsing_20250621_191051', 'backend')
        },
        {
            name: 'pdf-ocr',
            cmd: 'python',
            args: ['ocr_service.py'],
            cwd: join(__dirname, 'pdf_parsing_20250621_191051', 'backend')
        },
        {
            name: 'ghostscript',
            cmd: 'python',
            args: ['gs_service.py'],
            cwd: join(__dirname, 'pdf_parsing_20250621_191051', 'backend', 'ghostscript')
        }
    ];

    services.forEach(({ name, cmd, args, cwd }) => {
        const proc = spawn(cmd, args, { cwd, stdio: 'inherit', shell: false });
        console.log(`🚀 Started ${name} (PID ${proc.pid})`);

        proc.on('close', code => {
            console.log(`⚠️  ${name} exited with code ${code}`);
        });
        proc.on('error', err => {
            console.error(`❌ Failed to start ${name}:`, err.message);
        });
    });
}
/* ------------------------------------------------------ */

// After server creation and before routes, initialize tables
(async () => {
    try {
        await initTables();
        console.log('📚 PostgreSQL tables initialised');
    } catch (err) {
        console.error('⚠️  Failed to initialise database tables:', err.message);
    }
})();

// Serve static files
app.use(express.static('public'));

// Serve data files and downloads
app.use('/data', express.static('.'));
app.use('/downloads', express.static('data'));

// Landing page as root
// Dashboard route (main route)
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'dashboard.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'dashboard.html'));
});

// Landing page route  
app.get('/landing', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'landing.html'));
});

// Database API endpoints
app.get('/api/database/stats', async (req, res) => {
    try {
        const stats = await getScrapingStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/database/properties', async (req, res) => {
    try {
        const filters = {
            source_site: req.query.source_site,
            asset_type: req.query.asset_type,
            city: req.query.city,
            limit: req.query.limit ? parseInt(req.query.limit) : 100
        };
        
        const properties = await getProperties(filters);
        res.json({ success: true, data: properties, count: properties.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/database/import-existing', async (req, res) => {
    try {
        console.log('🔄 Starting import of existing data via API...');
        const totalImported = await importExistingData();
        res.json({ 
            success: true, 
            message: `Successfully imported ${totalImported} properties`,
            totalImported 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/database/clear', async (req, res) => {
    try {
        console.log('🗑️ Clearing database...');
        
        // Clear PostgreSQL tables
        await pool.query('TRUNCATE TABLE property_contacts CASCADE');
        await pool.query('TRUNCATE TABLE properties CASCADE');
        await pool.query('TRUNCATE TABLE scraping_runs CASCADE');
        await pool.query('TRUNCATE TABLE rcm1_raw CASCADE');
        await pool.query('TRUNCATE TABLE cbredealflow_raw CASCADE');
        await pool.query('TRUNCATE TABLE rankmyhotel_raw CASCADE');
        
        // Clear SQLite database
        await clearSQLiteDatabase();
        
        console.log('✅ Database cleared successfully');
        res.json({ success: true, message: 'Database cleared successfully' });
    } catch (error) {
        console.error('Database clear error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// SQLite database endpoints
app.get('/api/sqlite/stats', async (req, res) => {
    try {
        const stats = await getScraperStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('SQLite stats error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/sqlite/properties', async (req, res) => {
    try {
        const filters = {
            site: req.query.source_site,
            asset_type: req.query.asset_type,
            city: req.query.city,
            limit: req.query.limit ? parseInt(req.query.limit) : 1000
        };
        
        const properties = await getAllProperties(filters);
        res.json({ success: true, data: properties, count: properties.length });
    } catch (error) {
        console.error('SQLite properties error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/sqlite/clear', async (req, res) => {
    try {
        console.log('🗑️ Clearing SQLite database...');
        await clearSQLiteDatabase();
        console.log('✅ SQLite database cleared successfully');
        res.json({ success: true, message: 'SQLite database cleared successfully' });
    } catch (error) {
        console.error('SQLite clear error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Scraper state management
let scraperStates = {
    rankmyhotel: { status: 'idle', lastRun: null, schedule: 'manual' },
    rcm1: { status: 'idle', lastRun: null, schedule: 'manual' },
    cbredealflow: { status: 'idle', lastRun: null, schedule: 'manual' },
    loopnet: { status: 'idle', lastRun: null, schedule: 'manual' }
};

let activeTasks = new Map();
let scheduledTasks = new Map();

// Utility functions
function updateScraperStatus(scraper, status, socket = null) {
    scraperStates[scraper].status = status;
    if (status === 'completed') {
        scraperStates[scraper].lastRun = new Date();
        scraperStates[scraper].status = 'idle';
    }
    
    const statusUpdate = {
        scraper,
        status: status === 'completed' ? 'idle' : status,
        message: status === 'completed' ? 'Completed' : status.charAt(0).toUpperCase() + status.slice(1)
    };
    
    if (socket) {
        socket.emit('scraperStatusUpdate', statusUpdate);
    } else {
        io.emit('scraperStatusUpdate', statusUpdate);
    }
}

function emitProgress(message, scraper = 'all', socket = null) {
    const progressData = { message, scraper };
    if (socket) {
        socket.emit('progress', progressData);
    } else {
        io.emit('progress', progressData);
    }
}

function emitError(error, scraper = 'all', socket = null) {
    const errorData = { error, scraper };
    if (socket) {
        socket.emit('error', errorData);
    } else {
        io.emit('error', errorData);
    }
}

function emitComplete(message, scraper = 'all', socket = null) {
    const completeData = { message, scraper };
    if (socket) {
        socket.emit('scrapeComplete', completeData);
    } else {
        io.emit('scrapeComplete', completeData);
    }
}

// Scraper execution wrapper
async function executeScraper(scraperType, action, options = {}, socket = null) {
    const { headless = true, scraper } = options;
    const taskId = `${scraper}-${action}-${Date.now()}`;
    const taskMeta = { scraper, action, startTime: new Date(), cancel: null };
    // Store active task immediately so stop requests can target it
    activeTasks.set(taskId, taskMeta);
    
    try {
        updateScraperStatus(scraper, 'running', socket);
        emitProgress(`Starting ${action} for ${scraper}...`, scraper, socket);
        
        let scraperModule;
        let result;
        
        switch (scraper) {
            case 'rankmyhotel':
                if (action === 'revenue') {
                    const { scrapePivotTable } = await import('./scraper.js');
                    const onBrowserRank = (browser) => {
                        taskMeta.cancel = async () => {
                            try { const proc = browser.process(); if (proc && !proc.killed) proc.kill('SIGKILL'); } catch (_) {}
                        };
                    };
                    result = await scrapePivotTable(headless, onBrowserRank);
                } else if (action === 'all-tables') {
                    const { scrapeAllTables } = await import('./hotel_scraper.js');
                    const onBrowserRank = (browser) => {
                        taskMeta.cancel = async () => {
                            try { const proc = browser.process(); if (proc && !proc.killed) proc.kill('SIGKILL'); } catch (_) {}
                        };
                    };
                    result = await scrapeAllTables(headless, onBrowserRank);
                }
                break;
                
            case 'rcm1':
                const RCM1Scraper = (await import('./scrapers/rcm1_scraper.js')).default;
                const rcm1Scraper = new RCM1Scraper();
                // Provide cancel function so STOP can close browser
                taskMeta.cancel = async () => {
                    try {
                        await rcm1Scraper.close();
                    } catch (_) {}
                    try {
                        if (rcm1Scraper.browser) {
                            const proc = rcm1Scraper.browser.process();
                            if (proc && !proc.killed) proc.kill('SIGKILL');
                        }
                    } catch (_) {}
                };
                await rcm1Scraper.launch({ headless });
                
                // Login first
                emitProgress('🔐 Logging into RCM1...', 'rcm1', socket);
                const loginSuccess = await rcm1Scraper.login();
                if (!loginSuccess) {
                    throw new Error('RCM1 Login failed');
                }
                emitProgress('✅ Login successful!', 'rcm1', socket);
                
                if (action === 'deal-center') {
                    emitProgress('🏢 Navigating to Deal Center...', 'rcm1', socket);
                    await rcm1Scraper.navigateToDealCenter();
                    
                    emitProgress('🎯 Applying Hospitality filter...', 'rcm1', socket);
                    await rcm1Scraper.applyHospitalityFilterDealCenter();
                    
                    // Set up download handling
                    const downloadPath = path.join(__dirname, 'data', 'rcm1');
                    if (!fsSync.existsSync(downloadPath)) {
                        fsSync.mkdirSync(downloadPath, { recursive: true });
                    }
                    
                    // Set download behavior
                    const client = await rcm1Scraper.page.target().createCDPSession();
                    await client.send('Page.setDownloadBehavior', {
                        behavior: 'allow',
                        downloadPath: downloadPath
                    });
                    
                    // Now export the data
                    emitProgress('📤 Clicking Export button...', 'rcm1', socket);
                    try {
                        // Set up download promise
                        const downloadPromise = new Promise((resolve, reject) => {
                            const timeout = setTimeout(() => {
                                reject(new Error('Download timeout'));
                            }, 30000);
                            
                            rcm1Scraper.page.once('download', async download => {
                                try {
                                    const fileName = download.suggestedFilename();
                                    const filePath = path.join(downloadPath, fileName);
                                    await download.saveAs(filePath);
                                    clearTimeout(timeout);
                                    resolve({ fileName, filePath });
                                } catch (err) {
                                    clearTimeout(timeout);
                                    reject(err);
                                }
                            });
                        });
                        
                        // Click Export button
                        await rcm1Scraper.page.waitForSelector('#btnDealCenterExport', { 
                            visible: true,
                            timeout: 10000 
                        });
                        await rcm1Scraper.page.click('#btnDealCenterExport');
                        
                        emitProgress('⏳ Waiting for Report Ready popup...', 'rcm1', socket);
                        await rcm1Scraper.page.waitForTimeout(3000);
                        
                        // Wait for "Report Ready" popup
                        await rcm1Scraper.page.waitForFunction(() => {
                            const elements = Array.from(document.querySelectorAll('*'));
                            return elements.some(el => 
                                el.textContent?.includes('Report Ready') && 
                                !el.querySelector('*')
                            );
                        }, { timeout: 15000 });
                        
                        emitProgress('✅ Report Ready popup detected!', 'rcm1', socket);
                        await rcm1Scraper.page.waitForTimeout(1000);
                        
                        // Click download link
                        emitProgress('🔗 Clicking download link...', 'rcm1', socket);
                        const downloadClicked = await rcm1Scraper.page.evaluate(() => {
                            const links = Array.from(document.querySelectorAll('a'));
                            const downloadLink = links.find(link => 
                                link.textContent.toLowerCase().includes('click here to download') ||
                                link.textContent.toLowerCase().includes('download the report')
                            );
                            
                            if (downloadLink) {
                                downloadLink.click();
                                return true;
                            }
                            return false;
                        });
                        
                        if (downloadClicked) {
                            emitProgress('📥 Waiting for download to complete...', 'rcm1', socket);
                            
                            try {
                                const downloadInfo = await downloadPromise;
                                emitProgress(`✅ Excel file downloaded: ${downloadInfo.fileName}`, 'rcm1', socket);
                                
                                result = {
                                    success: true,
                                    message: '✅ RCM1 Deal Center export completed!',
                                    data: {
                                        status: 'export_completed',
                                        fileName: downloadInfo.fileName,
                                        filePath: `/downloads/rcm1/${downloadInfo.fileName}`,
                                        downloadUrl: `/downloads/rcm1/${downloadInfo.fileName}`,
                                        fileSize: fsSync.statSync(downloadInfo.filePath).size
                                    }
                                };
                                
                                // Emit completion with file info
                                socket.emit('rcm1ExportComplete', result.data);
                                
                            } catch (downloadErr) {
                                // Fallback: check Downloads folder
                                emitProgress('⚠️ Checking system Downloads folder...', 'rcm1', socket);
                                await rcm1Scraper.page.waitForTimeout(3000);
                                
                                const downloadsDir = path.join(os.homedir(), 'Downloads');
                                const files = fsSync.readdirSync(downloadsDir);
                                const excelFile = files.find(f => 
                                    f.includes('Deal Center Report') && 
                                    f.endsWith('.xlsx') &&
                                    fsSync.statSync(path.join(downloadsDir, f)).mtime > Date.now() - 60000
                                );
                                
                                if (excelFile) {
                                    // Move file to our data directory
                                    const sourcePath = path.join(downloadsDir, excelFile);
                                    const destPath = path.join(downloadPath, excelFile);
                                    fsSync.copyFileSync(sourcePath, destPath);
                                    
                                    result = {
                                        success: true,
                                        message: '✅ RCM1 Deal Center export completed!',
                                        data: {
                                            status: 'export_completed',
                                            fileName: excelFile,
                                            filePath: `/downloads/rcm1/${excelFile}`,
                                            downloadUrl: `/downloads/rcm1/${excelFile}`,
                                            fileSize: fsSync.statSync(destPath).size
                                        }
                                    };
                                    
                                    socket.emit('rcm1ExportComplete', result.data);
                                } else {
                                    result = {
                                        success: true,
                                        message: '✅ Export completed! Check Downloads folder.',
                                        data: {
                                            status: 'export_completed',
                                            note: 'File downloaded to system Downloads folder'
                                        }
                                    };
                                }
                            }
                            
                            // Try to close popup
                            await rcm1Scraper.page.evaluate(() => {
                                const closeButtons = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
                                const closeButton = closeButtons.find(btn => 
                                    btn.textContent?.toLowerCase().includes('close') ||
                                    btn.getAttribute('aria-label')?.toLowerCase().includes('close')
                                );
                                if (closeButton) closeButton.click();
                            });
                        }
                        
                    } catch (exportError) {
                        console.error('Export error:', exportError);
                        emitError(`Export failed: ${exportError.message}`, 'rcm1', socket);
                        result = {
                            success: false,
                            message: '❌ Export failed',
                            error: exportError.message
                        };
                    }
                    
                    // Close browser after a short delay
                    setTimeout(async () => {
                        console.log('🔒 Closing RCM1 browser...');
                        await rcm1Scraper.close();
                    }, 5000);
                    
                } else if (action === 'marketplace') {
                    emitProgress('🏪 Navigating to Marketplace...', 'rcm1', socket);
                    await rcm1Scraper.navigateToMarketplace();
                    
                    emitProgress('🎯 Applying Hospitality filter...', 'rcm1', socket);
                    await rcm1Scraper.applyHospitalityFilterMarketplace();
                    
                    emitProgress('📊 Starting data extraction from marketplace...', 'rcm1', socket);
                    const marketplaceData = await rcm1Scraper.extractMarketplaceDataWithHover();
                    
                    // Save the data to a JSON file
                    const dataFilePath = path.join('data', 'rcm1', `marketplace_hospitality_${new Date().toISOString().split('T')[0]}.json`);
                    fsSync.writeFileSync(dataFilePath, JSON.stringify(marketplaceData, null, 2));
                    
                    // Also save to CSV for easier viewing in Excel
                    const csvFilePath = path.join('data', 'rcm1', `marketplace_hospitality_${new Date().toISOString().split('T')[0]}.csv`);
                    
                    // Convert to CSV
                    if (marketplaceData.length > 0) {
                        const headers = [
                            'Property Name',
                            'City',
                            'Asset Type', 
                            'Size',
                            'Status',
                            'Price',
                            'Summary',
                            'Property Link',
                            'Broker Names',
                            'Broker Companies',
                            'Extracted At'
                        ];
                        
                        let csvContent = headers.join(',') + '\n';
                        
                        marketplaceData.forEach(property => {
                            const brokerNames = property.brokers.map(b => b.brokerName).join('; ');
                            const brokerCompanies = property.brokers.map(b => b.brokerCompany).join('; ');
                            
                            const row = [
                                `"${property.propertyName || ''}"`,
                                `"${property.city || ''}"`,
                                `"${property.assetType || ''}"`,
                                `"${property.size || ''}"`,
                                `"${property.status || ''}"`,
                                `"${property.price || ''}"`,
                                `"${property.summary ? property.summary.replace(/"/g, '""') : ''}"`,
                                `"${property.propertyLink || ''}"`,
                                `"${brokerNames}"`,
                                `"${brokerCompanies}"`,
                                `"${property.extractedAt || ''}"`
                            ];
                            
                            csvContent += row.join(',') + '\n';
                        });
                        
                        fsSync.writeFileSync(csvFilePath, csvContent);
                    }
                    
                    result = {
                        success: true,
                        message: `✅ RCM1 Marketplace extraction completed! Found ${marketplaceData.length} hospitality properties.`,
                        data: {
                            status: 'extraction_completed',
                            propertiesFound: marketplaceData.length,
                            jsonFile: `/downloads/rcm1/${path.basename(dataFilePath)}`,
                            csvFile: `/downloads/rcm1/${path.basename(csvFilePath)}`,
                            jsonFilePath: dataFilePath,
                            csvFilePath: csvFilePath,
                            sampleData: marketplaceData.slice(0, 3) // First 3 properties as sample
                        }
                    };
                    
                    emitProgress(`✅ Extraction complete! ${marketplaceData.length} properties saved.`, 'rcm1', socket);
                    
                    // Emit completion event
                    socket.emit('rcm1MarketplaceComplete', result.data);
                    
                    // Close browser after a short delay
                    setTimeout(async () => {
                        console.log('🔒 Closing RCM1 browser...');
                        await rcm1Scraper.close();
                    }, 5000);
                    
                } else {
                    // Default to login test
                    result = {
                        success: true,
                        message: '✅ RCM1 Login test successful!',
                        data: { loginStatus: 'success' }
                    };
                    await rcm1Scraper.close();
                }
                break;
                
            case 'cbredealflow':
                const { scrapeCBREDealFlow, scrapeCBREDealCenter } = await import('./scrapers/cbredealflow_scraper.js');
                let browserRef = null;
                const onBrowser = (browser) => {
                    browserRef = browser;
                    taskMeta.cancel = async () => {
                        try {
                            const proc = browser.process();
                            // Force-kill if still running
                            if (proc && !proc.killed) {
                                proc.kill('SIGKILL');
                            }
                        } catch (_) {}
                    };
                };
                if (action === 'deal-center') {
                    result = await scrapeCBREDealCenter(headless, onBrowser);
                } else {
                    // Default to properties page
                    result = await scrapeCBREDealFlow(headless, onBrowser);
                }

                // NEW: Update root-level summary for frontend card
                try {
                    if (result && result.success && result.dataFile && fsSync.existsSync(result.dataFile)) {
                        const destPath = path.join(process.cwd(), 'cbredealflow_data.json');
                        fsSync.copyFileSync(result.dataFile, destPath);
                    }
                } catch (err) {
                    console.error('Failed to update cbredealflow_data.json:', err.message);
                }
                break;
                
            case 'loopnet':
                const { scrapeLoopNet } = await import('./scrapers/loopnet_scraper.js');
                let loopBrowserRef = null;
                const onBrowserLoop = (browser) => {
                    loopBrowserRef = browser;
                    taskMeta.cancel = async () => {
                        try {
                            const proc = browser.process();
                            if (proc && !proc.killed) proc.kill('SIGKILL');
                        } catch (_) {}
                    };
                };
                result = await scrapeLoopNet(headless, onBrowserLoop);
                break;
                
            default:
                throw new Error(`Unknown scraper: ${scraper}`);
        }
        
        activeTasks.delete(taskId);
        updateScraperStatus(scraper, 'completed', socket);
        
        // Auto-insert scraped data to database if available
        if (result && result.success) {
            let dataFilePath = null;
            
            // Determine data file path based on scraper type and result
            if (result.dataFile) {
                dataFilePath = result.dataFile;
            } else if (result.data && result.data.jsonFilePath) {
                dataFilePath = result.data.jsonFilePath;
            } else {
                // Look for latest file in scraper's data directory
                const dataDir = path.join(__dirname, 'data', scraper);
                if (fsSync.existsSync(dataDir)) {
                    const jsonFiles = fsSync.readdirSync(dataDir)
                        .filter(f => f.endsWith('.json') && !f.includes('_raw'))
                        .sort((a, b) => fsSync.statSync(path.join(dataDir, b)).mtimeMs - fsSync.statSync(path.join(dataDir, a)).mtimeMs);
                    if (jsonFiles.length > 0) {
                        dataFilePath = path.join(dataDir, jsonFiles[0]);
                    }
                }
            }
            
            // Auto-insert to database
            if (dataFilePath) {
                await autoInsertToDatabase(scraper, dataFilePath, socket);
            }
        }
        
        emitComplete(`${action} completed for ${scraper}`, scraper, socket);
        
        return result;
        
    } catch (error) {
        activeTasks.delete(taskId);
        updateScraperStatus(scraper, 'error', socket);
        emitError(error.message, scraper, socket);
        throw error;
    }
}

// Schedule management
function scheduleScrapers() {
    // Clear existing scheduled tasks
    scheduledTasks.forEach(task => task.destroy());
    scheduledTasks.clear();
    
    Object.entries(scraperStates).forEach(([scraper, state]) => {
        if (state.schedule !== 'manual') {
            let cronPattern;
            switch (state.schedule) {
                case 'hourly':
                    cronPattern = '0 * * * *'; // Every hour
                    break;
                case 'daily':
                    cronPattern = '0 9 * * *'; // Every day at 9 AM
                    break;
                case 'weekly':
                    cronPattern = '0 9 * * 1'; // Every Monday at 9 AM
                    break;
                default:
                    return;
            }
            
            const task = cron.schedule(cronPattern, async () => {
                if (scraperStates[scraper].status === 'idle') {
                    console.log(`⏰ Running scheduled scraper: ${scraper}`);
                    try {
                        const result = await executeScraper('scheduled', 'extract', { 
                            headless: true, 
                            scraper 
                        });
                        console.log(`✅ Scheduled scraper ${scraper} completed successfully`);
                    } catch (error) {
                        console.error(`❌ Scheduled scraper error for ${scraper}:`, error);
                    }
                }
            }, { scheduled: false });
            
            scheduledTasks.set(scraper, task);
            task.start();
        }
    });
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected');
    
    // Send current scraper states
    Object.entries(scraperStates).forEach(([scraper, state]) => {
        updateScraperStatus(scraper, state.status, socket);
    });

    // Legacy handlers (keep for backward compatibility)
    socket.on('startRevenueScraper', async (options = {}) => {
        try {
            // Override console.log to emit progress
            const originalLog = console.log;
            console.log = (...args) => {
                emitProgress(args.join(' '), 'rankmyhotel', socket);
                originalLog.apply(console, args);
            };

            console.log('Received headless flag (Revenue):', options.headless);
            await executeScraper('legacy', 'revenue', { 
                headless: options.headless !== false, 
                scraper: 'rankmyhotel' 
            }, socket);

            // Restore original console.log
            console.log = originalLog;
        } catch (error) {
            console.error('Revenue scraper error:', error);
        }
    });

    socket.on('startAllTablesScraper', async (options = {}) => {
        try {
            // Override console.log to emit progress
            const originalLog = console.log;
            console.log = (...args) => {
                emitProgress(args.join(' '), 'rankmyhotel', socket);
                originalLog.apply(console, args);
            };

            console.log('Received headless flag (All Tables):', options.headless);
            await executeScraper('legacy', 'all-tables', { 
                headless: options.headless !== false, 
                scraper: 'rankmyhotel' 
            }, socket);

            // Restore original console.log
            console.log = originalLog;
        } catch (error) {
            console.error('All tables scraper error:', error);
        }
    });
    
    // Individual scraper handlers
    socket.on('startRankmyhotelRevenue', async (options) => {
        await executeScraper('individual', 'revenue', { 
            ...options, 
            scraper: 'rankmyhotel' 
        }, socket);
    });
    
    socket.on('startRankmyhotelAll-tables', async (options) => {
        await executeScraper('individual', 'all-tables', { 
            ...options, 
            scraper: 'rankmyhotel' 
        }, socket);
    });
    
    socket.on('startRcm1Extract', async (options) => {
        await executeScraper('individual', 'extract', { 
            ...options, 
            scraper: 'rcm1' 
        }, socket);
    });
    
    // Handle RCM1 with different actions (including deal-center)
    socket.on('startRcm1Scraper', async (options) => {
        const action = options.action || 'extract';
        await executeScraper('individual', action, { 
            ...options, 
            scraper: 'rcm1' 
        }, socket);
    });
    
    socket.on('startCbredealflowScraper', async (options) => {
        // Determine action: properties (default) or deal-center
        const action = options.action || 'properties';
        await executeScraper('individual', action, {
            ...options,
            scraper: 'cbredealflow'
        }, socket);
    });
    
    socket.on('startLoopnetExtract', async (options) => {
        await executeScraper('individual', 'extract', { 
            ...options, 
            scraper: 'loopnet' 
        }, socket);
    });
    
    // Master controls
    socket.on('startAllScrapers', async () => {
        emitProgress('Starting all scrapers...', 'all', socket);
        
        const scrapers = ['rankmyhotel', 'rcm1', 'cbredealflow', 'loopnet'];
        const promises = scrapers.map(async (scraper) => {
            try {
                const action = scraper === 'rankmyhotel' ? 'all-tables' : 'extract';
                await executeScraper('master', action, { 
                    headless: true, 
                    scraper 
                }, socket);
            } catch (error) {
                console.error(`Error running ${scraper}:`, error);
            }
        });
        
        try {
            await Promise.allSettled(promises);
            emitComplete('All scrapers completed', 'all', socket);
        } catch (error) {
            emitError('Some scrapers failed', 'all', socket);
        }
    });
    
    socket.on('stopAllScrapers', async () => {
        emitProgress('Stopping all scrapers...', 'all', socket);

        // Cancel each task if possible
        const cancelPromises = [];
        activeTasks.forEach((task, taskId) => {
            if (typeof task.cancel === 'function') {
                cancelPromises.push(task.cancel());
            }
            updateScraperStatus(task.scraper, 'stopped', socket);
            activeTasks.delete(taskId);
        });

        // Wait briefly for all cancels to finish
        await Promise.allSettled(cancelPromises);

        emitComplete('All scrapers stopped', 'all', socket);
    });
    
    // Schedule management
    socket.on('updateSchedule', (data) => {
        const { scraper, schedule } = data;
        if (scraperStates[scraper]) {
            scraperStates[scraper].schedule = schedule;
            scheduleScrapers(); // Re-initialize scheduled tasks
            emitProgress(`Schedule updated for ${scraper}: ${schedule}`, scraper, socket);
        }
    });

    // Handle data file requests
    socket.on('getDataFiles', async () => {
        try {
            const files = [
                'city_summary.json', 
                'powerbi_data.json', 
                'all_tables_data.json', 
                'tables_data_progress.json',
                'rcm1_data.json',
                'cbredealflow_data.json',
                'loopnet_data.json'
            ];
            const fileData = {};

            for (const file of files) {
                try {
                    const data = await fs.readFile(file, 'utf-8');
                    fileData[file] = {
                        exists: true,
                        size: Buffer.byteLength(data, 'utf8'),
                        lastModified: (await fs.stat(file)).mtime
                    };
                } catch (err) {
                    fileData[file] = {
                        exists: false,
                        error: err.code
                    };
                }
            }

            socket.emit('dataFilesStatus', fileData);
        } catch (error) {
            emitError(error.message, 'all', socket);
        }
    });

    // NEW: Return list of CBRE Deal Center downloads
    socket.on('getCbreDownloads', async () => {
        try {
            const baseDir = path.join(__dirname, 'data', 'cbredealflow', 'dealcenter');
            const result = [];
            if (fsSync.existsSync(baseDir)) {
                const folders = fsSync.readdirSync(baseDir, { withFileTypes: true })
                    .filter(d => d.isDirectory());

                for (const dirEnt of folders) {
                    const folderName = dirEnt.name;
                    const folderPath = path.join(baseDir, folderName);
                    const files = fsSync.readdirSync(folderPath, { withFileTypes: true })
                        .filter(f => f.isFile())
                        .map(fileEnt => {
                            const absolute = path.join(folderPath, fileEnt.name);
                            return {
                                name: fileEnt.name,
                                size: fsSync.statSync(absolute).size,
                                url: `/downloads/cbredealflow/dealcenter/${encodeURIComponent(folderName)}/${encodeURIComponent(fileEnt.name)}`
                            };
                        });
                    result.push({ folder: folderName, files });
                }
            }
            socket.emit('cbreDownloadsList', result);
        } catch (err) {
            console.error('Error listing CBRE downloads:', err.message);
            emitError('Failed to list CBRE downloads', 'cbredealflow', socket);
        }
    });
    
    // Get scraper status
    socket.on('getScraperStatus', () => {
        socket.emit('scraperStatesUpdate', scraperStates);
    });

    // Get active tasks
    socket.on('getActiveTasks', () => {
        const tasks = Array.from(activeTasks.entries()).map(([id, task]) => ({
            id,
            ...task,
            duration: Date.now() - task.startTime.getTime()
        }));
        socket.emit('activeTasksUpdate', tasks);
    });

    // New: dump latest scraped JSON into PostgreSQL
    socket.on('dumpToDatabase', async ({ scraper }) => {
        try {
            if (!scraper) throw new Error('scraper not specified');

            emitProgress(`Dumping latest ${scraper} data into database...`, scraper, socket);

            const dataDir = path.join(__dirname, 'data', scraper);
            if (!fsSync.existsSync(dataDir)) {
                throw new Error('Data directory not found');
            }

            // Find latest JSON file by modified time
            const jsonFiles = fsSync.readdirSync(dataDir)
                .filter(f => f.endsWith('.json'))
                .sort((a, b) => fsSync.statSync(path.join(dataDir, b)).mtimeMs - fsSync.statSync(path.join(dataDir, a)).mtimeMs);

            if (jsonFiles.length === 0) {
                throw new Error('No JSON files available');
            }

            const latestFile = jsonFiles[0];
            const raw = await fs.readFile(path.join(dataDir, latestFile), 'utf8');
            const payload = JSON.parse(raw);

            // Table names are same as scraper keys
            const tableNameMap = {
                rcm1: 'rcm1',
                cbredealflow: 'cbredealflow',
                rankmyhotel: 'rankmyhotel'
            };

            const table = tableNameMap[scraper];
            if (!table) throw new Error('Unsupported scraper');

            // Insert with filename for tracking
            const result = await insertData(table, payload, latestFile);

            emitComplete(`✅ Successfully inserted ${result.inserted} properties from ${latestFile} into database`, scraper, socket);
        } catch (err) {
            console.error('Database dump error:', err.message);
            emitError(`DB Dump failed: ${err.message}`, scraper, socket);
        }
    });

    // New: normalize latest JSON into relational tables
    socket.on('normalizeToDb', async ({ scraper }) => {
        try {
            if (!scraper) throw new Error('scraper not specified');
            emitProgress(`Normalizing ${scraper} data into relational tables...`, scraper, socket);

            const { loadLatestToPg } = await import('./scripts/etl_to_pg.js');
            const result = await loadLatestToPg(scraper);

            emitComplete(`Inserted ${result.inserted} records from ${result.file} into properties/contacts`, scraper, socket);
        } catch (err) {
            console.error('Normalize error:', err.message);
            emitError(`Normalize failed: ${err.message}`, scraper, socket);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Initialize scheduled tasks
scheduleScrapers();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    
    // Stop all scheduled tasks
    scheduledTasks.forEach(task => task.destroy());
    
    // Stop all active tasks
    activeTasks.clear();
    
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Professional Data Extraction Hub running on port ${PORT}`);
    console.log(`📊 Supporting 4 scrapers: RankMyHotel, RCM1, CBREDealFlow, LoopNet`);
    console.log(`⚡ Features: Individual controls, scheduling, headless mode, live progress`);
}); 