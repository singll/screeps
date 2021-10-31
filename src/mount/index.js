import mountCreep from './mount.creep';
import mountSpawn from './mount.spawn';

function index() {
    console.log('[mount] 重新挂载拓展');

    mountCreep();
    mountSpawn();
    // 其他拓展
}

export default index;