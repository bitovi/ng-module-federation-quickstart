"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitovi = void 0;
var webpack_1 = require("./webpack");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function bitovi(_options) {
    return function (tree, _context) {
        if (_options.port) {
            tree.create('webpack.config.js', (0, webpack_1.generateWebpackConfig)({
                port: _options.port,
                projectName: _options.projectName,
            }));
        }
        if (_options.host) {
            tree.create('webpack.config.js', (0, webpack_1.generateWebpackConfig)({ port: 4200, projectName: _options.projectName }, true));
        }
        tree.create('webpack.prod.config.js', "module.exports = require('./webpack.config')");
        tree = removeNoNeededFiles(tree);
        return tree;
    };
}
exports.bitovi = bitovi;
function removeNoNeededFiles(tree) {
    tree.delete('package.json');
    tree.delete('.vscode');
    tree.delete('.gitignore');
    tree.delete('.editorconfig');
    return tree;
}
//# sourceMappingURL=index.js.map