var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    
    var tower = Game.getObjectById('3ce5f7cf4d936c8212da029c');
    if (tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
        
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    }
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    
    console.log('Currently ' + harvesters.length + ' harvesters.');
    console.log('Currently ' + builders.length + ' builders.');
    console.log('Currently ' + upgraders.length + ' upgraders.');

    var energyTargets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
    });
    
    console.log(energyTargets);
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'unused') {
            if (energyTargets != [] && (upgraders.length / (upgraders.length + harvesters.length + builders.length) > .8)) {
                console.log('Converting ' + creep.name + ' to an upgrader.');
                creep.memory.role = 'upgrader';
            }
            else if (energyTargets) {
                console.log('Converting ' + creep.name + ' to a harvester.');
                creep.memory.role = 'harvester';
            }
            else if (creep.room.find(FIND_CONSTRUCTION_SITES)) {
                console.log('Converting ' + creep.name + ' to a builder.');
                creep.memory.role = 'builder';
            }
        }
    }
    
    console.log(harvesters);
    
    if(harvesters.length < 2 && energyTargets != [] && Game.creeps.length < 6) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    else {
        console.log('No more harvesters needed.');
    }
}