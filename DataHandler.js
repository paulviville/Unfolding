
import { CMap2 } from './CMapJS/CMap/CMap.js';
import { loadCMap2 } from './CMapJS/IO/SurfaceFormats/CMap2IO.js';
import { Vector3 } from './CMapJS/Libs/three.module.js';
import Skeleton from './Skeleton.js';

export default class DataHandler {
	/// surface mesh to unfold
	#mesh;
	#position;
	#faceCenters;
	#edgeMids;

	#skeleton;

	constructor ( ) {

	}

	#initializeSkeleton ( ) {
		this.#skeleton = new Skeleton();
	}

	loadMeshFromString ( meshString ) {
		// console.log("loadMeshFromString", meshString)
		this.#mesh = loadCMap2( "off", meshString );
	
		this.#position = this.#mesh.getAttribute( this.#mesh.vertex, "position" );
	
		this.#mesh.setEmbeddings( this.#mesh.edge );
		this.#mesh.setEmbeddings( this.#mesh.face );
		

		this.#faceCenters = this.#mesh.addAttribute( this.#mesh.face, "faceCenters" );
		this.#computeFaceCenters();

		this.#edgeMids = this.#mesh.addAttribute( this.#mesh.edge, "edgeMids" );
		this.#computeEdgeMids();
	}

	get mesh ( ) {
		return this.#mesh;
	}

	get skeleton ( ) {
		return this.#skeleton;
	}

	#computeFaceCenters ( ) {
		this.#mesh.foreach( this.#mesh.face, fd => {
			const center = new Vector3();
			let nbVertices = 0;
			this.#mesh.foreachIncident(this.#mesh.vertex, this.#mesh.face, fd, vd => {
				center.add(this.#position[this.#mesh.cell(this.#mesh.vertex, vd)]);
				++nbVertices;
			});
			center.multiplyScalar(1 / nbVertices);
		
			this.#faceCenters[this.#mesh.cell(this.#mesh.face, fd)] = center;
		});
	}

	#computeEdgeMids ( ) {
		this.#mesh.foreach( this.#mesh.edge, ed => {
			const mid = new Vector3();
			this.#mesh.foreachIncident(this.#mesh.vertex, this.#mesh.edge, ed, vd => {
				mid.add(this.#position[this.#mesh.cell(this.#mesh.vertex, vd)]);
			});
			mid.multiplyScalar(1 / 2);
		
			this.#edgeMids[this.#mesh.cell(this.#mesh.edge, ed)] = mid;
		});
	}

	reset ( ) {
		console.log("data reset")

		this.#mesh = null;
		this.#position = null;
		this.#faceCenters = null;
		this.#edgeMids = null;

		this.#skeleton = null;
	}
}