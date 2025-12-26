const fs = require('fs');
const path = require('path');

// CONFIGURATION
const NOCODB_API_URL = "https://nocodb.julian-mbp.pro";
const NOCODB_API_TOKEN = "5-qzRPHBpMsQz5JIbFsWlf4x2tH9r5nPDkStLC5q";
const TABLE_ID = "mbra9uo0wh2i6c0"; // Guests table
const CSV_PATH = path.join(__dirname, '../../invitados.csv'); // Relative to scripts/

console.log(`Leyendo CSV desde: ${CSV_PATH}`);

try {
    const data = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = data.split('\n');

    // Skip header (Line 1) and empty lines
    const startLine = 1;

    async function processLines() {
        let count = 0;
        let errors = 0;
        
        for (let i = startLine; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // CSV Format: Nombre Representante,N° Integrantes,Residencia,Celular,correo,N° de Integrantes confirmados
            // Parse CSV handling commas within quoted fields
            const parts = line.split(',');
            if (parts.length < 3) {
                console.log(`⚠️  Línea ${i + 1} ignorada (formato inválido): ${line}`);
                continue;
            }

            const nombreRepresentante = parts[0]?.trim() || '';
            const nIntegrantes = parts[1]?.trim() || '0';
            const residencia = parts[2]?.trim() || '';
            const celular = parts[3]?.trim() || '';
            const correo = parts[4]?.trim() || '';
            const nIntegrantesConfirmados = parts[5]?.trim() || '';

            // Validar que al menos tenga nombre y número de integrantes
            if (!nombreRepresentante) {
                console.log(`⚠️  Línea ${i + 1} ignorada (sin nombre): ${line}`);
                continue;
            }

            // Convertir número de integrantes a número
            const numIntegrantes = parseInt(nIntegrantes) || 0;
            const numIntegrantesConfirmados = nIntegrantesConfirmados ? parseInt(nIntegrantesConfirmados) : null;

            const payload = {
                'Nombre Representante': nombreRepresentante,
                'N° Integrantes': numIntegrantes,
                Residencia: residencia || null,
                Celular: celular || null,
                correo: correo || null,
                'N° de Integrantes confirmados': numIntegrantesConfirmados || null,
                Confirmado: false, // Por defecto no confirmado
                invited: false // Por defecto no invitado
            };

            console.log(`Subiendo: ${nombreRepresentante}...`);

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
                    const result = await res.json();
                    console.log(`✅ Éxito: ${nombreRepresentante} (ID: ${result.Id || 'N/A'})`);
                    count++;
                } else {
                    const errorText = await res.text();
                    console.error(`❌ Error: ${nombreRepresentante}`, errorText);
                    errors++;
                }
            } catch (err) {
                console.error(`❌ Error subiendo ${nombreRepresentante}:`, err.message);
                errors++;
            }

            // Esperar un poco para no sobrecargar la API
            await new Promise(r => setTimeout(r, 200));
        }
        
        console.log(`\n✅ Completado!`);
        console.log(`   - Invitados subidos: ${count}`);
        if (errors > 0) {
            console.log(`   - Errores: ${errors}`);
        }
    }

    processLines().catch(err => {
        console.error("Error procesando líneas:", err);
    });

} catch (err) {
    console.error("Error leyendo CSV:", err);
}
