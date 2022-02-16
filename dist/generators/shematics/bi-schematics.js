"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitovi = void 0;
var webpack_1 = require("./webpack");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function bitovi(_options) {
    return function (tree, _context) {
        console.log('El tree', tree);
        if (_options.port) {
            tree.create('webpack.config.js', (0, webpack_1.generateWebpackConfig)(_options.port));
        }
        return tree;
    };
}
exports.bitovi = bitovi;
//# sourceMappingURL=bi-schematics.js.map