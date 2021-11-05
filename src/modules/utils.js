export const findFreeSpace = (pos) => {
    const terrain = new Room.Terrain(pos.roomName);
    const result = [];
    const xs = [pos.x - 1, pos.x, pos.x + 1];
    const ys = [pos.y - 1, pos.y, pos.y + 1];

    xs.forEach((x) => {
        ys.forEach((y) => {
            if (terrain.get(x,y) != TERRAIN_MASK_WALL) 
                result.push(new Array(x, y));
        });
    });
    return result;
}