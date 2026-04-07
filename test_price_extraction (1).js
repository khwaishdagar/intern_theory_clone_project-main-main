// Test script to verify price extraction improvements
import { scrapeCBREDealFlow } from './scrapers/cbredealflow_scraper.js';

async function testPriceExtraction() {
    console.log('🧪 Testing enhanced price extraction...');
    
    try {
        const result = await scrapeCBREDealFlow(true, (browser) => {
            console.log('🌐 Browser started for testing');
        });
        
        if (result && result.success) {
            console.log('✅ Scraper completed successfully');
            console.log(`📊 Found ${result.data?.properties?.length || 0} properties`);
            
            // Check how many properties have prices
            const properties = result.data?.properties || [];
            const withPrices = properties.filter(p => p.price && p.price.trim() !== '');
            const withoutPrices = properties.filter(p => !p.price || p.price.trim() === '');
            
            console.log(`💰 Properties with prices: ${withPrices.length}`);
            console.log(`❌ Properties without prices: ${withoutPrices.length}`);
            
            // Show some examples
            if (withPrices.length > 0) {
                console.log('\n📋 Sample properties with prices:');
                withPrices.slice(0, 3).forEach((p, i) => {
                    console.log(`  ${i + 1}. ${p.title} - ${p.price}`);
                });
            }
            
            if (withoutPrices.length > 0) {
                console.log('\n📋 Sample properties without prices:');
                withoutPrices.slice(0, 3).forEach((p, i) => {
                    console.log(`  ${i + 1}. ${p.title} - No price`);
                });
            }
            
        } else {
            console.log('❌ Scraper failed:', result?.error || 'Unknown error');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testPriceExtraction(); 