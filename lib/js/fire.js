	var VSHADER_SOURCE =
		"attribute vec4 a_Position;\n" +
		"void main() {" +
		"gl_Position = a_Position;\n" +
		"}\n";

	var FSHADER_SOURCE =
		"precision mediump float;\n"+
		"uniform float u_Time;\n"+
		"vec2 hash(in vec2 p);\n"+
		"float noise(in vec2 p);\n"+
		"float fbm(in vec2 uv);\n"+
		
		"void main() {" +
		"	vec2 uv = gl_FragCoord.xy / vec2(1024.0, 500.0);\n"+
		"	vec2 q = uv;\n"+
		"	q.x *= 5.0;\n"+
		"	float strength = 1.8;\n"+
		"	float T = 1.5 * u_Time;\n"+
		"	q.x -= 1.5;\n"+
		"	q.y -= 0.1;\n"+
		"	float n = fbm(strength * q - vec2(0, T));\n"+
		"	float c = 1.0 - 16.0 * (pow(length(q) - n * q.y, 2.0));\n"+
		"	float c1 = n * c * (1.0 - pow(uv.y, 4.0));\n"+
		"	c1 = clamp(c1, 0.0, 1.0);\n"+
		"	vec3 col = vec3(2.0 * c1, 2.0 * c1 * c1 * c1, 0.5 * c1 * c1 * c1 * c1 * c1 * c1);\n"+
		"	float c2 = c * (1.0 - pow(uv.y, 4.0));\n"+
		"	gl_FragColor = vec4(mix(vec3(0.0), col, c2), 1.0);\n"+
		"}"+
		
		"vec2 hash(in vec2 p){\n"+
		"	p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));\n"+
		"	return -1.0 + 2.0 * fract(sin(p * 0.5) * 43758.5453123);\n"+
		"}\n"+
		
		"float noise(in vec2 p){\n"+
		"	const float k1 = 0.366025404;\n"+    //(sqrt(3)-1)/2
		"	const float k2 = 0.211324865;\n"+    //(3-sqrt(3))/6
		"	vec2 i = floor(p + (sin(p.x) + p.y) * k1);\n"+
		"	vec2 a = p - (i - (i.x + i.y) * k2);\n"+
		"	vec2 o = (a.x < a.y) ? vec2(0.0, 1.0) : vec2(1.0, 0.0);\n"+
		"	vec2 b = a - o + k2;\n"+
		"	vec2 c = a - 1.0 + 2.0 * k2;\n"+
		"	vec3 h =  max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);\n"+
		
		"	vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));\n"+
		"	return dot(n, vec3(85.0));\n"+
		"}\n"+
		
		"float fbm(in vec2 uv){\n"+
		"	float f = 0.0;\n"+
		"	uv = uv * 2.0;\n"+
		"	f += 0.5000 * noise(vec2(uv.x/2.0, uv.y/2.0));\n"+
		"	uv = uv * 2.0;\n"+
		"	f += 0.2500 * noise(vec2(uv.x, uv.y/2.0));\n"+
		"	uv = uv * 2.0;\n"+
		"	f += 0.1250 * noise(vec2(uv.x, uv.y/2.0));\n"+
		"	uv = uv * 2.0;\n"+
		"	f += 0.0625 * noise(vec2(uv.x, uv.y/2.0));\n"+
		"	uv = uv * 2.0;\n"+
		
		"	f = f + 0.5;\n"+
		
		"	return f;\n"+
		"}\n";
	
	var canvas = document.getElementById('webgl');
	var gl = canvas.getContext("webgl");
	if (!gl) {
		console.log("gl Failed");
	}
	var shaderProgram = blinkProgram(gl,VSHADER_SOURCE,FSHADER_SOURCE);
	
	
		var verticesTexCoords = new Float32Array([
			-1,  1,  
			-1, -1,   
			 1,  1,   
			 1, -1 
		]);
		var vertexTexCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

		//var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
		var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position); 
		
		//gl.clearColor(0.0, 0.0, 0.0, 1.0);

		var currentAngle = 0.0;
		function main(){
			var tick = function(){
				currentAngle = animate(currentAngle);
				var u_Time = gl.getUniformLocation(shaderProgram, "u_Time");
				gl.uniform1f(u_Time, currentAngle);
				//gl.clear(gl.COLOR_BUFFER_BIT); 
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); 
				window.requestAnimationFrame(tick);
			};
			tick();
		}
	
	var ANGLES_STEP = 16;
	var last = Date.now();
	function animate(angle){
		var now = Date.now();
		var elapsed = now - last;
		last = now;
		var newAngle = angle + (ANGLES_STEP * elapsed) / 10000.0;
		
		return newAngle % 360;
	}
	
	main();