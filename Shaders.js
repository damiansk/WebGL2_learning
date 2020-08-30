class Shader {
  constructor(gl, vShaderSrc, fShaderSrc) {
    this.program = ShaderUtil.createProgramFromText(gl, vShaderSrc, fShaderSrc, true);

    if(this.program !== null) {
      this.gl = gl;
      gl.useProgram(this.program);
      this.attribLocation = ShaderUtil.getStandardAttribLocation(gl, this.program);
      this.uniformLocation = {};
    }
  }

  activate() {
    this.gl.useProgram(this.program);

    return this;
  }

  deactivate() {
    this.gl.useProgram(null);

    return this;
  }

  dispose() {
    if(this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) {
      this.gl.useProgram(null);
    }

    this.gl.deleteProgram(this.program);
  }

  preRender() {}

  renderModel(model) {
    this.gl.bindVertexArray(model.mesh.vao);

    if(model.mesh.indexCount) {
      this.gl.drawElements(model.mesh.drawMode, model.mesh.indexCount, gl.UNSIGNED_SHORT, 0);
    } else {
      this.gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount);
    }

    this.gl.bindVertexArray(null);

    return this;
  }
}

class ShaderUtil {
  static domShaderSrc(elementId) {
    const element = document.getElementById(elementId);

    if(!element || element.text === '') {
      console.error(elementId + ' shader not found or no text');
      return null;
    }

    return element.textContent;
  }

  static createShader(gl, src, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Error compiling shader: ' + src, gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  static createProgram(gl, vShader, fShader, doValidate) {
    const program = gl.createProgram();

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    // Needs to do that before program link
    gl.bindAttribLocation(program, ATTR_POSITION_LOC, ATTR_POSITION_NAME);
    gl.bindAttribLocation(program, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME);
    gl.bindAttribLocation(program, ATTR_UV_LOC, ATTR_UV_NAME);

    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Error linking program.', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    // Additional validation
    if(doValidate) {
      gl.validateProgram(program);

      if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error validating program.', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
    }

    gl.detachShader(program, vShader);
    gl.detachShader(program, fShader);
    gl.deleteShader(vShader);
    gl.deleteShader(fShader);

    return program;
  }

  static domShaderProgram(gl, vShaderId, fShaderId, doValidate) {
    const vShaderText = ShaderUtil.domShaderSrc(vShaderId);
    const fShaderText = ShaderUtil.domShaderSrc(fShaderId);

    if(!vShaderText || !vShaderText) {
      return null;
    }

    return ShaderUtil.createProgramFromText(gl, vShaderText, fShaderText, doValidate);
  }

  static createProgramFromText(gl, vertexShaderText, fragmentShaderText, doValidate) {
    const vShader = ShaderUtil.createShader(gl, vertexShaderText, gl.VERTEX_SHADER);
    const fShader = ShaderUtil.createShader(gl, fragmentShaderText, gl.FRAGMENT_SHADER);

    if(!vShader || !fShader) {
      // TODO Should use gl.deleteShader
      return null;
    }

    return ShaderUtil.createProgram(gl, vShader, fShader, doValidate);
  }

  static getStandardAttribLocation(gl, program) {
    return {
      position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
      normal: gl.getAttribLocation(program, ATTR_NORMAL_NAME),
      uv: gl.getAttribLocation(program, ATTR_UV_NAME),
    };
  }
}
