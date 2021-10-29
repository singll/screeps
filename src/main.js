import creepApi from './modules/creepApi';
global.creepApi = creepApi;
import mount from './mount';
mount();
import { errorMapper } from './modules/errorMapper';
// import Harvester from "./role/harvester";
// import Builder from "./role/builder";
// import Upgrader from "./role/upgraderold";
// import Upgrader2 from "./role/upgrader2";
// import Defender from "./role/defender";
// import Repair from "./role/repair";
// import Worker from './role/worker';
import create_creep from './manage/creepmanage';
import { findFreeSpace } from './modules/utils';


// 游戏入口函数
export const loop = errorMapper(() => {

    // 每个房间都执行策略
    for (const room in Game.rooms) {
        // const current_room = Game.rooms[room];

        // const max_energy = current_room.energyCapacityAvailable;
        // const current_energy = current_room.energyAvailable;

        // const spawns = current_room.find(FIND_MY_SPAWNS);
        // const sources = current_room.find(FIND_SOURCES);
        // sources.forEach((source) => {
        //     source_pos = findFreeSpace(source.pos);
        // })

        // Tower防御代码
        // const tower = Game.getObjectById('617822394e5b2837c3542815');
        // if(tower) {
        //     const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        //     if(closestHostile) {
        //         tower.attack(closestHostile);
        //     }
        // }

        // 清除memory代码
        for(const name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        const max_energy = 300;

        // worker 数量，不够则生成新的
        // const workers = _.filter(Game.creeps, (creep) => creep.memory.alias == 'worker1');
        // if(workers.length < 3) {
        //     const newName = 'Worker' + Game.time;
        //     console.log('Spawning new worker: ' + newName);
        //     const spawn = Game.spawns['Spawn0'];
        //     const role = 'worker';
        //     // spawn, role, alias, max
        //     create_creep(spawn, role, "worker1", max_energy);
        // }
        const spawn = Game.spawns['Spawn0'];
        // harserver 数量，不够则生成新的
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.alias == 'harvester1');
        if(harvesters.length < 3) {
            const newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            const role = 'harvester';
            create_creep(spawn, role, "harvester1", max_energy);
        }

        // defender 数量，不够则生成新的
        // const defenders = _.filter(Game.creeps, (creep) => creep.memory.alias == 'defender');
        // if(defenders.length < 2) {
        //     const newName = 'Defender' + Game.time;
        //     console.log('Spawning new defender: ' + newDefenderName);
        //     const role = 'defender';
        //     create_creep(spawn, role, "defender", max_energy);
        // }

        // builder 数量，不够则生成新的
        const builders = _.filter(Game.creeps, (creep) => creep.memory.alias == 'builder');
        if (harvesters.length > 2 && builders.length < 2) {
            const newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            const role = 'builder';
            create_creep(spawn, role, "builder", max_energy);
        }

        
        // upgrader 数量，不够则生成新的
        const upgrader1s = _.filter(Game.creeps, (creep) => creep.memory.alias == 'upgrader1');
        if (harvesters.length > 2  && upgrader1s.length < 7) {
            const newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader1: ' + newName);
            const role = 'upgrader';
            create_creep(spawn, role, "upgrader1", max_energy);
        }

        // upgrader2 数量，不够则生成新的（采矿点不同
        const upgraders2 = _.filter(Game.creeps, (creep) => creep.memory.alias == 'upgrader2');
        if (harvesters.length > 2 && upgraders2.length < 2) {
            const newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader2: ' + newName);
            const role = 'upgrader';
            create_creep(spawn, role, "upgrader2", max_energy);
        }

        const repairs = _.filter(Game.creeps, (creep) => creep.memory.alias == 'repair');
        if (harvesters.length > 2 && repairs.length < 2) {
            const newName = 'Repair' + Game.time;
            console.log('Spawning new repair: ' + newName);
            const role = 'repair';
            create_creep(spawn, role, "repair", max_energy);
        }
        const sourceA = "5bbcae239099fc012e638747";
        const sourceB = "5bbcae239099fc012e638749"
        creepApi.remove("harvester1");
        creepApi.add('harvester1', 'harvester', sourceB);
        creepApi.remove("builder");
        creepApi.add('builder', 'builder', sourceB);
        creepApi.remove("upgrader1");
        creepApi.add('upgrader1', 'upgrader', sourceA);
        creepApi.remove("upgrader2");
        creepApi.add('upgrader2', 'upgrader', sourceB);
        creepApi.remove("repair");
        creepApi.add('repair', 'repair', sourceB);
        
        // spawn 生成新的creep的时候，提示
        if(Game.spawns['Spawn0'].spawning) { 
            var spawningCreep = Game.creeps[Game.spawns['Spawn0'].spawning.name];
            Game.spawns['Spawn0'].room.visual.text(
                '🛠️' + spawningCreep.memory.alias,
                Game.spawns['Spawn0'].pos.x + 1, 
                Game.spawns['Spawn0'].pos.y, 
                {align: 'left', opacity: 0.8});
        }

        // for(const name in Game.creeps) { 
        //     const creep = Game.creeps[name];
        //     if (creep.memory.role == 'worker') {
        //         Worker.run(creep);
        //     }
        //     // if(creep.memory.role == 'harvester') {
        //     //     Harvester.run(creep);
        //     // }
        //     if(creep.memory.role == 'defender') {
        //         Defender.run(creep);
        //     }
        //     if(creep.memory.role == 'upgrader') {
        //         Upgrader.run(creep);
        //     }
        //     if(creep.memory.role == 'upgrader2') {
        //         Upgrader2.run(creep);
        //     }
        //     // if(creep.memory.role == 'builder') {
        //     //     Builder.run(creep);
        //     // }
        //     if(creep.memory.role == 'repair') {
        //         Repair.run(creep);
        //     }
        // }
        Object.values(Game.creeps).forEach(creep => creep.work())
    }
})
