remote = {
  touching: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  scrollX: 0,
  scrollY: 0,
  swipeThreshold: 20, //px
  swipes: {
    left: 0,
    right: 0,
    up: 0,
    down: 0
  }
};

//domready
window.addEvent('domready', function() {
  $('touchArea').addEventListener('touchstart', touchHandler, false);
  $('touchArea').addEventListener('touchmove', touchHandler, false);
  $('touchArea').addEventListener('touchend', touchHandler, false);
  $('touchArea').addEventListener('touchcancel', touchHandler, false);
});

//touch handler for touchArea
function touchHandler(e) {
  //prevent the default scrolling behaviour (notice: This disables vertical scrolling as well)
  e.preventDefault();
  
  //handle types		
  switch(e.type) {
    case 'touchstart':
      remote.touching = true;
		  
		  //if there's only one finger touching
  		if(e.touches.length == 1) {
  			var touch = e.touches[0];
  			
  			/*
  			// If they user tries clicking on a link
  			if(touch.target.onclick) {
  			  touching = false;
  				touch.target.onclick();
  				return false;
  			}
  			*/
  			
  			//the originating X-coord (point where finger first touched the screen)
  			remote.startX = touch.pageX;
  			remote.startY = touch.pageY;
  			
  			//reset default values for current x,y coord and scroll distance
  			remote.currentX = 0;
  			remote.currentY = 0;
  			remote.scrollX = 0;
  			remote.scrollY = 0;
  			
  			//debug
  			$('dir').innerHTML = 'Direction: Null';
  			$('oX').innerHTML = 'Start Coord: ' + remote.startX + 'px, ' + remote.startY + 'px';
  		}
  		
      break;
      
    case 'touchmove':
  		//if there's only one finger touching
  		if(e.touches.length == 1) {
  			var touch = e.touches[0];
  			
  			//the current coordinates of the users finger
  			remote.currentX = touch.pageX;
  			remote.currentY = touch.pageY;
  			
  			//get scroll offsets
				remote.scrollX = Math.abs(remote.startX - remote.currentX);
				remote.scrollY = Math.abs(remote.startY - remote.currentY);
				
				//debug
 				$('scrollX').innerHTML = 'Scroll Distance: ' + remote.scrollX + 'px, ' + remote.scrollY + 'px';
  			$('nX').innerHTML = 'Current Coord: ' + remote.currentX + 'px, ' + remote.currentY + 'px';
  			
  			//swipe right to the left
  			if(remote.startX > remote.currentX && remote.scrollY < remote.swipeThreshold) {
  			  //debug
  				$('dir').innerHTML = 'Direction: flicked right->left';
  				  
          //scroll left (further from x=0)
  				if(parseInt(remote.scrollX / remote.swipeThreshold) > remote.swipes.left) {
  				  remote.swipes.left++;  					
  					if(remote.touching) {
    					plex.moveRight();
  	  				alertIt();
  	  			}
  				}
  				//scroll right (closer to x=0)
  				else if(parseInt(remote.scrollX / remote.swipeThreshold) < remote.swipes.left) {
  				  remote.swipes.left--;
  				  if(remote.touching) {
    					plex.moveLeft();
  	  				alertIt();
  	  			}
  				}
  			}
  			//swipe left to the right
  			else if(remote.startX < remote.currentX && remote.scrollY < remote.swipeThreshold) {
  			  //debug
  				$('dir').innerHTML = 'Direction: flicked left->right';
  				  
  				//scroll right (further from x=0)
  				if(parseInt(remote.scrollX / remote.swipeThreshold) > remote.swipes.right) {
  				  remote.swipes.right++;
  					if(remote.touching) {
    					plex.moveLeft();
  	  				alertIt();
  	  			}
  				}
  				//scroll left (closer to x=0)
  				else if(parseInt(remote.scrollX / remote.swipeThreshold) < remote.swipes.right) {
  				  remote.swipes.right--;
  				  if(remote.touching) {
    					plex.moveRight();
  	  				alertIt();
  	  			}
  				}
  			}
  			//swipe top to bottom
  			else if(remote.startY > remote.currentY && remote.scrollX < remote.swipeThreshold) {
  			  //debug
  				$('dir').innerHTML = 'Direction: flicked up->down';
  				
  				//scroll down (further from y=0)
  				if(parseInt(remote.scrollY / remote.swipeThreshold) > remote.swipes.down) {
  				  remote.swipes.down++;  					
  					if(remote.touching) {
    					plex.moveUp();
  	  				alertIt();
  	  			}
  				}
  				//scroll up (closer to y=0)
  				else if(parseInt(remote.scrollY / remote.swipeThreshold) < remote.swipes.down) {
  				  remote.swipes.down--;
  				  if(remote.touching) {
    					plex.moveDown();
  	  				alertIt();
  	  			}
  				}
  			}
  			//swipe bottom to top
  			else if(remote.startY < remote.currentY && remote.scrollX < remote.swipeThreshold) {
  			  //debug
  				$('dir').innerHTML = 'Direction: flicked down->up';
  				
  				//scroll up (further from y=0)
  				if(parseInt(remote.scrollY / remote.swipeThreshold) > remote.swipes.up) {
  				  remote.swipes.up++;  					
  					if(remote.touching) {
    					plex.moveDown();
  	  				alertIt();
  	  			}
  				}
  				//scroll down (closer to y=0)
  				else if(parseInt(remote.scrollY / remote.swipeThreshold) < remote.swipes.up) {
  				  remote.swipes.up--;
  				  if(remote.touching) {
    					plex.moveUp();
  	  				alertIt();
  	  			}
  				}
  			}
  		}
  		
      break;
      
    case 'touchend':
    case 'touchcancel':
      //reset vars
      remote.touching = false;
  		remote.swipes.left = 0;
  		remote.swipes.right = 0;
  		remote.swipes.up = 0;
  		remote.swipes.down = 0;
  		
      break;
  }
};

//alert
function alertIt() {
	$('swipesLeft').innerHTML = 'Swipes Left: ' + remote.swipes.left;
	$('swipesRight').innerHTML = 'Swipes Right: ' + remote.swipes.right;
	$('swipesUp').innerHTML = 'Swipes Up: ' + remote.swipes.up;
	$('swipesDown').innerHTML = 'Swipes Down: ' + remote.swipes.down;
}

/*
**
*/

plex = {
  //send command to plex
  run: function(c) {
    var r = new Request({method: 'get', url: 'sendcommand.php'});
    r.send('command=' + c);
    $('lastCommand').innerHTML = 'Last Command: ' + c;
  },
  
  //click
  click: function() {
    this.run('Action(7)'); //ACTION_SELECT_ITEM
  },
  
  //move left
  moveLeft: function() {
    this.run('Action(1)'); //ACTION_MOVE_LEFT
  },
  
  //move right
  moveRight: function() {
    this.run('Action(2)'); //ACTION_MOVE_RIGHT
  },
  
  //move up
  moveUp: function() {
    this.run('Action(3)'); //ACTION_MOVE_UP
  },
  
  //move down
  moveDown: function() {
    this.run('Action(4)'); //ACTION_MOVE_DOWN
  }
};


