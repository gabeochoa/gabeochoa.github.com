

f = undefined
gravity = .25
pipes = []
scroll_speed = 10
score = 0

function setup() {
    createCanvas(600, 600);
    f = new Flappy(200, 200)
    pipes.push(new Pipe());
}

function draw() {
    background(0)

    //updating things
    f.update(0, gravity)

    //check pipes
    for (var i = 0; i < pipes.length; i++) {
        hit = pipes[i].move(scroll_speed, f)
        //remove old pipes
        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
            score += 1
        }
    }


    //actually drawing
    fill(255);
    textSize(32);
    text(score, 400, 200);



    if(hit){
        scroll_speed = 0
        f.flap_speed = 0
        console.log("hit wall")
        fill(255);
        textSize(32);
        text("hit wall", 200, 200);
        return
    }
    else if(f.hitground){
        scroll_speed = 0
        f.flap_speed = 0
        console.log("hit ground")
        fill(255);
        textSize(32);
        text("hit ground", 200, 200);
        return
    }

    f.draw()

    for (var i = 0; i < pipes.length; i++) {
        pipes[i].draw()
    }

    //add a new pipe if its time
    if (frameCount % 75 == 0) {
        pipes.push(new Pipe());
    }
}

function mouseClicked() {
    f.flap()
}