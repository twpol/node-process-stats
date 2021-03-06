const http = require("http");
const { getParentTotal } = require("./util/parents");

const BYTES_PER_MB = 1024 * 1024;

/** @type {null | {cpu?: number, memory?: number}} */
let limits = null;
let metadata = null;

if (process.env.ECS_CONTAINER_METADATA_URI_V4) {
    http.get(`${process.env.ECS_CONTAINER_METADATA_URI_V4}/task`, (res) => {
        let data = "";

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            metadata = JSON.parse(data);
            if ("Limits" in metadata) {
                limits = {};
                if ("CPU" in metadata.Limits) {
                    limits.cpu = metadata.Limits.CPU;
                }
                if ("Memory" in metadata.Limits) {
                    limits.memory = metadata.Limits.Memory * BYTES_PER_MB;
                }
            }
        });
    });
}

function get(parents) {
    if (limits) {
        const parentTotal = getParentTotal(parents);
        return {
            metadata,
            cpu: {
                total: Math.min(parentTotal.cpu, limits.cpu || Infinity),
            },
            memory: {
                total: Math.min(parentTotal.memory, limits.memory || Infinity),
            },
        };
    }
    return null;
}

module.exports = {
    get,
};
