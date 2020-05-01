var VSHADER_SOURCE_RELESE = 
"attribute vec3 a_Position;\n"+
"attribute vec3 a_Color;\n"+
"uniform mat4 u_MvpMatrix;\n"+
"varying vec3 v_Color;\n"+
"void main(){ ;\n"+
"	v_Color = a_Color;\n"+
"	gl_Position = u_MvpMatrix * vec4(a_Position, 1.0);\n"+
"}\n";

var FSHADER_SOURCE_RELESE = 
"#ifdef GL_ES\n"+
"precision mediump float;\n"+
"#endif\n"+
"varying vec3 v_Color;\n"+
"void main(){\n"+
" 	gl_FragColor = vec4(v_Color, 1.0);\n"+
"}\n";
//shader for camera and model	

var VSHADER_SOURCE = 
"attribute vec3 a_Position;\n"+
"attribute vec3 a_Color;\n"+
"uniform mat4 u_MvpMatrix;\n"+
"varying vec3 v_Color;\n"+
"void main(){\n"+
"	gl_Position = u_MvpMatrix * vec4(a_Position, 1.0);\n"+
"	v_Color = a_Color;\n"+
"}";
var FSHADER_SOURCE = 
"precision mediump float;"+
"varying vec3 v_Color;\n"+
"void main(){\n"+
"	gl_FragColor = vec4(v_Color, 1.0);\n"+
"}";

var canvas = document.getElementById("tiyan");
var gl = canvas.getContext("webgl");
if(!gl){
console.log("get gl failed");
}

var shaderP_relese = blinkProgram(gl, VSHADER_SOURCE_RELESE, FSHADER_SOURCE_RELESE);
var shader = blinkProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
if(!shaderP_relese)
{
console.log("get relese program failed");
}
if(!shader)
{
console.log("get shader program error");
}
gl.useProgram(shaderP_relese);
gl.useProgram(shader);


//model position info
var position = new Float32Array([
0.0, 0.5, -0.4,
-0.5, -0.5, -0.4,
0.5, -0.5, -0.4,

0.5, 0.4, -0.2,
-0.5, 0.4, -0.2, 
0.0, -0.6, -0.2,

0.0, 0.5, 0.0, 
-0.5, -0.5, 0.0,
0.5, -0.5, 0.0
]);
var color = new Float32Array([
177/255, 241/255, 255/255,
177/255, 241/255, 255/255,
177/255, 241/255, 255/255,

255/255, 66/255, 132/255, 
255/255, 6/255, 64/255, 
204/255, 255/255, 200/255, 

177/255, 199/255, 255/255,
177/255, 199/255, 255/255,
177/255, 199/255, 255/255,
]);

//coordinate position info
var relese_position = new Float32Array([
0.0, 0.0, 0.0, 10.0, 0.0, 0.0,
0.0, 0.0, 0.0, 0.0, 10.0, 0.0, 
0.0, 0.0, 0.0, 0.0, 0.0, 10.0
]);

var relese_color = new Float32Array([
1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
0.0, 0.0, 1.0, 0.0, 0.0, 1.0
]);

/**
projection,view,model matrix
*/
var modelMatrix = new Matrix4();
var viewMatrix = new Matrix4();
var projMatrix = new Matrix4();
var mvpMatrix = new Matrix4();
/**
camera parameter
*/

var eyeX = parseFloat(document.getElementById("eyeX").value),
eyeY = parseFloat(document.getElementById("eyeY").value),
eyeZ = parseFloat(document.getElementById("eyeZ").value),
targetX = parseFloat(document.getElementById("targetX").value),
targetY = parseFloat(document.getElementById("targetY").value),
targetZ = parseFloat(document.getElementById("targetZ").value),
upX = parseFloat(document.getElementById("upX").value),
upY = parseFloat(document.getElementById("upY").value),
upZ = parseFloat(document.getElementById("upZ").value);

//viewMatrix.setLookAt(0.25, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
viewMatrix.setLookAt(eyeX, eyeY, eyeZ, targetX, targetY, targetZ, upX, upY, upZ);
projMatrix.setPerspective(5, canvas.width/canvas.height, 1, 100);
//projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 2.0);
mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

para_change("eyeX",0);
para_change("eyeY",1);
para_change("eyeZ",2);
para_change("targetX",3);
para_change("targetY",4);
para_change("targetZ",5);
para_change("upX",6);
para_change("upY",7);
para_change("upZ",8);
function para_change(var_name, number){
const count = 0.5;
var result = 0;
var name = document.getElementById(var_name);
name.addEventListener("keydown", function(){
var value = parseFloat(this.value);
if(event.keyCode == 38){
value += count;
this.value = value;
result = value;
charge_numb(number);
viewMatrix.setLookAt(eyeX, eyeY, eyeZ, targetX, targetY, targetZ, upX, upY, upZ);
relese_main();
}
else if(event.keyCode == 40){
value -= count;
this.value = value;
result = value;
charge_numb(number);
viewMatrix.setLookAt(eyeX, eyeY, eyeZ, targetX, targetY, targetZ, upX, upY, upZ);
relese_main();
}
});

function charge_numb(number){
switch(number){
case 0:
eyeX = result;
break;
case 1:
eyeY = result;
break;
case 2:
eyeZ = result;
break;
case 3:
targetX = result;
break;
case 4:
targetY = result;
break;
case 5:
targetZ = result;
break;
case 6:
upX = result;
break;
case 7:
upY = result;
break;
case 8:
upZ = result;
break;

default : 
console.log("Enter correct parameter");
}
}
}
function drawLines(relese_slice_Position, relese_slice_Color)
{
if(!orignalBuffer(gl, relese_slice_Position, 3, gl.FLOAT, shaderP_relese, "a_Position"))
{
console.log("get buffer a_Position error");
}	

if(!orignalBuffer(gl, relese_slice_Color, 3, gl.FLOAT, shaderP_relese, "a_Color"))
{
console.log("get buffer a_Color error");
}
var u_MvpMatrix = gl.getUniformLocation(shader, "u_MvpMatrix");
if(!u_MvpMatrix)
{
console.log("get u_MvpMatrix error");
}
gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
gl.drawArrays(gl.LINES, 0, 2);
}

function drawTriangle(gl)
{
if(!orignalBuffer(gl, position, 3, gl.FLOAT, shader, "a_Position"))
{
console.log("get model position error");
}

if(!orignalBuffer(gl, color, 3, gl.FLOAT, shader, "a_Color"))
{
console.log("get model colors error");
}

var u_MvpMatrix = gl.getUniformLocation(shader, "u_MvpMatrix");
if(!u_MvpMatrix)
{
console.log("get u_MvpMatrix error");
}

modelMatrix.setScale(1.5, 1.5, 1.5);

mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

gl.drawArrays(gl.TRIANGLES, 0, 9);
}

function orignalBuffer(gl_obj, data_src, data_num, data_type, shader_name, attribute)
{
var buffer = gl_obj.createBuffer();
if(!buffer)
{
console.log("create buffer error : -" + attribute)
}
gl_obj.bindBuffer(gl_obj.ARRAY_BUFFER, buffer);
gl_obj.bufferData(gl_obj.ARRAY_BUFFER, data_src, gl_obj.STATIC_DRAW);
var a_attribute = gl_obj.getAttribLocation(shader_name, attribute);
if(attribute < 0)
{
console.log("get location error: - " + attribute);
}
gl_obj.vertexAttribPointer(a_attribute, data_num, data_type, false, 0, 0);
gl_obj.enableVertexAttribArray(a_attribute);

return true;
}

function relese_main()
{
for(var i = 0; i < relese_position.length;)
{	
var relese_slice_Position = new Float32Array();
relese_slice_Position = relese_position.slice(i, i + 6);
var relese_slice_Color = new Float32Array();
relese_slice_Color = relese_color.slice(i, i + 6);
drawLines(relese_slice_Position, relese_slice_Color);
i += 6;
}

drawTriangle(gl);
}
relese_main();