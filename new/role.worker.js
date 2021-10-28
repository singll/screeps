/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.worker');
 * mod.thing == 'a thing'; // true
 */

var roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // 如果正在工作且储存的能量为0，则结束工作状态
        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        // 如果没有正在工作且可以获取的能量为0，则变成工作状态
        if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('🚧 harvester');
        }

        // 如果是工作状态，则进行工作，如果不是工作状态，则去获取能量
        if(creep.memory.working) {
            // 工作状态
            // 工人的工作分为：
            // 1. 给spawn extension store container 存储能量(需要排优先级，或者分类型) 或者接入动态能量管理系统，来动态分配
            // 2. 防御，给tower补充能量
            // 3. 给控制器升级，RCL等级低并且没有采运分离的时候，该工作是工人来做的
            // 4. 建造，这里需要添加自动建造系统，工人自动去建造当前需要造的东西
            // 5. 维修，在没有tower的时候，所有建筑都是由工人来维修，在有tower之后，根据维修消耗的能量，工人只负责维修tower不修的建筑
            // 一个工人在做什么工作需要一个动态管理的系统来调度，最高优先级是保证基地的运转，这是一个复杂的系统，暂时先保证能量供应

            // 需要添加能量的目标
            const harvestTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            // const total = _.sum(container.store);
            // const totalEnergy = creep.room.energyCapacityAvailable;
            // const currentEnergy = creep.room.energyAvailable;
            // console.log(totalEnergy);
            const work = creep.memory.work;
            if (work == 'harvest') {
                
                if(harvestTargets.length > 0) {
                    if(creep.transfer(harvestTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(harvestTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            } else if (work == 'upgrade')  {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#4fcf30'}});
                }
            }
        }
        else {
            // 获取能量的代码，这里可以进行优化，去距离最近的矿点进行采矿
            // TODO
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
  }
};

module.exports = roleWorker;