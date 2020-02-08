const vertexShaderText = [
  '#version 300 es',
  'precision mediump float;',
  'in vec2 vertPosition;',
  'in vec3 vertColor;',
  'out vec3 fragColor;',
  '',
  'void main()',
  '{',
  'fragColor=vertColor;',
  ' gl_Position=vec4(vertPosition, 0.0,1.0);',
  '}',
].join('\n');
const fragmentShaderText = [
  '#version 300 es',
  'precision mediump float;',
  'in vec4 colors',
  'out vec4 frag_color',
  'void main()',
  '{',
  'frag_color=vcolors',
  '}',
].join('\n');
const startwebgl = function () {
  console.log('Ohoh');

  const canvas = document.getElementById('gamecanvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    alert('Your browser does not support webgl');
  }
  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR: compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    return;
  }
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR: compiling vertex shader!', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR: linking error in program', gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('ERROR: error in validation of program!', gl.getProgramLog(program));
  }
  //
  // Create buffer
  //

  const triangleVertices = [// X,Y] R,G,B
    0.0, 0.5, 1.0, 1.0,
    -0.5, -0.5, 0.7, 0.0, 1.0,
    0.5, -0.5, 0.7, 0.9, 0.1
  ];
  const triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

  gl.vertexAttribPointer(
    positionAttribLocation, // Atrib loc
    2, // Number of elements per attrib,
    gl.FLOAT, // Type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0, // Offset from beginning of a singl evertex to this attrib
  );
  gl.vertexAttribPointer(
    positionAttribLocation, // Atrib loc
    5, // Number of elements per attrib,
    gl.FLOAT, // Type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT, // Offset from beginning of a singl evertex to this attrib
  );
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);


  //
  // Main render loop
  //
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, // Hoxw many vertices we ant to skip
    3, // Vertices we have to draw
  );
};
