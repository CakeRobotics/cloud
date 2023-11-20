if (process.env.CONFIG === "local") {
    module.exports = require("./config.local");
}
else if (process.env.CONFIG === "arvan") {
    module.exports = require("./config.arvan");
}
else if (process.env.CONFIG === "arvan-docker") {
    module.exports = require("./config.arvan.docker");
} else {
    throw "Unsupported or undeined env.CONFIG.";
}
