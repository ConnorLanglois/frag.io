class FraggerMP extends Fragger {
	constructor (fragger) {
		super(fragger);

		this._dx = this._x - this._ox;
		this._dy = this._y - this._oy;
	}

	onUpdate() {
		super.onUpdate();
		
		this._ox += this._dx / 200;
		this._oy += this._dy / 200;
	}
}
