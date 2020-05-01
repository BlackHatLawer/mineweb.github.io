
var ROAD_VSHADER_SOURCES = 
"attribute vec4 a_Position;\n"+
"attribute vec4 a_Normal;\n"+
"attribute vec2 a_TexCoord;\n"+
"uniform mat4 u_MvpMatrix;\n"+
"uniform mat4 u_ModelMatrix;\n"+
"uniform mat4 u_NormalMatrix;\n"+
"varying vec3 v_Position;\n"+
"varying vec3 v_Normal;\n"+
"varying vec2 v_TexCoord;\n"+
"void main(){\n"+
"	gl_Position = u_MvpMatrix * a_Position;\n"+
"	v_Position = vec3(u_ModelMatrix * a_Position);\n"+
"	v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n"+
"	v_TexCoord = a_TexCoord;\n"+
"}\n";

var ROAD_FSHADER_SOURCES = 
"#ifdef GL_ES\n"+
"precision mediump float;\n"+
"#endif\n"+
"uniform vec4 u_LightColor;\n"+
"uniform vec3 u_LightPosition;\n"+
"uniform vec4 u_AmbientLight;\n"+
"uniform sampler2D u_Sampler1;\n"+
"uniform sampler2D u_Sampler2;\n"+
"uniform float u_Time;\n"+
"varying vec3 v_Position;\n"+
"varying vec3 v_Normal;\n"+
"varying vec2 v_TexCoord;\n"+
"void main(){\n"+
"	vec2 Resolution = vec2(1024.0, 1024.0);\n"+//
"	vec3 fallOff = vec3(0.01, 5.0, 20.0);\n"+
"	vec3 normal = normalize(v_Normal);\n"+
"	vec3 lightDir = vec3(u_LightPosition.xy - (gl_FragCoord.xy/Resolution.xy), u_LightPosition.z);\n"+
"	lightDir.x *= Resolution.x / Resolution.y;\n"+
"	float D = length(lightDir);\n"+
"	vec3 normalmap = texture2D(u_Sampler2, v_TexCoord).rgb;\n"+
"	vec3 N = normalize(normalmap * 2.0 - 1.0);\n"+
"	vec3 L = normalize(lightDir);\n"+
"	vec4 diffuseColor = texture2D(u_Sampler1, v_TexCoord);\n"+
"	vec3 diffuse = (u_LightColor.rgb * u_LightColor.a) * max(dot(N, L), 0.0);\n"+
"	vec3 ambient = u_AmbientLight.rgb * u_AmbientLight.a;\n"+
"	float attenuation = 1.0 / (fallOff.x + (fallOff.y * D ) + (fallOff.z * D * D));\n"+
"	vec3 intensity = ambient + diffuse * attenuation * cos(u_Time * sin(u_Time));\n"+
"	vec3 finalColor = diffuseColor.rgb * intensity;\n"+
"	gl_FragColor = vec4(finalColor, diffuseColor.a);\n"+
"}\n";

var canvas = document.getElementById("indexExample");
if(!canvas){
	console.log("get canvas error");
}
var gl = canvas.getContext("webgl");
if(!gl){
	console.log("get gl error");
}
var roadProgram = createProgram(gl, ROAD_VSHADER_SOURCES, ROAD_FSHADER_SOURCES);

roadProgram.a_Position = gl.getAttribLocation(roadProgram, "a_Position");
roadProgram.a_Normal = gl.getAttribLocation(roadProgram, "a_Normal");
roadProgram.a_TexCoord = gl.getAttribLocation(roadProgram, "a_TexCoord");
roadProgram.u_MvpMatrix = gl.getUniformLocation(roadProgram, "u_MvpMatrix");
roadProgram.u_ModelMatrix = gl.getUniformLocation(roadProgram, "u_ModelMatrix");
roadProgram.u_NormalMatrix = gl.getUniformLocation(roadProgram, "u_NormalMatrix");
roadProgram.u_LightColor = gl.getUniformLocation(roadProgram, "u_LightColor");
roadProgram.u_LightPosition = gl.getUniformLocation(roadProgram, "u_LightPosition");
roadProgram.u_AmbientLight = gl.getUniformLocation(roadProgram, "u_AmbientLight");
roadProgram.u_Sampler1 = gl.getUniformLocation(roadProgram, "u_Sampler1");
roadProgram.u_Sampler2 = gl.getUniformLocation(roadProgram, "u_Sampler2");
roadProgram.u_Time = gl.getUniformLocation(roadProgram, "u_Time");

if(roadProgram.a_Position < 0 || roadProgram.a_Normal < 0 || roadProgram.a_TexCoord < 0 || !roadProgram.u_MvpMatrix ||
   !roadProgram.u_ModelMatrix || !roadProgram.u_NormalMatrix || !roadProgram.u_LightColor || !roadProgram.u_LightPosition ||
   !roadProgram.u_AmbientLight || !roadProgram.u_Sampler1 || !roadProgram.u_Sampler2 || !roadProgram.u_Time){
	   console.log("get shader information error");
	}
   
//global matirex
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();
var g_modelMatrix = new Matrix4();
   
function main(){
	
	var plane = initPlane(gl);
	if(!plane){
		console.log("get plane information error");
		return false;
	}
	
	var texture = initTextures(gl, roadProgram);
	if(!texture){
		console.log("init texture error");
		return false;
	}
	
	gl.enable(gl.DEPTH_TEST);
	//gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	
	var viewProjMatrix = new Matrix4();
	viewProjMatrix.setPerspective(30.0, canvas.width/canvas.height, 1.0, 1000.0);
	viewProjMatrix.lookAt(0.0, 1.0, 8.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
	
	var currentAngle = 0.0;
	var tick = function (){
		currentAngle = animate(currentAngle);
		var u_Time = gl.getUniformLocation(roadProgram, "u_Time");
		if(currentAngle > 320)
		{
			gl.uniform1f(u_Time, currentAngle * 1.5);
		}
		else{
			gl.uniform1f(u_Time, 1.0);
		}
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		initDrawPlane(gl, roadProgram, plane, texture, currentAngle, viewProjMatrix);
		
		window.requestAnimationFrame(tick, canvas);
	};
	tick();
}


function initPlane(gl){
	var vertices = new Float32Array([
		1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
	]);
	
	var normal =  new Float32Array([
		0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,     // v0-v1-v2-v3 front
     1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
     0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,     // v1-v6-v7-v2 left
     0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,     // v7-v4-v3-v2 down
     0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0      // v4-v7-v6-v5 back
	]);
	
	var texCoord = new Float32Array([
		1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
     0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
     1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
     1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
     0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
     0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
	]);
	
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
	])
	
	var o = new Object();
	o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
	o.normalBuffer = initArrayBufferForLaterUse	(gl, normal, 3, gl.FLOAT);
	o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoord, 2, gl.FLOAT);
	o.indexBuffer = initElementBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
	
	if(!o.vertexBuffer || !o.normalBuffer || !o.texCoordBuffer || !o.indexBuffer){
		console.log("init vertex information error");
		return false;
	}
	
	o.numIndices = indices.length;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
	return o;
}

function initArrayBufferForLaterUse(gl, data, num, type){
	var buffer = gl.createBuffer();
	if(!buffer){
		console.log("create ARRAY_BUFFER buffer error");
		return false;
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	
	buffer.num = num;
	buffer.type = type;
	
	return buffer;
}

function initElementBufferForLaterUse(gl, data, type){
	var buffer = gl.createBuffer();
	if(!buffer){
		console.log("create ELEMENT_BUFFER buffer error");
		return false;
	}
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
	
	buffer.type = type;
	
	return buffer;
}

function initAttributeVariable(gl, attribute, buffer){
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(attribute, buffer.num, buffer.type, false, 0, 0);
	gl.enableVertexAttribArray(attribute);
}

function initTextures(gl, program){
	var texture = new Object();
	texture.texture1 = gl.createTexture();
	texture.texture2 = gl.createTexture();
	if(!texture.texture1 || !texture.texture2){
		console.log("create texture1 error");
		return false;
	}
	
	var image1 = new Image();
	var image2 = new Image();
	if(!image1 || !image2){
		console.log("create image error");
		return false;
	}
	
	gl.useProgram(roadProgram);
	
	//set light information
	gl.uniform3f(roadProgram.u_LightPosition, 0.2, 0.16, 0.05);
	gl.uniform4f(roadProgram.u_LightColor, 1.0, 0.8, 0.6, 1.0);
	gl.uniform4f(roadProgram.u_AmbientLight, 0.6, 0.6, 1.0, 0.2);
	
	
	image1.onload = function(){loadTexture(gl, texture.texture1, roadProgram.u_Sampler1, image1, 0);};
	image2.onload = function(){loadTexture(gl, texture.texture2, roadProgram.u_Sampler2, image2, 1);};
		
	image1.src = "texture/stone.png";
	image2.src = "texture/stone_normal.jpg";
	
	return texture;
}

function loadTexture(gl, texture, u_Sampler, image, texUnit){
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	if(texUnit == 0){
		gl.activeTexture(gl.TEXTURE0);
	}else{
		gl.activeTexture(gl.TEXTURE1);
	}
	
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.uniform1i(u_Sampler, texUnit);
	
	gl.bindTexture(gl.TEXTURE_2D, null);
}

function initDrawPlane(gl, program, o, texture, angle, viewProjMatrix){
	gl.useProgram(program);
	initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
	initAttributeVariable(gl, program.a_Normal, o.normalBuffer);
	initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture.texture1);
	
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, texture.texture2);
	draw(gl, program, o, angle, viewProjMatrix);
	
}

function draw(gl, program, o, angle, viewProjMatrix){
	g_modelMatrix.setTranslate(-0.2, 0.0, 0.0);
	g_modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
	g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);
	
	g_normalMatrix.setInverseOf(g_modelMatrix);
	g_normalMatrix.transpose();
	gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
	
	g_mvpMatrix.set(viewProjMatrix);
	g_mvpMatrix.multiply(g_modelMatrix);
	gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
	
	gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);
}



var ANGLES_STEP = 30;
var last = Date.now();
function animate(angle){
	var now = Date.now();
	var elapsed = now - last;
	last = now;
	var newAngle = angle + (ANGLES_STEP * elapsed) / 1000.0;
	
	return newAngle % 360;
}
main();


