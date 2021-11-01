const level_tick=[100,20000,10000,20000,40000,80000,120000,150000,200000];
var typecontroller={
    run:function(flag){
        // 20t执行一次，且是在整除20的时候
        if(Game.time%20==0){
            // 获得房间控制器对象 StructureContainer
            var target=Game.getObjectById(flag.memory.serve_id);
            // 如果没有直接结束函数执行
            if(!target) return;
            // 不知道算的是什么，不知道为什么要除以100，大概是20tick能获得的经验？tick_a 大概是不让控制器降级需要的经验
            // level_tick[StructureContainer.level] - StructureContainer.ticksToDowngrade / 100 
            // StructureContainer.level[0-8]
            // StructureContainer.ticksToDowngrade [20000,10000,20000,40000,80000,120000,150000,200000]
            var tick_a=(level_tick[target.level]-target.ticksToDowngrade)/100;
            // 如果控制器满级并且降级时间还差一半以上，就吧tick_a 置为0
            if(target.level==8&&target.ticksToDowngrade>100000) tick_a=0;
            // 获取 升级所需经验和不降级所需的经验最大值
            // StructureContainer.progressTotal 当前等级升级所需的总经验
            // StructureContainer.progress 当前等级升级所需的经验
            var ammount=Math.max(target.progressTotal-target.progress,tick_a);
            // 获取升级或者不降级的任务
            var T=Game.rooms[flag.memory.center_room].memory.creep_Task['upgrade'][0][target.id];
            // 如果任务有就更新一下任务完成所需的量
            // 如果没有任务则将任务推到队列
            if(T){
                T['ammount']+=ammount-T['ammount_all'];
                T['ammount_all']=ammount;
            }
            else if(ammount>0) Game.rooms[flag.memory.center_room].add_creep_Task('upgrade',0,target.id,{'room':flag.room.name,'pos':[flag.pos.x,flag.pos.y],'ammount':ammount,'ammount_all':ammount});
        }
    }
}
module.exports=typecontroller;