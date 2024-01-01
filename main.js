const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext("webgl");

const vertexShaderSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
                gl_PointSize = 5.0;
            }
        `;

const fragmentShaderSource = `
            precision mediump float;
            uniform vec4 color;
            void main() {
                gl_FragColor = color;
            }
        `;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const colorUniformLocation = gl.getUniformLocation(program, "color");


const positionAttributeLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionAttributeLocation);

const verticesPointsBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, verticesPointsBuffer);

var verticesPoints = [];
var scale = 10;
var count = 1;

function fix(str) {
  str = str.replace(/\bsin\b/g, "Math.sin");
  str = str.replace(/\bcos\b/g, "Math.cos");
  str = str.replace(/\btan\b/g, "Math.tan");
  str = str.replace(/\basin\b/g, "Math.asin");
  str = str.replace(/\bacos\b/g, "Math.acos");
  str = str.replace(/\batan2\b/g, "Math.atan2");
  str = str.replace(/\batan\b/g, "Math.atan");
  str = str.replace(/\bsinh\b/g, "Math.sinh");
  str = str.replace(/\bcosh\b/g, "Math.cosh");
  str = str.replace(/\btanh\b/g, "Math.tanh");
  str = str.replace(/\^/g, "**");
  return str;
}

function updateTing() {
    verticesPoints.length = 0;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(0), gl.STATIC_DRAW);
    point_count.innerHTML = "Points: " + Math.round(2 / (1 / slider.value), 3);

    for (let i = -1; i < 1; i += 1 / slider.value) {
        let x = i * scale;
        y = eval(fix(eq.value));
        if (!y > scale || !y < -scale || !isNaN(y)) {
            verticesPoints.push(x / scale, y / scale);
        }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesPoints), gl.STATIC_DRAW);
    console.log(verticesPoints.length)

}
updateTing();

function render() {
    gl.uniform4f(colorUniformLocation, 1, 1, 1, 1);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, verticesPoints.length / 2);
    window.requestAnimationFrame(render);
};
render();

document.addEventListener("DOMMouseScroll", handleScroll);
document.addEventListener("mousewheel", handleScroll);
function handleScroll(event) {
    let increment = (1 / 25) * scale;
    const delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
    scale -= delta > 0 ? increment : -increment;
    point_follower.innerHTML = "Scale: " + Math.round(scale * 1000) / 1000;
    updateTing();
}

slider.addEventListener("input", () => {
    updateTing();
});
eq.addEventListener("input", () => {
    updateTing();
});
