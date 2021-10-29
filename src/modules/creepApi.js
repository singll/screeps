const creepApi = {
    /**
     * 新增 creep 别名
     * @param alias 别名
     * @param role 该 creep 的角色
     * @param args creep 的工作参数
     */
    add(alias, role, ...args) {
        if (!Memory.creepAlias) Memory.creepAlias = {}
        Memory.creepAlias[alias] = { role, args }
        
        return `${alias} 别名已更新：[角色] ${role} [工作参数] ${args}`
    },
    /**
     * 移除指定 creep 别名
     * @param 别名 要移除的配置项名称
     */
    remove(alias) {
        delete Memory.creepAlias[alias]
        return `${alias} 别名已移除`
    },
    /**
     * 获取 creep 别名
     * @param alias 要获取的别名
     * @returns 对应的别名，若不存在则返回 undefined
     */
    get(alias) {
        if (!Memory.creepAlias) return undefined
        return Memory.creepAlias[alias]
    },
}

export default creepApi;