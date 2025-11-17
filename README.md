# zhan0584
# Time-based animation
## How to interact
This artwork is fully automatic and only depends on time-based. Users don't need to click, move mouse or press any key. The animation will play automatically. And the circle will rotate, fall, breathe and expand, orbit around the main circle, shift colors, fade opacity and the background will also breathe and expand with time.
## How my work differs from group members'
My version is defferent because everything is time-based. Each element behaves like a living organism: its colors shift, size breathes, opacity fades, orbit angles change, and new circles respawn over time. No mouse or keyboard actions influence the animation.Meanwhile, the other team members focused on controlling the size and color of the circles as well as the distance of the background, while in my artwork, each circle could fall down and gradually fade out over time.
## Inspiration
The moment I saw the artwork "Wheels of Fortune", I immediately thought of ferris wheels, planetary revolution and rotation. Based on this, I completed my personal assignment.
## Details of my individual approach to animating the group code
Below is a clear explanation of how each version differs and builds upon the previous one.
### Iteration 1 - Rotation Only
This version introduces the first and simplest animation: rotation.
Key code added:
this.rotationAngle += this.rotationSpeed
rotate(this.rotationAngle)
(rotationAngle is NOT a built-in function taught in class. It is a variable I created myself to store the rotation angle.)
### Iteration 2 - Rotation and Falling
This iteration introduces falling movement. Circles continuously move down and reset when off-screen.
Key code added:
this.fallSpeed = random(0.3, 0.8)
this.y += this.fallSpeed
### Iteration 3 - Rotation, Falling and Breathing
This iteration introduces a breathing animation to make the circle expand and contract smoothly over time.
Key code added:
this.breathPhase += this.breathSpeed
this.currentSize = this.baseSize * breathScale
scale(this.currentSize / this.baseSize)
This technique is based on the Week 9 concept of increasing a value every frame.The variable name breathPhase and the specific breathing logic were created by me. And the idea of using a ratio (currentSize / baseSize) to create a smooth breathing effect is my own implementation.
### Iteration 4 - Rotation, Falling, Breathing and orbiting
This iteration adds orbiting, which means outer dots rotate around the center like planets.
Key code added:
this.orbitAngle += this.orbitSpeed
px = cos(angle + this.orbitAngle) * orbitRadius
py = sin(angle + this.orbitAngle) * orbitRadius
### Final time-based version
Added:
1.breathing background
2.fading + lifecycle
3.color shifting
4.new circle spawning
5.orbiting dots with animated size and opacity
6.RGB Color Control
#### 1.Breathing background
The background uses three sine waves (different speeds) mapped to RGB values to create a slow breathing effect.
Key code:
sin(), map()
#### 2.fading + lifecycle
Circles fade out.
Key code：
if(), opacity
#### 3.Color Shifting
Uses sin + map to cycle through colors in the palette smoothly.
Key code:
sin(), map(), % modulo indexing, color() to extract RGB.
#### 4.New Circle Spawning
Every 120 frames (~2 seconds), a new circle is created above the screen.Object spawning in my project is implemented using the frame-based animation principles. Since p5.js does not have a native “object spawning” function, the mechanism is built by combining frameCount, JavaScript classes, and array management (push()).
Key code:
frameCount, array, push().
#### 5.orbiting dots with animated size and opacity
Orbiting dots change size and opacity based on sine waves, creating a “flowing orbit” effect.
Key code:
cos(),sin()
#### 6.RGB Color Control
Instead of using HEX colors directly, RGB components are extracted so opacity can be animated properly.
key code: color()
## Summary
This time-based animation combines multiple
techniques (rotation, scaling, sin-based animation, trigonometry, classes, loops) and extends them with several self-researched techniques (dist(), color(), modulo indexing, object spawning). All external references are properly cited in references according to assignment requirements.
## References
### dist()
https://p5js.org/reference/p5/dist/
### color()
https://p5js.org/reference/p5/color/
### modulo indexing
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
### object spawning
https://p5js.org/reference/p5/frameCount/
https://p5js.org/reference/p5.Element/addClass/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push