var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleUpgrader2 = require('role.upgrader2');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    // console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 3) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn0'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    // console.log('Builders: ' + builders.length);
    if (harvesters.length > 2 && builders.length < 3) {
        var newBuilderName = 'Builder' + Game.time;
        Game.spawns['Spawn0'].spawnCreep([WORK,CARRY,MOVE,MOVE], newBuilderName,
        { memory: { role: 'builder' } });
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    // console.log('Upgraders: ' + upgraders.length);
    if (harvesters.length > 2 && upgraders.length < 8) {
        var newUpgraderName = 'Upgrader' + Game.time;
        Game.spawns['Spawn0'].spawnCreep([WORK,CARRY,MOVE,MOVE], newUpgraderName,
        { memory: { role: 'upgrader' } });
    }

    var upgraders2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader2');
    // console.log('Upgraders: ' + upgraders.length);
    if (harvesters.length > 2 && upgraders2.length < 5) {
        var newUpgraderName2 = 'Upgrader2' + Game.time;
        Game.spawns['Spawn0'].spawnCreep([WORK,CARRY,MOVE,MOVE], newUpgraderName2,
        { memory: { role: 'upgrader2' } });
    }
    
    if(Game.spawns['Spawn0'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn0'].spawning.name];
        Game.spawns['Spawn0'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn0'].pos.x + 1, 
            Game.spawns['Spawn0'].pos.y, 
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
        if(creep.memory.role == 'upgrader2') {
            roleUpgrader2.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}