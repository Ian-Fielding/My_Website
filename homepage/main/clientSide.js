//https://www.youtube.com/watch?v=Q7AOvWpIVHU
//https://sketchfab.com/3d-models/dingus-the-cat-2ca7f3c1957847d6a145fc35de9046b0
//https://solarsystem.nasa.gov/resources/2366/earths-moon-3d-model/

import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import { GLTFLoader } from "GLTFLoader";

let MAXY=1000;

const FREE_CONTROLS=false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 800);
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});
camera.lookAt(new THREE.Vector3(-1,-1,-5));
camera.up=new THREE.Vector3(0,1,0);
scene.fog = new THREE.Fog( 0x3c9c45, 0, 800 );

function resize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}
resize();

window.addEventListener("resize", resize);


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);




const geometry = new THREE.SphereGeometry( 30,24,24);
const material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
const sphere=new THREE.Mesh(geometry,material);

//scene.add(sphere);


let cat=undefined;
let ground=undefined;
let moon=undefined;
const loader=new GLTFLoader();
loader.load(
	"projects/homepage/cat.gltf",
	function ( gltf ) {

		cat = gltf.scene;
		cat.scale.set(0.5,0.5,0.5);
		cat.position.x+=25;
		cat.position.y+=5;
		cat.position.z-=75;
		cat.children[0].children[0].children[0].children[0].children[0].castShadow=true;
		console.log(gltf.scene.children[0].children[0].children[0].children[0].children[0]);
		gltf.scene.transparent=true;
		scene.add(cat);
		
	},
	// called while loading is progressing
	function ( xhr ) {},
	// called when loading has errors
	function ( error ) {
		console.log(`Error loading cat! ${error}`);
	}
);
loader.load(
	"projects/homepage/scene.glb",
	function ( gltf ) {
		
		ground=gltf.scene;
		ground.position.z-=50;
		ground.children[0].children[1].receiveShadow=true;
		ground.transparent=true;
		scene.add(ground);
	},
	// called while loading is progressing
	function(xhr){},
	// called when loading has errors
	function ( error ) {
		console.log(`Error loading ground! ${error}`);
	}
)
loader.load(
	"projects/homepage/moon.glb",
	function ( gltf ) {
		
		moon=gltf.scene;
		const k=0.08
		moon.scale.set(k,k,k);
		moon.position.x=50;
		moon.position.y=MAXY+40;
		moon.position.z=-70;
		scene.add(moon);
	},
	// called while loading is progressing
	function(xhr){},
	// called when loading has errors
	function ( error ) {
		console.log(`Error loading ground! ${error}`);
	}
)



let planeGeometry = new THREE.PlaneGeometry(10000, 10000);
let planeTexture=new THREE.MeshStandardMaterial({
	color: 0x3c9c45
});
let mesh=new THREE.Mesh(planeGeometry,planeTexture);
mesh.position.set(0,-3,500);
mesh.rotateX(-90*Math.PI/180);
scene.add(mesh);



const pointLight=new THREE.PointLight(0xffffff);
pointLight.position.set(15,30,-75);
renderer.shadowMap.enabled = true;
pointLight.castShadow = true;
const ambientLight=new THREE.AmbientLight(0xffffff);
scene.add(pointLight,ambientLight);


//const lightHelper=new THREE.PointLightHelper(pointLight);
//scene.add(lightHelper);

let controls;
if(FREE_CONTROLS)
	controls=new OrbitControls(camera, renderer.domElement);




function addStar(){
	const geometry = new THREE.SphereGeometry(0.25, 24, 24);
	const material=new THREE.MeshStandardMaterial( {color: 0xffffff} );
	const star=new THREE.Mesh(geometry,material);

	const [x,y,z] = [
		THREE.MathUtils.randFloatSpread(500),
		THREE.MathUtils.randFloatSpread(500)+MAXY-150,
		THREE.MathUtils.randFloatSpread(300)-180
	];

	star.position.set(x,y,z);
	scene.add(star);
}

for(let i=0;i<500;i++)
	addStar();

// Returns value in [0,1] representing percent of page scrolled
function getScrollAmount(){
	return window.pageYOffset/Math.floor(document.getElementById("main").clientHeight-window.innerHeight+8);
}

function scale(start,end,t){
	return (end-start)*t+start;
}

function moveCamera(){
	const t=getScrollAmount();

	camera.position.y = (1-t)*MAXY+30;

	camera.lookAt(new THREE.Vector3(-1,10*(t-1)+camera.position.y,-5));
	camera.up=new THREE.Vector3(0,1,0);


	let h=scale(240,230,t);
	let s=scale(70,80,t);
	let v=scale(10,70,t);
	scene.background=new THREE.Color(`hsl(${h},${s}%,${v}%)`);
}
document.body.onscroll = moveCamera;
	




function animate(){
	requestAnimationFrame(animate);

	//torus.rotation.x+=0.01;
	//torus.rotation.y+=0.01;
	//torus.rotation.z+=0.01;

	if(FREE_CONTROLS)
		controls.update();

	if(cat)
		cat.rotation.y-=0.01;

	if(moon){
		moon.rotation.y+=0.003;

	}

	renderer.render(scene,camera);
}

//camera.rotation.z = 30 * Math.PI / 180;
//camera.rotation.x = -30 * Math.PI / 180;
//camera.rotation.y = 45 * Math.PI / 180;
moveCamera();
animate();