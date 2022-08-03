class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2,4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  interact(boids){
    let perceptionRadius = 100;
    let alignment = createVector();
    let seperation = createVector();
    let cohesion = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius){
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d**2);
        alignment.add(other.velocity);
        seperation.add(diff);
        cohesion.add(other.position);
        total++;
      }
    }
    if (total > 0){
      alignment.div(total);
      alignment.setMag(this.maxSpeed)
      alignment.sub(this.velocity);
      alignment.limit(this.maxForce);

      seperation.div(total);
      seperation.setMag(this.maxSpeed)
      seperation.sub(this.velocity);
      seperation.limit(this.maxForce);

      cohesion.div(total);
      cohesion.sub(this.position);
      cohesion.setMag(this.maxSpeed)
      cohesion.sub(this.velocity);
      cohesion.limit(this.maxForce);
    }
    return {seperation, alignment, cohesion};
  }

  flock(boids) {
    let interactions = this.interact(boids);
    let seperation = interactions.seperation;
    let alignment = interactions.alignment;
    let cohesion = interactions.cohesion;

    seperation.mult(seperationSlider.value());
    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());

    this.acceleration.add(seperation);
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0)
  }

  show() {
    strokeWeight(8);
    stroke(255);
    point(this.position.x, this.position.y);
  }
}
