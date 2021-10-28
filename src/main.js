import mount from './mount';
mount();
import { errorMapper } from './modules/errorMapper';
import Harvester from "./role/harvester";
import Builder from "./role/builder";
import Upgrader from "./role/upgrader";
import Upgrader2 from "./role/upgrader2";
import Defender from "./role/defender";
import Repair from "./role/repair";
import Worker from './role/worker';
import create_creep from './manage/creepmanage';
import { findFreeSpace } from './modules/utils';


// 游戏入口函数
export const loop = errorMapper(() => {

    // 每个房间都执行策略
    for (const room in Game.rooms) {
        const current_room = Game.rooms[room];

        const max_energy = current_room.energyCapacityAvailable;
        const current_energy = current_room.energyAvailable;

        // const spawns = current_room.find(FIND_MY_SPAWNS);
        // const sources = current_room.find(FIND_SOURCES);
        // sources.forEach((source) => {
        //     source_pos = findFreeSpace(source.pos);
        // })

        // Tower防御代码
        const tower = Game.getObjectById('617822394e5b2837c3542815');
        if(tower) {
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }

        // 清除memory代码
        for(const name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        // worker 数量，不够则生成新的
        const workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');
        if(workers.length < 3) {
            const newName = 'Worker' + Game.time;
            console.log('Spawning new worker: ' + newName);
            const spawn = Game.spawns['Spawn0'];
            const role = 'worker';
            // spawn, role, work, max
            create_creep(spawn, role, "harvest", 500);
        }

        // harserver 数量，不够则生成新的
        // var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        // if(harvesters.length < 3) {
        //     var newName = 'Harvester' + Game.time;
        //     console.log('Spawning new harvester: ' + newName);
        //     Game.spawns['Spawn0'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
        //         {memory: {role: 'harvester'}});
        // }

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
        if (workers.length > 2 && upgraders.length < 7) {
            var newUpgraderName = 'Upgrader' + Game.time;
            Game.spawns['Spawn0'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newUpgraderName,
            { memory: { role: 'upgrader' } });
        }

        // upgrader2 数量，不够则生成新的（采矿点不同
        var upgraders2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader2');
        // console.log('Upgraders: ' + upgraders.length);
        if (workers.length > 2 && upgraders2.length < 2) {
            var newUpgraderName2 = 'Upgrader2' + Game.time;
            Game.spawns['Spawn0'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newUpgraderName2,
            { memory: { role: 'upgrader2' } });
        }

        var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
        if (workers.length > 2 && repairs.length < 2) {
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

        for(const name in Game.creeps) { 
            const creep = Game.creeps[name];
            if (creep.memory.role == 'worker') {
                Worker.run(creep);
            }
            if(creep.memory.role == 'harvester') {
                Harvester.run(creep);
            }
            if(creep.memory.role == 'defender') {
                Defender.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                Upgrader.run(creep);
            }
            if(creep.memory.role == 'upgrader2') {
                Upgrader2.run(creep);
            }
            if(creep.memory.role == 'builder') {
                Builder.run(creep);
            }
            if(creep.memory.role == 'repair') {
                Repair.run(creep);
            }
        }
    }
})
