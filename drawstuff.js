/* classes */ 

// Color constructor
class Color {
    
        // Color constructor default opaque black
    constructor(r=0,g=0,b=0,a=255) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
    
        // Color add method
    add(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.add: non-color parameter";
            else {
                this.r += c.r; this.g += c.g; this.b += c.b; this.a += c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color add
    
        // Color subtract method
    subtract(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.subtract: non-color parameter";
            else {
                this.r -= c.r; this.g -= c.g; this.b -= c.b; this.a -= c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color subgtract
    
        // Color scale method
    scale(s) {
        try {
            if (typeof(s) !== "number")
                throw "scale factor not a number";
            else {
                this.r *= s; this.g *= s; this.b *= s; this.a *= s; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color scale method
    
        // Color copy method
    copy(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.copy: non-color parameter";
            else {
                this.r = c.r; this.g = c.g; this.b = c.b; this.a = c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end Color copy method
    
        // Color clone method
    clone() {
        var newColor = new Color();
        newColor.copy(this);
        return(newColor);
    } // end Color clone method
    
        // Send color to console
    toConsole() {
        console.log(this.r +" "+ this.g +" "+ this.b +" "+ this.a);
    }  // end Color toConsole
    
} // end color class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
} // end drawPixel
    

/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas, context, and image data
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    var w = context.canvas.width; // as set in html
    var h = context.canvas.height;  // as set in html
    var imagedata = context.createImageData(w,h);
 
    // Define a triangle in 2D with colors and coords at corners
    // (cyan, magenta, yellow — pink was the 4th color for a rectangle)
    var tc = new Color(0,255,255,255); // top corner color: cyan
    var blc = new Color(255,0,255,255); // bottom left corner color: magenta
    var brc = new Color(255,255,0,255); // bottom right corner color: yellow
    var tx = 125, ty = 50; // top corner position
    var blx = 50, bly = 150; // bottom left corner position
    var brx = 200, bry = 150; // bottom right corner position
    
    // set up the vertical interpolation (left and right edges from tip to base)
    var lc = tc.clone();  // left color
    var rc = tc.clone();  // right color
    var lx = tx, rx = tx; // left and right edge x
    var vDelta = 1 / (bly-ty); // norm'd vertical delta
    var lcDelta = blc.clone().subtract(tc).scale(vDelta); // left vert color delta
    var rcDelta = brc.clone().subtract(tc).scale(vDelta); // right vert color delta
    var lxDelta = (blx-tx) * vDelta; // left edge x delta
    var rxDelta = (brx-tx) * vDelta; // right edge x delta
    
    // set up the horizontal interpolation
    var hc = new Color(); // horizontal color
    var hcDelta = new Color(); // horizontal color delta
    
    // do the interpolation
    for (var y=ty; y<=bly; y++) {
        var leftX = Math.round(lx);
        var rightX = Math.round(rx);
        var hSpan = rightX - leftX;
        hc.copy(lc); // begin with the left color
        if (hSpan > 0) {
            hcDelta.copy(rc).subtract(lc).scale(1 / hSpan); // reset horiz color delta
            for (var x=leftX; x<=rightX; x++) {
                drawPixel(imagedata,x,y,hc);
                hc.add(hcDelta);
            } // end horizontal
        } else {
            drawPixel(imagedata,leftX,y,hc); // single pixel at the tip
        }
        lc.add(lcDelta);
        rc.add(rcDelta);
        lx += lxDelta;
        rx += rxDelta;
    } // end vertical
    
    context.putImageData(imagedata, 0, 0); // display the image in the context
}
