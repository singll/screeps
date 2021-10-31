/**
 * 全局配置文件
 * 
 */
import { Harvester, Upgrader, Defender, Repair, Worker, Builder } from "../role";

/**
 * 角色列表
 * 依赖角色模块
 */
export const roles = {
    'harvester': Harvester,
    'upgrader': Upgrader,
    'defender': Defender,
    'repair': Repair,
    'worker': Worker,
    'builder': Builder,
}

/**
 * creep的角色和身体部件的比例关系
 * 依赖creep_body_list
 */
export const creep_type_body_proportion = {
    'worker':[1,1,2],
    'harvester':[1,1,2],
    'builder':[1,1,2],
    'upgrader':[1,1,2],
    'repair':[1,1,2],
    'defender': [1,1,2],
};

/**
 * 身体部件的顺序
 * 使用：角色和部件比例
 */
export const creep_body_list = [WORK,CARRY,MOVE,TOUGH,ATTACK,RANGED_ATTACK,HEAL,CLAIM];
