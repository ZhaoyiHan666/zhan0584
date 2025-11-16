// Final Version:Time-Based Animation
// This is my final time-based animation version


let colorPalettes = [
  ["#8BC34A", "#81D4FA", "#F48FB1", "#CE93D8", "#FFCC80", "#AED581"],//Palette 1: greens and blues
  ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#FFB300"],//Palette 2: reds and cyans
  ["#6A0572", "#AB83A1", "#3C91E6", "#342E37", "#FA824C", "#FF7043"],//Palette 3: purples
  ["#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", "#264653", "#FFD740"] //Palette 4: warm colors
];

// This array will store all circles
let circles = [];

// This is the phase (angle) used to animate the background breathing effect
let bgBreathPhase = 0;

function setup() {
  // Create full-window canvas
  createCanvas(windowWidth, windowHeight);
  // Use degreess instead of radians
  angleMode(DEGREES);
  
  // Draw 5–8 initial circles, not fixed 15 any more
  let circleCount = floor(random(5, 9));
  for (let i = 0; i < circleCount; i++) {
    let size = random(180, 280);                 // random diameter
    let x = random(size, width - size);          //random x position
    // y is between above the canvas and upper part of the screen
    let y = random(-height * 0.5, height * 0.2);

    // Create new AnimatedCircle object and add to circles array
    circles.push(new AnimatedCircle(x, y, size));
  }
}

function draw() {
  // Background breathing animation using sin() + map()
  bgBreathPhase = bgBreathPhase + 0.3;  // increase phase each frame
  
  // Use three sin waves for R, G and B
  // map() maps sin() output from -1 to 1 to color range
  let bgR = map(sin(bgBreathPhase), -1, 1, 25, 35);
  let bgG = map(sin(bgBreathPhase * 0.7), -1, 1, 40, 50);
  let bgB = map(sin(bgBreathPhase * 0.5), -1, 1, 52, 62);
  background(bgR, bgG, bgB); // Set background color

  // Update and draw all circles
  for (let circle of circles) {
    circle.update();   // update rotation angle
    circle.display();  // draw the circle
  }
  
  // Remove dead circles which are fallen off screen
  let aliveCircles = [];
  for (let circle of circles) {
  // opacity > 0
  // y not far below canvas
    let isAlive = circle.opacity > 0 && circle.y <= height + circle.currentSize;
    
    // If alive, add to new array
    if (isAlive) {
      aliveCircles.push(circle);  
    }
    // If dead, don't add
  }

  //  Replace circles with only alive circles
  circles = aliveCircles;
  
  // Draw new circles every with 120 frame, almost 2 seconds
  if (frameCount % 120 === 0 && circles.length < 12) {
    let size = random(180, 280);
    let x = random(size, width - size);
    //start above the canvas
    let y = random(-height * 0.5, -size);
    circles.push(new AnimatedCircle(x, y, size));
  }
  
  // If all circles have faded out, respawn a new batch
  if (circles.length === 0) {
    let newCount = floor(random(5, 9)); 
    for (let i = 0; i < newCount; i++) {
      let size = random(180, 280);
      let x = random(size, width - size);
      let y = random(-height * 0.5, height * 0.2);
      circles.push(new AnimatedCircle(x, y, size));
    }
  }
}

// Define animatedcircle class
class AnimatedCircle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.baseSize = size;
    this.currentSize = size;               // Current size change with breathing
    this.palette = random(colorPalettes); 
    
    // Rotation parameters 
    this.rotationAngle = random(360); // Initial angle is random number between 0-360
    this.rotationSpeed = random(0.5, 1.5);  // Rotation speed is random between 0.5-1.5 degrees per frame
    if (random() > 0.5) {
      this.rotationSpeed = this.rotationSpeed * -1;  // 50% chance to make speed navagive rotate counter-clockwise
    }
    
    // Falling parameters
    this.fallSpeed = random(0.3, 0.8);         // falling speed
    
    // Breathing parameters
    this.breathPhase = random(360);           
    this.breathSpeed = random(1, 2);           
    this.breathAmount = random(0.15, 0.25);    
    
    // Orbiting parameters
    this.orbitAngle = random(360);
    this.orbitSpeed = random(1.5, 3);
    
    // Opacity parameters
    this.opacity = 255;                        // start fully visible
    this.fadeSpeed = random(0.3, 0.8);         // how fast it fades
    
    // Color shift parameters
    this.colorShiftPhase = random(360);        // phase for color shifting
    this.colorShiftSpeed = random(0.5, 1.5);   // speed of color shift
  }
  
  // Update all time-based properties
  update() {
    // rotation
    this.rotationAngle = this.rotationAngle + this.rotationSpeed;
    
    // falling
    this.y = this.y + this.fallSpeed;
    
    // Breathing scale using sin()
    this.breathPhase = this.breathPhase + this.breathSpeed;
    let breathScale = 1 + sin(this.breathPhase) * this.breathAmount;
    this.currentSize = this.baseSize * breathScale;
    
    // Orbit angle increases each frame
    this.orbitAngle += this.orbitSpeed;
    
    // color shifting phase
    this.colorShiftPhase = this.colorShiftPhase + this.colorShiftSpeed;
    
    // Opacity decreases over time; fade faster near the bottom
    if (this.y > height * 0.7) {
      this.opacity = this.opacity - (this.fadeSpeed * 2);
    } else {
      this.opacity = this.opacity - (this.fadeSpeed * 0.3);
    }
    
    //clamp opacity to 0
    if (this.opacity < 0) {
      this.opacity = 0;
    }
  }
  
  // This method is for drawing circle
  display() {
    push();
    translate(this.x, this.y); 
    rotate(this.rotationAngle);  
    
    // Scale the drawing according to breathing size
    let breathScale = this.currentSize / this.baseSize;
    scale(breathScale);
    this.drawCircleContent();
    pop();
  }
  
  // Draw all circle patterns
  drawCircleContent() {
    let size = this.baseSize;
    let palette = this.palette;
    
    // Color shifting: choose main color along the palette using sin() + map()
    let colorIndex = floor(
      map(sin(this.colorShiftPhase), -1, 1, 0, palette.length)
    );
    // Use modulo (%) to keep index within valid range.
    // reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
    let mainColor = palette[colorIndex % palette.length];
    
    // Convert hex color to color object so we can use rgb
    // Creates a p5.Color object
    // reference: https://p5js.org/reference/p5/color/
    let mainCol = color(mainColor);
    
    // Background glow
    noStroke();
    fill(255, 255, 255, this.opacity * 0.14);
    ellipse(0, 0, size * 1.18);
    
    // Main circle
    fill(red(mainCol), green(mainCol), blue(mainCol), this.opacity);
    ellipse(0, 0, size);
    
    // Scattered dots inside
    let scatterDots = 30;
    for (let i = 0; i < scatterDots; i++) {
      // Random radius and random angle
      let r = random(size * 0.05, size * 0.40); 
      let a = random(360);
      let px = cos(a) * r;
      let py = sin(a) * r;
      let dotCol = color(random(palette));      // random palette color
      noStroke();
      fill(red(dotCol), green(dotCol), blue(dotCol), this.opacity * 0.8);
      ellipse(px, py, size * 0.035);
    }
    
    // Ring lines outside
    let ringCol = color(palette[1]);
    stroke(red(ringCol), green(ringCol), blue(ringCol), this.opacity);
    strokeWeight(2);
    noFill();
    for (let r = size * 0.55; r < size * 0.92; r = r + (size * 0.07)) {
      ellipse(0, 0, r);
    }
    
    // 16 colored dots inside
    stroke(255, 255, 255, this.opacity);
    strokeWeight(1.4);
    let insideDots = 16;
    for (let i = 0; i < insideDots; i++) {
      let angle = i * (360 / insideDots);
      let px = cos(angle) * (size * 0.38);
      let py = sin(angle) * (size * 0.38);
      let dotCol = color(random(palette));
      fill(red(dotCol), green(dotCol), blue(dotCol), this.opacity);
      ellipse(px, py, size * 0.09);
    }
    
    // Orbital ring
    this.drawOrbitingRing(size, palette);
    
    // 8 spokes
    stroke(255, 255, 255, this.opacity * 0.8);
    strokeWeight(2);
    for (let i = 0; i < 8; i++) {
      let angle = i * 45;
      let px = cos(angle) * (size * 0.43);
      let py = sin(angle) * (size * 0.43);
      line(0, 0, px, py);
    }
    
    // Two layers center dots
    // Outer: Light gray circle
    fill(250, 250, 250, this.opacity);
    stroke(255, 255, 255, this.opacity);
    strokeWeight(2);
    ellipse(0, 0, size * 0.15);
    
    // Inner: colored small circle
    noStroke();
    let centerCol = color(palette[2]);
    fill(red(centerCol), green(centerCol), blue(centerCol), this.opacity);
    ellipse(0, 0, size * 0.07);
  }
  
  // Draw orbital ring with orbiting
  drawOrbitingRing(size, palette) {
    let outerDotCount = 9;         // Outer ring has 9 big concentric dots
    let orbitRadius = size * 0.65; // Orbit radius
    
    // draw connecting dots
    this.drawOrbitingConnectingDots(orbitRadius, size, palette, outerDotCount);
    
    //Concentric dots with orbit angle added
    for (let i = 0; i < outerDotCount; i++) {
      let angle = (i * (360 / outerDotCount) + this.orbitAngle * 0.5) % 360;// Add orbitangle to original angle
      let px = cos(angle) * orbitRadius;
      let py = sin(angle) * orbitRadius;
      this.drawConcentricDot(px, py, size * 0.08);
    }
  }
  
  //  Draw small dots between large dots to form dotted orbit
  drawOrbitingConnectingDots(orbitRadius, size, palette, outerDotCount) {
    let dotsPerSegment = 7;                          // 7 dots between main ones
    let totalConnectingDots = outerDotCount * dotsPerSegment;
    
    for (let i = 0; i < totalConnectingDots; i++) {
      // Connecting dots add orbitangle
      let angle = (i * (360 / totalConnectingDots) + this.orbitAngle) % 360;
      let px = cos(angle) * orbitRadius;
      let py = sin(angle) * orbitRadius;
      
      // Dot size animated along the orbit
      let dotSize = map(
        sin(angle + this.orbitAngle), 
        -1, 1, 
        size * 0.015, 
        size * 0.04
      );
      
      // Dot opacity also animated
      let dotOpacity = map(
        sin(angle * 2), 
        -1, 1, 
        this.opacity * 0.4, 
        this.opacity
      );
      
      // choose color segment-wise
      let dotColor = color(palette[floor(i / dotsPerSegment) % palette.length]);
      
      noStroke();
      fill(red(dotColor), green(dotColor), blue(dotColor), dotOpacity);
      ellipse(px, py, dotSize);
    }
  }
  
  // draw three layer concentric dot
  drawConcentricDot(x, y, baseSize) {
    push();
    translate(x, y);
    
    fill(255, 152, 0, this.opacity);   // outer orange ring
    noStroke();
    ellipse(0, 0, baseSize);
    
    fill(0, 0, 0, this.opacity);       // middle black
    ellipse(0, 0, baseSize * 0.7);
    
    fill(255, 255, 255, this.opacity); //  inner white dot
    ellipse(0, 0, baseSize * 0.4);
    
    pop();
  }
 } 

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}