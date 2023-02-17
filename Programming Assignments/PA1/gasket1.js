
window.onload = function init() {

    var gl;
    var points;
    var i = 0;
    


    var Canvas = document.getElementById( "gl-canvas" );
    Canvas.width = innerWidth;
    Canvas.height = innerHeight;

    const width = innerWidth;
    const height = innerHeight;

    //Array of number of points from 100, 10 items, increments of 5000
    var points = [100, 6000, 11000, 16000, 21000, 26000, 31000, 36000, 41000, 46000]
    
    //Array of Colors to be drawn, 10 colors, rgb values
    var colors = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0], [1.0, 1.0, 0.0], [1.0, 0.0, 1.0], [0.0, 1.0, 1.0], [1.0, 0.5, 0.0], [0.0, 1.0, 0.5], [0.5, 0.0, 1.0], [1.0, 0.0, 0.5]];

    //Array of canvas sizes as fractions of innerwidth and innerheight, 10 items
    var sizes = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];



    load_points_sierpinski(points[0], colors[0], sizes[0], Canvas);
    setInterval(function() {

        if (i >= 9) {
            i = -1;
        }
        i++;
        load_points_sierpinski(points[i], colors[i], sizes[i],  Canvas);
    }, 1000);

}


function load_points_sierpinski(NumPoints, color, size_scale, canvas ) {
    const width = innerWidth;
    const height = innerHeight;
    
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

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length );
}

