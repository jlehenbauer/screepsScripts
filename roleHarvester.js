
const PATH_COLOR = '#e3c800';

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
	    if(creep.carry.energy < creep.carryCapacity) {
            if(!creep.memory.upgrading && _.filter(Game.creeps, (creep) => creep.memory.role == 'subminer').length > 0){
            var sources = creep.room.find(FIND_DROPPED_RESOURCES);
            if(creep.pickup(sources[0] == ERR_NOT_IN_RANGE)){
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: PATH_COLOR}});
                creep.pickup(sources[0]);
            }
            if(sources.length === 0 && creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER)
                    }
            }).length > 0){
                    if(creep.withdraw(sources[0], RESOURCE_ENERGY, creep.energyCapacityAvailable) == ERR_NOT_IN_RANGE){
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: PATH_COLOR}});
                        creep.withdraw(sources[0]);
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
                        return (structure.structureType == 'container' ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            
            if(targets.length > 0) {
                if(targets[0].energy <= targets[0].energyCapacity){
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: PATH_COLOR}});
                    }
                }
                else{
                    if(creep.transfer(targets[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[1], {visualizePathStyle: {stroke: PATH_COLOR}});
                        creep.say('extenderfill');
                    }
                }
            }
        }
	}
};

module.exports = roleHarvester;