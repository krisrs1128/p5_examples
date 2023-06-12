// attempting to deconstruct: https://openprocessing.org/sketch/1945451

// let colors = "4059ad-6b9ac4-97d8c4-eff2f1-f4b942-FF4F79".split("-").map(a=>"#"+a)
let colors = "2176ae-57b8ff-b66d0d-fbb13c-fe6847-fff-f24-edae49-d1495b-00798c-30638e-003d5b-51e5ff-440381-ec368d-ffa5a5-ffd6c0-0e402d-295135-5a6650-9fcc2e".split("-").map(a=>"#"+a)
let overAllTexture

function brush({x,y,brushR=200,color,graphics}) {
	graphics = graphics || window
	color = color || color(0)
	graphics.push()
	let angDelta = atan2(y-mouseY,x-mouseX)
	let dd = min(dist(x,y,mouseX,mouseY),50)
	let rDistributeFunc = (r = 1) =>
	r * (1-(random(random())));
	let angDistributeFunc = () => random(2 * PI);
	//let brushDensity = pow(brushR,1.8)*1.3+map(brushR,5,0.3,30,0,true);
  let brushDensity = 100
	graphics.translate(x, y);
	graphics.rotate(angDelta);
	for (let i = 0; i < brushDensity; i++) {
		let rr = rDistributeFunc(brushR ),
				ang = angDistributeFunc()
		let xx =rr*cos(ang), yy = rr*sin(ang)
		color.setAlpha(random(255))
		graphics.stroke(color);
		graphics.strokeWeight(random(0.1, 1));
		graphics.point(xx, yy);
	} 
	graphics.pop()
}

class Particle{
	constructor(args){
		let def = {
			p: createVector(0,0),
			v: createVector(0,0),
			a: createVector(0,0),
			r: 5,
			id: random(500),
			color: color(random(colors)),
			randomId: int(random(100000)),
			stage: 1,
			rFactor: random(0.985,0.992)
		}
		Object.assign(def,args)
		Object.assign(this,def)
	}
	draw(graphics){
		graphics.push()
			let distort = (p=>{
				let _p = p.copy()
				let _freq = sqrt(frameCount)*1.5+1
				let _r =  (int(noise(this.randomId)*10000)%5)/10+0.1
				let _center = int(noise(this.randomId)*10000)%5
				_p.x -= width*_center/5
				_p.x += width*_center/5
				return _p
			})

		let _ang = map(noise(this.p.x/100),0,1,-0.1,0.1)
			graphics.rotate(_ang)
			graphics.translate(distort(this.p ))
			graphics.fill(this.color)
			graphics.rectMode(CENTER)
			brush({
				graphics,
				x: 0,y: 0,
				//brushR: this.r*(0.75 + noise(this.p.x/50,this.p.y/50,this.randomId/1000)/10 + random(random([0,0,0,0,0,0.1,0.2,0.3,0.4,0.8,1,5,8])) ) ,
        brushR: 10,
				color: this.color
			})
		graphics.pop()
	}
	update(){
		this.p.add(this.v)
		this.v.add(this.a)
		
		let useX = dist(this.p.x,this.p.y,width/2,50)*1.5 + frameCount*0.5 - noise(this.randomId)*width/5-width/20
		let _x = int(this.p.x/400), _y = int(this.p.y/400)
		this.v.mult(0.9995)
		let weaveSpan = int(map(this.p.x+sin(this.p.y)*20,width/3,width*2/3,2,20))
			
		let factor = noise(this.randomId)*100
		if (useX>width*20/21){
			// this.stage=2
			this.v.rotate(sin(this.p.x/factor+this.p.y/factor+frameCount/50)/this.r/this.r)
			//this.v.mult(noise(this.randomId)*0.2+0.9)
			this.v.x+=0.1
			this.v.y+=0.1
			
		this.v.limit(this.r*5)
			if (this.r>2) this.r*=0.99
			this.color = lerpColor(color(this.color),color(255),0.05)
		}
		
		this.r*=this.rFactor
		
	}
}
let particles = []
let cnv,graphics1,graphics2
function setup() {
	
	pixelDensity(100)

	cnv = createCanvas(1400,1200);
  fill(200)
	graphics1 = createGraphics(width,height)
	graphics2 = createGraphics(width,height)
	//background(100);
	//fill(255)
	//rect(0,0,width,height)
	graphics1.noStroke()
	graphics2.noStroke()
	
	for(let x=0;x<width;x+=15){
		for(let y=0;y<height*1.8/3;y+=100){
			if (noise(x/20,y/20)>0.4) continue
			particles.push(new Particle({
				p: createVector(x + random(-2,2),y + random(-2,2) + random(0,100)),
				v: createVector(0,5),
				r: random([1,2,3,4,5,6])
			}))
		}
	}
	
	overAllTexture = loadImage("canvas-light.jpg")
}

function draw() {
	graphics1.clear()
	particles.forEach(p=>{
		p.update()
		p.draw(graphics1)
		p.draw(graphics2)
	})	
	
	push()
	fill(0)
	rect(0,0,width,height)
	graphics2.image(graphics1,0,0)
	image(graphics2,0,0)
	blendMode(MULTIPLY)
	drawingContext.globalAlpha=0.8
	image(overAllTexture,0,0,height/1080*1920,height)
	drawingContext.globalAlpha=0.3
	
	image(graphics2,0,0)
	pop()
	
	particles.forEach(p=>{
		p.draw(graphics1)
	})	
	particles=particles.filter(p=>p.r>0.5)
}