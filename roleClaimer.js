var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var thisroom = creep.room;
	    var currentController = creep.room.controller;
	    var ourController = Game.spawns['Sp1'].room.controller;
        
        //creep.move(TOP);
        //creep.move(BOTTOM);
        //creep.move(LEFT);
        //creep.move(RIGHT);
                creep.moveTo(14,32);
                creep.reserveController(currentController)

        if(currentController === ourController){
            //var exitpoint = creep.room.find(FIND_EXIT_TOP);
            //var exitpoint = creep.room.find(FIND_EXIT_LEFT);
            var exitpoint = creep.room.find(FIND_EXIT_RIGHT);
            creep.moveTo(exitpoint[7]);
            creep.say('onmyway');
        }
        else{
            if(!creep.claimController(currentController)) {
                creep.moveTo(14,32);
            creep.say('youremine');
            }
        }
    }

};

module.exports = roleClaimer;