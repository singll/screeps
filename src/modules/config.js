/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('config');
 * mod.thing == 'a thing'; // true
 */
import Upgrader from "../role/upgrader";
import Harvester from "../role/harvester";
import Defender from "../role/defender";
import Repair from "../role/repair";
import Worker from "../role/worker";
import Builder from "../role/builder";

export const roles = {
    'harvester': Harvester,
    'upgrader': Upgrader,
    'defender': Defender,
    'repair': Repair,
    'worker': Worker,
    'builder': Builder,
}

export const creep_type_body_proportion = {
    'worker':[1,1,2],
    'harvester':[1,1,2],
    'builder':[1,1,2],
    'upgrader':[1,1,2],
    'repair':[1,1,2],
    'defender': [1,1,2],
};

export const creep_body_list = [WORK,CARRY,MOVE,TOUGH,ATTACK,RANGED_ATTACK,HEAL,CLAIM];
