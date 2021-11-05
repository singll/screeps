import creepApi from './modules/creepApi';
global.creepApi = creepApi;
import mount from './mount';
mount();
import energyManageApi from './manage/energyManageApi';
import { errorMapper } from './modules/errorMapper';
import create_creep from './manage/creepManageApi';
import { findFreeSpace } from './modules/utils';


// 游戏入口函数
export const loop = errorMapper(() => {
    // 激活安全模式：别动我！
    const main_spawn = Game.spawns['Spawn0'];
    if (main_spawn.hits  < main_spawn.hitsMax){
        main_spawn.room.controller.activateSafeMode();
    }
    // 每个房间都执行策略
    for (const room in Game.rooms) {
        // 获取当前的房间对象
        const current_room = Game.rooms[room];
        // 初始化生成爬的最大能量
        if (!current_room.memory.creep_energy_max) current_room.memory.creep_energy_max = 500;
        // 初始化一下任务队列
        if (!current_room.memory.spawnList) current_room.memory.spawnList = [];
        // 初始化一下采矿点
        if (!current_room.memory.sourcePoss) {
            let sourcePoss = [];
            const sources = current_room.find(FIND_SOURCES);
            sources.forEach((source) => {
                const source_pos = findFreeSpace(source.pos);
                sourcePoss = sourcePoss.concat(source_pos);
            })
            current_room.memory.sourcePoss=sourcePoss;
        }
        console.log("[采矿点]");
        console.log(current_room.memory.sourcePoss);

        // const max_energy = current_room.energyCapacityAvailable;
        // const current_energy = current_room.energyAvailable;

        // const spawns = current_room.find(FIND_MY_SPAWNS);

        
        // const current_energy_status = energyManageApi.status(current_room);
        // console.log("[房间能量状态]"+current_energy_status);
        const current_energy_percent = energyManageApi.percent(current_room);
        console.log("[房间能量百分比]"+current_energy_percent);

        // tower 防御代码
        const towers = current_room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER);
            }
        });
        towers.forEach(tower => {
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            tower.attack(closestHostile);
        })


        // 清除memory代码
        for(const name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        const max_energy = 500;

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
        if(harvesters.length < 1) {
            const role = 'harvester';
            create_creep(spawn, role, "harvester1", 500);
        }

        const harvesters2 = _.filter(Game.creeps, (creep) => creep.memory.alias == 'harvester2');
        if(harvesters2.length < 2) {
            const role = 'harvester';
            create_creep(spawn, role, "harvester2", 500);
        }

        // defender 数量，不够则生成新的
        const defenders = _.filter(Game.creeps, (creep) => creep.memory.alias == 'defender');
        if(harvesters.length > 0 && defenders.length < 2) {
            const role = 'defender';
            create_creep(spawn, role, "defender", max_energy);
        }

        // builder 数量，不够则生成新的
        const builders = _.filter(Game.creeps, (creep) => creep.memory.alias == 'builder');
        if (harvesters.length > 0 && harvesters2.length > 1 && builders.length < 3) {
            const role = 'builder';
            create_creep(spawn, role, "builder", max_energy);
        }

        
        // upgrader 数量，不够则生成新的
        const upgrader1s = _.filter(Game.creeps, (creep) => creep.memory.alias == 'upgrader1');
        if (harvesters.length > 0 && harvesters2.length > 1  && upgrader1s.length < 6) {
            const role = 'upgrader';
            create_creep(spawn, role, "upgrader1", max_energy);
        }

        // upgrader2 数量，不够则生成新的（采矿点不同
        const upgraders2 = _.filter(Game.creeps, (creep) => creep.memory.alias == 'upgrader2');
        if (harvesters.length > 0 && harvesters2.length > 1 && upgraders2.length < 1) {
            const role = 'upgrader';
            create_creep(spawn, role, "upgrader2", max_energy);
        }

        const repairs = _.filter(Game.creeps, (creep) => creep.memory.alias == 'repair');
        if (harvesters.length > 0 && harvesters2.length > 1 && repairs.length < 1) {
            const role = 'repair';
            create_creep(spawn, role, "repair", max_energy);
        }
        const sourceA = "5bbcae239099fc012e638747";
        const sourceB = "5bbcae239099fc012e638749"
        // creepApi.remove("harvester1");
        creepApi.add('harvester1', 'harvester', sourceB);
        // creepApi.remove("harvester2");
        creepApi.add('harvester2', 'harvester', sourceA);
        // creepApi.remove("builder");
        creepApi.add('builder', 'builder', sourceB);
        // creepApi.remove("upgrader1");
        creepApi.add('upgrader1', 'upgrader', sourceA);
        // creepApi.remove("upgrader2");
        creepApi.add('upgrader2', 'upgrader', sourceB);
        // creepApi.remove("repair");
        creepApi.add('repair', 'repair', sourceB);

        creepApi.add('defender', 'defender', sourceA);
        
        // spawn 生成新的creep的时候，提示
        if(Game.spawns['Spawn0'].spawning) { 
            var spawningCreep = Game.creeps[Game.spawns['Spawn0'].spawning.name];
            Game.spawns['Spawn0'].room.visual.text(
                '🛠️' + spawningCreep.memory.alias,
                Game.spawns['Spawn0'].pos.x + 1, 
                Game.spawns['Spawn0'].pos.y, 
                {align: 'left', opacity: 0.8});
        }
        Object.values(Game.creeps).forEach(creep => creep.work())
    }
})
