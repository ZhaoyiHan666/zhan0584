// Iteration 1 – Rotation
// This is my first iteration,adding rotation animation

let colorPalettes = [
  ["#8BC34A", "#81D4FA", "#F48FB1", "#CE93D8", "#FFCC80", "#AED581"],//Palette 1: greens and blues
  ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#FFB300"],//Palette 1: reds and cyans
  ["#6A0572", "#AB83A1", "#3C91E6", "#342E37", "#FA824C", "#FF7043"],//Palette 1: purples
  ["#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", "#264653", "#FFD740"] //Palette 1: warm colors
];

// This array will store all circles
let circles = [];

function setup() {
  // Create canvas
  createCanvas(windowWidth, windowHeight);
  // Use degreess instead of radians
  angleMode(DEGREES);

  // I want to draw 15 circles
  let circleCount = 15;
  let placed = []; //This array placed circles to avoid too much overlap

  for (let i = 0; i < circleCount; i++) {
    let size = random(180, 320);
    let margin = size * 0.7;     
    let x, y;
    let ok = false;//check if the position is good
    let tries = 0;

    // keep trying while position is bad(ok=false) and attempts < 200
      while (!ok && tries < 200) {
     x = random(margin, width - margin);
      y = random(margin, height - margin);
      ok = true;

      // check overlap with existing circles
      // dist() can Calculate the distance between two points, this technique was not covered in class 
      // reference: https://p5js.org/reference/p5/dist/
      for (let c of placed) {
        let d = dist(x, y, c.x, c.y);
        let minDist = (size * 0.5 + c.size * 0.5) * 0.9;
        if (d < minDist) {
          ok = false; 
          break;
        }
      }
      tries++;
    }

    if (ok) {
      placed.push({ x, y, size });
      // Create new AnimatedCircle object and add to circles array
      circles.push(new AnimatedCircle(x, y, size));
    }
  }
}

function draw() {
  // background is the same as group code
  background("#1e2c3a");

  for (let circle of circles) {
    circle.update();  // update rotation angle
    circle.display(); // draw the circle
  }
}

// Define animatedcircle class
class AnimatedCircle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.baseSize = size;
    this.palette = random(colorPalettes);

    // Rotation parameters
    this.rotationAngle = random(360);      // Initial angle is random number between 0-360
    this.rotationSpeed = random(0.5, 1.5); // Rotation speed is random between 0.5-1.5 degrees per frame
    if (random() > 0.5) {
      this.rotationSpeed *= -1; // 50% chance to make speed navagive rotate counter-clockwise
    }
  }

  // This method is called every frame
  update() {
    this.rotationAngle += this.rotationSpeed; // Increase angle each frame, creates rotation animation
  }

  // This method is for drawing circle
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotationAngle);// rotate entire coordinate center
    this.drawCircleContent();
    pop();
  }

  // Draw all circle patterns
  drawCircleContent() {
    let size = this.baseSize;
    let palette = this.palette;

    // Background glow
    noStroke();
    fill(255, 255, 255, 35);
    ellipse(0, 0, size * 1.18);

    // Main circle
    fill(palette[0]);
    ellipse(0, 0, size);

    // Scattered dots inside
    let scatterDots = 30;
    for (let i = 0; i < scatterDots; i++) {
    // Random radius and random angle
    let r = random(size * 0.05, size * 0.40);
    let a = random(360);
    let px = cos(a) * r;
    let py = sin(a) * r;
    noStroke();
    fill(random(palette));
    ellipse(px, py, size * 0.035);
    }

    // Ring lines outside
    stroke(palette[1]);
    strokeWeight(2);
    noFill();
    for (let r = size * 0.55; r < size * 0.92; r += size * 0.07) {
      ellipse(0, 0, r);
    }

    // 16 colored dots inside
    stroke(255);
    strokeWeight(1.4);
    let insideDots = 16;
    // for loop draws 16 dots
    for (let i = 0; i < insideDots; i++) {
      let angle = i * (360 / insideDots);
      let px = cos(angle) * (size * 0.38);
      let py = sin(angle) * (size * 0.38);
      fill(random(palette));
      ellipse(px, py, size * 0.09);
    }

    // Orbital ring
    this.drawOrbitalRing(size, palette);

    // 8 spokes
    stroke("#FFFFFF");
    strokeWeight(2);
    for (let i = 0; i < 8; i++) {
      let angle = i * 45;
      let px = cos(angle) * (size * 0.43);
      let py = sin(angle) * (size * 0.43);
      line(0, 0, px, py);
    }

    // Two layers center dots
    // Outer: Light gray circle
    fill("#FAFAFA");
    stroke("#FFFFFF");
    strokeWeight(2);
    ellipse(0, 0, size * 0.15);
    // Inner: colored small circle
    noStroke();
    fill(palette[2]);
    ellipse(0, 0, size * 0.07);
  }

  // Draw orbital ring
  drawOrbitalRing(size, palette) {
    let outerDotCount = 9;           // Outer ring has 9 big concentric dots
    let orbitRadius = size * 0.65;   // Orbit radius

    // draw connecting dots
    this.drawConnectingOrbit(orbitRadius, size, palette, outerDotCount);
    for (let i = 0; i < outerDotCount; i++) {
      let angle = i * (360 / outerDotCount);
      let px = cos(angle) * orbitRadius;
      let py = sin(angle) * orbitRadius;
      this.drawConcentricDot(px, py, size * 0.08);
    }
  }

  //  Draw small dots between large dots to form dotted orbit
  drawConnectingOrbit(orbitRadius, size, palette, outerDotCount) {
    let dotsPerSegment = 7;                      
    let totalConnectingDots = outerDotCount * dotsPerSegment;

    for (let i = 0; i < totalConnectingDots; i++) {
      let angle = i * (360 / totalConnectingDots);
      let px = cos(angle) * orbitRadius;
      let py = sin(angle) * orbitRadius;

      let dotSize = random(size * 0.015, size * 0.035);
      let dotColor = random(palette);

      noStroke();
      fill(dotColor);
      ellipse(px, py, dotSize);

      // 15% chance to add satellite dots to add depth
      if (random() > 0.85) {
        let offset = random(-size * 0.02, size * 0.02);
        let sx = px + cos(angle * 2) * offset;
        let sy = py + sin(angle * 2) * offset;
        let satelliteSize = dotSize * 0.6;
        fill(random(palette));
        ellipse(sx, sy, satelliteSize);
      }
    }
  }

  // draw three layer concentric dot
  drawConcentricDot(x, y, baseSize) {
    push();
    translate(x, y);

    fill("#FF9800");
    noStroke();
    ellipse(0, 0, baseSize);

    fill("#000000");
    ellipse(0, 0, baseSize * 0.7);

    fill("#FFFFFF");
    ellipse(0, 0, baseSize * 0.4);

    pop();
  }
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}