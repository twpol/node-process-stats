const MICROSECONDS_PER_MS = 1000;

function getCpuUsed() {
    const cpuUsage = process.cpuUsage();
    return {
        ts: Date.now(),
        user: cpuUsage.user,
        system: cpuUsage.system,
        busy: cpuUsage.user + cpuUsage.system,
    };
}

function get(parent, previous) {
    previous = previous || {};
    previous._cpu = previous._cpu || {
        user: 0,
        system: 0,
        busy: 0,
    };
    const _cpu = getCpuUsed();
    const cpuTotal = parent.cpu.total;
    const cpuDelta =
        cpuTotal * MICROSECONDS_PER_MS * (_cpu.ts - previous._cpu.ts);
    const cpu = {
        user: (_cpu.user - previous._cpu.user) / cpuDelta,
        system: (_cpu.system - previous._cpu.system) / cpuDelta,
        busy: (_cpu.busy - previous._cpu.busy) / cpuDelta,
        total: cpuTotal,
    };
    const memoryUsage = process.memoryUsage();
    return {
        uptime: process.uptime(),
        _cpu,
        cpu,
        memory: {
            external: memoryUsage.external / parent.memory.total,
            heapTotal: memoryUsage.heapTotal / parent.memory.total,
            heapUsed: memoryUsage.heapUsed / parent.memory.total,
            rss: memoryUsage.rss / parent.memory.total,
            used: memoryUsage.rss / parent.memory.total,
            total: parent.memory.total,
        },
    };
}

module.exports = {
    get,
};
