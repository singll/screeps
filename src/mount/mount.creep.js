import { roles } from '../modules/config';
// 将拓展签入 Creep 原型
function mountCreep() {
    _.assign(Creep.prototype, creepExtension)
}

// 自定义的 Creep 的拓展
const creepExtension = {
    /**
     * creep的执行工作逻辑
     * @returns none
     */
    work() {
        // 如果 creep 还没有发送重生信息的话，执行健康检查，保证只发送一次生成任务
        // 健康检查不通过则向 spawnList 发送自己的生成任务
        if (!this.memory.hasSendRebirth) {
            const health = this.isHealthy();
            if (!health) {
                // 向指定 spawn 推送生成任务
                // room.find(FIND_MY_SPAWNS)
                const spawns = this.room.find(FIND_MY_SPAWNS);
                const taskName = this.memory.role + ":" + this.memory.alias;
                spawns[0].addTask(taskName);
                this.memory.hasSendRebirth = true;
            }
        }

        // ------------------------ 第一步：获取 creep 执行逻辑 ------------------------

        // 获取对应别名
        const creepAlias = creepApi.get(this.memory.alias)
        // 检查 creep 内存中的别名是否存在
        if (!creepAlias) {
            console.log(`creep ${this.name} 携带了一个无效的别名 ${this.memory.alias}`);
            this.say('找不到别名！');
            return ;
        }
        const creepLogic = roles[creepAlias.role](...creepAlias.args);
        // ------------------------ 第二步：执行 creep 准备阶段 ------------------------

        // 没准备的时候就执行准备阶段
        if (!this.memory.ready) {
            // 有准备阶段配置则执行
            if (creepLogic.prepare && creepLogic.isReady) {
                creepLogic.prepare(this);
                this.memory.ready = creepLogic.isReady(this);
            }
            // 没有就直接准备完成
            else this.memory.ready = true;
            return;
        }

        // ------------------------ 第三步：执行 creep 工作阶段 ------------------------

        let stateChange = true;
        // 执行对应阶段
        // 阶段执行结果返回 true 就说明需要更换 working 状态
        if (this.memory.working) {
            if (creepLogic.target) stateChange = creepLogic.target(this);
        }
        else {
            if (creepLogic.source) stateChange = creepLogic.source(this);
        }

        // 状态变化了就切换工作阶段
        if (stateChange) this.memory.working = !this.memory.working;
    },
    /**
     * 判断是否健康
     * @returns boolean
     */
    isHealthy() {
        if (this.ticksToLive <= 10) return false;
        // 其他逻辑，比如判断当前工作状态，能否完成任务等
        return true;
    },
    // 自定义敌人检测
    checkEnemy() { 
        // 代码实现...
    },
    // 填充所有 spawn 和 extension
    fillSpawnEngry() { 
        // 代码实现...
    },
    // 填充所有 tower
    fillTower() {
        // 代码实现...
    },
    // 其他更多自定义拓展
}

export default mountCreep;