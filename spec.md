# FIREEYES

## Current State
New project -- no existing application files.

## Requested Changes (Diff)

### Add
- 3D bike racing game using React Three Fiber / Three.js
- Player controls a motorcycle on a highway road
- Robot opponent that races against the player
- Traffic cars driving on the road (obstacles to dodge)
- Level system from 1 to 500 with increasing difficulty
- Speed HUD, level display, health/lives, score
- Fire/neon visual effects on player bike
- Game states: menu, racing, level complete, game over

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Set up React Three Fiber scene with camera, lighting, fog
2. Create infinite scrolling road with lane markings
3. Build player bike model (3D geometry, fire trail)
4. Build robot opponent bike with AI movement
5. Add traffic cars that spawn and move toward player
6. Implement keyboard controls (left/right/accelerate/brake)
7. Collision detection for cars and robot
8. Level system: speed increases, more traffic, smarter robot per level
9. HUD overlay: level, speed, lives, score, distance
10. Menu screen and game over/level complete screens
