/**
 * 采集者配置生成器
 * source: 从指定矿中挖矿
 * target: 将其转移到指定的 roomController 中
 * 
 * @param sourceId 要挖的矿 id
 */
 const Harvester = sourceId => ({
    // 采集能量矿
    source: creep => {
        const source = Game.getObjectById(sourceId);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) creep.moveTo(source)
        // 自己身上的能量装满了，返回 true（切换至 target 阶段）
        return creep.store.getFreeCapacity() <= 0
    },
    // 添加能量
    target: creep => {
        // 需要添加能量的目标
        const harvestTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ) && 
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        const builder_targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(harvestTargets.length > 0) {
            if(creep.transfer(harvestTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(harvestTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if(builder_targets.length) {
            if(creep.build(builder_targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(builder_targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }

        // 自己身上的能量没有了，返回 true（切换至 source 阶段）
        return creep.store[RESOURCE_ENERGY] <= 0
    }
})

export default Harvester;