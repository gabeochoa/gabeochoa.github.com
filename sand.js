
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = new obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

var Material = {
    Empty: 'Empty',
    Sand: 'Sand',
    Water: 'Water',
    BlackHole : 'BlackHole',
    Wood: 'Wood',
};

class Tile {
    constructor(){
        this.material = Material.Empty;
        this.lifetime = 1000;
        this.updated = false;
    }

    toward(x, y, a, b){
        // translate a,b to center
        let nx = x - a;
        let ny = y - b;

        if(nx < 0) nx+=1;
        else nx -= 1;

        if(ny < 0) nx+=1
        else ny += 1;

        return [nx+a, ny+b];
    }


    update(x, y){
        if(this.updated) return;
        this.updated = true;
        switch(this.material){
            case Material.BlackHole:
                {

                    let n = [];
                    for(var i =0; i<8;i++) {
                        n.push([x+dx[i], y+dy[i]]);
                        grid.clear(x+dx[i], y+dy[i]);
                    }

                    let pullD = 4;
                    let top = y - pullD
                    let bottom = y + pullD
                    let moved = [];
                    for (var j = top; j <= bottom; j++) {
                        let yd  = j - y;
                        let xd  = Math.sqrt(pullD * pullD - yd * yd);
                        let left = Math.ceil(x - xd);
                        let right = Math.floor(x + xd);

                        for (var i = left; i <= right; i++) {
                            if(!grid.empty(i, j) && !grid.matching(i, j, Material.BlackHole)){
                                if(
                                    n.some(e => e[0] == i && e[1] == j) || 
                                    moved.some(e => e[0] == i && e[1] == j) ){ 
                                    continue 
                                }
                                else{
                                    let newpos = this.toward(i, j, x, y);
                                    moved.push(newpos);
                                    grid.swap(i, j, ...newpos);
                                }
                            }
                        }
                    }
                }
                break;
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
                                // Something in our way
                                if(!grid.empty(x + i, y)){
                                    break;
                                }
                                // Can fall now
                                if(grid.empty(x + i, y+1)){
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
                                if(grid.empty(x - i, y+1)){
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
            default:
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
            case Material.BlackHole:
                return [100, 10, 200];
            case Material.Wood:
                return [102, 50, 0];
        }
    }
}

function circle(x, y, r, m) {
    let top = y - r
    let bottom = y + r
    let moved = [];
    for (var j = top; j <= bottom; j++) {
        let yd  = j - y;
        let xd  = Math.sqrt(r * r - yd * yd);
        let left = Math.ceil(x - xd);
        let right = Math.floor(x + xd);

        for (var i = left; i <= right; i++) {
            grid.place(i, j, m);
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

    clear(x, y){
        if(!this.in(x, y)) return;
        this.at(x, y).material = Material.Empty;
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
        if(!this.in(x, y)) return false;
        if(!this.in(a, b)) return false;
        let me = this.at(x, y);
        let them = this.at(a, b);
        this.data[this.xy(x, y)] = clone(them);
        this.data[this.xy(a, b)] = clone(me);
    }

}

function setSelectedMaterial(mat){
    selectedMaterial = mat;
    dropdown.selectedIndex = Object.keys(Material).indexOf(mat);
}

function update(progress) {
    setSelectedMaterial(Object.keys(Material)[dropdown.selectedIndex]);

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
        circle(mp[0], mp[1], penRadius-1, selectedMaterial);
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

    // 
    outctx.drawImage(canvas, 0, 0);
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

scale = 10;

iw = window.innerWidth - 50;
ih = window.innerHeight - 50;

canvas = document.getElementById("src");
canvas.width = iw / scale;
canvas.height = ih / scale ;
ctx = canvas.getContext('2d');
canvas.style.display = 'none';

grid_w = canvas.width;
grid_h = canvas.height;

output = document.getElementById("dst");
output.width = iw;
output.height = ih;
outctx = output.getContext('2d');
outctx.imageSmoothingEnabled = false;
outctx.scale(scale, scale);


frame = 0
grid = new Grid(grid_w, grid_h);

penRadius = 2;
selectedMaterial = Material.Sand;

const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
const dy = [-1, -1, -1, 0, 0, 1, 1, 1];


let mouse = false;
let mp = [0, 0];
output.addEventListener('mousedown', function(e) {
    mouse = true;
})

output.addEventListener('mousemove', function(e) {
    const rect = output.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    mp = [Math.floor(x / scale),Math.floor(y/ scale)];
})

output.addEventListener('mouseup', function(e) {
    mouse = false;
})


window.addEventListener("keydown", 
    (event) =>  {
        let key = event.key;
        if(key == 's') setSelectedMaterial(Material.Sand);
        if(key == 'w') setSelectedMaterial(Material.Water);
        if(key == 'e') setSelectedMaterial(Material.Empty);
        if(key == 'b') setSelectedMaterial(Material.BlackHole);
        if(key == 't') setSelectedMaterial(Material.Wood);
        if(key == '1') penSize(1)
        if(key == '2') penSize(-1)
    }
    , false)


dropdown = document.getElementById("tool");
{
    const types = Object.keys(Material);
    for(type of types){
        let option = document.createElement("option");
        option.text = type
        dropdown.add(option);
    }
}

radiusLabel = document.getElementById("penRadius");
plus = document.getElementById("plus");
minus = document.getElementById("minus");

function penSize(x){
    penRadius = Math.max(0, Math.min(grid_w, penRadius + x));
    radiusLabel.innerHTML = penRadius;

}

plus.addEventListener("click", (e) => { penSize(1); });
minus.addEventListener("click", (e) => { penSize(-1); });


window.requestAnimationFrame(loop)
