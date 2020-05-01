//left plane
function initLeftPlane(gl){
	var vertices = new Float32Array([
    -2.0, 11.0, 2.0,  -2.0, 11.0,-5.0,  -2.0,-2.0,-5.0,  -2.0,-2.0, 2.0
	]);
	
	var normal =  new Float32Array([
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0
	]);
	
	var texCoord = new Float32Array([
      -0.3,1.7, 1.7, 1.7, 1.7,-0.2, -0.3,-0.2
	]);
	
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3
	])
	
	var TB = getTangentAndBitangent(vertices, texCoord, indices);
	
	var tangent = new Float32Array(TB.tangent);
	
	var bitangent = new Float32Array(TB.bitangent);

	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "leftPlane");
	return VBO;
}

//right plane
function initRightPlane(gl){
	var vertices = new Float32Array([
		5.0, 11.0, 2.0,   5.0,-2.0, 2.0,   5.0,-2.0,-5.0,   5.0, 11.0,-5.0
	]);
	
	var normal =  new Float32Array([
		-1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0
	]);
	
	var texCoord = new Float32Array([
      -0.3,1.7, 1.7, 1.7, 1.7,-0.2, -0.3,-0.2,
	]);
	
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3
	])
	
	var TB = getTangentAndBitangent(vertices, texCoord, indices);
	
	var tangent = new Float32Array(TB.tangent);
	
	var bitangent = new Float32Array(TB.bitangent);

	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "frontPlane");
	return VBO;
}
//window plane
function initWindowPlane(gl){
	var vertices = new Float32Array([
		4.9, 6.0, 1.5,   4.9, 0.0, 1.5,   4.9, 0.0,-4.3,   4.9, 6.0,-4.3
	]);
	
	var normal = new Float32Array([
		-1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0
	]);
	
	var texCoord = new Float32Array([0.0,1.0, 0.0,0.0, 1.0,0.0,1.0,1.0]);
	
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3
	])
	
	var o = new Object();
	o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
	o.normalBuffer = initArrayBufferForLaterUse	(gl, normal, 3, gl.FLOAT);
	o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoord, 2, gl.FLOAT);
	o.indexBuffer = initElementBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
	
	if(!o.vertexBuffer || !o.normalBuffer || !o.indexBuffer){
		console.log("init vertex information error");
		return false;
	}
	
	o.numIndices = indices.length;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
	return o;
}

//front plane
function initFrontPlane(gl){
	var vertices = new Float32Array([
		5.0, 11.0, 2.0,  -2.0, 11.0, 2.0,  -2.0,-2.0, 2.0,   5.0,-2.0, 2.0
	]);
	
	var normal =  new Float32Array([
		0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   0.0, 0.0, -1.0
	]);
	
	var texCoord = new Float32Array([
      -0.3,1.7, 1.7, 1.7, 1.7,-0.2, -0.3,-0.2
	]);
	
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3
	])
	
	var TB = getTangentAndBitangent(vertices, normal, indices);
	
	var tangent = new Float32Array(TB.tangent);
	
	var bitangent = new Float32Array(TB.bitangent);
	
	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "wallPlane");
	
	return VBO;
}

//back plane
function initBackPlane(gl){
	var vertices = new Float32Array([
     5.2,-2.2,-5.0,  -2.2,-2.2,-5.0,  -2.2, 11.0,-5.0,   5.2, 11.0,-5.0 
	]);
	
	var normal =  new Float32Array([
     0.0, 0.0,1.0,   0.0, 0.0,1.0,   0.0, 0.0,1.0,   0.0, 0.0,1.0     
	]);
	
	var texCoord = new Float32Array([
    1.7,-0.2, -0.3,-0.2, -0.3,1.7, 1.7, 1.7, 
	]);
	
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3
	])
	
	var TB = getTangentAndBitangent(vertices, texCoord, indices);
	
	var tangent = new Float32Array(TB.tangent);
	
	var bitangent = new Float32Array(TB.bitangent);

	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "backPlane");
	return VBO;
}

//back square
function initBackSquarePlane(gl){
	var vertices = new Float32Array([
     2.2,3.0,-4.3,  -1.2,3.0,-4.3,  -1.2, 5.0,-4.3,   2.2, 5.0,-4.3
	]);
	
	var normal =  new Float32Array([
     0.0, 0.0,1.0,   0.0, 0.0,1.0,   0.0, 0.0,1.0,   0.0, 0.0,1.0     
	]);
	
	var texCoord = new Float32Array([
    1.7,-0.2, -0.3,-0.2, -0.3,1.7, 1.7, 1.7, 
	]);
	
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3
	])
	
	var TB = getTangentAndBitangent(vertices, texCoord, indices);
	
	var tangent = new Float32Array(TB.tangent);
	
	var bitangent = new Float32Array(TB.bitangent);

	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "backPlane");
	return VBO;
}

//firePlace plane
function initFirePlacePlane(gl){
	var vertices = new Float32Array([
     4.0,-2.0,-4.0,  -1.0,-2.0,-4.0,  -1.0, 2.5,-4.0,   4.0, 2.5,-4.0
	]);
	
	var normal =  new Float32Array([
     0.0, 0.0,1.0,   0.0, 0.0,1.0,   0.0, 0.0,1.0,   0.0, 0.0,1.0     
	]);
	
	var texCoord = new Float32Array([
    0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0 
	]);
	
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3
	])
	
	var TB = getTangentAndBitangent(vertices, texCoord, indices);
	
	var tangent = new Float32Array(TB.tangent);
	
	var bitangent = new Float32Array(TB.bitangent);

	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "firePlacePlane");
	return VBO;
}

//fireStone plane
function initFireStonePlane(gl){
	var vertices = new Float32Array([
     4.0, 2.5, -4.0,   4.0,-2.0, -4.0,   4.0,-2.0,-5.0,   4.0, 2.5,-5.0,    // v0-v3-v4-v5 right
     4.0, 2.5, -4.0,   4.0, 2.5,-5.0,  -1.0, 2.5,-5.0,  -1.0, 2.5, -4.0,    // v0-v5-v6-v1 up
    -1.0, 2.5, -4.0,  -1.0, 2.5,-5.0,  -1.0,-2.0,-5.0,  -1.0,-2.0, -4.0,    // v1-v6-v7-v2 left
	]);
	
	var normal =  new Float32Array([
     1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
     0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,     // v1-v6-v7-v2 left
	]);
	
	var texCoord = new Float32Array([
	 -0.3,1.7,  0.5, 1.7,  0.5,-0.2,  -0.3,-0.2,
     -0.3,1.7,  0.5, 1.7,  0.5,-0.2,  -0.3,-0.2,
	 -0.3,1.7,  0.5, 1.7,  0.5,-0.2,  -0.3,-0.2
	]);
	
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
	])
	
	var TB = getTangentAndBitangent(vertices, texCoord, indices);
	
	var tangent = new Float32Array(TB.tangent);
	
	var bitangent = new Float32Array(TB.bitangent);

	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "fireStonePlane");
	return VBO;
}
//down plane
function initDownPlane(gl){
	var vertices = new Float32Array([
     -2.1,-2.0,-5.1,   5.1,-2.0,-5.1,   5.1,-2.0, 2.1,  -2.1,-2.0, 2.1
	]);
	
	var normal =  new Float32Array([
     0.0, 1.0, 0.0,   0.0,1.0, 0.0,   0.0,1.0, 0.0,   0.0,1.0, 0.0
	]);
	
	var texCoord = new Float32Array([
      -0.3,-0.2, -0.3,1.7, 1.7, 1.7, 1.7,-0.2
	]);
	
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3
	])
	
	var TB = getTangentAndBitangent(vertices, texCoord, indices);
	
	var tangent = new Float32Array(TB.tangent);
	
	var bitangent = new Float32Array(TB.bitangent);

	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "downPlane");
	return VBO;
}


function initSquarePlane(gl){
	var vertices = new Float32Array([
     -0.5,-1.7,-1.1,   1.1,-1.7,-1.1,   1.1,-1.7,0.3,  -0.5,-1.7,0.3
	]);
	
	var normal =  new Float32Array([
     0.0, 1.0, 0.0,   0.0,1.0, 0.0,   0.0,1.0, 0.0,   0.0,1.0, 0.0
	]);
	
	var texCoord = new Float32Array([
      -0.3,-0.2, -0.3,1.7, 1.7, 1.7, 1.7,-0.2
	]);
	
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3
	])
	
	var TB = getTangentAndBitangent(vertices, texCoord, indices);
	
	var tangent = new Float32Array(TB.tangent);
	
	var bitangent = new Float32Array(TB.bitangent);

	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "squarePlane");
	return VBO;
}
//fire plane
function initFirePlane(gl){
	var vertices = new Float32Array([2.93,-1.45,-3.9,  0.01,-1.45,-3.9,  0.01, 0.69,-3.9,   2.93, 0.69,-3.9]);
	//var vertices = new Float32Array([4.0,-1.45,-3.9,  -1.0,-1.45,-3.9,  -1.0, 0.69,-3.9,   4.0, 0.69,-3.9]);
	var indices = new Uint8Array([0, 1, 2,   0, 2, 3]);
	
	var o = new Object();
	o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
	o.indexBuffer = initElementBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
	
	if(!o.vertexBuffer || !o.indexBuffer){
		console.log("init fire vertex information error");
		return false;
	}
	
	o.numIndices = indices.length;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
	return o;
}