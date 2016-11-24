'use strict';

import Animator from './animator.js';

class AnimationQueue {
	constructor(animators){
		this.animators = animators || [];
	}

	append(){
		this.animators.push.apply(this.animators, arguments);
	}
	flush(){
		var self = this
			;

		if( this.animators.length ){
			(function play(){
				var animator = self.animators.shift()
					;

				if( animator instanceof Animator){
					animator.start(function(){
						if( self.animators.length ){
							play();
						}
					});
				}
				else{
					animator.apply(self);

					if( self.animators.length ){
						play();
					}
				}
			})();
		}
	}
}

export default AnimationQueue;