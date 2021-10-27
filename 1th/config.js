/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('config');
 * mod.thing == 'a thing'; // true
 */

const config = {
    creep_type_body_proportion: {
        'worker':[1,1,2],
    },
    creep_body_list: [WORK,CARRY,MOVE,TOUGH,ATTACK,RANGED_ATTACK,HEAL,CLAIM],
    creep_body_spend: {
        MOVE: 50,
        WORK: 100,
        CARRY: 80,
        TOUGH: 10,
        ATTACK: 80,
        RANGED_ATTACK: 150,
        HEAL: 250,
        CLAIM: 600,
    },
};

module.exports = config;