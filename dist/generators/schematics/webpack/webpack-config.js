"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWebpackConfig = void 0;
var webpack_host_config_1 = require("./webpack-host.config");
var webpack_remote_config_1 = require("./webpack-remote.config");
function generateWebpackConfig(config, isHost) {
    if (isHost === void 0) { isHost = false; }
    console.log('LEGO AL CONG', config);
    if (isHost) {
        return webpack_host_config_1.webpackHostConfigTemplate.replace(/{{projectName}}/g, config.projectName.toString());
    }
    return webpack_remote_config_1.webpackRemoteConfigTemplate.replace(/{{projectName}}/g, config.projectName.toString());
}
exports.generateWebpackConfig = generateWebpackConfig;
//# sourceMappingURL=webpack-config.js.map