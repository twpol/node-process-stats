const os = require("./lib/os");
const container = require("./lib/container");
const process = require("./lib/process");
module.exports = {
    os,
    container,
    process,
    get: function (previous) {
        previous = previous || {};
        const osData = os.get(previous.os);
        const containerData = container.get(previous.container);
        const processData = process.get(
            containerData || osData,
            previous.process
        );
        return {
            os: osData,
            container: containerData,
            process: processData,
        };
    },
};
