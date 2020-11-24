const { sprintf } = require("sprintf");
const stats = require("../index");

const SAMPLE_TIME = 10000;
const BYTES_PER_GB = 1024 * 1024 * 1024;

function format(data) {
    return sprintf(
        "Uptime=%10d  Processor=%.3f (%6.2f cores)  Memory=%.3f (%6.2f GB)",
        data.uptime,
        data.cpu.busy,
        data.cpu.total,
        data.memory.used,
        data.memory.total / BYTES_PER_GB
    );
}

function log(name, data) {
    if (data) {
        console.log(sprintf("%s  %s", name, format(data)));
    }
}

let previousData = stats.get();

setInterval(function () {
    const data = stats.get(previousData);
    console.log(data);

    console.log(sprintf("%s", new Date().toISOString()));
    log("OS       ", data.os);
    log("Container", data.container);
    log("Process  ", data.process);

    previousData = data;
}, SAMPLE_TIME);

console.log(`Test running (sampling every ${SAMPLE_TIME} ms)`);
