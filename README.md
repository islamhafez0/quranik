# Quranik

Quranik is a modern, responsive single-page application (SPA) built to stream Quranic recitations. It provides a seamless, gapless audio experience, allowing users to browse Surahs, search efficiently in Arabic or English, select from various reciters, and listen to high-quality audio without interruptions.

## Features
- **Gapless Audio Playback**: Streams full-Surah MP3s from MP3Quran directly via HTML5 Audio, ensuring no delays between verses.
- **Auto-Play Next Surah**: Automatically transitions to the next Surah when the current one finishes.
- **Robust Arabic Search**: Advanced text normalization algorithm that ignores Harakat (diacritics), Tatweel, and varied Alef/Hamza forms, allowing users to find Surahs easily even with imperfect Arabic typing (e.g., typing "سوره الفاتحه" matches "سُورَةُ ٱلْفَاتِحَةِ").
- **Multiple Reciters**: Choose from a vast library of over 230 reciters (data sourced from MP3Quran).
- **Offline Ready PWA**: Can be installed as a Progressive Web App for quick access.
- **Bilingual Interface**: Supports both English and Arabic UI with RTL layout support.
- **Persistent State**: Remembers your selected reciter, volume, and last played position across sessions.
- **Media Session Integration**: Control playback natively from your device lock screen or hardware media keys.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + Framer Motion (Animations)
- **State Management**: React Context API (`AudioContext`, `LanguageContext`)
- **Data Fetching**: Custom hooks (`useSurahs`, `useReciters`) fetching from Al Quran Cloud and local JSON.
- **List Virtualization**: `react-virtuoso` for 60fps rendering of the Surah list.

## Architecture & APIs
The application uses a pure Client-Side Rendering (CSR) architecture and interfaces with:
- **Al Quran Cloud API** (`api.alquran.cloud`): For Surah metadata (names, ayah counts, revelation types).
- **MP3Quran CDN** (`server8.mp3quran.net`): For streaming audio and fetching reciter metadata.

Audio state is centralized in `AudioContext.tsx`, which attaches native browser event listeners (`timeupdate`, `ended`) to a single underlying `<audio>` element to manage gapless playback and auto-advancement.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## License
MIT License
