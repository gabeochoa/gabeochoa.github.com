
function Flappy(x, y){
    frames = [
        loadImage("http://ochoag.com/sprites/bird/frame-1.png"),
        loadImage("http://ochoag.com/sprites/bird/frame-2.png"),
        loadImage("http://ochoag.com/sprites/bird/frame-3.png"),
        loadImage("http://ochoag.com/sprites/bird/frame-4.png")
    ]
    this.w = 50
    this.flap_speed = 0.25
    this.x = x;
    this.y = y;
    this.dy = 0;
    this.max_speed = 10
    this.current_frame = 0

    this.update = function(dx, accely){
        this.dy += accely
        if(this.dy > this.max_speed)
        {
            this.dy = this.max_speed
        }
        this.y += this.dy

        if(this.y > height-this.w)
        {
            this.y = height-this.w
            this.dy = 0
            this.hitground = true
        }else{

            this.hitground = false
        }
    }

    this.flap = function(){
        console.log("flapped")
        this.dy = -8
    }

    this.draw = function(){

        //grab the last frame we passed
        frame_ind = Math.floor(this.current_frame)

        //show the image
        image(frames[frame_ind],
              this.x,
              this.y,
              this.w,
              this.w)

        //increment by the speed
        this.current_frame += this.flap_speed
        //if we have dont all the frames
        //loop back to beginning
        if(this.current_frame > frames.length-1)
        {
            this.current_frame = 0
        }
    }
}