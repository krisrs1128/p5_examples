
//OPC.button("btoButton", "back to origin");
const agentsNum = 1000;
const sensorOffset = 10;
const sensorAngle = Math.PI / 2;
const turnAngle = Math.PI / 10;
let agents;

function setup() {
  createCanvas(720, 720);
  pixelDensity(1);
  background(255, 210, 225);
  agents = new Agents();
}

function draw() {
  background(255, 210, 255, 20);
  loadPixels();
  for (let i = 0; i < 10; i++) {
    agents.update();
  } 
  updatePixels();
}

class Agent {
  constructor() {
    this.x = width * random();
    this.y = height * random();
    this.color = [random(255), random(255), random(255)];
    this.dir = random(TWO_PI);
  }

  updateDirection() {
    const right = this.sense(+sensorAngle);
    const center = this.sense(0);
    const left = this.sense(-sensorAngle);

		const threeWays = [left, center - 1 , right];
		const minIndex = threeWays.indexOf(min(...threeWays));
		this.dir += turnAngle * (minIndex - 1);
  }
  
  sense(dirOffset) {
    const angle = this.dir + dirOffset;
    let x = floor(this.x + sensorOffset * cos(angle));
    let y = floor(this.y + sensorOffset * sin(angle));
    const index = (x + y * width) * 4;
    return pixels[index];
  }

  updateColor() {
    this.color[0] = pixels[]
  }
  
  updatePosition() {
    this.x += cos(this.dir);
    this.y += sin(this.dir);
    this.x = (this.x + width) % width;
    this.y = (this.y + height) % height;

    const index = floor(this.x) + floor(this.y) * width;
    pixels.set(this.color, index * 4);
  }
}

class Agents {
  constructor() {
    this.agents = Array(agentsNum)
      .fill()
      .map((e) => new Agent());
  }
  update() {
    this.agents.forEach((e) => e.updateDirection());
    this.agents.forEach((e) => e.updateColor());
    this.agents.forEach((e) => e.updatePosition());
  }
}