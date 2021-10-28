var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleUpgrader2 = require('role.upgrader2');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var roleRepair = require('role.repair');

module.exports.loop = function () {

    // Tower防御代码
    var tower = Game.getObjectById('617822394e5b2837c3542815');
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    // 清除memory代码
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // harserver 数量，不够则生成新的
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if(harvesters.length < 3) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn0'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }

    // defender 数量，不够则生成新的
    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    if(defenders.length < 2) {
        var newDefenderName = 'Defender' + Game.time;
        console.log('Spawning new defender: ' + newDefenderName);
        Game.spawns['Spawn0'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newDefenderName,
            {memory: {role: 'defender'}});
    }

    // builder 数量，不够则生成新的
    // var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    // // console.log('Builders: ' + builders.length);
    // if (harvesters.length > 2 && builders.length < 3) {
    //     var newBuilderName = 'Builder' + Game.time;
    //     Game.spawns['Spawn0'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newBuilderName,
    //     { memory: { role: 'builder' } });
    // }

    // upgrader 数量，不够则生成新的
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    // console.log('Upgraders: ' + upgraders.length);
    if (harvesters.length > 2 && upgraders.length < 7) {
        var newUpgraderName = 'Upgrader' + Game.time;
        Game.spawns['Spawn0'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newUpgraderName,
        { memory: { role: 'upgrader' } });
    }

    // upgrader2 数量，不够则生成新的（采矿点不同
    var upgraders2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader2');
    // console.log('Upgraders: ' + upgraders.length);
    if (harvesters.length > 2 && upgraders2.length < 2) {
        var newUpgraderName2 = 'Upgrader2' + Game.time;
        Game.spawns['Spawn0'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newUpgraderName2,
        { memory: { role: 'upgrader2' } });
    }

    var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
    if (harvesters.length > 2 && repairs.length < 2) {
        var newRepairName = 'Repair' + Game.time;
        Game.spawns['Spawn0'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newRepairName,
            { memory: { role: 'repair' } });
    }
    
    // spawn 生成新的creep的时候，提示
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
        if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
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
        if(creep.memory.role == 'repair') {
            roleRepair.run(creep);
        }
    }
}