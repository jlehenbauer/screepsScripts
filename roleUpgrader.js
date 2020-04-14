
const PATH_COLOR = '#00aba9';

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: PATH_COLOR}});
                //creep.say('upgrading');
            }
        }

        else if(!creep.memory.upgrading && _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').length > 0){
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
        
        else if(!creep.memory.upgrading){
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: PATH_COLOR}});
            }
        }
	}
};

module.exports = roleUpgrader;
