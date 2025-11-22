import { writeFileSync } from 'fs';

// Génération des classes
const classes = [
  { id: 'classe-1', nom: '3èmeA', niveau: '3ème', nombreEleves: 28, ecoleId: 'ecole-1' },
  { id: 'classe-2', nom: '3èmeB', niveau: '3ème', nombreEleves: 25, ecoleId: 'ecole-1' },
  { id: 'classe-3', nom: 'TerminaleS1', niveau: 'Terminale S', nombreEleves: 30, ecoleId: 'ecole-2' },
  { id: 'classe-4', nom: 'TerminaleS2', niveau: 'Terminale S', nombreEleves: 32, ecoleId: 'ecole-2' },
  { id: 'classe-5', nom: 'CE2A', niveau: 'CE2', nombreEleves: 22, ecoleId: 'ecole-3' },
  { id: 'classe-6', nom: '1èreSTI2D', niveau: '1ère STI2D', nombreEleves: 26, ecoleId: 'ecole-4' }
];

// Génération des missions
const missions = [];
const startDate = new Date('2025-11-01');

for (let i = 0; i < 15; i++) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + Math.floor(Math.random() * 60));

  missions.push({
    id: `mission-${i + 1}`,
    coursId: `cours-${(i % 5) + 1}`,
    ecoleId: `ecole-${(i % 4) + 1}`,
    classeId: `classe-${(i % 6) + 1}`,
    dateDebut: date.toISOString().split('T')[0],
    dateFin: date.toISOString().split('T')[0],
    heureDebut: ['08:00', '10:00', '14:00'][Math.floor(Math.random() * 3)],
    heureFin: ['10:00', '12:00', '16:00', '18:00'][Math.floor(Math.random() * 4)],
    formateurId: `user-${(i % 3) + 1}`,
    statut: ['planifiee', 'en_cours', 'terminee'][Math.floor(Math.random() * 3)],
    fichiersNotes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// Génération des propositions
const propositions = [];
const futureDate = new Date('2025-12-01');

for (let i = 0; i < 10; i++) {
  const date = new Date(futureDate);
  date.setDate(date.getDate() + Math.floor(Math.random() * 30));

  propositions.push({
    id: `prop-${i + 1}`,
    coursId: `cours-${(i % 5) + 1}`,
    ecoleId: `ecole-${(i % 4) + 1}`,
    classeId: `classe-${(i % 6) + 1}`,
    dateDebut: date.toISOString().split('T')[0],
    dateFin: date.toISOString().split('T')[0],
    heureDebut: '09:00',
    heureFin: '12:00',
    type: i < 7 ? 'publique' : 'directe',
    statut: ['en_attente', 'acceptee', 'refusee'][Math.floor(Math.random() * 3)],
    formateurCibleId: i >= 7 ? `user-${(i % 3) + 1}` : undefined,
    description: `Mission pour enseigner le cours dans le cadre du programme scolaire`,
    remuneration: [40, 45, 50][Math.floor(Math.random() * 3)] * 3,
    dateExpiration: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin-1',
    candidatures: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// Génération des factures
const factures = [];
for (let i = 0; i < 8; i++) {
  const dateEmission = new Date('2025-11-01');
  dateEmission.setDate(dateEmission.getDate() + i * 5);

  const lignes = [
    {
      id: `ligne-${i}-1`,
      description: `Cours de mathématiques - Collège Jean Moulin`,
      missionId: `mission-${i + 1}`,
      quantite: 3,
      tauxHoraire: 45,
      montant: 135
    }
  ];

  const sousTotal = lignes.reduce((acc, l) => acc + l.montant, 0);
  const taxe = sousTotal * 0.2;

  factures.push({
    id: `facture-${i + 1}`,
    numero: `FAC-2025-${String(i + 1).padStart(3, '0')}`,
    formateurId: `user-${(i % 3) + 1}`,
    lignes,
    sousTotal,
    taxe,
    total: sousTotal + taxe,
    dateEmission: dateEmission.toISOString().split('T')[0],
    dateEcheance: new Date(dateEmission.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    statut: ['soumise', 'validee', 'payee'][Math.floor(Math.random() * 3)],
    createdAt: dateEmission.toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// Génération des notifications
const notifications = [];
const typesNotif = [
  'nouvelle_proposition',
  'proposition_acceptee',
  'mission_confirmee',
  'facture_validee'
];

for (let i = 0; i < 12; i++) {
  const date = new Date();
  date.setHours(date.getHours() - i * 6);

  notifications.push({
    id: `notif-${i + 1}`,
    userId: `user-${(i % 3) + 1}`,
    type: typesNotif[i % typesNotif.length],
    titre: `Notification ${i + 1}`,
    message: `Message de test pour la notification ${i + 1}`,
    lien: `/missions/mission-${i + 1}`,
    lu: i > 5,
    createdAt: date.toISOString(),
    metadata: {}
  });
}

// Écriture des fichiers
writeFileSync('./src/assets/data/classes.json', JSON.stringify(classes, null, 2));
writeFileSync('./src/assets/data/missions.json', JSON.stringify(missions, null, 2));
writeFileSync('./src/assets/data/propositions.json', JSON.stringify(propositions, null, 2));
writeFileSync('./src/assets/data/factures.json', JSON.stringify(factures, null, 2));
writeFileSync('./src/assets/data/notifications.json', JSON.stringify(notifications, null, 2));

console.log('✅ Mock data generated successfully!');
