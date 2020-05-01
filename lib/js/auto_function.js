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
	
	image1.onload = function(){loadTexture(gl, texture.texture1, program.u_Sampler[0], image1, 0, program);};
	image2.onload = function(){loadTexture(gl, texture.texture2, program.u_Sampler[1], image2, 1, program);};
		
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
	var vLen = vertices.length / 3;
	var nLen = normal.length / 3;
	var texLen = texture.length / 2;
	var iLen = index[index.length - 1] + 1;
	var tanLen = tangent.length / 3;
	var bLen = bitangent.length / 3;
	
	if(vLen != nLen && vLen != texLen && vLen != iLen && vLen != tanLen && vLen != bLen){
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
function: checked Array has Null or Undefined
@return if Arrays hasn't null of it,return true, else return false;
**/
function isNull(arr){
	var result = true;
	var len = arr.length;
	for(var i = 0; i < len; i++){
		if(arr[i] == null){
			result = false
			break;
		}
	
	}
	return result;
}
/**
linght information
**/
var Light = function(position, lightColor, ambientColor){
	this.position = position;					//(x, y, z)
	this.lightColor = lightColor;				//(r, g, b, a)
	this.ambientColor = ambientColor;			//(r, g, b, a)
}
/*
Light.prototype = {
	
	//@function: normal array						{reconcile}
	//@param(1~N): reconcile all of array to argument[0]
	//@return: argument[0]
	
	reconcile:function(){
		var len = arguments.length;
		for(var i = 0; i < len; i++){
			if(arguments[i] != "undefined" && arguments[i] != "null"){
				var a0 = new Array(arguments[0]);
				var ai = new Array(arguments[i]);
				a0.concat(ai);
				return a0;
			}
			break;
			
			//console.log(a0);
		}
		return argument;
	}
}
*/

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
	var num = Math.floor(Math.random() * 3 + 1.0);
	gl.uniform3fv(obj.program.u_Light[0], obj.light[0][0].position);
	gl.uniform4fv(obj.program.u_Light[1], obj.light[0][0].lightColor);
	gl.uniform4fv(obj.program.u_Light[2], obj.light[0][0].ambientColor);
	
	gl.uniform3fv(obj.program.u_Light1[0], obj.light[0][num].position);
	gl.uniform4fv(obj.program.u_Light1[1], obj.light[0][num].lightColor);
	gl.uniform4fv(obj.program.u_Light1[2], obj.light[0][num].ambientColor);
	
	gl.uniform3fv(obj.program.u_Light2[0], obj.light[0][4].position);
	gl.uniform4fv(obj.program.u_Light2[1], obj.light[0][4].lightColor);
	gl.uniform4fv(obj.program.u_Light2[2], obj.light[0][4].ambientColor);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, obj.texture.texture1);
	
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, obj.texture.texture2);
	
	gl.uniform1f(obj.program.u_Time, Math.random() * 2.0 + 0.5);

	gl.uniformMatrix4fv(obj.program.u_Matrix[2], false, obj.modelMatrix.elements);
	
	obj.normalMatrix.setInverseOf(obj.modelMatrix);
	obj.normalMatrix.transpose();
	gl.uniformMatrix4fv(obj.program.u_Matrix[1], false, obj.normalMatrix.elements);
	
	obj.mvpMatrix.set(viewProjMatrix);
	obj.mvpMatrix.multiply(obj.modelMatrix);
	gl.uniformMatrix4fv(obj.program.u_Matrix[0], false, obj.mvpMatrix.elements);
	gl.drawElements(gl.TRIANGLES, obj.position.numIndices, obj.position.indexBuffer.type, 0);
	//newDraw(gl, obj.program, obj, angle, viewProjMatrix);
}

/**
0307
**/


function drawPlaneNoTexture(gl, obj, angle, viewProjMatrix){
	gl.useProgram(obj.program);
	obj.angle = angle
	initAttributeVariable(gl, obj.program.a_Position, obj.position.vertexBuffer);
	if(obj.program.u_Time != undefined){
		gl.uniform1f(obj.program.u_Time, angle);
	}
	
	newDraw(gl, obj, angle, viewProjMatrix);
}

function newDraw(gl, obj, angle, viewProjMatrix){
	gl.uniformMatrix4fv(obj.program.u_ModelMatrix, false, obj.modelMatrix.elements);
	
	obj.normalMatrix.setInverseOf(obj.modelMatrix);
	obj.normalMatrix.transpose();
	gl.uniformMatrix4fv(obj.program.u_NormalMatrix, false, obj.normalMatrix.elements);
	
	obj.mvpMatrix.set(viewProjMatrix);
	obj.mvpMatrix.multiply(obj.modelMatrix);
	gl.uniformMatrix4fv(obj.program.u_MvpMatrix, false, obj.mvpMatrix.elements);
	gl.drawElements(gl.TRIANGLES, obj.position.numIndices, obj.position.indexBuffer.type, 0);
}


