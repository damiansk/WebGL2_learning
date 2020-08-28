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

    const vShader = ShaderUtil.createShader(gl, vShaderText, gl.VERTEX_SHADER);
    const fShader = ShaderUtil.createShader(gl, fShaderText, gl.FRAGMENT_SHADER);

    
    if(!vShader || !fShader) {
      return null;
    }

    return ShaderUtil.createProgram(gl, vShader, fShader, doValidate);
  }
}