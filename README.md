# Test technique implémentation IA

Ce projet a été réalisé dans le cadre d'un test technique.

---

## Structure du projet

- **frontend/** → Contient l'application React
- **backend/** → Contient l'application Django

---

## Installation et exécution

### Backend (Django)

Assurez-vous d'avoir **Python 3** installé.

```bash
cd backend
python3 manage.py runserver
```

Le serveur sera accessible sur **http://127.0.0.1:8000/**.

### Frontend (ReactJS)

Assurez-vous d'avoir **Node.js** installé.

```bash
cd frontend
npm install  # (Seulement la première fois)
npm start
```

L'application sera accessible sur **http://localhost:3000/**.

---

## Format du fichier JSON pour l'emploi du temps

L'application accepte un fichier JSON respectant le format suivant :

```json
{
  "schedule": [
    {
      "date": "03/02/2025",
      "day": "Lundi",
      "courses": [
        {
          "name": "Maths",
          "start_time": "08:30",
          "end_time": "10:30",
          "color": "#FF5733",
          "rendu": false
        },
        {
          "name": "Physique",
          "start_time": "10:30",
          "end_time": "12:30",
          "color": "#3498DB",
          "rendu": true
        }
      ]
    }
  ]
}
```

### Explication des champs

| Champ        | Type    | Description |
|-------------|--------|-------------|
| `date`      | String | Date du jour (format `jj/mm/aaaa`) |
| `day`       | String | Jour de la semaine |
| `courses`   | Array  | Liste des cours de la journée |
| `name`      | String | Nom du cours |
| `start_time` | String | Heure de début (format `HH:mm`) |
| `end_time`   | String | Heure de fin (format `HH:mm`) |
| `color`     | String | Couleur associée au cours (hexadécimal) |
| `rendu`     | Bool   | Indique si un rendu est prévu pour ce cours |

---

## Upload du JSON

L'emploi du temps peut être chargé dans la webapp via le formulaire d'upload.

---

## 🛠 Développement
- Backend : **Django (Python)**
- Frontend : **ReactJS**
