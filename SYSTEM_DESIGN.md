# Quranik - System Design & Architecture

## Overview
Quranik is a modern, responsive single-page application (SPA) built to stream Quranic recitations. It allows users to browse surahs, search for specific recitations, select from various reciters, and play high-quality audio seamlessly.

## 1. Technology Stack
* **Core Framework**: React 19, initialized with Vite.
* **Language**: TypeScript for strict typing and improved developer experience.
* **Styling**: Tailwind CSS v4, PostCSS, and raw CSS (`App.css`, `index.css`). Includes modern UI patterns like glassmorphism.
* **Animations**: Framer Motion.
* **Icons**: Lucide React.
* **Data Sources**: 
  * Al Quran Cloud API (for Surah metadata).
  * MP3Quran Data (for Reciter metadata and Audio CDN).

## 2. System Architecture
The application follows a client-side rendering (CSR) architecture. There is no custom backend; the application interfaces directly with external APIs and static data files to render the UI and stream audio.

### 2.1 State Management (`AudioContext`)
The core state of the application revolves around audio playback, managed centrally via the React Context API in `src/context/AudioContext.tsx`.

* **Context State**: Tracks `isPlaying`, `nowPlaying` (current Surah), `currentReciter`, `currentTime`, `duration`, `volume`, and `playbackSpeed`.
* **HTML5 Audio Engine**: Utilizes a single underlying `<audio>` element reference (`audioRef`). Event listeners (`timeupdate`, `loadedmetadata`, `ended`) are attached to sync the React state with the native browser audio engine.
* **Persistence**: The volume preference and selected reciter are persisted to the browser's `localStorage` to retain user settings across sessions.

### 2.2 Data Fetching Layer (Custom Hooks)
The app encapsulates data logic into custom hooks to separate concerns from the UI components:

* **`useSurahs`**: Asynchronously fetches the list of 114 Surahs from `https://api.alquran.cloud/v1/surah`. Handles loading, error, and success states.
* **`useReciters`**: Synchronously loads reciter metadata from a local JSON file (`src/data/reciters.json`). It transforms the schema from the MP3Quran format to the internal `Reciter` interface, specifically extracting the standard Murattal Hafs (`moshaf_type === 11`) audio server URLs for each reciter.

### 2.3 Audio Streaming
Audio playback does not require downloading the full MP3 before playing. The `<audio>` tag streams directly from the selected reciter's CDN.
* **URL Construction**: The audio URL is built dynamically: `${reciter.serverUrl}${surahNumber.padStart(3, '0')}.mp3`.
* Example: `https://server8.mp3quran.net/afs/001.mp3`.

### 2.4 Component Structure
The primary UI is housed in `src/App.tsx`:
* **`App` (Root)**: Initializes the `AudioProvider` and passes down the saved reciter from `localStorage`.
* **`MainApp`**: The primary layout container. It manages local UI state like the Surah search query (`search`).
  * **Header**: Contains the application logo and the `ReciterCombobox`.
  * **Surah List**: Renders the fetched Surahs. Filters the list based on the search query across English name, Arabic name, or Surah number.
  * **Bottom Player**: Fixed glassmorphism footer that appears when a Surah is playing. Controls playback (Play/Pause, Next/Prev, Seek bar).
* **`ReciterCombobox`**: A custom, accessible, searchable dropdown component for selecting a reciter. Manages its own local state for search filtering and keyboard navigation.

## 3. Data Models (`src/types/quran.ts`)
The system relies on strong TypeScript interfaces to manage data predictably:
* **`Surah`**: `{ number, name, englishName, englishNameTranslation, numberOfAyahs, revelationType }`
* **`Reciter`**: `{ identifier, language, name, englishName, format, type, serverUrl }`

## 4. Key Workflows

### 4.1 Changing a Reciter
1. User opens `ReciterCombobox` and selects a reciter.
2. `setReciter` is called on the `AudioContext`.
3. Context updates `currentReciter` state and saves to `localStorage`.
4. If a Surah is currently playing, the audio engine swaps the `src` URL to the new reciter's CDN, restores the `currentTime`, and resumes playing seamlessly.

### 4.2 Playing a Surah
1. User clicks a Surah card in `MainApp`.
2. `playSurah` is invoked in `AudioContext`.
3. The new audio URL is generated. The native `<audio>` element src is updated and `.play()` is executed.
4. The Bottom Player mounts, listening to `currentTime` updates to move the progress bar.
