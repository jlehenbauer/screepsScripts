
const PATH_COLOR = '#f0a30a';

var roleBuilder = {
    
    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	        var roadToRepair = creep.room.find(FIND_STRUCTURES, {
                filter: function(object){
                    return object.structureType == STRUCTURE_ROAD && object.hits < object.hitsMax / 2;
                } 
            });
    
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: PATH_COLOR}});
                    creep.say('🚧');
                }
            }
            else if(roadToRepair){
                creep.moveTo(roadToRepair, {visualizePathStyle: {stroke: PATH_COLOR}});
                creep.repair(roadToRepair);
                creep.say('🛠');
            }
            /** If all else fails - nothing to build or repair - do what extenders do **/
            else{
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[1], {visualizePathStyle: {stroke: PATH_COLOR}});
                    }
                    else{
                        creep.transfer(targets[1]);
                    }
                }
            }
	    }
	    else if(_.filter(Game.creeps, (creep) => creep.memory.role == 'miner').length > 0){
	        var sources = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER && structure.store > 0)
                        }
                });
            if(creep.withdraw(sources[0], RESOURCE_ENERGY, creep.energyCapacityAvailable) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: PATH_COLOR}});
                creep.say('nopot');
            }
            if(sources.length === 0){
                sources = creep.room.find(FIND_DROPPED_RESOURCES);
                if(creep.pickup(sources[1] == ERR_NOT_IN_RANGE)){
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: PATH_COLOR}});
                    creep.say('otg?');
                    creep.pickup(sources[1]);
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
};

module.exports = roleBuilder;