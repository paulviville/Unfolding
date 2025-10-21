import * as THREE from './CMapJS/Libs/three.module.js';
import DataHandler from './DataHandler.js';

import { GUI } from './lil-gui.module.min.js';
import Viewer from './viewer.js';


// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xdddddd);

// const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100.0);
// camera.position.set(0, 0, 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const dataHandler = new DataHandler();
const viewer = new Viewer( renderer );
// viewer.initializeMeshRenderer()


const mouse = new THREE.Vector2;
function setMouse(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

const selectMouseDown = function( event ) {
	setMouse(event);
	// console.log(event.button)
	if(event.button == 2){
		const fd = viewer.getFace( mouse );
		viewer.colorFace( fd, guiParams.activeColor);
	}
}

renderer.domElement.addEventListener( 'pointerdown', selectMouseDown );


window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
	viewer.resize( width, height );
});

const guiParams = {
	loadMesh: function() {
		document.getElementById('fileInput').click();
	},

	loadProject: function() {

	},

	fileName: "fileName.off",
	content: "", 

	saveFile: function() {
		saveFile()
	},

	exportSVG: function() {

	},

	reset: function() {
		reset();
	},

	debug: function() {
	},

	activeColor: new THREE.Color(0xFF0000),

	edgeSize: 1,
	
};

const gui = new GUI();
const guiFileFolder = gui.addFolder("File")
guiFileFolder.add(guiParams, 'loadMesh').name('Load Mesh');
guiFileFolder.add(guiParams, 'fileName');
guiFileFolder.add(guiParams, 'saveFile').name('Save File');
gui.addColor(guiParams, 'activeColor').name('Color');
gui.add(guiParams, 'reset').name('Reset');
gui.add(guiParams, 'debug').name('debug');

const guiViewerFolder = gui.addFolder("View Settings");



document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        console.log(`Selected file: ${file.name}`);
		const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            // console.log(`File content: ${content}`);
            // document.getElementById('fileContent').textContent = content;
			guiParams.content = `File content: ${content}`;
			console.log(guiParams.content)
			dataHandler.loadMeshFromString(content);
			viewer.initializeMeshRenderer(dataHandler.mesh);
		};
        reader.readAsText(file);
		document.getElementById('fileInput').value = null;
        // Add additional logic to handle the file here
	}
});

function saveFile () {
	console.log(guiParams)
	const blob = new Blob([guiParams.content], { type: 'text/plain' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = guiParams.fileName;
	link.style.display = 'none';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function reset () {
	console.log("reseting")
	viewer.reset();
	dataHandler.reset();
}

window.red = new THREE.Color(0xFF0000);

window.viewer = viewer;

window.viewerColorTest = function (fd) {
	viewer.colorFace(fd, guiParams.activeColor)
}



function update ()
{
	// console.log("update")
}

// function render()
// {
// 	// view
// 	// renderer.render(scene, camera);
// }

function mainloop()
{
    update();
    // render();
	viewer.render( );
    requestAnimationFrame(mainloop);
}

mainloop();
