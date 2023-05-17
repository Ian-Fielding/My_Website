// Sources used:
// https://www.youtube.com/watch?v=Q7AOvWpIVHU
// https://sketchfab.com/3d-models/dingus-the-cat-2ca7f3c1957847d6a145fc35de9046b0
// https://solarsystem.nasa.gov/resources/2366/earths-moon-3d-model/
import * as THREE from "three";
import {
	GLTFLoader
} from "GLTFLoader";

const MAXY = 1000; // maximum height for camera

// scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 800);
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});
camera.lookAt(new THREE.Vector3(-1, -1, -5));
camera.up = new THREE.Vector3(0, 1, 0);
camera.position.z = 30;
scene.fog = new THREE.Fog(0x3c9c45, 0, 800);

// resizes canvas
function resize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}
resize();
window.addEventListener("resize", resize);

// loads meshes
let cat = undefined;
let ground = undefined;
let moon = undefined;
const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);
loader.load(
	"projects/homepage/media/cat.gltf",
	function(gltf) {
		cat = gltf.scene;
		cat.scale.set(0.5, 0.5, 0.5);
		cat.position.x += 25;
		cat.position.y += 5;
		cat.position.z -= 75;
		cat.children[0].children[0].children[0].children[0].children[0].castShadow = true;
		scene.add(cat);

	}
);
loader.load(
	"projects/homepage/media/scene.glb",
	function(gltf) {
		ground = gltf.scene;
		ground.position.z -= 50;
		ground.children[0].children[1].receiveShadow = true;
		scene.add(ground);
	}
)
loader.load(
	"projects/homepage/media/moon.glb",
	function(gltf) {
		moon = gltf.scene;
		const k = 0.08;
		moon.scale.set(k, k, k);
		moon.position.x = 50;
		moon.position.y = MAXY + 40;
		moon.position.z = -70;
		scene.add(moon);
	}
);

let mesh = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), new THREE.MeshStandardMaterial({
	color: 0x3c9c45
}));
mesh.position.set(0, -3, 500);
mesh.rotateX(-90 * Math.PI / 180);
scene.add(mesh);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(15, 30, -75);
renderer.shadowMap.enabled = true;
pointLight.castShadow = true;
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// adds stars
for(let i = 0; i < 500; i++) {
	const geometry = new THREE.SphereGeometry(0.25, 24, 24);
	const material = new THREE.MeshStandardMaterial({
		color: 0xffffff
	});
	const star = new THREE.Mesh(geometry, material);

	const [x, y, z] = [
		THREE.MathUtils.randFloatSpread(500),
		THREE.MathUtils.randFloatSpread(500) + MAXY - 150,
		THREE.MathUtils.randFloatSpread(300) - 180
	];

	star.position.set(x, y, z);
	scene.add(star);
}

// Returns value in [0,1] representing percent of page scrolled
function getScrollAmount() {
	let t = window.pageYOffset / Math.floor(document.getElementById("main").clientHeight - window.innerHeight + 8);

	if(t < 0)
		return 0;
	if(t > 1)
		return 1;
	return t;
}

// returns linear interpretation from start to end
function scale(start, end, t) {
	return (end - start) * t + start;
}

// adjusts camera based on scroll amount
function moveCamera(t) {
	camera.position.y = (1 - t) * MAXY + 30;

	camera.lookAt(new THREE.Vector3(-1, 10 * (t - 1) + camera.position.y, -5));
	camera.up = new THREE.Vector3(0, 1, 0);
}

// animates
function animate() {
	requestAnimationFrame(animate);

	const t = getScrollAmount();
	moveCamera(t);

	if(cat)
		cat.rotation.y -= 0.01;
	if(moon)
		moon.rotation.y += 0.003;

	// sets background color
	let h = scale(240, 230, t);
	let s = scale(70, 80, t);
	let v = scale(10, 70, t);
	scene.background = new THREE.Color(`hsl(${h},${s}%,${v}%)`);

	renderer.render(scene, camera);
}

manager.onLoad = animate;