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
			acc.unshift(newItem);
			return acc;
		}, []);
	}

	var select = function(list, options) {
		if (!options) {
			return list;
		}

		var result = options.merge? mergeList(list) : list;

		return result.filter( e => {
			var check = true;
			check = options.id ? e.id === options.id : true;
			check &= options.minPlayTime ? e.playTime >= options.minPlayTime : true;
			check &= options.auto ? e.auto === options.auto : true;

			return check;
		});
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