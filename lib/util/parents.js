function getParentTotal(parents) {
    const parentCpu = parents.find((p) => p && "cpu" in p).cpu;
    const parentMemory = parents.find((p) => p && "memory" in p).memory;
    return {
        cpu: parentCpu.total,
        memory: parentMemory.total,
    };
}

module.exports = {
    getParentTotal,
};
