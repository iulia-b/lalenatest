'use strict';

var soundcloud = soundcloud || {};

soundcloud.Song = function(id, playTime, auto) {
	this.id = id;
	this.playTime = playTime;
	this.auto = auto;
}

soundcloud.aggregate = function() {
	var mergeItems = function (source, target) {
		// I use source and target to avoid creating a new object everytime this is called
		// Instead, I am changing the 'target' argument - value is preserved outside the scope because JS passes args by refference
		// This calls for some attention from the programmer - usually you don't expect args to be changed;
		// I can also return a new object with new values (but I am greedy on memory)
		target.playTime += source.playTime;
		target.auto = target.auto && source.auto;
	}

	var mergeList = function(list) {
		var processed = {};

		// Using reduceRight to preserve the backwards order - "the element should be inserted in the should take the place of the latest occurrence of that id"
		return list.reduceRight((acc, current, i) => {
			if (processed.hasOwnProperty(current.id)) {
				return acc;
			}

			processed[current.id] = true;
			var newItem = new soundcloud.Song(current.id, current.playTime, current.auto);
			for (var j = 0; j < i; j++) {
				if(newItem.id === list[j].id) {
					mergeItems(list[j], newItem);
				}
			}

			// Inserting element in the beginning of the list to not have to inverse it in the end because of loopinf from right to left			
			acc.unshift(newItem);
			return acc;
		}, []);
	}

	var select = function(list, options) {
		if (!options) {
			return list;
		}

		// If merge is defined, it will be the first operation, so filtering is done on merged list
		var result = options.merge? mergeList(list) : list;

		return result.filter( e => {
			// Applying all filters; will return false for the first false one
			// If filter is not defined, !filter will escape the checkup
			return (!options.id || (options.id && e.id === options.id))
				&& (!options.minPlayTime || (e.playTime >= options.minPlayTime))
				&& (!options.auto || (e.auto === options.auto));
			}
		);
	}

	return {
		select: select
	}
}

Array.prototype.toListString = function() {
	return JSON.stringify(this, null, 4);
}
/*
if(window.console && console.log){
    var old = console.log;
    console.log = function(){
        Array.prototype.unshift.call(arguments, 'arg' + arguments[0]);
        old.apply(this, arguments)
    }
}
*/

var solution = new soundcloud.aggregate();

var items = [
    { id: 8, playTime:  500, auto: false },
    { id: 7, playTime: 1500, auto: true  },
    { id: 1, playTime:  100, auto: true  },
    { id: 7, playTime: 1000, auto: false },
    { id: 7, playTime: 2000, auto: false },
    { id: 2, playTime: 2000, auto: true  },
    { id: 2, playTime: 2000, auto: true  }
]

console.log(solution.select(items, { merge: true }).toListString());
console.log(solution.select(items, { id: 2 }).toListString());
console.log(solution.select(items, { minPlayTime: 4000 }).toListString());
console.log(solution.select(items, { merge: true, minPlayTime: 4000 }).toListString());