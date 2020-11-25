const { getParentTotal } = require("./util/parents");

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

function get(parents, previous) {
    const parentTotal = getParentTotal(parents);
    previous = previous || {};
    previous._cpu = previous._cpu || {
        user: 0,
        system: 0,
        busy: 0,
    };
    const _cpu = getCpuUsed();
    const cpuTotal = parentTotal.cpu;
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
            external: memoryUsage.external / parentTotal.memory,
            heapTotal: memoryUsage.heapTotal / parentTotal.memory,
            heapUsed: memoryUsage.heapUsed / parentTotal.memory,
            rss: memoryUsage.rss / parentTotal.memory,
            used: memoryUsage.rss / parentTotal.memory,
            total: parentTotal.memory,
        },
    };
}

module.exports = {
    get,
};
