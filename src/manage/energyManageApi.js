const energyManageApi = {

    /**
     * 最小能量，默认是300
     */
    _min: 300,
    /**
     * 获取当前房间的能量状态
     * 0 能量告急 小于_min
     * 1 能量紧缺 
     * 2 能量均衡
     * 3 能量充足
     * 4 能量已满
     */
    status(room) {
        let result = 0;
        // 根据能量百分比 获取能量的速度 消耗能量的速度 
        const max = room.energyCapacityAvailable;
        const current = room.energyAvailable;
        // const level = room.controller.level;
        // const percent = this.percent(room);
        
        if (current < energyManageApi._min) {
            return result;
        }
        if(current === max) {
            result = 4;
        }else if(max*(30/100) >= current){
            result = 1;
        }else if (max*(70/100) < current) {
            result = 3;
        }else {
            result = 2;
        }
        return result;

    },
    percent(room) {
        const max = parseFloat(room.energyCapacityAvailable);
        const current = parseFloat(room.energyAvailable);
        if (isNaN(current) || isNaN(max)) {
            return "-";
        }
        return max <= 0 ? parseInt(0.0) : parseInt(Math.round(current / max * 10000) / 100.00);
    },
    /**
     * 获取单个creep的能量
     * @param {*} room 
     * @returns 
     */
    creep(room) {
        let result = 300;
        const status = this.status(room);
        // if (status > 1)
        return result;

    }
//     getMode() {
};

export default energyManageApi;
