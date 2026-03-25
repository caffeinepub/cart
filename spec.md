# RadioVerse 3D

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- Full radio app with multiple genre channels (Pop, Jazz, Hip-Hop, Classical, Rock, Afrobeats, Lo-Fi, Electronic)
- 3D cyberpunk/synthwave visual style with glassmorphism panels
- Now Playing card with playback controls, seek bar, and equalizer visualizer
- Station channel grid with 3D clay icons per genre
- Top Picks section with image-based tiles
- Nav bar: Explore, Stations, Genre, Account pages
- Streaming via public radio stream URLs (icecast/shoutcast)
- Animated neon equalizer bars when audio is playing

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: store channel definitions (name, genre, frequency, stream URL, description)
2. Frontend: build full layout matching design preview
   - Glassmorphism Now Playing card with HTML5 Audio
   - Station channel cards grid with 3D icon visuals
   - Top Picks row
   - Animated equalizer bars using Web Audio API or CSS animation
   - Three.js/R3F 3D retro radio hero object
   - Nav with active state, search, user avatar
