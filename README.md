# arbeitszeit

Ein minimalistischer Arbeitszeitrechner mit Supabase-Backend und Light/Dark Theme.

## ✨ Features

- ✅ **Stunden erfassen** mit automatischer Gehaltsberechnung
- ✅ **Dashboard** mit Zusammenfassung nach Stellentyp
- ✅ **Trend-Chart** — Visualisierung der täglichen Einnahmen mit Chart.js
- ✅ **Job-Filter** — Filtern nach Stellentyp im Dashboard und Monatsansicht
- ✅ **Monatsübersicht** mit Kalender-Navigation
- ✅ **Detailansicht** pro Monat mit Datum-Sortierung
- ✅ **Light & Dark Mode** mit Theme-Toggle (☀️/🌙)
- ✅ **Supabase Backend** — Online PostgreSQL-Datenbank
- ✅ **Auto-Deploy** via Vercel + GitHub
- ✅ **Responsive Design** im OpenClaw-Docs-Stil

## 🚀 Live Demo

**[arbeitszeit-mocha.vercel.app](https://arbeitszeit-mocha.vercel.app/)**

## 💼 Stellentypen & Stundenlöhne

| Stelle                  | Stundenlohn |
|-------------------------|-------------|
| Ganztag                 | 15€/h       |
| Hausaufgabenbetreuung   | 14€/h       |
| Freitagsbetreuung       | 14€/h       |

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS (CSS Variables für Theming), Vanilla JavaScript
- **Charts:** Chart.js für Trend-Visualisierung
- **Database:** Supabase (PostgreSQL mit Row Level Security)
- **Hosting:** Vercel (Auto-Deploy von GitHub)
- **Design:** Dark/Light Theme mit OpenClaw Docs-Stil

## 📂 Struktur

```
arbeitszeit/
├── index.html      # Hauptseite mit Navigation
├── style.css       # Theming (Dark/Light Mode mit CSS Variables)
├── script.js       # Supabase Integration + UI Logic
└── README.md       # Diese Datei
```

## 🎨 Design

**Dark Mode (Standard):**
- Hintergrund: `#0a0a0a`
- Akzentfarbe: `#00ff00` (Grün)
- Minimalistisch, modern, wie OpenClaw Docs

**Light Mode:**
- Hintergrund: `#ffffff`
- Akzentfarbe: `#00aa00` (Gedämpftes Grün)
- Sauber, hell, gut lesbar

**Theme wechseln:** Button oben rechts (☀️/🌙)

## 🗄️ Datenbank

Supabase PostgreSQL mit folgender Tabelle:

```sql
CREATE TABLE arbeitszeit_entries (
  id BIGSERIAL PRIMARY KEY,
  job TEXT NOT NULL,
  hours NUMERIC NOT NULL,
  rate NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policy:** Public access (kein Login erforderlich)

## 🚢 Deployment

Automatisches Deployment via Vercel:
1. Push zu `main` Branch → Production-Deployment
2. Push zu anderen Branches → Preview-Deployment

```bash
git add .
git commit -m "Update"
git push origin main
```

→ Vercel deployt automatisch in ~30 Sekunden

## 🧪 Local Development

```bash
# Repository clonen
git clone https://github.com/phillipschwarz/arbeitszeit.git
cd arbeitszeit

# Im Browser öffnen
open index.html
```

**Hinweis:** Supabase-Credentials sind im Code (`script.js`). Für Production sollten die in Environment Variables.

## 📝 Verwendung

1. **Hinzufügen:** Stelle, Stunden und Datum eingeben
2. **Dashboard:** Übersicht nach Stellentyp gruppiert mit Trend-Chart
3. **Filtern:** Nach Stellentyp filtern im Dashboard oder Monatsansicht
4. **Monate:** Kalender-Karten mit Monatsübersicht
5. **Entfernen:** Einzelne Einträge löschen

## 🦡 Gebaut von

Chester — mit Phillip's Hilfe

**Entwicklungszeitraum:** 02.02.2026 – 04.02.2026
**Features:** Dark/Light Theme, Trend-Chart, Job-Filter
**Status:** ✅ Production-ready

---

*Powered by Supabase, Vercel & OpenClaw*
