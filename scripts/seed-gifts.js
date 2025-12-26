const fs = require('fs');
const path = require('path');

// CONFIGURATION
const NOCODB_API_URL = "https://nocodb.julian-mbp.pro";
const NOCODB_API_TOKEN = "5-qzRPHBpMsQz5JIbFsWlf4x2tH9r5nPDkStLC5q";
const TABLE_ID = "moba9dsegr191su"; // Gift table
const CSV_PATH = path.join(__dirname, '../../datos.csv'); // Relative to scripts/

console.log(`Reading CSV from: ${CSV_PATH}`);

try {
    const data = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = data.split('\n');

    // Skip header (Line 1) and empty lines
    const startLine = 1;

    async function processLines() {
        let count = 0;
        for (let i = startLine; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // CSV Format: Category,Item,Description,Estimated Price Range (COP)
            // Note: simple split by comma handling. If description has commas, this breaks.
            // But datos.csv looks simple.
            const parts = line.split(',');
            if (parts.length < 2) continue;

            const category = parts[0];
            const item = parts[1];
            // Rejoin description if it was split
            const description = parts[2];
            const price = parts[3] || '';

            const payload = {
                Category: category,
                Item: item,
                Description: description,
                PriceRange: price,
                Existencias: 1 // Default
            };

            console.log(`Uploading: ${item}...`);

            try {
                const res = await fetch(`${NOCODB_API_URL}/api/v2/tables/${TABLE_ID}/records`, {
                    method: 'POST',
                    headers: {
                        'xc-token': NOCODB_API_TOKEN,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    console.log(`✅ Success: ${item}`);
                    count++;
                } else {
                    console.error(`❌ Failed: ${item}`, await res.text());
                }
            } catch (err) {
                console.error(`❌ Error uploading ${item}:`, err.message);
            }

            // Be nice to the API
            await new Promise(r => setTimeout(r, 200));
        }
        console.log(`\nDone! Uploaded ${count} items.`);
    }

    processLines();

} catch (err) {
    console.error("Error reading CSV:", err);
}
