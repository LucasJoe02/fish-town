//To host local server input following in the terminal
//browser-sync start --server -f -w
const flock = [];

let alignSlider, cohesionSlider, seperationSlider, boidsSlider;

var tree;

function resetTree(){
  tree = new QuadTree(flock,createVector(width/2,height/2),width);
}

function setup() {
  createCanvas(500, 500);
  seperationSlider = createSlider(0, 5, 1, 0.1);
  alignSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider = createSlider(0, 5, 1, 0.1);
  boidsSlider = createSlider(0, 100, 5, 1);
  for (let i = 0; i < boidsSlider.value(); i++) {
    flock.push(new Boid());
  }
  tree = new QuadTree(flock,createVector(width/2,height/2),width);
  // setInterval(resetTree,100);
  // noLoop();
}

function overlaps(child,searchWindow){
  let isOverlapping = true;
  let chCe = child.centre;
  let chSi = child.size/2;
  let seCe = searchWindow.centre;
  let seSi = searchWindow.size/2;
  if (chCe.x-chSi > seCe.x+seSi || chCe.x+chSi <= seCe.x-seSi ||
      chCe.y-chSi > seCe.y+seSi || chCe.y+chSi <= seCe.y-seSi){
        isOverlapping = false;
      }
  return isOverlapping;
}

function query(node, searchWindow){
  if (node.isLeaf){
    var matches = [];
    for (let point of node.points){
      if (node.inBox(point, searchWindow.centre, searchWindow.size/2)){
        matches.push(point);
      }
    }
    return matches;
  }else{
    var matches = [];
    for (let child of node.children){
      if (overlaps(child, searchWindow)){
        matches = matches.concat(query(child,searchWindow));
      }
    }
    return matches;
  }
}

function draw() {
  background(51);
  tree = new QuadTree(flock,createVector(width/2,height/2),width);
  // tree.show();
  let boidChange = boidsSlider.value()-flock.length;
  if (boidChange > 0){
    flock.push(new Boid());
  }else if (boidChange < 0){
    flock.pop()
  }

  for (let boid of flock) {
    // if (flock[0]==boid){
    //   stroke(255);
    //   noFill();
    //   rectMode(CENTER);
    //   rect(boid.position.x,boid.position.y,100);
    // }
    boid.edges();
    closeBoids = query(tree,{centre:createVector(boid.position.x,
                       boid.position.y),size:100});
    boid.flock(closeBoids);
    boid.update();
    boid.show();
  }
}
