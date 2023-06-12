function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  if (mouseIsPressed) {
    fill(0);
    ellipse(mouseX, mouseY, 80, 80);
  } else {
    fill(255);
  }

  ellipse(50,50,80,80);
}
