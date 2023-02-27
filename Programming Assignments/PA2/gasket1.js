var i;
var points;
var colors = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0], [1.0, 1.0, 0.0], [1.0, 0.0, 1.0], [0.0, 1.0, 1.0], [1.0, 0.5, 0.0], [0.0, 1.0, 0.5], [0.5, 0.0, 1.0], [1.0, 0.0, 0.5]];
var sizes;



var Canvas;
var speed;

var pointColor;

var points_slider;
var speed_slider;
var size_slider;


var intervalId;

window.onload = function init() {


    i = 0;
    
    Canvas = document.getElementById( "gl-canvas" );
    var status_p = document.getElementById("status");
    status_p.innerHTML = "Status: Generating points..."
    Canvas.width = innerWidth;
    Canvas.height = innerHeight;

    const width = innerWidth;
    const height = innerHeight;

    //Make points equal to value of slider
    points_slider = document.getElementById("slider");

    points = points_slider.value;
    
    //Make speed equal to value of slider
    speed_slider = document.getElementById("speed");

    speed = 2010 - speed_slider.value;

    size_slider = document.getElementById("size");

    sizes = size_slider.value;

    

    load_points_sierpinski(points, colors[0], sizes[0], Canvas);
  
    

}

function speedChange() {
    clearInterval(intervalId);
    var speed_slider = document.getElementById("speed");
    speed = 2010 - speed_slider.value;
    startInterval(speed);
}

function startInterval(_interval) {
    intervalId = setInterval(function() {
        points = points_slider.value;
        speed = 2010 - speed_slider.value;
        sizes = size_slider.value;
        
        if (i >= 9) {
            i = -1;
        }
        i++;
        load_points_sierpinski(points, colors[i], sizes,  Canvas);
    }, _interval);
}


function load_points_sierpinski(NumPoints, color, size_scale, canvas ) {
    
    const width = innerWidth;
    const height = innerHeight;
    
    var status_p = document.getElementById("status");
    status_p.innerHTML = "Status: Generating points..."

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices

    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.25, add( u, v ) );

    // And, add our initial point into our array of points

    points = [ p ];

    var color_picker = document.getElementById("color");
    var pointColor = hexToRgb(color_picker.value);
    
    color_point = []

    for (var i = 0; i < NumPoints; i++) {
        color_point.push(pointColor[0]);
        color_point.push(pointColor[1]);
        color_point.push(pointColor[2]);
    }

    
    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex

    for ( var i = 0; points.length < NumPoints; ++i ) {
        var j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
        points.push( p );
    }

    //
    //  Configure WebGL
    //
    canvas.width = width * size_scale;
    canvas.height = height * size_scale;

    gl.viewport( 0, 0, canvas.width, canvas.height);
    gl.clearColor( color[0], color[1], color[2], 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    
    // Load the data into the GPU




    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    
    //create a color buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_point), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    

    

    var vColor = gl.getAttribLocation( program, "aVertexColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );


    render();
};


function render() {
    var status_p = document.getElementById("status");
    if (status_p.innerHTML == "Status: Generating points...") {
        
    }

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length );
    status_p.innerHTML = "Status: Rendered!";
}

//function to convert hex to rgb
function hexToRgb(hex) {
    // var bigint = parseInt(hex, 16);
    // var r = (bigint >> 16) & 255;
    // var g = (bigint >> 8) & 255;
    // var b = bigint & 255;
   
    // return [r/255, g/255, b/255];
    

    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [Number((((c>>16)&255)/255).toFixed(1)), Number((((c>>8)&255)/255).toFixed(1)),Number((( c&255)/255).toFixed(1))] ;
    }
    throw new Error('Bad Hex');
};

function pointsChange( ) {
    var status_p = document.getElementById("status");
    status_p.innerHTML = "Status: Generating points..."
    setTimeout(() => { console.log("Points Changed.")}, 1000);
}

function startAnimation() {
    intervalId =  setInterval(function() {
        points = points_slider.value;
        speed = 2010 - speed_slider.value;
        sizes = size_slider.value;
        
        if (i >= 9) {
            i = -1;
        }
        i++;
        load_points_sierpinski(points, colors[i], sizes,  Canvas);
    }, speed);

}