const os = require("os");
const fs = require("fs");

const NANOSECONDS_PER_MS = 1000000;

function getCGroupString(metric) {
    return fs
        .readFileSync(`/sys/fs/cgroup/${metric}`)
        .toString()
        .split("\n")[0];
}

function getCGroupNumber(metric) {
    return parseInt(
        fs
            .readFileSync(`/sys/fs/cgroup/${metric}`)
            .toString()
            .split("\n")[0]
            .split(" ")[0]
    );
}

function parseCpus(cpus) {
    return [].concat(
        ...cpus.split(",").map((cpu) => {
            const range = cpu.split("-");
            if (range.length === 2) {
                return Array(range[1] - range[0] + 1)
                    .fill(Number(range[0]))
                    .map((x, y) => x + y);
            }
            return Number(cpu);
        })
    );
}

const MEM_UNSET = 9223372036854771712;

function get(previous) {
    previous = previous || {};
    previous._cpu = previous._cpu || {
        ts: 0,
        busy: 0,
    };
    try {
        const cpus = parseCpus(getCGroupString("cpuset/cpuset.cpus"));
        const cpuQuota =
            getCGroupNumber("cpu/cpu.cfs_quota_us") /
            getCGroupNumber("cpu/cpu.cfs_period_us");
        const cpuTotal = cpuQuota > 0 ? cpuQuota : cpus.length;
        const _cpu = {
            ts: Date.now(),
            busy: getCGroupNumber("cpuacct/cpuacct.usage"),
        };
        const cpuDelta =
            cpuTotal * NANOSECONDS_PER_MS * (_cpu.ts - previous._cpu.ts);
        const cpu = {
            busy: (_cpu.busy - previous._cpu.busy) / cpuDelta,
            idle: 1 - (_cpu.busy - previous._cpu.busy) / cpuDelta,
            total: cpuTotal,
        };
        const memoryLimit = getCGroupNumber("memory/memory.limit_in_bytes");
        const memoryTotal =
            memoryLimit === MEM_UNSET ? os.totalmem() : memoryLimit;
        const memoryUsed = getCGroupNumber("memory/memory.usage_in_bytes");
        return {
            uptime: -1,
            _cpu,
            cpu,
            memory: {
                used: memoryUsed / memoryTotal,
                free: (memoryTotal - memoryUsed) / memoryTotal,
                total: memoryTotal,
            },
        };
    } catch (error) {
        return null;
    }
}

module.exports = {
    get,
};
