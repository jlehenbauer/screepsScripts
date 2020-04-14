var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleExtender = require('role.extender');
var roleAttacker = require('role.attacker');
var roleMiner = require('role.miner');
var roleSubMiner = require('role.subminer');
var roleClaimer = require('role.claimer');

module.exports.loop = function () {
    
    //TODO:
    // - optimize body parts for different roles
    
    /** Set this variable to true to temporarily halt all creep production **/
    /** DONT' FORGET TO TURN THIS BACK TO FALSE AFTER YOU'RE FINISHED **/
    var nobuild = false;
    
    var offenseNeeded = false;
    
    var tower = Game.getObjectById('5e933ffdff5f6d267f9412e4');
    if(tower) {

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
            offenseNeeded = true;
        }
        else {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < (structure.hitsMax/500)
        });
        if(closestDamagedStructure && tower.energy > tower.energyCapacity/2) {
            tower.repair(closestDamagedStructure);
        }
        }
    }
    
    
    var numExtentions = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION)
                }}).length;
    var numOpenExtensions = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION 
                        && structure.energy === structure.energyCapacity 
                        && structure.isActive() == true);
                    }
            }).length;
    var numEmptyExtensions = numExtentions - numOpenExtensions;
    
    // Log the amount of resources available
    //console.log(numExtentions + ' Total');
    //console.log(numOpenExtensions + ' Open');
    //console.log(numEmptyExtensions + ' Empty');
    
            
    var totalEnergy = numOpenExtensions*50 + Game.spawns['Spawn1'].energy;
    
    
    var basecreep = [WORK,CARRY,MOVE];
    var lvl2creep = [WORK,WORK,CARRY,MOVE];
    var ext1creep = [WORK,WORK,CARRY,MOVE];
    var ext3creep = [WORK,WORK,CARRY,CARRY,MOVE];
    var ext5creep = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
    var ext7creep = [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
    var ext9creep = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE]
    var lvl4creep = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
    
    var baseminer = [WORK,MOVE];
    var lvl2miner = [WORK,WORK,MOVE];
    var lvl3miner = [WORK,WORK,WORK,MOVE];
    var lvl5miner = [WORK,WORK,WORK,WORK,MOVE];
    
    
    var nowcreep = [WORK,CARRY,MOVE];
    var minercreep = [WORK,WORK,MOVE];
    
    var attackermin = 0;
    var attackermax = 3;
    var buildermin = 0;
    var buildermax = 4;
    var harvestermin = 2;
    var harvestermax = 3;
    var minermin = 1;
    var minermax = 3;
    var subminermin = 0;
    var subminermax = 1;
    var extendermin = 0;
    var extendermax = 4;
    var upgradermin = 1;
    var upgradermax = 4;
    
    var reqEnergy = 200;
    
    /** Change parameters for created creeps based on the amount of extenders available **/
    if(Game.spawns['Spawn1'].room.controller.level > 1 && numOpenExtensions > 0){
        switch(numOpenExtensions){
            case 1:
                nowcreep = basecreep;
                reqEnergy = 200;
                break;
            case 2:
                nowcreep = ext1creep;
                reqEnergy = 300;
                break;
            case 3:
                nowcreep = ext1creep;
                reqEnergy = 300;
                break;
            case 4:
                nowcreep = ext3creep;
                reqEnergy = 350;
                break;
            case 5:
                nowcreep = ext5creep;
                reqEnergy = 400;
                break;
            case 6:
                nowcreep = ext5creep;
                reqEnergy = 400;
                break;
            case 7:
                nowcreep = ext7creep;
                reqEnergy = 550;
                break;
            case 8:
                nowcreep = ext7creep;
                reqEnergy = 550;
                break;
            case 9:
                nowcreep = ext7creep;
                reqEnergy = 550;
                break;
            case 10:
                nowcreep = ext7creep;
                reqEnergy = 550;
                break;
            case 11:
            case 12:
            case 13:
            case 14:
                nowcreep = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE];
                reqEnergy = 800;
                break;
            case 15:
                nowcreep = lvl4creep;
                reqEnergy = 1000;
                break;
        }
    }
    else{
        nowcreep = basecreep;
        reqEnergy = 200;
    }
    
    
    
    
    if(Game.spawns['Spawn1'].room.controller.level > 1){
        switch(numOpenExtensions){
            case 0:
                minercreep = lvl2miner;
                break;
            case 1:
                minercreep = lvl2miner;
                break;
            case 2:
                minercreep = lvl2miner;
                break;
            case 3:
                minercreep = lvl2miner;
                break;
            case 4:
                minercreep = lvl3miner;
                break;
            case 5:
                minercreep = lvl3miner;
                break;
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                minercreep = lvl3miner;
                break;
        }
    }
    else{
        minercreep = baseminer;
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    /** Create variable lists for all the creep types **/
    var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var extenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'extender');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var subminers = _.filter(Game.creeps, (creep) => creep.memory.role == 'subminer');
    
    
    /** Make more miners **/
    if(totalEnergy >= (minercreep.length * 100 - 50)
            && miners.length < minermax
            && harvesters.length > harvestermin
            && !nobuild){
        var newName = Game.spawns['Spawn1'].createCreep(minercreep, undefined, {role: 'miner'});
        console.log('Spawning new miner: ' + newName);
    }
    /** Make more subminers **/
    else if(totalEnergy >= (minercreep.length * 100 - 50) 
            && subminers.length < subminermax
            && harvesters.length > harvestermin
            && miners.length > minermin
            && !nobuild){
        var newName = Game.spawns['Spawn1'].createCreep(minercreep, undefined, {role: 'subminer'});
        console.log('Spawning new subminer: ' + newName);
    }

    
    /** Make more harvesters **/
    else if(totalEnergy >= reqEnergy 
            && harvesters.length < harvestermax
            && !nobuild){
        var newName = Game.spawns['Spawn1'].createCreep(nowcreep, undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }
    
    else if(totalEnergy >= reqEnergy 
            && harvesters.length < harvestermin
            && !nobuild){
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }
    
    /** Make more upgraders **/
    else if(totalEnergy >= reqEnergy 
            && upgraders.length < upgradermax
            && harvesters.length > harvestermin
            && miners.length > minermin
            && !nobuild){
        var newName = Game.spawns['Spawn1'].createCreep(nowcreep, undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
    }
    
    /** Make more extenders **/
    else if(totalEnergy >= reqEnergy 
            && extenders.length < extendermax
            && numExtentions > 1
            && harvesters.length > harvestermin
            && miners.length > minermin
            && !nobuild)
    {
        var newName = Game.spawns['Spawn1'].createCreep(nowcreep, undefined, {role: 'extender'});
        console.log('Spawning new extender: ' + newName);
    }

    
    /** Make more builders **/
    else if(totalEnergy >= reqEnergy 
        && builders.length < buildermax
        && (Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length > 0 
            || Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
               filter: (site) => {
                    return (site.hits < site.hitsMax / 2)
                }
            }).length > 0)
        && !nobuild){
            var newName = Game.spawns['Spawn1'].createCreep(nowcreep, undefined, {role: 'builder'});
            console.log('Spawning new builder: ' + newName);
    }

    
    /** Make more attackers **/
    else if(totalEnergy >= 560 
            && attackers.length < attackermax 
            && miners.length >= minermax
            && offenseNeeded
            && !nobuild){
        var newName = Game.spawns['Spawn1'].createCreep([RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,MOVE,MOVE], undefined, {role: 'attacker'});
        console.log('Spawning new attacker: ' + newName);
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester' && Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
            roleHarvester.run(creep);
            //creep.say('harvest');
        }
        else if(creep.memory.role == 'harvester'){
            roleExtender.run(creep);
            //creep.say('upgrading');
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            //creep.say('upgrading');
        }
        if(creep.memory.role == 'builder' && Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length > 0) {
            roleBuilder.run(creep);
            //creep.say('building');
        }
        /** I believe this is happening within the builder role already
        else if(creep.memory.role == 'builder' && Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
                    }
            })){
            roleExtender.run(creep);
        }
        **/
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'extender' && numEmptyExtensions > 0) {
            roleExtender.run(creep);
            //creep.say('extending');
        }   
        else if(creep.memory.role == 'extender'){
            roleUpgrader.run(creep);
            creep.say('temp upgrade');
        }
        if(creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
            //creep.say('attacking');
        }
        if(creep.memory.role == 'miner'){
            roleMiner.run(creep);
            //creep.say('mining');
        }
        if(creep.memory.role == 'subminer'){
            roleSubMiner.run(creep);
            //creep.say('mining');
        }
        if(creep.memory.role == 'claimer'){
            roleClaimer.run(creep);
            //creep.say('going');
        }
        
        var gap = 1;
        /** Announce the amount of each creep at minute intervals **/
        if(Game.time%45 === 0){
            
            console.log(nowcreep);
            
            console.log(totalEnergy);
            
            console.log("Attackers: " + attackers.length + '\n' +
                        "Builders: " + builders.length + '\n' +
                        "Extenders: " + extenders.length + '\n' +
                        "Harvesters: " + harvesters.length + '\n' +
                        "Miners: " + miners.length + ' , ' + subminers.length + '\n' +
                        "Upgraders: " + upgraders.length);
        }
    }
    
    /** Kill old creeps in memory **/
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}