import * as THREE from './CMapJS/Libs/three.module.js';

import { GUI } from './lil-gui.module.min.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100.0);
camera.position.set(0, 0, 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

	console.log(scene)
});

const guiParams = {
	loadFile: function() {
		document.getElementById('fileInput').click();
	},

	fileName: "fileName.off",
	content: "", 

	saveFile: function() {
		saveFile()
	},
};

const gui = new GUI();
gui.add(guiParams, 'loadFile').name('Load File');
gui.add(guiParams, 'fileName');
gui.add(guiParams, 'saveFile').name('Save File');

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

		};
        reader.readAsText(file);
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

function update ()
{
	// console.log("update")
}

function render()
{
	renderer.render(scene, camera);
}

function mainloop()
{
    update();
    render();
    requestAnimationFrame(mainloop);
}

mainloop();
