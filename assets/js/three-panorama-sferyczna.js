var manualControl = false;
var longitude = 0;
var latitude = 0;
var savedLongitude, savedLatitude;
var savedX, savedY;
var moveSpeed = 0.1;

// Panorama element
var panoramaContainer = document.getElementById('panorama');
var panoramaUrl = panoramaContainer.getAttribute('data-panorama');

// Settings for the renderer
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene initialization
var scene = new THREE.Scene();

// Camera initialization
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.target = new THREE.Vector3(0, 0, 0);

// Creation of a big sphere geometry
var sphere = new THREE.SphereGeometry(100, 100, 40);
sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

// Creation of the sphyere material
var sphereMaterial = new THREE.MeshBasicMaterial();
sphereMaterial.map = THREE.ImageUtils.loadTexture(panoramaUrl);

// geometry + material = mesh (actual object)
var sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
scene.add(sphereMesh);

function render() {
    requestAnimationFrame(render);

    if(!manualControl) {
        longitude += moveSpeed;
    }

    // limiting latitude from -85 to 85 (cannot point to the sky or under your feet)
    latitude = Math.max(-85, Math.min(85, latitude));

    // moving the camera according to current latitude (vertical movement) and longitude (horizontal movement)
    camera.target.x = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.cos(THREE.Math.degToRad(longitude));
    camera.target.y = 500 * Math.cos(THREE.Math.degToRad(90 - latitude));
    camera.target.z = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.sin(THREE.Math.degToRad(longitude));
    camera.lookAt(camera.target);

    renderer.render(scene, camera);
}

// update redered scene and camera on resize
function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// when the mouse is pressed, we switch to manual control and save current coordinates
function onDocumentMouseDown(event) {
    event.preventDefault();

    manualControl = true;

    savedX = event.clientX;
    savedY = event.clientY;

    savedLongitude = longitude;
    savedLatitude = latitude;
}

// when the mouse moves, if in manual contro we adjust coordinates
function onDocumentMouseMove(event) {
    if(manualControl) {
        longitude = (savedX - event.clientX) * 0.1 + savedLongitude;
        latitude = (event.clientY - savedY) * 0.1 + savedLatitude;
    }
}

// when the mouse is released, we turn manual control off
function onDocumentMouseUp(event) {
    manualControl = false;
}

// Listeners
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);
window.addEventListener('resize', onWindowResize, false );

// Initialization
render();