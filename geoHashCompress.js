"use strict";
class geoHashCompress{
	constructor(hashes,currentPrecision,minPrecision = 1){
		this._hashes = hashes;
		this._currentPrecision = currentPrecision;
		this._minPrecision = minPrecision;
		return this;
	}
	getCombinations(hash){
		let base32 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'm',
				  'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		return base32.map((c) => `${hash}${c}`);
	}
	decreasePrecison(data,currentPrecison){
		let checked = new Map()
		for (let hash of Object.keys(data[currentPrecison])) {
			
			if(checked.has( hash.substr(0,hash.length - 1))) continue;
			else checked.set(hash.substr(0,hash.length - 1),true);
			
			let combinations = this.getCombinations( hash.substr(0,hash.length - 1) );
	
			(()=>{
				for(let combination of combinations){
					if( !(combination in data[currentPrecison]) ) return;
				}
				for(let combination of combinations){
					delete data[currentPrecison][combination];
				}
				if( !(currentPrecison - 1 in data )){
					data[currentPrecison - 1] = {}
				}
				data[currentPrecison - 1][hash.substr(0,hash.length - 1)] = 1
			})()
		}
		checked.clear();
	}
	compress(){
		let hashes = this._hashes;
		let precision = this._currentPrecision;
		let minPrecision = this._minPrecision;
		if(!Array.isArray(hashes)){
			throw Error("Hashes must be an Arrray");
		}
		if(precision <= minPrecision){
			throw new Error("minimum precision should be less than given precison of hashes!");
		}
		
		let result = [];
		let data = {[precision] : {}};
		
		data[precision] = hashes.reduce((acc,elem) => {
			acc[elem] = true
			return acc
		},{})
	   
		for(let i = precision ;i > minPrecision;i--){
			if( i in data) this.decreasePrecison(data,i);
			else break;
		}
	
		Object.keys(data).forEach((finalPrecisions)=>{
			result = result.concat( Object.keys(data[finalPrecisions]) );
		})
		return result
	}
}
module.exports = geoHashCompress