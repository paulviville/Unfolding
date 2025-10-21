
export default class KeyboardController {
	#domElement;
	#callbacks;

	#boundCallbacks = { };
	#keyHeld = { };

	constructor ( domElement, callbacks = { } ) {
		console.log( `KeyboardController - constructor` );
		this.#callbacks = callbacks;
		this.#domElement = domElement;
	
		this.#boundCallbacks.keydown = this.#keydown.bind( this );
		this.#boundCallbacks.keyup = this.#keyup.bind( this );
	
		this.#domElement.addEventListener( "keydown", this.#boundCallbacks.keydown );
		
	}

	#keydown ( event ) {
		this.#domElement.removeEventListener( "keydown", this.#boundCallbacks.keydown );
		this.#domElement.addEventListener( "keyup", this.#boundCallbacks.keyup );

		const keyCode = event.code;
		console.log(keyCode);
		this.#keyHeld[ keyCode ] = true;
		this.#callbacks?.down?.[keyCode]?.();
	}

	#keyup ( event ) {
		this.#domElement.removeEventListener( "keyup", this.#boundCallbacks.keyup );
		this.#domElement.addEventListener( "keydown", this.#boundCallbacks.keydown );

		const keyCode = event.code;
		delete( this.#keyHeld[ keyCode ] );
		this.#callbacks?.up?.[keyCode]?.();

	}

	// test = (function () {console.log(this)}).bind(this);
}