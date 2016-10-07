class Model{
	constructor(){
		this._data = {};
		this._event = {};
	}

	setItem(key, value){
		var old = this._data[key] || ''
			;

		this._data[key] = value;
		if( old !== value && key in this._event ){
			this._event[key].forEach()
		}

		return Promise.resolve(true);
	}
	getItem(key){
		return Promise.resolve( this._data[key] );
	}

	removeItem(key){
		delete this._data[key];

		return Promise.resolve(true);
	}

	on(key, callback){
		if( typeof callback !== 'function' ){
			return;
		}

		if( !(key in this._event) ){
			this._event[key] = [];
		}
		this._event[key].push( callback );
	}
}

export default Model;