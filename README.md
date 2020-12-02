# NodeJS Process Stats

NodeJS library for collecting processor and memory stats for monitoring.

## Usage

```javascript
const stats = require("@twpol/process-stats");

let previousData = stats.get();

setInterval(function () {
  const data = stats.get(previousData);

  // Use the data as needed (see docs below)

  previousData = data;
}, 60000);
```

## Collected data

Data is organised for capturing into health metrics, so under each type there are `cpu` and `memory` stats, all expressed as fractions of the `total` value.

Types always have `cpu.total` and `memory.total`. Those which measure usage also always have `cpu.busy` and `memory.used`.

- `os` (operating system)
  - `uptime` (seconds)
  - `load` (three element array of floats)
  - `cpu`
    - `user` (fraction of usable processor time spent in user mode code)
    - `nice` (fraction of usable processor time spent in nice user mode code)
    - `sys` (fraction of usable processor time spent in kernel mode code)
    - `irq` (fraction of usable processor time spent in interrupt request handling code)
    - `busy` (fraction of usable processor time spent running code - sum of values above)
    - `idle` (fraction of usable processor time spent idle - opposite of `busy`)
    - `total` (usable processor time in logical cores)
  - `memory`
    - `used` (fraction of usable memory being used)
    - `free` (fraction of usable memory not being used - opposite of `used`)
    - `total` (usable memory in bytes)
- `awsTask` (current AWS EC2/Fargate task)
  - `metadata` (complete AWS EC2/Fargate V4 task metadata)
  - `cpu`
    - `total` (usable processor time in logical cores)
  - `memory`
    - `total` (usable memory in bytes)
- `awsContainer` (current AWS EC2/Fargate container)
  - `metadata` (complete AWS EC2/Fargate V4 container metadata)
  - `cpu`
    - `total` (usable processor time in logical cores)
  - `memory`
    - `total` (usable memory in bytes)
- `container` (current cgroup-based container)
  - `cpu`
    - `busy` (fraction of usable processor time spent running code - sum of values above)
    - `idle` (fraction of usable processor time spent idle - opposite of `busy`)
    - `total` (usable processor time in logical cores)
  - `memory`
    - `used` (fraction of usable memory being used)
    - `free` (fraction of usable memory not being used - opposite of `used`)
    - `total` (usable memory in bytes)
- `process` (current process)
  - `cpu`
    - `user` (fraction of usable processor time spent in user mode code)
    - `system` (fraction of usable processor time spent in kernel mode code)
    - `busy` (fraction of usable processor time spent running code - sum of values above)
    - `total` (usable processor time in logical cores)
  - `memory`
    - `external` (fraction of usable memory used by JavaScript runtime)
    - `heapTotal` (fraction of usable memory used by JavaScript runtime)
    - `heapUsed` (fraction of usable memory used by JavaScript runtime)
    - `rss` (fraction of usable memory being used)
    - `used` (fraction of usable memory being used - same as `rss`)
    - `total` (usable memory in bytes)
