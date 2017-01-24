'use strict';


class Song {

	constructor() {
		this.id = 0;
		this.playTime = 0;
		this.auto = true;
	}

	updateBy(item) {
		this.id = item.id;
		this.playTime += item.playTime;
		this.auto = this.auto && item.auto;
	}
}

var select = function(list, options) {
	if (!options) {
		// Return copy of current list so further changes on the return value will not influence current list
		return list && list.slice();
	}

	// If merge is defined, it will be the first operation so filtering is performed on merged list
	let result = options.merge ? mergeList(list) : list;

	return result.filter(e => {
		// Applying all filters; will return false for the first false one
		return (options.id === undefined || (e.id === options.id))
			&& (options.minPlayTime === undefined || (e.playTime >= options.minPlayTime))
			&& (options.auto === undefined || (e.auto === options.auto));
		}
	);
}

var mergeList = function(list) {
	// Use reduceRight to preserve the backwards order - "the merged element should take the place in the latest occurrence of that id"
	return list.reduceRight((acc, current) => {
		let wasSeenBefore = !!acc.itemsMap[current.id];
		// Create a new object if current was not processed so far
		// Or reference an existing item
		let song = wasSeenBefore
				? acc.itemsMap[current.id]
				: new Song();

		// If it's a new empty object, copy current's values; otherwise, update existing one as specified
		song.updateBy(current);

		if (!wasSeenBefore) {
			// Add element to the beginning of the array so that the natural order of list traversing is preserved
			acc.itemsList.unshift(song);
			// Add reference to the same object in the itemsMap
			acc.itemsMap[current.id] = song;
		}

		return acc;
	}, {
		itemsMap: Object.create(null),
		itemsList: []
	}).itemsList;
}

var usage = function() {
	let items = [
		{ id: 8, playTime:  500, auto: false },
		{ id: 7, playTime: 1500, auto: true  },
		{ id: 1, playTime:  100, auto: true  },
		{ id: 7, playTime: 1000, auto: false },
		{ id: 7, playTime: 2000, auto: false },
		{ id: 2, playTime: 2000, auto: true  },
		{ id: 2, playTime: 2000, auto: true  }
	];
	
	console.log('select(items)', select(items).toListString());
	console.log('select(items, { merge: true })', select(items, { merge: true }).toListString());
	console.log('select(items, { id: 2 })', select(items, { id: 2 }).toListString());
	console.log('select(items, { auto: false })', select(items, { auto: false }).toListString());
	console.log('select(items, { minPlayTime: 4000 })', select(items, { minPlayTime: 4000 }).toListString());
	console.log('select(items, { merge: true, minPlayTime: 4000 })', select(items, { merge: true, minPlayTime: 4000 }).toListString());
}

Array.prototype.toListString = function() {
	return JSON.stringify(this, null, 4);
}

exports.select = select;
exports.select.usage = usage;