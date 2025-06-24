import fs from 'fs/promises';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import 'dotenv/config';

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();

interface LogEntry {
  timestamp?: string;
  cost?: number;
}

async function run() {
  const snap = await db.collection('insights_logs').get();
  const totals: Record<string, number> = {};
  snap.forEach(doc => {
    const data = doc.data() as LogEntry;
    if (!data.timestamp || typeof data.cost !== 'number') return;
    const day = data.timestamp.slice(0, 10);
    totals[day] = (totals[day] || 0) + data.cost;
  });

  const sorted = Object.entries(totals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, cost]) => ({ date, cost: Number(cost.toFixed(6)) }));

  const csv = 'date,cost\n' + sorted.map(r => `${r.date},${r.cost}`).join('\n');
  await fs.writeFile('insights-costs.csv', csv);
  console.log(`Arquivo insights-costs.csv gerado com ${sorted.length} linhas.`);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Custos de IA por Dia</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
<canvas id="costChart" width="600" height="400"></canvas>
<script>
const ctx = document.getElementById('costChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ${JSON.stringify(sorted.map(r => r.date))},
    datasets: [{
      label: 'Custo (USD)',
      data: ${JSON.stringify(sorted.map(r => r.cost))},
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: { y: { beginAtZero: true } }
  }
});
</script>
</body>
</html>`;
  await fs.writeFile('insights-costs.html', html);
  console.log('Arquivo insights-costs.html gerado.');
}

run().catch(err => {
  console.error('Erro ao calcular custos:', err);
  process.exit(1);
});
