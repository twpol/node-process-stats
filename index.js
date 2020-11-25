const os = require("./lib/os");
const awsTask = require("./lib/aws-task");
const awsContainer = require("./lib/aws-container");
const container = require("./lib/container");
const process = require("./lib/process");
module.exports = {
    os,
    awsTask,
    awsContainer,
    container,
    process,
    get: function (previous) {
        previous = previous || {};
        const osData = os.get(previous.os);
        const awsTaskData = awsTask.get([osData]);
        const awsContainerData = awsContainer.get([awsTaskData, osData]);
        const containerData = container.get(
            [awsContainerData, awsTaskData, osData],
            previous.container
        );
        const processData = process.get(
            [containerData, awsContainerData, awsTaskData, osData],
            previous.process
        );
        return {
            os: osData,
            awsTask: awsTaskData,
            awsContainer: awsContainerData,
            container: containerData,
            process: processData,
        };
    },
};
