
// function intersectRect(r1, r2) {
//   return !(r2.left > r1.right ||
//            r2.right < r1.left ||
//            r2.top > r1.bottom ||
//            r2.bottom < r1.top);
// }

function check_intersect(x1,y1,w1,h1,
                         x2,y2,w2,h2)
{
    if(x2 > x1+w1) return false
    if(x2+w2 < x1) return false
    if(y2 > y1+h1) return false
    if(y2+h2 < y1) return false
    return true;
}



function Pipe(){

    this.x = width
    this.w = 20;
    this.yTop = random(height/2)
    this.yBot = random(height/2)

    this.move = function(speed, bird){
        this.x -= speed
        if (bird.y < this.yTop ||
            bird.y > height - this.yBot) {
            if (bird.x > this.x &&
                bird.x < this.x + this.w) {
                    return true
            }
        }
        return false
    }

    this.offscreen = function(){
        return this.x < -this.w
    }

    this.draw = function(){
        fill(255);
        rect(this.x, 0, this.w, this.yTop);
        rect(this.x, height-this.yBot, this.w, this.yBot);
    }
}