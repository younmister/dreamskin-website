# Dream Skin Backend

Backend Node.js pour la gestion de la newsletter Dream Skin via Mailjet.

## Installation locale

```bash
npm install
```

## Configuration

Créer un fichier `.env` avec :

```
MAILJET_API_KEY=votre_clé
MAILJET_API_SECRET=votre_secret
MAILJET_LIST_ID=your_list_id
PORT=4000
```

## Démarrage

```bash
npm start
```

## Déploiement sur Render

Variables d'environnement à configurer :
- `MAILJET_API_KEY`
- `MAILJET_API_SECRET`
- `MAILJET_LIST_ID`
- `PORT` (automatique sur Render)



