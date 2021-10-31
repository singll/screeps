// import { roles } from '../modules/config';
import create_creep from "../manage/creepManageApi";
// 将拓展签入 Creep 原型
function mountSpawn() {
    _.assign(Spawn.prototype, spawnExtension)
}

// 自定义的 Creep 的拓展
const spawnExtension = {
    // 工作
    work() {
        // 自己已经在生成了 / 内存里没有生成队列 / 生产队列为空 就啥都不干
        if (this.spawning || !this.room.memory.spawnList || this.room.memory.spawnList.length == 0) return ;
        // 进行生成
        // const spawnSuccess = this.mainSpawn(this.room.memory.spawnList[0])
        const task = this.room.memory.spawnList[0].split(":");
        const role = task[0];
        const alias = task[1];
        // spawn, role, alias, energy_max // 现在的问题是能量的数是怎么获得？
        const energy = this.room.memory.creep_energy_max;
        const spawnSuccess = create_creep(this, role, alias, energy);
        // 生成成功后移除任务
        if (spawnSuccess === OK) {
            this.memory.spawnList.shift();
        } else {
            // 任务完成失败 进行一些操作
        }
    },
    /**
     *  添加任务到队列
     * @param {*} taskName  role:alias
     * @returns {int} taskLength
     */
    addTask(taskName) { 
        // 任务加入队列
        this.room.memory.spawnList.push(taskName);
        return this.room.memory.spawnList.length;
    }
}

export default mountSpawn;