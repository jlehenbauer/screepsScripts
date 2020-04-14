const PATH_COLOR = '#60a917';
var roleExtender = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
	        if(!creep.memory.upgrading && _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').length > 0){
            var sources = creep.room.find(FIND_DROPPED_RESOURCES);
            if(creep.pickup(sources[1] == ERR_NOT_IN_RANGE)){
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: PATH_COLOR}});
                creep.pickup(sources[1]);
            }
            if(sources.length === 0 && creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER)
                    }
            }).length > 0){
                    if(creep.withdraw(sources[1], RESOURCE_ENERGY, creep.energyCapacityAvailable) == ERR_NOT_IN_RANGE){
                        creep.moveTo(sources[1], {visualizePathStyle: {stroke: PATH_COLOR}});
                        creep.withdraw(sources[1]);
                }
            }
	        }
            else{
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: PATH_COLOR}});
                }
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
                    }
            });
            
            /** Reverse targets to prioritize tower charge, else comment **/
            //targets.sort().reverse();
            //targets.reverse();
            
            /** If needed, use the following line to check the target order **/
            //console.log(targets);
            
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: PATH_COLOR}});
                }
                else{
                    creep.transfer(targets[0]);
                }
            }
        }
	}
};


module.exports = roleExtender;