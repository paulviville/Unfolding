
export default class MouseController {
	#domElement;
	#callbacks;
	#boundCallbacks = { };

	constructor ( domElement, callbacks ) {
		console.log( `MouseController - constructor` )

		this.#domElement = domElement;
		this.#callbacks = callbacks;

		this.#boundCallbacks.pointerdown = this.#pointerdown.bind( this );
		this.#boundCallbacks.pointermove = this.#pointermove.bind( this );
		this.#boundCallbacks.pointerup = this.#pointerup.bind( this );

		this.#domElement.addEventListener( "pointerdown", this.#boundCallbacks.pointerdown );
	}

	#pointerdown ( event ) {
		// console.log( `MouseController - #pointerdown` )

		this.#domElement.removeEventListener( "pointerdown",  this.#boundCallbacks.pointerdown )
		this.#domElement.addEventListener( "pointerup",  this.#boundCallbacks.pointerup )
		this.#domElement.addEventListener( "pointermove",  this.#boundCallbacks.pointermove )


		switch ( event.button ) {
			case 0: // left
				this.#callbacks.left?.down?.( event.clientX, event.clientY );
				break;
			case 1: // middle
				this.#callbacks.middle?.down?.( event.clientX, event.clientY );
				break;
			case 2: // right
				this.#callbacks.right?.down?.( event.clientX, event.clientY );
				break;
			default:
				break;
		}
	}

	#pointermove ( event ) {
		// console.log(`MouseController - #pointermove`)

		this.#callbacks.move?.( event.clientX, event.clientY );
	}

	#pointerup ( event ) {
		// console.log(`MouseController - #pointerup`)

		this.#domElement.removeEventListener( "pointerup",  this.#boundCallbacks.pointerup );
		this.#domElement.removeEventListener( "pointermove",  this.#boundCallbacks.pointermove );
		this.#domElement.addEventListener( "pointerdown",  this.#boundCallbacks.pointerdown );

		switch ( event.button ) {
			case 0: // left
				this.#callbacks.left?.up?.( event.clientX, event.clientY );
				break;
			case 1: // middle
				this.#callbacks.middle?.up?.( event.clientX, event.clientY );
				break;
			case 2: // right
				this.#callbacks.right?.up?.( event.clientX, event.clientY );
				break;
			default:
				break;
		}
	}
	
	// #scroll ( event ) {
	// 	console.log( event );
	// }
}