import fs from 'fs/promises';

async function scrapeSkillIndia() {
    console.log('Starting Skill India Digital Data Scraper...');

    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Origin': 'https://www.skillindiadigital.gov.in',
        'Referer': 'https://www.skillindiadigital.gov.in/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    try {
        // 1. Fetch Internships
        console.log('\nFetching Internships...');
        const internshipPayload = {
            "PageNumber": 1,
            "PageSize": 20
        };
        
        const internshipRes = await fetch('https://api-fe.skillindiadigital.gov.in/api/internship/get-programs', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(internshipPayload)
        });
        
        if (internshipRes.ok) {
            const internshipData = await internshipRes.json();
            await fs.writeFile('skillindia_internships.json', JSON.stringify(internshipData, null, 2));
            console.log(`Successfully saved Internships data. Items count: ${internshipData?.data?.content?.length || internshipData?.data?.length || 'Unknown'}`);
        } else {
            console.error('Failed to fetch internships. Status:', internshipRes.status);
        }

        // 2. Fetch Jobs
        console.log('\nFetching Jobs...');
        const jobsPayload = {
            "PageSize": 20,
            "PageNumber": 1,
            "JobStatus": "Active",
            "SearchString": ""
        };

        const jobsRes = await fetch('https://api-fe.skillindiadigital.gov.in/api/jobs/filter', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(jobsPayload)
        });

        if (jobsRes.ok) {
            const jobsData = await jobsRes.json();
            await fs.writeFile('skillindia_jobs.json', JSON.stringify(jobsData, null, 2));
            console.log(`Successfully saved Jobs data. Items count: ${jobsData?.data?.content?.length || jobsData?.data?.length || 'Unknown'}`);
        } else {
            console.error('Failed to fetch jobs. Status:', jobsRes.status);
        }

        // 3. Fetch Courses (Sector 13 as example, typically Agriculture or similar)
        console.log('\nFetching Courses...');
        const coursesPayload = {
            "PageNumber": 1,
            "PageSize": 20
        };

        const coursesRes = await fetch('https://api-fe.skillindiadigital.gov.in/api/online-offline-courses/combine-course-list', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(coursesPayload)
        });

        if (coursesRes.ok) {
            const coursesData = await coursesRes.json();
            await fs.writeFile('skillindia_courses.json', JSON.stringify(coursesData, null, 2));
            console.log(`Successfully saved Courses data. Items count: ${coursesData?.data?.content?.length || coursesData?.data?.length || 'Unknown'}`);
        } else {
            console.error('Failed to fetch courses. Status:', coursesRes.status);
        }

        console.log('\nScraping complete! Check the JSON files for data.');

    } catch (error) {
        console.error('Error during scraping API:', error);
    }
}

scrapeSkillIndia();
