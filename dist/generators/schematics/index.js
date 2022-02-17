"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitovi = void 0;
var webpack_1 = require("./webpack");
var remotesRegex = /remotes[:\s{\tA-Za-z0-9\'\"\/\n.]{1,}}/;
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function bitovi(_options) {
    return function (tree, _context) {
        // if port exists, is remote app
        // add webpack config for module federation
        if (_options.port) {
            // Add remotes to host
            if (_options.addRemote) {
                var webpackConfig = tree.get('webpack.config.js').content.toString();
                var remotes = webpackConfig
                    .match(remotesRegex)[0]
                    .replace(/remotes[\s\t\n]{0,}:/, '')
                    .replace(/[\n\s\t]/g, '');
                var newRemotes = JSON.parse(remotes) === '{}' ? {} : JSON.parse(remotes);
                newRemotes[_options.projectName] = "http://localhost:".concat(_options.port, "/remoteEntry.js");
                var newConfig = webpackConfig.replace(remotesRegex, "remotes: ".concat(JSON.stringify(newRemotes)));
                tree.overwrite('webpack.config.js', newConfig);
                // add remote module declarations
                var moduleDeclaration = "declare module '".concat(_options.projectName, "/Module';");
                if (tree.exists('src/decl.d.ts')) {
                    var oldDeclarations = tree.get('src/decl.d.ts').toString();
                    oldDeclarations += "\n ".concat(moduleDeclaration);
                    tree.overwrite('src/decl.d.ts', oldDeclarations);
                }
                else {
                    tree.create('src/decl.d.ts', moduleDeclaration);
                }
                return tree;
            }
            tree.create('webpack.config.js', (0, webpack_1.generateWebpackConfig)({
                port: _options.port,
                projectName: _options.projectName,
            }));
        }
        if (_options.host) {
            tree.create('webpack.config.js', (0, webpack_1.generateWebpackConfig)({ port: 4200, projectName: _options.projectName }, true));
        }
        // add webpack prod config
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