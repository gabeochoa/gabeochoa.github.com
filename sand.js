

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = new obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

var Material = {
    Empty: 'empty',
    Sand: 'sand',
    Water: 'water',
};

class Tile {
    constructor(){
        this.material = Material.Empty;
        this.lifetime = 1000;
        this.updated = false;
    }

    update(x, y){
        if(this.updated) return;
        this.updated = true;
        switch(this.material){
            case Material.Sand:
                {
                    if(grid.empty(x, y+1)){
                        grid.swap(x, y, x, y+1);
                    }
                    else if(grid.empty(x-1, y+1)){
                        grid.swap(x, y, x-1, y+1);
                    }
                    else if(grid.empty(x+1, y+1)){
                        grid.swap(x, y, x+1, y+1);
                    }
                    else if(grid.matching(x, y+1, Material.Water)){
                        grid.swap(x, y, x, y+1);
                    }
                    else if(grid.matching(x-1, y+1, Material.Water)){
                        grid.swap(x, y, x-1, y+1);
                    }
                    else if(grid.matching(x+1, y+1, Material.Water)){
                        grid.swap(x, y, x+1, y+1);
                    }
                }
                break;
            case Material.Water:
                {
                    if(grid.empty(x, y+1)){
                        grid.swap(x, y, x, y+1);
                    }
                    else if(grid.empty(x-1, y+1)){
                        grid.swap(x, y, x-1, y+1);
                    }
                    else if(grid.empty(x+1, y+1)){
                        grid.swap(x, y, x+1, y+1);
                    }
                    else {
                        let spread = 15;
                        let dir = Math.random() < 0.5;
                        let d = 0;
                        if(dir){
                            for(let i = 1; i<spread; i++){
                                if(!grid.empty(x + i, y)){
                                    break;
                                }
                                d = x+i;
                            }
                        }
                        else{
                            for(let i = 1; i<spread; i++){
                                if(!grid.empty(x - i, y)){
                                    break;
                                }
                                d = x-i;
                            }
                        }
                        if(d != 0){
                            grid.swap(x, y, d, y);
                        }
                    }
                }
                break;
            case Material.Empty:
                break;
        }
    }

    color(){
        switch(this.material){
            default:
            case Material.Empty:
                return [0, 0, 0];
            case Material.Sand:
                return [189, 183, 107];
            case Material.Water:
                return [10, 10, 250];
        }
    }
}

class Grid {
    constructor(w, h){
        this.w = w;
        this.h = h;
        this.data = new Array(w*h);

        for(var i=0; i < w* h; i++){
            this.data[i] = new Tile();
        }
    }

    xy(x, y){
        return y * this.w + x;
    }

    at(x, y){
        return this.data[this.xy(x, y)];
    }

    in(x, y){
        return x >= 0 && y >= 0 && x < this.w && y < this.h; 
    }

    place(x, y, p){
        if(!this.in(x, y)) return;
        x = Math.floor(x);
        y = Math.floor(y);
        this.data[this.xy(x, y)].material = p;
    }

    empty(x, y){
        if(!this.in(x, y)) return false;
        return this.at(x, y).material == Material.Empty;
    }

    matching(x, y, mat){
        if(!this.in(x, y)) return false;
        return this.at(x, y).material == mat;
    }

    swap(x, y, a, b){
        let me = this.at(x, y);
        let them = this.at(a, b);
        this.data[this.xy(x, y)] = clone(them);
        this.data[this.xy(a, b)] = clone(me);
    }

}

function update(progress) {

    for(var i=0; i < grid_w; i++){
        for(var j=0; j < grid_h; j++){
            let x = grid.at(i, j);
            if(x.updated) continue;
            x.update(i, j);
        }
    }
    for(var i=0; i < grid_w; i++){
        for(var j=0; j < grid_h; j++){
            grid.at(i, j).updated = false;
        }
    }


    if(mouse){
        for(var i=0; i<9; i++){
            grid.place(mp[0] + dx[i], mp[1] + dy[i], selectedMaterial);
        }
    }

}

function draw() {
    var image = ctx.getImageData(0, 0, grid_w, grid_h);
    data = image.data;
    var d = 0;
    for (var i = 0; i < grid.data.length; i ++) {
        [r,g,b, a] = grid.data[i].color();
        data[d]     = r;
        data[d + 1] = g;
        data[d + 2] = b;
        data[d + 3] = 255;
        d+=4;
    }
    ctx.clearRect(0, 0, grid_w, grid_h);
    ctx.putImageData(image, 0, 0);
}

var lastRender = 0
function loop(timestamp) {
  var progress = timestamp - lastRender
  if(progress > 10){
      lastRender = timestamp
      update(progress)
  }
  draw()
  frame++;
  if(frame < 1000000){
      window.requestAnimationFrame(loop)
  }

}

canvas = document.getElementById("can");
canvas.width = 200;//window.innerWidth ;
canvas.height = 200;// window.innerHeight ;
grid_w = canvas.width;
grid_h = canvas.height;
ctx = canvas.getContext('2d');
frame = 0
grid = new Grid(grid_w, grid_h);

selectedMaterial = Material.Sand;

const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
const dy = [-1, -1, -1, 0, 0, 1, 1, 1];


let mouse = false;
let mp = [0, 0];
canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    mouse = true;
})

canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    mp = [Math.floor(x),Math.floor(y)];

})

canvas.addEventListener('mouseup', function(e) {
    mouse = false;
})

function keydown(event) {
    var keyMap = {
      68: 'D',
      65: 'A',
      87: 'W',
      83: 'S'
    }
    var key = keyMap[event.keyCode]
    if(key == 'S') selectedMaterial = Material.Sand;
    if(key == 'W') selectedMaterial = Material.Water;
}
window.addEventListener("keydown", keydown, false)

window.requestAnimationFrame(loop)
