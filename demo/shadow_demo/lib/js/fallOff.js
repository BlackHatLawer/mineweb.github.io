var WALL_VSHADER_SOURCES = 
"attribute vec4 a_Position;\n"+
"attribute vec3 a_Normal;\n"+
"attribute vec2 a_TexCoord;\n"+
"attribute vec3 a_Tangent;\n"+
"attribute vec3 a_Bitangent;\n"+

"uniform mat4 u_MvpMatrix;\n"+
"uniform mat4 u_ModelMatrix;\n"+
"uniform mat4 u_NormalMatrix;\n"+
"uniform vec3 u_LightPosition;\n"+
"uniform vec3 u_ViewPos;\n"+
"varying vec3 v_Position;\n"+
"varying vec2 v_TexCoord;\n"+
"varying vec3 v_TangentLightPos;\n"+
"varying vec3 v_TangetnViewPos;\n"+
"varying vec3 v_TangentFragPos;\n"+
"varying mat3 v_TBN;\n"+
"mat3 transpose_mat3(mat3 m);\n"+
"void main(){\n"+
"	gl_Position = u_MvpMatrix * a_Position;\n"+
"	v_Position = vec3(u_ModelMatrix * a_Position);\n"+
"	v_TexCoord = a_TexCoord;\n"+
"	mat3 normalMatrix = mat3(u_NormalMatrix);\n"+
"	vec3 T = normalize(normalMatrix * a_Tangent);\n"+
"	vec3 B = normalize(normalMatrix * a_Bitangent);\n"+

"	vec3 N = normalize(normalMatrix * a_Normal);\n"+
"	v_TBN = transpose_mat3(mat3(T, B, N));\n"+
"	v_TangentLightPos = v_TBN * u_LightPosition;\n"+
"	v_TangetnViewPos = v_TBN * u_ViewPos;\n"+
"	v_TangentFragPos = v_TBN * v_Position;\n"+
"}\n"+
"mat3 transpose_mat3(mat3 m){\n"+
"	float t = 0.0;\n"+
"	t = m[0][1];  m[0][1] = m[1][0];  m[1][0] = t;\n"+
"	t = m[0][2];  m[0][2] = m[2][0];  m[2][0] = t;\n"+
"	t = m[1][2];  m[1][2] = m[2][1];  m[2][1] = t;\n"+
"	return m;\n"+
"}\n";

var WALL_FSHADER_SOURCES = 
"#ifdef GL_ES\n"+
"precision mediump float;\n"+
"#endif\n"+
"uniform vec4 u_LightColor;\n"+
"uniform vec4 u_AmbientLight;\n"+
"uniform sampler2D u_Sampler1;\n"+
"uniform sampler2D u_Sampler2;\n"+
"varying vec3 v_Position;\n"+
"varying vec2 v_TexCoord;\n"+
"varying vec3 v_TangentLightPos;\n"+
"varying vec3 v_TangetnViewPos;\n"+
"varying vec3 v_TangentFragPos;\n"+
"varying mat3 v_TBN;\n"+
"void main(){\n"+
"	vec3 fallOff = vec3(1.0, 0.09, 0.032);\n"+
"	vec3 normal = texture2D(u_Sampler2, v_TexCoord).rgb;\n"+
"	normal = normalize(v_TBN *(normal * 2.0 - 1.0));\n"+
"	vec3 color = texture2D(u_Sampler1, v_TexCoord).rgb;\n"+
"	vec3 ambient = u_AmbientLight.rgb * u_AmbientLight.a;\n"+
"	vec3 lightDir = normalize(v_TangentLightPos - v_TangentFragPos);\n"+
"	float D = length(lightDir);\n"+
"	float attenuation = 1.0 / (fallOff.x  + (fallOff.y * D) + (fallOff.z * D * D));\n"+
"	float diff = max(dot(lightDir, normal), 0.0);\n"+
"	vec3 diffuse = (u_LightColor.rgb * u_LightColor.a) * diff * color;\n"+
"	vec3 viewDir = normalize(v_TangetnViewPos - v_TangentFragPos);\n"+
"	vec3 reflectDir = reflect(-lightDir, normal);\n"+
"	vec3 halfwayDir = normalize(lightDir + viewDir);\n"+
"	float spec = pow(max(dot(normal, halfwayDir), 0.0), 128.0);\n"+
"	vec3 specular = vec3(1.0, 0.8, 0.6) * spec;\n"+
"	gl_FragColor = vec4((ambient + diffuse) * attenuation, 1.0);\n"+
"}\n";


var BACK_VSHADER_SOURCES = 
"attribute vec4 a_Position;\n"+
"attribute vec3 a_Normal;\n"+
"attribute vec2 a_TexCoord;\n"+
"attribute vec3 a_Tangent;\n"+
"attribute vec3 a_Bitangent;\n"+

"uniform mat4 u_MvpMatrix;\n"+
"uniform mat4 u_ModelMatrix;\n"+
"uniform mat4 u_NormalMatrix;\n"+
"uniform mat4 u_MvpMatrixFromLight;\n"+
"uniform vec3 u_ViewPos;\n"+
"uniform vec3 u_LightPosition;\n"+
"varying vec4 v_PositionFromLight;\n"+

"varying vec3 v_Position;\n"+
"varying vec2 v_TexCoord;\n"+
"varying vec3 v_TangentLightPos;\n"+
"varying vec3 v_TangetnViewPos;\n"+
"varying vec3 v_TangentFragPos;\n"+
"varying mat3 v_TBN;\n"+
"mat3 transpose_mat3(mat3 m);\n"+
"void main(){\n"+
"	gl_Position = u_MvpMatrix * a_Position;\n"+
"	v_Position = vec3(u_ModelMatrix * a_Position);\n"+
"	v_PositionFromLight = u_MvpMatrixFromLight * a_Position;\n"+
"	v_TexCoord = a_TexCoord;\n"+
"	mat3 normalMatrix = mat3(u_NormalMatrix);\n"+
"	vec3 T = normalize(normalMatrix * a_Tangent);\n"+
"	vec3 B = normalize(normalMatrix * a_Bitangent);\n"+
"	vec3 N = normalize(normalMatrix * a_Normal);\n"+    //25
"	v_TBN = transpose_mat3(mat3(T, B, N));\n"+
"	v_TangentLightPos = v_TBN * u_LightPosition;\n"+
"	v_TangetnViewPos = v_TBN * u_ViewPos;\n"+
"	v_TangentFragPos = v_TBN * v_Position;\n"+
"}\n"+

"mat3 transpose_mat3(mat3 m){\n"+
"	float t = 0.0;\n"+
"	t = m[0][1];  m[0][1] = m[1][0];  m[1][0] = t;\n"+
"	t = m[0][2];  m[0][2] = m[2][0];  m[2][0] = t;\n"+
"	t = m[1][2];  m[1][2] = m[2][1];  m[2][1] = t;\n"+
"	return m;\n"+
"}\n";


var BACK_FSHADER_SOURCES = 
"#ifdef GL_ES\n"+
"precision mediump float;\n"+
"#endif\n"+
"uniform vec4 u_LightColor;\n"+
"uniform vec4 u_AmbientLight;\n"+
"uniform sampler2D u_Sampler1;\n"+
"uniform sampler2D u_Sampler2;\n"+
"uniform sampler2D u_ShadowMap;\n"+
"varying vec4 v_PositionFromLight;\n"+
"varying vec3 v_Position;\n"+
"varying vec3 v_Normal;\n"+
"varying vec2 v_TexCoord;\n"+
"varying vec3 v_TangentLightPos;\n"+
"varying vec3 v_TangetnViewPos;\n"+
"varying vec3 v_TangentFragPos;\n"+
"varying mat3 v_TBN;\n"+

"float unpackDepth(const in vec4 rgbaDepth){\n"+
"	const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0 * 256.0), 1.0/(256.0 * 256.0 * 256.0));\n"+
"	float depth = dot(rgbaDepth, bitShift);\n"+
"	return depth;\n"+
"}\n"+

"void main(){\n"+
"	vec3 fallOff = vec3(1.0, 0.09, 0.032);\n"+
"	vec3 normal = texture2D(u_Sampler2, v_TexCoord).rgb;\n"+
"	normal = normalize( v_TBN * (normal * 2.0 - 1.0));\n"+
"	vec3 color = texture2D(u_Sampler1, v_TexCoord).rgb;\n"+
"	vec3 ambient = u_AmbientLight.rgb * u_AmbientLight.a;\n"+
"	vec3 lightDir = normalize(v_TangentLightPos - v_TangentFragPos);\n"+
"	float D = length(lightDir);\n"+
"	float attenuation = 1.0 / (fallOff.x + (fallOff.y * D) + (fallOff.z * D * D));\n"+
"	float diff = max(dot(lightDir, normal), 0.0);\n"+
"	vec3 diffuse = (u_LightColor.rgb * u_LightColor.a) * diff * color;\n"+
"	vec3 viewDir = normalize(v_TangetnViewPos - v_TangentFragPos);\n"+
"	vec3 reflectDir = reflect(-lightDir, normal);\n"+
"	vec3 halfwayDir = normalize(lightDir + viewDir);\n"+
"	float spec = pow(max(dot(normal, halfwayDir), 0.0),128.0);\n"+
"	vec3 specular = vec3(1.0) * spec;\n"+
"	vec3 finalColor = (ambient + diffuse) * attenuation;\n"+
// soft shadow
"	vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;\n"+
"	float shadows = 5.0;\n"+
"	float opacity = 0.6;\n"+
"	const float texelSize = 1.0/1024.0;\n"+
"	const float shadow_depth = 0.68;\n"+
"	vec4 rgbaDepth;\n"+
"	for(float y = -1.5; y <= 1.5; y += shadow_depth){\n"+
"		for(float x = -1.5; x <= 1.5; x += shadow_depth){\n"+
"			rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy + vec2(x, y) * texelSize);\n"+
"			shadows += shadowCoord.z - 0.0015 < unpackDepth(rgbaDepth + 0.4) ? 1.0 : 0.5;\n"+
"		}\n"+
"	}\n"+
"	shadows /= 25.0;\n"+
"	float visibility = min(opacity + (1.0 - shadows), 1.0);\n"+
"	gl_FragColor = vec4(finalColor * visibility, 1.0);\n"+
"}\n";

var DOWN_VSHADER_SOURCES = 
"attribute vec4 a_Position;\n"+
"attribute vec3 a_Normal;\n"+
"attribute vec2 a_TexCoord;\n"+
"attribute vec3 a_Tangent;\n"+
"attribute vec3 a_Bitangent;\n"+

"uniform mat4 u_MvpMatrix;\n"+
"uniform mat4 u_ModelMatrix;\n"+
"uniform mat4 u_NormalMatrix;\n"+
"uniform mat4 u_MvpMatrixFromLight;\n"+
"uniform vec3 u_ViewPos;\n"+
"uniform vec3 u_LightPosition;\n"+
"varying vec4 v_PositionFromLight;\n"+

"varying vec3 v_Position;\n"+
"varying vec2 v_TexCoord;\n"+
"varying vec3 v_TangentLightPos;\n"+
"varying vec3 v_TangetnViewPos;\n"+
"varying vec3 v_TangentFragPos;\n"+
"varying mat3 v_TBN;\n"+
"mat3 transpose_mat3(mat3 m);\n"+
"void main(){\n"+
"	gl_Position = u_MvpMatrix * a_Position;\n"+
"	v_Position = vec3(u_ModelMatrix * a_Position);\n"+
"	v_PositionFromLight = u_MvpMatrixFromLight * a_Position;\n"+
"	v_TexCoord = a_TexCoord;\n"+
"	mat3 normalMatrix = mat3(u_NormalMatrix);\n"+
"	vec3 T = normalize(normalMatrix * a_Tangent);\n"+
"	vec3 B = normalize(normalMatrix * a_Bitangent);\n"+
"	vec3 N = normalize(normalMatrix * a_Normal);\n"+    //25
"	v_TBN = transpose_mat3(mat3(T, B, N));\n"+
"	v_TangentLightPos = v_TBN * u_LightPosition;\n"+
"	v_TangetnViewPos = v_TBN * u_ViewPos;\n"+
"	v_TangentFragPos = v_TBN * v_Position;\n"+
"}\n"+

"mat3 transpose_mat3(mat3 m){\n"+
"	float t = 0.0;\n"+
"	t = m[0][1];  m[0][1] = m[1][0];  m[1][0] = t;\n"+
"	t = m[0][2];  m[0][2] = m[2][0];  m[2][0] = t;\n"+
"	t = m[1][2];  m[1][2] = m[2][1];  m[2][1] = t;\n"+
"	return m;\n"+
"}\n";


var DOWN_FSHADER_SOURCES = 
"#ifdef GL_ES\n"+
"precision mediump float;\n"+
"#endif\n"+
"uniform vec4 u_LightColor;\n"+
"uniform vec4 u_AmbientLight;\n"+
"uniform sampler2D u_Sampler1;\n"+
"uniform sampler2D u_Sampler2;\n"+
"uniform sampler2D u_ShadowMap;\n"+
"varying vec4 v_PositionFromLight;\n"+
"varying vec3 v_Position;\n"+
"varying vec3 v_Normal;\n"+
"varying vec2 v_TexCoord;\n"+
"varying vec3 v_TangentLightPos;\n"+
"varying vec3 v_TangetnViewPos;\n"+
"varying vec3 v_TangentFragPos;\n"+
"varying mat3 v_TBN;\n"+

"float unpackDepth(const in vec4 rgbaDepth){\n"+
"	const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0 * 256.0), 1.0/(256.0 * 256.0 * 256.0));\n"+
"	float depth = dot(rgbaDepth, bitShift);\n"+
"	return depth;\n"+
"}\n"+

"void main(){\n"+
"	vec3 fallOff = vec3(1.0, 0.09, 0.032);\n"+
"	vec3 normal = texture2D(u_Sampler2, v_TexCoord).rgb;\n"+
"	normal = normalize( v_TBN * (normal * 2.0 - 1.0));\n"+
"	vec3 color = texture2D(u_Sampler1, v_TexCoord).rgb;\n"+
"	vec3 ambient = u_AmbientLight.rgb * u_AmbientLight.a;\n"+
"	vec3 lightDir = normalize(v_TangentLightPos - v_TangentFragPos);\n"+
"	float D = length(lightDir);\n"+
"	float attenuation = 1.0 / (fallOff.x + (fallOff.y * D) + (fallOff.z * D * D));\n"+
"	float diff = max(dot(lightDir, normal), 0.0);\n"+
"	vec3 diffuse = (u_LightColor.rgb * u_LightColor.a) * diff * color;\n"+
"	vec3 viewDir = normalize(v_TangetnViewPos - v_TangentFragPos);\n"+
"	vec3 reflectDir = reflect(-lightDir, normal);\n"+
"	vec3 halfwayDir = normalize(lightDir + viewDir);\n"+
"	float spec = pow(max(dot(normal, halfwayDir), 0.0),128.0);\n"+
"	vec3 specular = vec3(1.0) * spec;\n"+
"	vec3 finalColor = (ambient + diffuse) * attenuation;\n"+
// soft shadow
"	vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;\n"+
"	float shadows = 5.0;\n"+
"	float opacity = 0.6;\n"+
"	const float texelSize = 1.0/1024.0;\n"+
"	const float shadow_depth = 0.68;\n"+
"	vec4 rgbaDepth;\n"+
"	for(float y = -1.5; y <= 1.5; y += shadow_depth){\n"+
"		for(float x = -1.5; x <= 1.5; x += shadow_depth){\n"+
"			rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy + vec2(x, y) * texelSize);\n"+
"			shadows += shadowCoord.z - 0.0015 > unpackDepth(rgbaDepth) ? 1.0 : 0.5;\n"+
"		}\n"+
"	}\n"+
"	shadows /= 25.0;\n"+
"	float visibility = min(opacity + (1.0 - shadows), 1.0);\n"+
"	gl_FragColor = vec4(finalColor * visibility, 1.0);\n"+
"}\n";

var WINDOW_VSHADER_SOURCES = 
"attribute vec4 a_Position;\n"+
"attribute vec4 a_Normal;\n"+
"attribute vec2 a_TexCoord;\n"+
"uniform mat4 u_MvpMatrix;\n"+
"uniform mat4 u_ModelMatrix;\n"+
"uniform mat4 u_NormalMatrix;\n"+
"varying vec2 v_TexCoord;\n"+
"varying vec3 v_Position;\n"+
"varying vec3 v_Normal;\n"+
"void main(){\n"+
"	gl_Position = u_MvpMatrix * a_Position;\n"+
"	v_Position = normalize(vec3(u_ModelMatrix * a_Position));\n"+
"	v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n"+
"	v_TexCoord = a_TexCoord;\n"+
"}\n";

//"	gl_FragColor = vec4(texColor.rgb * 0.6 - color + 0.08, 2.0);\n"+
var WINDOW_FSHADER_SOURCES =
"precision mediump float;\n"+
"uniform sampler2D u_Sampler1;\n"+
"uniform vec4 u_LightColor;\n"+
"uniform vec3 u_LightPosition;\n"+

"uniform vec4 u_AmbientLight;\n"+
"varying vec3 v_Normal;\n"+
"varying vec3 v_Position;\n"+
"varying vec2 v_TexCoord;\n"+
"void main(){\n"+
"	vec3 normal = normalize(v_Normal);\n"+
"	vec3 lightDirection = normalize(u_LightPosition - v_Position) * 2.0 - 1.0;\n"+
"	float nDotL = max(dot(lightDirection, normal), 0.0);\n"+
"	vec4 color = vec4(0.0);\n"+
"	float f = 0.0;\n"+
"	float dv = 1.5 / 512.0;\n"+
"	float tot = 5.0;\n"+
"	vec4 baseColor = vec4(0.22, 0.22, 0.22, 1.0);\n"+ 				//indistinct
"	for(float i = -5.0; i <= 5.0; ++i){\n"+
"		for(float j = -5.0; j <= 5.0; ++j){\n"+
"			f = (1.1 - sqrt(i*i + j*j)/8.0);\n"+
"			f *= f;\n"+
"			tot += f;\n"+
"			color += texture2D(u_Sampler1, vec2(v_TexCoord.x + j * dv, v_TexCoord.y + i * dv)).rgba * f;\n"+
"		}\n"+
"	}\n"+
"	color /= tot;\n"+
"	vec3 diffuse = u_LightColor.rgb * color.rgb * nDotL;\n"+
"	vec3 ambient = u_AmbientLight.rgb * color.rgb;\n"+
"	vec4 finalColor = vec4(color.rgb - baseColor.rgb + diffuse + ambient, 0.9);\n"+
"	gl_FragColor = finalColor;\n"+
"}\n";

var FIRE_VSHADER_SOURCES = 
"attribute vec4 a_Position;\n"+
"uniform mat4 u_MvpMatrix;\n"+
"void main(){\n"+
"	gl_Position = u_MvpMatrix * a_Position;\n"+
"}\n";

var FIRE_FSHADER_SOURCES = 
"precision mediump float;\n"+
"uniform float u_Time;\n"+
"vec2 hash(in vec2 p);\n"+
"float noise(in vec2 p);\n"+
"float fbm(in vec2 uv);\n"+

"void main(){\n"+
"	vec2 uv = gl_FragCoord.xy / vec2(1024.0, 500.0);\n"+
"	vec2 q = uv;\n"+
"	q.x *= 5.0;\n"+
"	float strength = 1.8;\n"+
"	float t = 1.5 * u_Time * 0.04;\n"+
"	float balance = sin(u_Time * 0.0347);\n"+
"	if(balance > 0.8 && balance < 1.0){\n"+
"	q.x -= 1.8 - balance + sin(mod((u_Time * 0.0345 + 90.0), 180.0)) - 0.2;\n"+
"	}\n"+
"	else{\n"+
"	q.x -= 1.9 - balance;\n"+
"	}\n"+
"	q.y -= 0.3;\n"+
"	float n = fbm(strength * q - vec2(0, t));\n"+
"	float c = 1.0 - 16.0 * (pow(length(q) - n * q.y, 2.0));\n"+
"	float c1 = clamp(c, 0.0, 1.0);\n"+
"	vec3 col = vec3(2.0 * c1, 2.0 * c1 * c1 * c1, 0.5 * c1 * c1 * c1 * c1 * c1 * c1);\n"+
"	float c2 = c * (1.0 - pow(uv.y, 4.0));\n"+
"	gl_FragColor = vec4(mix(vec3(0.0, 0.0, 0.0), col, c2), 1.0);\n"+
"}\n"+

"vec2 hash(in vec2 p){\n"+
"	p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));\n"+
"	return -1.0 + 2.0 * fract(sin(p * 0.5) * 43758.5453123);\n"+
"}\n"+

"float noise(in vec2 p){\n"+
"	const float k1 = 0.366025404;\n"+ 				//(sqrt(3)-1)/2
"	const float k2 = 0.211324865;\n"+				//(3 - sqrt(3))/6
"	vec2 i = floor(p + (sin(p.x) + p.y) * k1);\n"+
"	vec2 a = p - (i - (i.x + i.y) * k2);\n"+
"	vec2 o = (a.x < a.y) ? vec2(0.0, 1.0) : vec2(1.0, 0.0);\n"+
"	vec2 b = a - o + k2;\n"+
"	vec2 c = a - 1.0 + 2.0 * k2;\n"+
"	vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);\n"+
"	vec3 n  = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));\n"+
"	return dot(n, vec3(75.0));\n"+
"}\n"+

"float fbm(in vec2 uv){\n"+
"	float f = 0.0;\n"+
"	uv = uv * 2.0;\n"+
"	f += 0.5000 * noise(vec2(uv.x / 2.0, uv.y / 2.0));\n"+
"	uv = uv * 2.0;\n"+
"	f += 0.2500 * noise(vec2(uv.x, uv.y / 2.0));\n"+
"	uv  = uv * 2.0;\n"+
"	f += 0.1250 * noise(vec2(uv.x, uv.y / 2.0));\n"+
"	uv = uv * 2.0;\n"+
"	f += 0.0625 * noise(vec2(uv.x, uv.y / 2.0));\n"+
"	uv  = uv * 2.0;\n"+
"	f = f + 0.5;\n"+
"	return f;\n"+
"}\n";


var SHADOW_VSHADER_SOURCES = 
"attribute vec4 a_Position;\n"+
"uniform mat4 u_MvpMatrix;\n"+
"void main(){\n"+
"	gl_Position = u_MvpMatrix * a_Position;\n"+
"}\n";

var SHADOW_FSHADER_SOURCES = 
"#ifdef GL_ES\n"+
"precision mediump float;\n"+
"#endif\n"+
"void main(){\n"+
"	const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);\n"+
"	const vec4 bitMask = vec4(1.0/256.0, 1.0/256.0, 1.0/256.0, 0.0);\n"+
"	vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);\n"+
"	rgbaDepth -= rgbaDepth.gbaa * bitMask;\n"+
"	gl_FragColor = rgbaDepth;\n"+
"}\n";
var canvas = document.getElementById("drawing");
if(!canvas){
	console.log("get canvas error");
}
var gl = canvas.getContext("webgl");
if(!gl){
	console.log("get gl error");
}
var wallProgram = createProgram(gl, WALL_VSHADER_SOURCES, WALL_FSHADER_SOURCES);
var backProgram = createProgram(gl, BACK_VSHADER_SOURCES, BACK_FSHADER_SOURCES);
var downProgram = createProgram(gl, DOWN_VSHADER_SOURCES, DOWN_FSHADER_SOURCES);
var windowProgram = createProgram(gl, WINDOW_VSHADER_SOURCES, WINDOW_FSHADER_SOURCES);
var fireProgram = createProgram(gl, FIRE_VSHADER_SOURCES, FIRE_FSHADER_SOURCES);
var shadowProgram = createProgram(gl, SHADOW_VSHADER_SOURCES, SHADOW_FSHADER_SOURCES);

//window program
windowProgram.a_Position = gl.getAttribLocation(windowProgram, "a_Position");
windowProgram.a_Normal = gl.getAttribLocation(windowProgram, "a_Normal");
windowProgram.u_MvpMatrix = gl.getUniformLocation(windowProgram, "u_MvpMatrix");
windowProgram.u_ModelMatrix = gl.getUniformLocation(windowProgram, "u_ModelMatrix");
windowProgram.u_NormalMatrix = gl.getUniformLocation(windowProgram, "u_NormalMatrix");
windowProgram.u_LightColor = gl.getUniformLocation(windowProgram, "u_LightColor");
windowProgram.u_LightPosition = gl.getUniformLocation(windowProgram, "u_LightPosition");
windowProgram.u_AmbientLight = gl.getUniformLocation(windowProgram, "u_AmbientLight");
windowProgram.a_TexCoord = gl.getAttribLocation(windowProgram, "a_TexCoord");
windowProgram.u_Sampler1 = gl.getUniformLocation(windowProgram, "u_Sampler1");
if(windowProgram.a_Position < 0 || !windowProgram.a_Normal || !windowProgram.a_TexCoord ||
	!windowProgram.u_MvpMatrix || !windowProgram.u_ModelMatrix || !windowProgram.u_NormalMatrix ||
	!windowProgram.u_LightColor || !windowProgram.u_LightPosition || !windowProgram.u_AmbientLight){
	console.log("get window program information error");
}


wallProgram.a_Position = gl.getAttribLocation(wallProgram, "a_Position");
wallProgram.a_TexCoord = gl.getAttribLocation(wallProgram, "a_TexCoord");
wallProgram.a_Normal = gl.getAttribLocation(wallProgram, "a_Normal");
wallProgram.a_Tangent = gl.getAttribLocation(wallProgram, "a_Tangent");
wallProgram.a_Bitangent = gl.getAttribLocation(wallProgram, "a_Bitangent");
wallProgram.u_MvpMatrix = gl.getUniformLocation(wallProgram, "u_MvpMatrix");
wallProgram.u_NormalMatrix = gl.getUniformLocation(wallProgram, "u_NormalMatrix");
wallProgram.u_ModelMatrix = gl.getUniformLocation(wallProgram, "u_ModelMatrix");
wallProgram.u_LightColor = gl.getUniformLocation(wallProgram, "u_LightColor");
wallProgram.u_LightPosition = gl.getUniformLocation(wallProgram, "u_LightPosition");
wallProgram.u_AmbientLight = gl.getUniformLocation(wallProgram, "u_AmbientLight");
wallProgram.u_Sampler1 = gl.getUniformLocation(wallProgram, "u_Sampler1");
wallProgram.u_Sampler2 = gl.getUniformLocation(wallProgram, "u_Sampler2");


if(wallProgram.a_Position < 0 || !wallProgram.a_Normal || !wallProgram.a_TexCoord || !wallProgram.u_MvpMatrix ||
   !wallProgram.u_ModelMatrix || !wallProgram.u_NormalMatrix || !wallProgram.u_LightColor || !wallProgram.u_LightPosition ||
   !wallProgram.u_AmbientLight || !wallProgram.u_Sampler1 || !wallProgram.u_Sampler2){
	   console.log("get wall shader information error");
	}
	
//back program
backProgram.a_Position = gl.getAttribLocation(backProgram, "a_Position");
backProgram.a_Normal = gl.getAttribLocation(backProgram, "a_Normal");
backProgram.a_TexCoord = gl.getAttribLocation(backProgram, "a_TexCoord");
backProgram.u_MvpMatrix = gl.getUniformLocation(backProgram, "u_MvpMatrix");
backProgram.u_MvpMatrixFromLight = gl.getUniformLocation(backProgram, "u_MvpMatrixFromLight");
backProgram.u_ModelMatrix = gl.getUniformLocation(backProgram, "u_ModelMatrix");
backProgram.u_NormalMatrix = gl.getUniformLocation(backProgram, "u_NormalMatrix");
backProgram.u_LightColor = gl.getUniformLocation(backProgram, "u_LightColor");
backProgram.u_LightPosition = gl.getUniformLocation(backProgram, "u_LightPosition");
backProgram.u_AmbientLight = gl.getUniformLocation(backProgram, "u_AmbientLight");
backProgram.u_Sampler1 = gl.getUniformLocation(backProgram, "u_Sampler1");
backProgram.u_Sampler2 = gl.getUniformLocation(backProgram, "u_Sampler2");
backProgram.u_ShadowMap = gl.getUniformLocation(backProgram, "u_ShadowMap");
if(backProgram.a_Position < 0 || !backProgram.a_Normal|| !backProgram.a_TexCoord || !backProgram.u_MvpMatrix ||
   !backProgram.u_ModelMatrix  || !backProgram.u_NormalMatrix || !backProgram.u_LightColor || !backProgram.u_LightPosition ||
   !backProgram.u_AmbientLight || !backProgram.u_Sampler1 || !backProgram.u_Sampler2 || !backProgram.u_ShadowMap){
	   console.log("get back program shader information error");
	}
	

//down program
downProgram.a_Position = gl.getAttribLocation(downProgram, "a_Position");
downProgram.a_Normal = gl.getAttribLocation(downProgram, "a_Normal");
downProgram.a_TexCoord = gl.getAttribLocation(downProgram, "a_TexCoord");
downProgram.u_MvpMatrix = gl.getUniformLocation(downProgram, "u_MvpMatrix");
downProgram.u_MvpMatrixFromLight = gl.getUniformLocation(downProgram, "u_MvpMatrixFromLight");
downProgram.u_ModelMatrix = gl.getUniformLocation(downProgram, "u_ModelMatrix");
downProgram.u_NormalMatrix = gl.getUniformLocation(downProgram, "u_NormalMatrix");
downProgram.u_LightColor = gl.getUniformLocation(downProgram, "u_LightColor");
downProgram.u_LightPosition = gl.getUniformLocation(downProgram, "u_LightPosition");
downProgram.u_AmbientLight = gl.getUniformLocation(downProgram, "u_AmbientLight");
downProgram.u_Sampler1 = gl.getUniformLocation(downProgram, "u_Sampler1");
downProgram.u_Sampler2 = gl.getUniformLocation(downProgram, "u_Sampler2");
downProgram.u_ShadowMap = gl.getUniformLocation(downProgram, "u_ShadowMap");

if(downProgram.a_Position < 0 || !downProgram.a_Normal || !downProgram.a_TexCoord || !downProgram.u_MvpMatrix ||
   !downProgram.u_ModelMatrix || !downProgram.u_LightColor || !downProgram.u_LightPosition ||
   !downProgram.u_AmbientLight || !downProgram.u_Sampler1 || !downProgram.u_Sampler2 || !downProgram.u_ShadowMap){
	   console.log("get down program shader information error");
	}
	

//fire program	
fireProgram.a_Position = gl.getAttribLocation(fireProgram, "a_Position");
fireProgram.u_MvpMatrix = gl.getUniformLocation(fireProgram, "u_MvpMatrix");
fireProgram.u_Time = gl.getUniformLocation(fireProgram, "u_Time");
if(fireProgram.a_Position < 0 || !fireProgram.u_MvpMatrix || !fireProgram.u_Time){
	console.log("get fire program information error");
}
	
//shadow program	
shadowProgram.a_Position = gl.getAttribLocation(shadowProgram, "a_Position");
shadowProgram.u_MvpMatrix = gl.getUniformLocation(shadowProgram, "u_MvpMatrix");
if(shadowProgram.a_Position < 0 || !shadowProgram.u_MvpMatrix){
	console.log("get shadow program information error");
}
   
//global matirex
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();
var g_modelMatrix = new Matrix4();

//shadow matrie
var mvpMatrixFromLight_m = new Matrix4();
var mvpMatrixFromLight_p = new Matrix4();

//off screen
var OFFSCREEN_WIDTH = 1024;
var OFFSCREEN_HEIGHT = 1024;

var LIGHT_X = 0.0;
var LIGHT_Y = 0.0;
var LIGHT_Z = 2.0;

var g_angle = 120;

function main(){
	
	var frontPlane = initFrontPlane(gl);
	if(!frontPlane){
		console.log("get frontPlane information error");
		return false;
	}
	var leftPlane = initLeftPlane(gl);
	if(!leftPlane){
		console.log("get left plane information error");
		return false;
	}
	
	var windowPlane = initWindowPlane(gl);
	if(!windowPlane){
		console.log("get window plane information error");
		return false;
	}
	
	var rightPlane = initRightPlane(gl);
	if(!rightPlane){
		console.log("get right plane information error");
		return false;
	}
	
	var backPlane = initBackPlane(gl);
	if(!backPlane){
		console.log("get back plane information error");
		return false;
	}
	
	var firePlacePlane = initFirePlacePlane(gl);
	if(!firePlacePlane){
		console.log("get firePlacePlane plane information error");
		return false;
	}
	
	var fireStonePlane = initFireStonePlane(gl);
	if(!fireStonePlane){
		console.log("get fireStone plane information error");
		return false;
	}
	
	var downPlane = initDownPlane(gl);
	if(!downPlane){
		console.log("get down plane information error");
		return false;
	}
	
	var firePlane = initFirePlane(gl);
	if(!firePlane){
		console.log("get fire plane information error");
		return false;
	}
	
	var frontTexture = initTextures(gl, wallProgram, "texture/white_wall.png", "texture/white_wall_NRM.jpg");
	if(!frontTexture){
		console.log("init frontTexture error");
		return false;
	}
	
	var leftTexture = initTextures(gl, wallProgram, "texture/white_wall.png", "texture/white_wall_NRM.jpg");
	if(!leftTexture){
		console.log("init leftTexture error");
		return false;
	}
	
	var rightTexture = initTextures(gl, wallProgram, "texture/white_wall.png", "texture/white_wall_NRM.jpg");
	if(!rightTexture){
		console.log("init rightTexture error");
		return false;
	}
	
	var backTexture = initTextures(gl, backProgram, "texture/wall.jpg", "texture/wall_NRM.jpg");
	if(!backTexture){
		console.log("init backTexture error");
		return false;
	}
	var firePlaceTexture = initTextures(gl, wallProgram, "texture/fire.png", "texture/fire_normal.jpg");
	if(!firePlaceTexture){
		console.log("init firePlaceTexture error");
		return false;
	}
	
	var fireStoneTexture = initTextures(gl, wallProgram, "texture/fire_stone.png", "texture/fire_stone_normal.png");
	if(!fireStoneTexture){
		console.log("init fireStoneTexture error");
		return false;
	}
	
	var downTexture = initTextures(gl, downProgram, "texture/white.jpg", "texture/white_NRM.jpg");
	if(!downTexture){
		console.log("init downTexture error");
		return false;
	}
	
	var windowFBO = initFrameBufferObject(gl);
	if(!windowFBO){
		console.log("init window frame buffer object error");
		return false;
	}
	
	var shadowFBO = initFrameBufferObject(gl);
	if(!shadowFBO){
		console.log("init shadow frame buffer object error");
		return false;
	}
	
	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
/* 	var viewProjMatrix = new Matrix4();
	viewProjMatrix.setPerspective(100.0, canvas.width/canvas.height, 1.0, 1000.0);
	viewProjMatrix.lookAt(0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); */
	
	var viewProjMatrixForWindowFBO = new Matrix4();
	viewProjMatrixForWindowFBO.setPerspective(100.0, OFFSCREEN_WIDTH/OFFSCREEN_HEIGHT, 1.0, 1000.0);
	viewProjMatrixForWindowFBO.lookAt(-1.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
	
	var viewProjMatrixFromLight = new Matrix4();
	viewProjMatrixFromLight.setPerspective(70.0, OFFSCREEN_WIDTH/OFFSCREEN_HEIGHT, 1.0, 1000.0);
	viewProjMatrixFromLight.lookAt(LIGHT_X, LIGHT_Y, LIGHT_Z, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
	
	var currentAngle = 0.0;
	var update = function (){
		currentAngle = animate(currentAngle);
		console.log(currentAngle);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		var viewProjMatrix = new Matrix4();
		viewProjMatrix.setPerspective(100.0, canvas.width/canvas.height, 1.0, 1000.0);
		viewProjMatrix.lookAt(Math.sin((currentAngle - 5.0)  * -0.0349) * 2.0, 0.0, Math.cos((currentAngle - 5.0) * -0.0349) * 2.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
		//viewProjMatrix.lookAt(0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); 
		drawSkyBox(viewProjMatrix);
		//renderShadow(gl, shadowFBO, viewProjMatrix, viewProjMatrixFromLight);
	
		window.requestAnimationFrame(update, canvas);
	};
	update();
	
	function drawSkyBox(viewProjMatrix){
		initDrawPlane(gl, wallProgram, frontPlane, frontTexture, currentAngle, viewProjMatrix);
		initDrawPlane(gl, wallProgram, leftPlane, leftTexture, currentAngle, viewProjMatrix);
		initDrawPlane(gl, wallProgram, backPlane, backTexture, currentAngle, viewProjMatrix);
		initDrawPlane(gl, wallProgram, firePlacePlane, firePlaceTexture, currentAngle, viewProjMatrix);
		initDrawPlane(gl, wallProgram, fireStonePlane, fireStoneTexture, currentAngle, viewProjMatrix);
		initDrawPlane(gl, wallProgram, downPlane, downTexture, currentAngle, viewProjMatrix);
		initDrawPlane(gl, wallProgram, rightPlane, rightTexture, currentAngle, viewProjMatrix);
		drawPlaneNoTexture(gl, fireProgram, firePlane, currentAngle, viewProjMatrix);
	}
	
	
	function renderShadow(gl, fbo, viewProjMatrix, viewProjMatrixFromLight){
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
		
		gl.viewport(0.0, 0.0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.useProgram(shadowProgram);
		initDrawPlane(gl, shadowProgram, firePlacePlane, firePlaceTexture, currentAngle, viewProjMatrixFromLight);
		initDrawPlane(gl, shadowProgram, fireStonePlane, fireStoneTexture, currentAngle, viewProjMatrixFromLight);
		mvpMatrixFromLight_m.set(g_mvpMatrix);
		initDrawPlane(gl, shadowProgram, backPlane, backTexture, currentAngle, viewProjMatrixFromLight);
		mvpMatrixFromLight_p.set(g_mvpMatrix);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		
		gl.viewport(0.0, 0.0, canvas.width, canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.useProgram(backProgram);
		gl.uniform1i(backProgram.u_ShadowMap, 2);
		gl.uniformMatrix4fv(backProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_p.elements);
		initDrawPlane(gl, backProgram, backPlane, backTexture, currentAngle, viewProjMatrix);
		gl.uniformMatrix4fv(backProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_m.elements);
		
		
		//down shadow
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
		
		gl.viewport(0.0, 0.0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.useProgram(shadowProgram);
		initDrawPlane(gl, shadowProgram, firePlacePlane, firePlaceTexture, currentAngle, viewProjMatrixFromLight);
		initDrawPlane(gl, shadowProgram, fireStonePlane, fireStoneTexture, currentAngle, viewProjMatrixFromLight);
		mvpMatrixFromLight_m.set(g_mvpMatrix);
		initDrawPlane(gl, shadowProgram, downPlane, downTexture, currentAngle, viewProjMatrixFromLight);
		mvpMatrixFromLight_p.set(g_mvpMatrix);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		
		gl.viewport(0.0, 0.0, canvas.width, canvas.height);
		//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.useProgram(downProgram);
		gl.uniform1i(downProgram.u_ShadowMap, 2);
		gl.uniformMatrix4fv(downProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_p.elements);
		initDrawPlane(gl, downProgram, downPlane, downTexture, currentAngle, viewProjMatrix);
		gl.uniformMatrix4fv(downProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_m.elements);
		
		
		initDrawPlane(gl, wallProgram, firePlacePlane, firePlaceTexture, currentAngle, viewProjMatrix);
		initDrawPlane(gl, wallProgram, fireStonePlane, fireStoneTexture, currentAngle, viewProjMatrix);
		initDrawPlane(gl, wallProgram, frontPlane, frontTexture, currentAngle, viewProjMatrix);
		initDrawPlane(gl, wallProgram, leftPlane, leftTexture, currentAngle, viewProjMatrix);
		initDrawPlane(gl, wallProgram, rightPlane, rightTexture, currentAngle, viewProjMatrix);
		
		//drawPlaneNoTexture(gl, fireProgram, firePlane, currentAngle, viewProjMatrix);
	}
}

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

	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "frontPlane");
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

	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "frontPlane");
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

	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "frontPlane");
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

	var VBO = initVBO(vertices, normal, texCoord, indices, tangent, bitangent, "frontPlane");
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

function drawPlaneNoTexture(gl, program, o, angle, viewProjMatrix){
	gl.useProgram(program);
	initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
	if(program.u_Time != undefined){
		gl.uniform1f(program.u_Time, angle);
	}
	
	draw(gl, program, o, angle, viewProjMatrix);
}

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
	gl.uniform4f(program.u_LightColor, 1.0, 0.8, 0.6, 1.0);
	gl.uniform4f(program.u_AmbientLight, 0.6, 0.6, 1.0, 0.25);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture.texture1);
	
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, texture.texture2);
	
	
	
	draw(gl, program, o, angle, viewProjMatrix);
}

function draw(gl, program, o, angle, viewProjMatrix){
	
	g_modelMatrix.setTranslate(0.2, 0.0, 0.0);
	g_modelMatrix.rotate(0.0, 1.0, 0.0, 0.0);
	g_modelMatrix.scale(1.0, 1.0, 1.0);
	g_modelMatrix.rotate(0, 0.0, 1.0, 0.0);
	
	
	gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
	
	g_normalMatrix.setInverseOf(g_modelMatrix);
	g_normalMatrix.transpose();
	gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
	
	g_mvpMatrix.set(viewProjMatrix);
	g_mvpMatrix.multiply(g_modelMatrix);
	gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
	gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);
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


var ANGLES_STEP = 20;
var last = Date.now();
function animate(angle){
	var now = Date.now();
	var elapsed = now - last;
	last = now;
	var newAngle = angle + (ANGLES_STEP * elapsed) / 1000.0;
	
	return newAngle % 360;
}
main();

