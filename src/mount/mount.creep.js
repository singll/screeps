import { roles } from '../modules/config';
// 将拓展签入 Creep 原型
function mountCreep() {
    _.assign(Creep.prototype, creepExtension)
}

// 自定义的 Creep 的拓展
const creepExtension = {
    // 工作
    work() {
        // ------------------------ 第一步：获取 creep 执行逻辑 ------------------------

        // 获取对应配置项
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