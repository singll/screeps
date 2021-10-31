/*
 * Creep 管理的API
 */


import { creep_body_list, creep_type_body_proportion } from '../config/global';


const create_creep = (spawn, role, alias, max, ...args) => {
    const newName = role + Game.time;
    // console.log('Spawning new harvester: ' + newName);
    let body = [];
    // 从配置文件获取当前角色的各个身体部件的比例
    const type_list = creep_type_body_proportion[role];
    // 制造一个当前creep需要最少的能量
    let min = 0;
    // 遍历身体部件比例
    for (let i = 0; i < type_list.length; i++) {
        // 从身体部件列表获取身体部件名字
        let currentBody = creep_body_list[i];
        // 使用比例乘以当前身体部件的消耗，然后累加到min中
        min = min + type_list[i] * BODYPART_COST[currentBody];
        // body.append(config.creep_body_list[i]);
    }
    // 获取当前规划的最多能量能造几倍的creep
    
    const mul = parseInt(max/min);
    // console.log(mul);
    // 小于1说明能量不满足造最基本的creep，退出
    if (mul < 1) {
        // 可能需要一个报错或者返回信息，后续添加
        // TODO
        return ;
    }
    // 根据倍数生成body列表
    for (let i = 0; i < type_list.length; i++) {
        // 从身体部件列表获取身体部件名字
        const currentBody = creep_body_list[i];
        const numb = type_list[i]*mul;
        for ( let a = 0; a < numb; a++) {
            body.push(currentBody);
        }
    }
    return spawn.spawnCreep(body, newName, {memory: {role:role,alias:alias}});
}


export default create_creep;