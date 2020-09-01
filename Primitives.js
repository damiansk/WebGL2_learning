const Primitives = {};

Primitives.GridAxis = class {
  static createMesh(gl) {
    const vertices = [];
    const size = 1.8;
    const division = 10.0;
    const step = size / division;
    const half = size / 2;

    for(let i = 0; i <= division; i++) {
      const vPosition = -half + (i * step);
      vertices.push(
        vPosition, half, 0, 0,
        vPosition, -half, 0, 1,
      );

      const hPosition = half - (i * step);
      vertices.push(
        -half, hPosition, 0, 0,
        half, hPosition, 0, 3,
      );
    }

    const attrColorLocation = 4;
    const mesh = {
      drawMode: gl.LINES,
      vao: gl.createVertexArray(),
    };
    let strideLength;
    
    mesh.vertexComponentLength = 4;
    mesh.vertexCount = vertices.length / mesh.vertexComponentLength;
    strideLength = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLength; 

    mesh.bufferVertices = gl.createBuffer();
    gl.bindVertexArray(mesh.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(ATTR_POSITION_LOC);
    gl.enableVertexAttribArray(attrColorLocation);

    gl.vertexAttribPointer(ATTR_POSITION_LOC, 3, gl.FLOAT, false, strideLength, 0);
    gl.vertexAttribPointer(attrColorLocation, 1, gl.FLOAT, false, strideLength, Float32Array.BYTES_PER_ELEMENT * 3);
  
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.mMeshCache['grid'] = mesh;

    return mesh;
  }
}