import * as THREE from './CMapJS/Libs/three.module.js';
import Renderer from './CMapJS/Rendering/Renderer.js';
import { OrbitControls } from './CMapJS/Libs/OrbitsControls.js';

const defaultBackgroundColor = new THREE.Color( 0xdddddd );
const defaultFaceColor = new THREE.Color(0x0099FF);

export default class Viewer {
	#renderer; // webGL renderer
	#scene;
	#camera;
	
	#orbitControls;
	#helpers;

	#raycaster;

	#mesh;
	#meshRenderer;


	constructor ( renderer ) {
		this.#renderer = renderer;

		this.#camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100.0 );
		this.#camera.position.set( 0, 0, 2 );

		this.#scene = new THREE.Scene();
		this.#scene.background = defaultBackgroundColor;

		const ambientLight = new THREE.AmbientLight( 0XFFFFFF, 0.5 );
		this.#scene.add(ambientLight);
		const pointLight = new THREE.PointLight( 0XFFFFFF, 1 );
		pointLight.position.set(10,8,5);
		this.#scene.add(pointLight);

		this.#orbitControls = new OrbitControls(this.#camera, this.#renderer.domElement);
		this.#orbitControls.enablePan = false;

		this.#helpers = new THREE.Group();
		this.#helpers.add( new THREE.AxesHelper( 1 ));
		this.#scene.add( this.#helpers );

		this.#raycaster = new THREE.Raycaster();

	}

	render ( ) {
		this.#renderer.render(this.#scene, this.#camera);
	}

	resize ( width, height ) {
		this.#renderer.setSize( width, height );
		this.#camera.aspect = width / height;
		this.#camera.updateProjectionMatrix();
	}

	initializeMeshRenderer ( mesh ) {
		this.#mesh = mesh;
		
		this.#meshRenderer = new Renderer( mesh );
		this.#meshRenderer.edges.create({size: 2});
		this.#meshRenderer.edges.addTo( this.#scene );

		this.#meshRenderer.faces.create({color: defaultFaceColor});
		this.#meshRenderer.faces.addTo( this.#scene );

		console.log(this.#meshRenderer);
	}

	getFace ( pixel ) {
		this.#raycaster.setFromCamera( pixel, this.#camera );

		const faceHit = this.#raycaster.intersectObject( this.#meshRenderer.faces.mesh )[0];

		if(faceHit) {
			return this.#faceDart(faceHit.faceIndex);
		}

		return null;
	}

	#faceDart ( faceIndex ) {
		return this.#meshRenderer.faces.mesh.fd[faceIndex];
	}

	#faceInstance ( faceDart ) {

	}

	colorFace ( faceDart, color ) {
		const fid0 = this.#mesh.cell(this.#mesh.face, faceDart);

		this.#meshRenderer.faces.mesh.fd.forEach((fd, id) => {
			if(this.#mesh.cell(this.#mesh.face, fd) == fid0) {
				this.#meshRenderer.faces.mesh.geometry.faces[id].color.copy(color);
			}

			this.#meshRenderer.faces.mesh.geometry.colorsNeedUpdate = true;
		});
	}

	reset ( ) {
		console.log("viewer reset")

		this.#meshRenderer?.edges?.delete();
		this.#meshRenderer?.faces?.delete();
		this.#meshRenderer = null;

		this.#mesh = null;
	}
}