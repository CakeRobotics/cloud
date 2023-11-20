const { NODE_HOSTNAMES_POOL } = require("../config");
const get = require("./openshift/get");

const getFreeDomain = async () => {
    // TODO: Freeze a domain after it is granted in order to avoid concurrency issues. (At least randomize the process)
    const activeRoutes = await get('routes');
    const takenDomains = activeRoutes.map(route => route['host/port']);
    const freeDomains = NODE_HOSTNAMES_POOL.filter(hostname => !takenDomains.includes(hostname));
    if (freeDomains.length == 0) {
        throw "No free domains available.";
    }
    return freeDomains[0];
}

module.exports = getFreeDomain;
