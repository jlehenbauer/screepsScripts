const PATH_COLOR = '#825a2c';

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: PATH_COLOR}});
            }
            creep.drop(RESOURCE_ENERGY, creep.carryCapacity);
	}
};

module.exports = roleMiner;