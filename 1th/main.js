const roleWorker = require('role.worker');
const utilBasic = require('util.basic');

module.exports.loop = function () {


    // 清除memory代码
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // harserver 数量，不够则生成新的
    var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');
    if(workers.length < 3) {
        var newName = 'Worker' + Game.time;
        console.log('Spawning new worker: ' + newName);
        // Game.spawns['Spawn0'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
        //     {memory: {role: 'harvester'}});
        const spawn = Game.spawns['Spawn0'];
        const role = 'worker';
        // spawn, role, work, max
        utilBasic.create_creep(spawn, role, "harvest", 300);
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
        let creep = Game.creeps[name];
        if (creep.memory.role == 'worker') {
            roleWorker.run(creep);
        }

    }
}