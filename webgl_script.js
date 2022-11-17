var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
' fragColor = vertColor;',
' gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

var fragmentShaderText = 
[
'precision mediump float;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
' gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var InitDemo = function() {
    console.log("This is working");


    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log("webgl not supported without experimental");
        gl = canvas.getContext('experimental-webgl');
    }
    if (!gl) {
        alert('your browser does not support webgl');
    }

    gl.clearColor(0.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //need vertex shader and fragment shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.log('vertex shader issue', gl.getShaderInfoLog(vertexShader));
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.log('fragment shader issue', gl.getShaderInfoLog(fragmentShader));
    }


    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log('Error linking gl program', gl.getProgramInfoLog(program));
        return;
    }

    //validate the program, don't do in testing
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.log('error validating program', gl.getProgramInfoLog(program));
        return;
    }


    //create buffer
    var triangleVertices = 
    [ //x, y
        0.0, 0.5,  1.0, 0.0, 0.0,
        -.5, -.5,  0.0, 1.0, 0.0,
        .5, -.5,    0.0, 0.0, 1.0
    ];

    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer (
            positionAttribLocation,//attribute location
            2, //elemns per attribute
            gl.FLOAT, //type
            gl.FALSE, //is it normalized?
            5 * Float32Array.BYTES_PER_ELEMENT,//size per element
            0, //offset from beginning of single vertex to attribute
        );
    gl.vertexAttribPointer (
            colorAttribLocation,//attribute location
            3, //elemns per attribute
            gl.FLOAT, //type
            gl.FALSE, //is it normalized?
            5 * Float32Array.BYTES_PER_ELEMENT,//size per element
            2 * Float32Array.BYTES_PER_ELEMENT, //offset from beginning of single vertex to attribute
        );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);



    //main render loop
    gl.useProgram(program);//which program to use
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    

};

