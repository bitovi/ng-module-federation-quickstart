"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNewWorkspace = void 0;
var child_process_1 = require("child_process");
var gitignore_1 = __importDefault(require("gitignore"));
var util_1 = require("util");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var process_1 = __importDefault(require("process"));
var templates_1 = require("./templates");
var writeGitignore = (0, util_1.promisify)(gitignore_1.default.writeFile);
function generateNewWorkspace(initOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var projectPath, goToWorkspace, createMainApp, gitInit, filesFromVsCode, _i, filesFromVsCode_1, fileFromVsCode;
        return __generator(this, function (_a) {
            projectPath = path_1.default.join(process_1.default.cwd(), initOptions.projectName);
            fs_1.default.mkdirSync(path_1.default.join(projectPath));
            fs_1.default.mkdirSync(path_1.default.join("".concat(projectPath), 'apps'));
            goToWorkspace = "cd ".concat(projectPath, "/apps");
            createMainApp = "ng new ".concat(initOptions.projectName, " --routing --style=").concat(initOptions.style, " --skip-git --skip-install");
            gitInit = "cd ".concat(projectPath, " && git init");
            (0, child_process_1.execSync)("".concat(goToWorkspace, " && ").concat(createMainApp, " && ").concat(gitInit));
            try {
                fs_1.default.copyFileSync(path_1.default.join(projectPath, "apps/".concat(initOptions.projectName, "/package.json")), path_1.default.join(projectPath, 'package.json'));
            }
            catch (e) {
                console.error(e);
            }
            try {
                filesFromVsCode = fs_1.default.readdirSync(path_1.default.join(projectPath, "apps/".concat(initOptions.projectName, "/.vscode")));
                fs_1.default.mkdirSync(path_1.default.join(projectPath, ".vscode"));
                for (_i = 0, filesFromVsCode_1 = filesFromVsCode; _i < filesFromVsCode_1.length; _i++) {
                    fileFromVsCode = filesFromVsCode_1[_i];
                    fs_1.default.copyFileSync(path_1.default.join(projectPath, "apps/".concat(initOptions.projectName, "/.vscode/").concat(fileFromVsCode)), path_1.default.join(projectPath, ".vscode/".concat(fileFromVsCode)));
                }
            }
            catch (e) {
                console.error(e);
            }
            try {
                (0, child_process_1.execSync)("cd ".concat(projectPath, "/apps/").concat(initOptions.projectName, " && ng g @bitovi/bi:bi --projectName=").concat(initOptions.projectName, " --host"));
            }
            catch (e) {
                console.error(e);
            }
            /* 	try {
                execSync(`cd ${projectPath} && npm install`);
            } catch (e) {
                console.error(e);
            } */
            setBitoviConfigurationFile(initOptions.projectName, projectPath);
            createGitignore(projectPath);
            return [2 /*return*/];
        });
    });
}
exports.generateNewWorkspace = generateNewWorkspace;
function setBitoviConfigurationFile(projectName, projectPath) {
    var bitoviConfig = JSON.parse(templates_1.bitoviConfigTemplate);
    bitoviConfig.apps[projectName] = "apps/".concat(projectName);
    bitoviConfig.host = projectName;
    fs_1.default.writeFileSync(path_1.default.join(projectPath, 'bi.json'), JSON.stringify(bitoviConfig));
}
function createGitignore(targetDirectory) {
    return __awaiter(this, void 0, void 0, function () {
        var file;
        return __generator(this, function (_a) {
            file = fs_1.default.createWriteStream(path_1.default.join(targetDirectory, '.gitignore'), {
                flags: 'a',
            });
            writeGitignore({
                type: 'Node',
                file: file,
            });
            return [2 /*return*/];
        });
    });
}
//# sourceMappingURL=workspace.generator.js.map