const ATTR_POSITION_NAME = 'a_position';
const ATTR_POSITION_LOC = 0;
const ATTR_NORMAL_NAME = 'a_normal';
const ATTR_NORMAL_LOC = 1;
const ATTR_UV_NAME = 'a_uv';
const ATTR_UV_LOC = 2;

function GLInstance(canvasId) {
  const canvas = document.getElementById(canvasId);
  const gl = canvas.getContext('webgl2');

  if(!gl) {
    console.error('WebGL2 context is not avaliable.');
    return null;
  }

  gl.mMeshCache = [];

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.fClear = function() {
    this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
    return this;
  } 

  gl.fCreateArrayBuffer = function(floatArray, isStatic = true) {
    const bufferUsage = isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW;
    const buffer = this.createBuffer();

    this.bindBuffer(this.ARRAY_BUFFER, buffer);
    this.bufferData(this.ARRAY_BUFFER, floatArray, bufferUsage);
    this.bindBuffer(this.ARRAY_BUFFER, null);

    return buffer;
  }

  gl.fCreateMeshVAO = function(name, indexArray, vertexArray, normalArray, uvArray) {
    const mesh = {
      drawMode: this.TRIANGLES,
    };

    mesh.vao = this.createVertexArray();
    this.bindVertexArray(mesh.vao);

    if(vertexArray !== undefined && vertexArray !== null) {
      mesh.bufferVertices = this.createBuffer();
      mesh.vertexComponentLength = 3;
      mesh.vertexCount = vertexArray.length / mesh.vertexComponentLength;

      this.bindBuffer(this.ARRAY_BUFFER, mesh.bufferVertices);
      this.bufferData(this.ARRAY_BUFFER, new Float32Array(vertexArray), this.STATIC_DRAW);
      this.enableVertexAttribArray(ATTR_POSITION_LOC);
      this.vertexAttribPointer(ATTR_POSITION_LOC, 3, this.FLOAT, false, 0, 0);
    }

    if(normalArray !== undefined && normalArray !== null) {
      mesh.bufferNormals = this.createBuffer();

      this.bindBuffer(this.ARRAY_BUFFER, mesh.bufferNormals);
      this.bufferData(this.ARRAY_BUFFER, new Float32Array(normalArray), this.STATIC_DRAW);
      this.enableVertexAttribArray(ATTR_UV_LOC);
      this.vertexAttribPointer(ATTR_UV_LOC, 3, this.FLOAT, false, 0, 0);
    }

    if(uvArray !== undefined && uvArray !== null) {
      mesh.bufferUVs = this.createBuffer();

      this.bindBuffer(this.ARRAY_BUFFER, mesh.bufferUVs);
      this.bufferData(this.ARRAY_BUFFER, new Float32Array(uvArray), this.STATIC_DRAW);
      this.enableVertexAttribArray(ATTR_UV_LOC);
      this.vertexAttribPointer(ATTR_UV_LOC, 2, this.FLOAT, false, 0, 0);
    }

    if(indexArray !== undefined && indexArray !== null) {
      mesh.bufferIndex = this.createBuffer();
      mesh.indexCount = indexArray.length;

      this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, mesh.bufferIndex);
      this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), this.STATIC_DRAW);
      this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
    }

    this.bindVertexArray(null);
    this.bindBuffer(this.ARRAY_BUFFER, null);

    this.mMeshCache[name] = mesh;

    return mesh;
  }

  gl.fSetSize = function(w, h) {
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.width = w;
    this.canvas.height = h;

    this.viewport(0, 0, w, h);

    return this;
  }

  return gl;
}