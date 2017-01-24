# SoundCloud challenge

### Aggregate 

This solution is O(n) time and space complexity. For the merge implementation I am looping once through the initial list using reduceRight (to satisfy the "merge into last occurence" condition) and inserting new item into beginning of accumulator array (to preserve the natural list transversion). 

The accumulator I am using is an object with interface 
{ 
	itemsMap: Object with number keys and Song values,
	itemsList: Array of Song
}

where itemsMap[id] represents the "accumulator" for every sond with ID id, and itemsList is an Array keeping reference towards itemsMap values, but sorted according to requirements.

In order to run the method, open a node.js shell in current directory and run
	var solution = require('/aggregate.js');
You can then run
	solution.select(list, [, options])
	 or
	solution.select.usage() so see examples of how to call it
	
PS: I like how in the tests for select you did not add { auto: false }. I initially checked the filter existence by if (!object.auto) which would return true for both false and undefined and would not apply false filter


### Animation

The idea behind was to give the impression of looking at a vinyl cover (nostalgic :) ). You look around, you find the band that you like and when pressing Play the cover slides up and the record is unveiled. I like this experience as it creates the impression of an upgraded, digitalized visit in a records store. 

Th HMTL can be made a template and rendered in a list of bands etc.

The view is responsive to any width and height, but of course looks best for standard viewPort sizes. The waveform format is not the most desirable and I would def use the one from task #3 (which also has the seek implemented).

The rest is CSS.


### Original Waveform feedback (my notes)

The main cause for this class's inefficiency is redrawing the whole canvas everytime timeUpdate event is triggered. My solution is based on differential drawing ( keeping track of last drawn sound.currentTime and drawing only the missing part on timeUpdate) => transforming for loop (x = 0; x < canvas.offsetWidth) into drawing from x -> y which are optimaly calculated and updated every time event is triggered.

Other expensive operations that I optimized in my refactoring: 

 - as the canvas is not resizable, the getContext method can be called only once. The reason i've put it into render() and not in constructor is semantics: creating a Waveform object should initialize basic properties and it's not tied to the visual represantation of it. 

 - actually, everything connected to the visual represantation should be initialized and computed when the object is rendered => moving some initializations from constructor into render

 - extract constants which are used in for loops outside the loop to avoid repetition of Math operations

 - the second "for" ( drawing the vertical lines ) can easily be transformed into drawRect(x, y, 1, height) it doesn't need to be drawn pixel by pixel

 - considering it's a 2 color canvas, the color can be computed outside the updateSegment. This is a method that updates a wave between two specified positions; the color is bound to different events logic (seek forward / backwards)

 The updated logic and other optimizations are inserted as inline comments; I prefer to not be that descriptive when writing production code, but I think in this case it is easier to follow while reading the code rather than having steps explained elsewhere 
