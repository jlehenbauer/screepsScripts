const PATH_COLOR = '#e51400';

var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        var thisroom = creep.room;
	    var creepTargets = creep.room.find(FIND_HOSTILE_CREEPS);
	    var structureTargets = creep.room.find(FIND_HOSTILE_STRUCTURES);
        
        //creep.move(TOP);
        //creep.move(BOTTOM);
        //creep.move(LEFT);
        //creep.move(RIGHT);
        
        var tripwire = false;
        
        if(!tripwire && creepTargets.length >= 1){
            //creep.room.controller.activateSafeMode();
            tripwire = true;
            console.log('INVADERS');
        }

	    
	    if(attackers.length >= 1){
	        if(creep.room == Game.spawns['Spawn1'].room){
	            if(creepTargets >= 2){
	                creep.rangedAttack(creepTargets[0]);
	            }
	            else{                
	                //var exitpoint = creep.room.find(FIND_EXIT_TOP);
                    //var exitpoint = creep.room.find(FIND_EXIT_LEFT);
                    var exitpoint = creep.room.find(FIND_EXIT_RIGHT);
                    creep.moveTo(34,8, {visualizePathStyle: {stroke: PATH_COLOR}});
	            }
	        }
            else if(creepTargets.length >= 1){
                if(creep.rangedAttack(creepTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creepTargets[0], {visualizePathStyle: {stroke: PATH_COLOR}});
                creep.say('trying');
                }
            }
            else if(structureTargets.length > 0){
                creep.say('what?');
                if(creep.rangedAttack(structureTargets[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureTargets[1], {visualizePathStyle: {stroke: PATH_COLOR}});
                }
            }
            /**
	        else if(structureTargets.length === 0){
	            creep.say('controller?');
	            if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
            **/
            else{
                var exitpoint = creep.room.find(FIND_EXIT_BOTTOM);
                //var exitpoint = creep.room.find(FIND_EXIT_LEFT);
                //var exitpoint = creep.room.find(FIND_EXIT_BOTTOM);
                creep.moveTo(exitpoint[25], {visualizePathStyle: {stroke: PATH_COLOR}});
            }
        }
	    /**
	    else if(attackers.length <= 4 && attackers.length > 0){
	        creep.attack(targets[0]);
	    }
	    else{
	        creep.moveTo(creep.room.find(FIND_STRUCTURES), RESOURCE_HYDROGEN);
	        creep.say('holding');
	    }
	    **/
    }
};

module.exports = roleAttacker;