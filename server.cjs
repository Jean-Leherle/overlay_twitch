const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = 8080;

// Récupérer les arguments passés au serveur
const args = process.argv.slice(2); // Exclut `node` et le fichier .cjs
const distPath = args[0] || path.join(__dirname, 'dist'); // Utilise le chemin passé ou le répertoire par défaut

console.log(`Serving files from: ${distPath}`);

// Serve les fichiers compilés de Vite
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});