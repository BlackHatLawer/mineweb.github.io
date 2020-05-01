function blinkProgram(gl,VSHADER_SOURCE,FSHADER_SOURCE){
	var vertShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertShader, VSHADER_SOURCE);
	gl.compileShader(vertShader);
	if(!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
	{  
        console.log("vertShader erro:  "+gl.getShaderInfoLog(vertShader));  
    }
	
	var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragShader, FSHADER_SOURCE);
	gl.compileShader(fragShader);
	if(!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
	{  
        console.log("fragShader erro:  "+gl.getShaderInfoLog(fragShader));  
    }
	
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertShader);
	gl.attachShader(shaderProgram, fragShader);
	gl.linkProgram(shaderProgram);
	if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
	{        
        console.log(gl.getProgramInfoLog(shaderProgram));  
    }
	
	return shaderProgram;
};


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

function initTextures(gl, program, src, normal_src){
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
	
	image1.onload = function(){loadTexture(gl, texture.texture1, program.u_Sampler1, image1, 0, program);};
	image2.onload = function(){loadTexture(gl, texture.texture2, program.u_Sampler2, image2, 1, program);};
		
	image1.src = src;
	image2.src = normal_src;
	
	return texture;
}

function loadTexture(gl, texture, u_Sampler, image, texUnit, program){
	gl.useProgram(program);
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

function initFrameBufferObject(gl){
	var framebuffer, texture, depthbuffer;

	var error = function(){
		if(framebuffer) gl.deleteFrameBuffer(framebuffer);
		if(texture) gl.deleteTexture(texture);
		if(depthbuffer) gl.deleteRenderbuffer(depthbuffer);
		
		return false;
	}
	
	framebuffer = gl.createFramebuffer();
	if(!framebuffer){
		console.log("create frame buffer error");
		return error();
	}
	
	texture = gl.createTexture();
	if(!texture){
		console.log("create texture error");
		return error();
	}
	
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	framebuffer.texture = texture;
	
	depthbuffer = gl.createRenderbuffer();
	if(!depthbuffer){
		console.log("create depthbuffer error");
		return error();
	}
	
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthbuffer);
	
	var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	if(gl.FRAMEBUFFER_COMPLETE != e){
		console.log("frame buffer object incomplete: " + e.toString());
		return error();
	}
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	
	return framebuffer;
}

function drawPlaneNoTexture(gl, program, o, angle, viewProjMatrix){
	gl.useProgram(program);
	initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
	if(program.u_Time != undefined){
		gl.uniform1f(program.u_Time, angle);
	}
	
	newDraw(gl, program, o, angle, viewProjMatrix);
}


/**
@param 1: Array vertices of position;           (vec3)
@param 2: Array texture of texture coordinate;	(vec2)
@param 3: Array indices of number;				(vec3)
**/
function getTangentAndBitangent(vertices, texture, index){
	var v_len = vertices.length / 3;
	var t_len = texture.length / 2;
	var i_len = index[index.length - 1] + 1;
	if(v_len != t_len && v_len != i_len){
		console.log("Parameters error, Please consult method of constructor.");
		return 0;
	}
	
	var tangent = new Array();
	var bitangent = new Array();
	var i;
	for(i = 0; i < index.length; i += 6){
		//firse triangle
		//pos2 - pos1
		var edge1 = new Vector3([vertices[index[i + 1] * 3] - vertices[index[i] * 3], vertices[index[i + 1] * 3 + 1] - vertices[index[i] * 3 + 1], vertices[index[i + 1] * 3 + 2] - vertices[index[i] * 3 + 2]]);
		//pos3 - pos1
		var edge2 = new Vector3([vertices[index[i + 2] * 3] - vertices[index[i] * 3], vertices[index[i + 2] * 3 + 1] - vertices[index[i] * 3 + 1], vertices[index[i + 2] * 3 + 2] - vertices[index[i] * 3 + 2]]);
		
		//uv2 - uv1
		var deltaUV1 = new Vector2([texture[index[i + 1] * 2] - texture[index[i] * 2], texture[index[i + 1] * 2 + 1] - texture[index[i] * 2 + 1], texture[index[i + 1] * 2 + 2] - texture[index[i] * 2 + 2]]);
		//uv3 - uv1
		var deltaUV2 = new Vector2([texture[index[i + 2] * 2] - texture[index[i] * 2], texture[index[i + 2] * 2 + 1] - texture[index[i] * 2 + 1], texture[index[i + 2] * 2 + 2] - texture[index[i] * 2 + 2]]);

		//second triangle
		// pos3 - pos1
		var edge3 = new Vector3([vertices[index[i + 2] * 3] - vertices[index[i] * 3], vertices[index[i + 2] * 3 + 1] - vertices[index[i] * 3 + 1], vertices[index[i + 2] * 3 + 2] - vertices[index[i] * 3 + 2]]);
		//pos4 - pos1
		var edge4 = new Vector3([vertices[index[i + 5] * 3] - vertices[index[i] * 3], vertices[index[i + 5] * 3 + 1] - vertices[index[i] * 3 + 1], vertices[index[i + 5] * 3 + 2] - vertices[index[i] * 3 + 2]]);
		
		//uv3 - uv1
		var deltaUV3 = new Vector2([texture[index[i + 2] * 2] - texture[index[i] * 2], texture[index[i + 2] * 2 + 1] - texture[index[i] * 2 + 1], texture[index[i + 2] * 2 + 2] - texture[index[i] * 2 + 2]]);
		//uv4 - uv1
		var deltaUV4 = new Vector2([texture[index[i + 5] * 2] - texture[index[i] * 2], texture[index[i + 5] * 2 + 1] - texture[index[i] * 2 + 1], texture[index[i + 5] * 2 + 2] - texture[index[i] * 2 + 2]]);
		
		var tangent1 = new Vector3();
		var tangent2 = new Vector3();
		var bitangent1 = new Vector3();
		var bitangent2 = new Vector3();
		
		//calculate tangent and bitangent
		//	| Tx  Ty  Tz |  =  |deltaU1  deltaV1| -1  |E1x  E1y  E1z|
		//	| Bx  By  Bz |     |deltaU2  deltaV2|	  |E2x  E2y  E2z|
		
		
		//   0|\
		//    | \
		//	  |  \
		//   1|_ _\2
		var f = 1.0 / (deltaUV1.elements[0] * deltaUV2.elements[1] - deltaUV2.elements[0] * deltaUV1.elements[1]);
		
		tangent1.elements[0] = f * (deltaUV2.elements[1] * edge1.elements[0] - deltaUV1.elements[1] * edge2.elements[0]);
		tangent1.elements[1] = f * (deltaUV2.elements[1] * edge1.elements[1] - deltaUV1.elements[1] * edge2.elements[1]);
		tangent1.elements[2] = f * (deltaUV2.elements[1] * edge1.elements[2] - deltaUV1.elements[1] * edge2.elements[2]);
		tangent1.normalize();
		
		bitangent1.elements[0] = f * (-deltaUV2.elements[0] * edge1.elements[0] + deltaUV1.elements[0] * edge2.elements[0]);
		bitangent1.elements[1] = f * (-deltaUV2.elements[0] * edge1.elements[1] + deltaUV1.elements[0] * edge2.elements[1]);
		bitangent1.elements[2] = f * (-deltaUV2.elements[0] * edge1.elements[2] + deltaUV1.elements[0] * edge2.elements[2]);
		bitangent1.normalize();
		
		//0 _ __ 3
		//  \   |
		//   \  |
		//    \ |
		//     \| 2
		var g = 1.0 / (deltaUV3.elements[0] * deltaUV4.elements[1] - deltaUV4.elements[0] * deltaUV3.elements[1]);
		
		tangent2.elements[0] = g * (deltaUV4.elements[1] * edge3.elements[0] - deltaUV3.elements[1] * edge4.elements[0]);
		tangent2.elements[1] = g * (deltaUV4.elements[1] * edge3.elements[1] - deltaUV3.elements[1] * edge4.elements[1]);
		tangent2.elements[2] = g * (deltaUV4.elements[1] * edge3.elements[2] - deltaUV3.elements[1] * edge4.elements[2]);
		tangent2.normalize();
	
		bitangent2.elements[0] = g * (-deltaUV4.elements[0] * edge3.elements[0] + deltaUV3.elements[0] * edge4.elements[0]);
		bitangent2.elements[1] = g * (-deltaUV4.elements[0] * edge3.elements[1] + deltaUV3.elements[0] * edge4.elements[1]);
		bitangent2.elements[2] = g * (-deltaUV4.elements[0] * edge3.elements[2] + deltaUV3.elements[0] * edge4.elements[2]);
		bitangent2.normalize();
		
		for(var j = 0; j < 4; j++){
			tangent.push((tangent1.elements[0] + tangent2.elements[0]) / 2);
			tangent.push((tangent1.elements[1] + tangent2.elements[1]) / 2);
			tangent.push((tangent1.elements[2] + tangent2.elements[2]) / 2);
			
			bitangent.push((bitangent1.elements[0] + bitangent2.elements[0]) / 2);
			bitangent.push((bitangent1.elements[1] + bitangent2.elements[1]) / 2);
			bitangent.push((bitangent1.elements[2] + bitangent2.elements[2]) / 2);
		}
		
	}
	
	var o = new Object();
	o.tangent = tangent;
	o.bitangent = bitangent;
	
	return o;
}

/**
@param 1: Array vertices		(vec3)
@param 2: Array normal			(vec3)
@param 3: Array texture			(vec2)
@param 4: Array index			(vec3)
@param 5: Array tangent			(vec3)
@param 6: Array bitangent		(vec3)
@param 7: parents node name for handy to checked error
**/
function initVBO(vertices, normal, texture, index, tangent, bitangent, parentNodeName){
	var v_len = vertices.length / 3;
	var n_len = normal.length / 3;
	var tex_len = texture.length / 2;
	var i_len = index[index.length - 1] + 1;
	var tan_len = tangent.length / 3;
	var b_len = bitangent.length / 3;
	
	if(v_len != n_len && v_len != tex_len && v_len != i_len && v_len != tan_len && v_len != b_len){
		console.log("VBO data error, Position is : " + parentNodeName);
	}
	
	var o = new Object();
	
	o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
	o.normalBuffer = initArrayBufferForLaterUse(gl, normal, 3, gl.FLOAT);
	o.texCoordBuffer = initArrayBufferForLaterUse(gl, texture, 2, gl.FLOAT);
	o.tangentBuffer = initArrayBufferForLaterUse(gl, tangent, 3, gl.FLOAT);
	o.bitangentBuffer = initArrayBufferForLaterUse(gl, bitangent, 3, gl.FLOAT);
	
	o.indexBuffer = initElementBufferForLaterUse(gl, index, gl.UNSIGNED_BYTE);
	
	if(!o.vertexBuffer || !o.normalBuffer || !o.texCoordBuffer || !o.tangentBuffer || !o.bitangentBuffer || !o.indexBuffer){
		console.log("Checked VBO, error in :" + parentNodeName);
		return false;
	}
	
	o.numIndices = index.length;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	return o;
}

/**
linght information
**/
var Light = function(){
	this.position = new Vector3();				//(x, y, z)
	this.lightColor = new Vector4();			//(r, g, b, a)
	this.ambientColor = new Vector4();			//(r, g, b, a)
}

/**
send light information to shader, more than one Light;
@param1: shader Program
@param2: light information						//array([]);
**/
function bindLight(gl, program, light){
	if(program === undefined){
		console.log("Prgoram undefined");
		return false;
	}
	
	if(light === undefined || typeof light != "object"){
		console.log("Light error");
		return false;
	}
	
	var len = light.length;
	switch(len){
		case 1:
			gl.uniform3f(program.u_LightPosition, light[0][0].position[0], light[0][0].position[1], light[0][0].position[2]);
			gl.uniform4f(program.u_LightColor, light[0][0].lightColor[0], light[0][0].lightColor[1], light[0][0].lightColor[2], light[0][0].lightColor[3]);
			gl.uniform4f(program.u_AmbientLight, light[0][0].ambientColor[0], light[0][0].ambientColor[1], light[0][0].ambientColor[2], light[0][0].ambientColor[3]);
		break;
		
		case 2:
			gl.uniform3f(program.u_LightPosition, light[0][0].position[0], light[0][0].position[1], light[0][0].position[2]);
			gl.uniform4f(program.u_LightColor, light[0][0].lightColor[0], light[0][0].lightColor[1], light[0][0].lightColor[2], light[0][0].lightColor[3]);
			gl.uniform4f(program.u_AmbientLight, light[0][0].ambientColor[0], light[0][0].ambientColor[1], light[0][0].ambientColor[2], light[0][0].ambientColor[3]);
			
			gl.uniform3f(program.u_LightPosition1, light[0][1].position[0], light[0][1].position[1], light[0][1].position[2]);
			gl.uniform4f(program.u_LightColor1, light[0][1].lightColor[0], light[0][1].lightColor[1], light[0][1].lightColor[2], light[0][1].lightColor[3]);
			gl.uniform4f(program.u_AmbientLight1, light[0][1].ambientColor[0], light[0][1].ambientColor[1], light[0][1].ambientColor[2], light[0][1].ambientColor[3]);
		break;
		
		case 3:
		gl.uniform3f(program.u_LightPosition, light[0][0].position[0], light[0][0].position[1], light[0][0].position[2]);
			gl.uniform4f(program.u_LightColor, light[0][0].lightColor[0], light[0][0].lightColor[1], light[0][0].lightColor[2], light[0][0].lightColor[3]);
			gl.uniform4f(program.u_AmbientLight, light[0][0].ambientColor[0], light[0][0].ambientColor[1], light[0][0].ambientColor[2], light[0][0].ambientColor[3]);
			
			gl.uniform3f(program.u_LightPosition1, light[0][1].position[0], light[0][1].position[1], light[0][1].position[2]);
			gl.uniform4f(program.u_LightColor1, light[0][1].lightColor[0], light[0][1].lightColor[1], light[0][1].lightColor[2], light[0][1].lightColor[3]);
			gl.uniform4f(program.u_AmbientLight1, light[0][1].ambientColor[0], light[0][1].ambientColor[1], light[0][1].ambientColor[2], light[0][1].ambientColor[3]);
			
			gl.uniform3f(program.u_LightPosition2, light[0][2].position[0], light[0][2].position[1], light[0][2].position[2]);
			gl.uniform4f(program.u_LightColor2, light[0][2].lightColor[0], light[0][2].lightColor[1], light[0][2].lightColor[2], light[0][2].lightColor[3]);
			gl.uniform4f(program.u_AmbientLight2, light[0][2].ambientColor[0], light[0][2].ambientColor[1], light[0][2].ambientColor[2], light[0][2].ambientColor[3]);
		break;
	}
}
/**
@param1:shader program
@param2:position      (vec3)
@param3:texture		  (texture information)	
**/

var Piece = function(gl, program, position, texture){
	this.program = program;							//shader program		(glsl)
	this.position = position;						//position
	this.texture = texture;							//texture
	this.modelMatrix = new Matrix4();				//model matrix
	this.viewProjMatrix = new Matrix4();			//view projection matrix
	this.normalMatrix = new Matrix4();				//normal matrix
	this.mvpMatrix = new Matrix4();					//mvp matrix
	this.light;										//light information 	{ array([]); }
	this.angle;										//model angle			{ float		 }
}


function draw(gl, obj, angle, viewProjMatrix){
	if(obj == undefined && obj.typeof != 'object'){
		console.log("Model information error");
		return false;
	}
	
	obj.angle = angle;
	
	gl.useProgram(obj.program);
	
	initAttributeVariable(gl, obj.program.a_Position, obj.position.vertexBuffer);
	
	if(obj.program.a_Color != undefined)
		initAttributeVariable(gl, obj.program.a_Color, obj.position.colorBuffer);
	if(obj.program.a_Normal != undefined)
		initAttributeVariable(gl, obj.program.a_Normal, obj.position.normalBuffer);

	if(obj.program.a_TexCoord != undefined)
		initAttributeVariable(gl, obj.program.a_TexCoord, obj.position.texCoordBuffer);
	
	if(obj.program.a_Tangent != undefined)
		initAttributeVariable(gl, obj.program.a_Tangent, obj.position.tangentBuffer);
	
	if(obj.program.a_Bitangent != undefined)
		initAttributeVariable(gl, obj.program.a_Bitangent, obj.position.bitangentBuffer);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.position.indexBuffer);
	//set light information
	bindLight(gl, obj.program, obj.light);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, obj.texture.texture1);
	
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, obj.texture.texture2);
	
	
	/*
	gl.uniformMatrix4fv(obj.program.u_ModelMatrix, false, obj.modelMatrix.elements);
	
	g_normalMatrix.setInverseOf(obj.modelMatrix);
	g_normalMatrix.transpose();
	gl.uniformMatrix4fv(obj.program.u_NormalMatrix, false, g_normalMatrix.elements);
	
	g_mvpMatrix.set(viewProjMatrix);
	g_mvpMatrix.multiply(obj.modelMatrix);
	gl.uniformMatrix4fv(obj.program.u_MvpMatrix, false, g_mvpMatrix.elements);
	gl.drawElements(gl.TRIANGLES, obj.position.numIndices, obj.position.indexBuffer.type, 0);*/
	newDraw(gl, obj.program, obj, angle, viewProjMatrix);
}

/**
0307
**/


function initDrawPlane(gl, program, o, texture, angle, viewProjMatrix){
	gl.useProgram(program);
	
	initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
	
	if(program.a_Normal != undefined)
		initAttributeVariable(gl, program.a_Normal, o.normalBuffer);
	
	if(program.a_TexCoord != undefined)
		initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);
	
	if(program.a_Color != undefined)
		initAttributeVariable(gl, program.a_Color, o.colorBuffer);
	
	if(program.a_Tangent != undefined)
		initAttributeVariable(gl, program.a_Tangent, o.tangentBuffer);
	
	if(program.a_Bitangent != undefined)
		initAttributeVariable(gl, program.a_Bitangent, o.bitangentBuffer);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
	//set light information
	gl.uniform3f(program.u_LightPosition, LIGHT_X, LIGHT_Y, LIGHT_Z);
	gl.uniform4f(program.u_LightColor, 1.0, 0.85, 0.7, 1.4);
	gl.uniform4f(program.u_AmbientLight, 0.6, 0.6, 1.0, 0.25);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture.texture1);
	
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, texture.texture2);
	
	newDraw(gl, program, o, angle, viewProjMatrix);
}

function newDraw(gl, program, o, angle, viewProjMatrix){
	gl.uniformMatrix4fv(program.u_ModelMatrix, false, o.modelMatrix.elements);
	
	o.normalMatrix.setInverseOf(o.modelMatrix);
	o.normalMatrix.transpose();
	gl.uniformMatrix4fv(program.u_NormalMatrix, false, o.normalMatrix.elements);
	
	o.mvpMatrix.set(viewProjMatrix);
	o.mvpMatrix.multiply(o.modelMatrix);
	gl.uniformMatrix4fv(program.u_MvpMatrix, false, o.mvpMatrix.elements);
	gl.drawElements(gl.TRIANGLES, o.position.numIndices, o.position.indexBuffer.type, 0);
} 

