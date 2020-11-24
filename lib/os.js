const os = require("os");

const EMPTY_CPU_USAGE = { user: 0, nice: 0, sys: 0, irq: 0, busy: 0, idle: 0 };

function getCpuUsed() {
    const cpus = os.cpus();
    const usage = {
        ts: Date.now(),
        ...EMPTY_CPU_USAGE,
        total: 0,
    };
    for (const cpu of cpus) {
        usage.user += cpu.times.user;
        usage.nice += cpu.times.nice;
        usage.sys += cpu.times.sys;
        usage.irq += cpu.times.irq;
        usage.idle += cpu.times.idle;
    }
    usage.busy = usage.user + usage.nice + usage.sys + usage.irq;
    usage.total = usage.busy + usage.idle;
    return usage;
}

function get(previous) {
    previous = previous || {};
    previous._cpu = previous._cpu || {
        ts: 0,
        ...EMPTY_CPU_USAGE,
        total: 0,
    };
    const _cpu = getCpuUsed();
    const cpuDelta = _cpu.total - previous._cpu.total;
    const cpu = {
        ...EMPTY_CPU_USAGE,
        total: cpuDelta / (_cpu.ts - previous._cpu.ts),
    };
    for (const type of Object.keys(EMPTY_CPU_USAGE)) {
        cpu[type] = (_cpu[type] - previous._cpu[type]) / cpuDelta;
    }
    const freemem = os.freemem();
    const totalmem = os.totalmem();
    return {
        uptime: os.uptime(),
        load: os.loadavg(),
        _cpu,
        cpu,
        memory: {
            used: (totalmem - freemem) / totalmem,
            free: freemem / totalmem,
            total: totalmem,
        },
    };
}

module.exports = {
    get,
};
