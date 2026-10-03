# DoAide Type — Free Typing Speed Test

A free, client-side typing speed test and practice tool. Measure your WPM, track accuracy, practice weak keys, and challenge friends.

**Live at:** [type.doaide.com](https://type.doaide.com)

## Features

- **Speed Test** — 15s, 30s, 60s, or 120s tests with real-time WPM graph
- **Multiple Modes** — Words, Sentences, Code (JS/Python/HTML), Numbers, Custom text
- **Difficulty Levels** — Easy, Medium, Hard, Expert
- **Results & Stats** — Beautiful shareable results card, history tracking, WPM progress chart
- **Practice Mode** — Home row, top row, bottom row drills + weak key detection
- **Leaderboard Ranks** — Beginner → Average → Fast → Expert → Pro
- **Themes** — Dark, Light, Retro/Terminal, Ocean
- **Sound Effects** — Subtle keypress sounds via Web Audio API
- **Sharing** — Tweet, WhatsApp, copy link, download results as image
- **No Login Required** — All data stored in localStorage

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- Recharts (WPM graphs)
- html-to-image (shareable results)

## Development

```bash
npm install
npm run dev     # Starts at 172.18.0.1:3056
```

## Build & Deploy

```bash
npm run build
npx serve dist -l tcp://172.18.0.1:3056 -s
```

### systemd Service

```bash
sudo cp doaide-type-web.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now doaide-type-web
```

## License

Proprietary — DoAide
