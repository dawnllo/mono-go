#!/usr/bin/env node
import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import process, { cwd } from 'node:process';
import prompts from 'prompts';
import ora from 'ora';
import { Buffer } from 'node:buffer';
import { loadConfigFromFile } from 'vite';

const colors = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "gray",
  "redBright",
  "greenBright",
  "yellowBright",
  "blueBright",
  "magentaBright",
  "cyanBright",
  "whiteBright",
  // bg
  "bgBlack",
  "bgRed",
  "bgGreen",
  "bgYellow",
  "bgBlue",
  "bgMagenta",
  "bgCyan",
  "bgWhite",
  "bgBlackBright",
  "bgRedBright",
  "bgGreenBright",
  "bgYellowBright",
  "bgBlueBright",
  "bgMagentaBright",
  "bgCyanBright",
  "bgWhiteBright"
];
const log = {};
colors.forEach((item) => {
  log[item] = (...strs) => {
    console.log(chalk[item](...strs));
  };
});
colors.forEach((item) => {
  log[`_${item}`] = chalk[item];
});

var ERROR_TYPE_ENUM;
(function(ERROR_TYPE_ENUM2) {
  ERROR_TYPE_ENUM2["HTTP"] = "git_http_error";
  ERROR_TYPE_ENUM2["SYNTAX"] = "syntax_error";
})(ERROR_TYPE_ENUM || (ERROR_TYPE_ENUM = {}));
let DLCHttpError$1 = class DLCHttpError extends Error {
  constructor(type, message) {
    super(message);
    this.type = type;
  }
};
function errorInit() {
  globalThis.DLCHttpError = DLCHttpError$1;
}
function handlerHttpError(error) {
  log.red(`gitApi request error: ${error.message}`);
}
const errorHandler = {
  [ERROR_TYPE_ENUM.HTTP]: handlerHttpError,
  [ERROR_TYPE_ENUM.SYNTAX]: handlerHttpError
};
function errorWrapper(fn) {
  return async function(...args) {
    try {
      return await fn.apply(this, args);
    } catch (error) {
      if (typeof error === "string")
        log.red(error);
      else if (errorHandler[error.type])
        errorHandler[error.type]?.(error);
      else
        log.red(error);
      process.exit(0);
    }
  };
}

var GitFetchEnum;
(function(GitFetchEnum2) {
  GitFetchEnum2["branches"] = "branches";
  GitFetchEnum2["contents"] = "contents";
  GitFetchEnum2["trees"] = "trees";
  GitFetchEnum2["blobs"] = "blobs";
})(GitFetchEnum || (GitFetchEnum = {}));
const gitConfig = {};
function init$1(configFile) {
  const dclUserConfigGitOption = configFile.git;
  Object.keys(gitConfig).forEach((key) => {
    gitConfig[key] = dclUserConfigGitOption[key];
  });
}
const urlStrategy = {
  [GitFetchEnum.contents]: (option) => {
    const path = option.sha ? `${option.sha}` : "";
    const branch = option.branch || gitConfig.defaultBranch;
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/contents/${path}?ref=${branch}`;
  },
  [GitFetchEnum.branches]: () => {
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/branches`;
  },
  [GitFetchEnum.trees]: (option) => {
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/git/trees/${option.sha}${option.recursive ? "?recursive=1" : ""}`;
  },
  [GitFetchEnum.blobs]: (option) => {
    return `https://api.github.com/repos/${gitConfig.owner}/${gitConfig.repo}/git/blobs/${option.sha}`;
  }
};
async function git(option) {
  let url;
  const generate = urlStrategy[option.type];
  if (generate)
    url = generate(option);
  return await gitUrl(url);
}
async function gitUrl(url) {
  if (!url)
    throw new Error(log._red("urlStrategy not found, please check option.type!"));
  const options = new Request(url, {
    headers: {
      "User-Agent": "@dawnll/cli",
      "Accept": "application/vnd.github.v3+json",
      "authorization": `Bearer ${gitConfig.pafg_token}`
    }
  });
  const res = await fetch(options);
  const json = await res.json();
  if (json.message)
    throw new DLCHttpError(ERROR_TYPE_ENUM.HTTP, json.message);
  return json;
}
const http = {
  init: init$1,
  git,
  gitUrl
};

const fileConfig = {};
function init(configFile) {
  const dlcFileConfig = configFile.file;
  Object.keys(fileConfig).forEach((key) => {
    fileConfig[key] = dlcFileConfig[key];
  });
}
async function writeFileSync(input, restParams) {
  if (fs.existsSync(input)) {
    const repeat_confirm_text = pro.repeatFactory(log._red(`file already exists, rename?`));
    const result = await repeat_confirm_text(input);
    if (result.confirm && result.name)
      input = pathRename(input, result.name);
    else
      throw new Error("file already exists, exit!!!");
  }
  const dir = path.dirname(input);
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(input, ...restParams);
  return input;
}
function pathRename(input, name) {
  const extname = path.extname(input);
  const newFilePath = path.join(path.dirname(input), name + extname);
  return newFilePath;
}
async function rmSyncFile(input) {
  if (!rmSyncValidate(input))
    return;
  let promptResult = {
    confirm: false
  };
  promptResult = await pro.confirm(log._red(`delete file or directory, ${input}?`));
  if (fs.statSync(input).isDirectory()) {
    const curDirFiles = fs.readdirSync(input);
    if (curDirFiles.length > 0)
      promptResult = await pro.confirm(log._red(`directory is not empty, confirm delete?`));
  }
  promptResult.confirm && fs.rmSync(input, { recursive: true });
  log.green("delete success");
}
async function rmSyncEmptyDir(input) {
  if (!rmSyncValidate(input))
    return;
  if (!fs.statSync(input).isDirectory())
    return;
  const curDirFiles = fs.readdirSync(input);
  for (const file2 of curDirFiles) {
    const nextPath = path.join(input, file2);
    if (fs.statSync(nextPath).isDirectory())
      await rmSyncEmptyDir(nextPath);
  }
  if (curDirFiles.length === 0)
    return fs.rmSync(input);
}
function rmSyncValidate(input) {
  const whiteList = fileConfig.removeWhitePath;
  let isPass = false;
  for (const white of whiteList) {
    if (input.startsWith(white)) {
      isPass = true;
      break;
    }
  }
  if (!isPass) {
    log._red("file path not in whiteList, exit!!!");
    return false;
  }
  if (!fs.existsSync(input))
    return false;
  return true;
}
const file = {
  init,
  writeFileSync,
  rmSyncFile,
  rmSyncEmptyDir,
  pathRename
};

async function confirm$1(message) {
  message = message || `file or directory already exists, rename?`;
  return await prompts({
    type: "toggle",
    name: "confirm",
    message: log._yellow(message),
    initial: false,
    active: "yes",
    inactive: "no"
  });
}
async function text(message) {
  message = message || "please input";
  return await prompts({
    type: "text",
    name: "name",
    validate(input) {
      return !input ? log._yellow("name is required") : true;
    },
    message
  });
}
async function list(validate, message) {
  message = message || log._yellow(`input rename and must separate with comma!`);
  validate = validate || (() => true);
  return await prompts({
    type: "list",
    name: "names",
    separator: ",",
    message,
    validate
  });
}
async function autoMultiselect(choices, message, suggest, onState) {
  suggest = suggest || (async (input, choices2) => {
    return choices2.filter((choice) => {
      return choice.title.toLowerCase().includes(input.toLowerCase());
    });
  });
  onState = onState || (() => {
    log.green("--onState--");
  });
  message = message || "please select";
  return await prompts({
    type: "autocompleteMultiselect",
    name: "selects",
    initial: 0,
    limit: 100,
    optionsPerPage: 100,
    fallback: "no match!",
    instructions: false,
    message,
    choices,
    suggest,
    onState
  });
}
async function confirm_text(confirmMsg, textMsg) {
  const step1 = await confirm$1(confirmMsg);
  const step2 = step1.confirm ? await text(textMsg) : { name: "" };
  return {
    ...step1,
    ...step2
  };
}
function repeatFactory(confirmMsg, textMsg) {
  const initAnswer = {
    confirm: false,
    isRenamed: false,
    name: ""
  };
  return async function repeat_confirm_text(name, count = 0) {
    const dirname = path.dirname(name);
    const extname = path.extname(name);
    const basename = path.basename(name, extname);
    const targetPath = path.resolve(cwd(), name);
    const isExist = fs.existsSync(targetPath);
    if (!isExist) {
      return {
        confirm: true,
        isRenamed: count !== 0,
        // 大于0代表: 已经重命名且不存在
        name: basename
      };
    }
    let answer = {
      confirm: false,
      name: ""
    };
    answer = await confirm_text(confirmMsg, textMsg);
    if (answer.confirm && answer.name) {
      const newName = path.join(dirname, answer.name + extname);
      count++;
      return await repeat_confirm_text(newName, count);
    }
    return initAnswer;
  };
}
const pro = {
  confirm: confirm$1,
  text,
  list,
  autoMultiselect,
  confirm_text,
  repeat_confirm_text: repeatFactory(),
  repeatFactory
};

function oneLayerCatalog(data, type) {
  if (!data)
    return [];
  const urlKey = type === GitFetchEnum.contents ? "git_url" : "url";
  const catalog = [];
  for (const item of data) {
    const ele = {
      path: item.path,
      url: item[urlKey],
      type: type === GitFetchEnum.contents ? item.type : item.type === "tree" ? "dir" : "file",
      size: item.size,
      sha: item.sha
    };
    catalog.push(ele);
  }
  return catalog;
}
let treeLevel = 0;
async function treeLayerCatalog(data, type, level) {
  const oneLayer = oneLayerCatalog(data, type);
  treeLevel++;
  try {
    for (let i = 0; i < oneLayer.length; i++) {
      const element = oneLayer[i];
      if (element.type === "dir" && (!level || treeLevel < level)) {
        const json = await http.gitUrl(element.url);
        oneLayer[i].children = await treeLayerCatalog(json.tree, GitFetchEnum.trees, level);
        oneLayer[i].children = oneLayer[i].children?.map((item) => {
          return {
            ...item,
            relativeInputPath: path.join(element.path, item.path)
          };
        });
      }
    }
  } finally {
    treeLevel--;
  }
  return oneLayer;
}
async function fileBlob(catalogItem, configFile, parse) {
  const { url, path: itemPath } = catalogItem;
  const downloadRelativeDest = path.join(configFile.file.downloadRelativeDest, itemPath);
  const spinner = ora(log._green(downloadRelativeDest)).start();
  const data = await http.gitUrl(url);
  spinner.stop();
  const filePath = path.resolve(cwd(), downloadRelativeDest);
  const restParams = await parse(filePath, data);
  let finishPath;
  try {
    finishPath = await file.writeFileSync(filePath, restParams);
  } catch (error) {
    throw new Error("writeFileSync error.");
  }
  spinner.succeed(log._green(`${downloadRelativeDest}, success.`));
  return finishPath;
}
let _level = 0;
async function recursiveFileBlob(catalogItem, configFile, parse) {
  _level++;
  const finishPaths = [];
  const { sha, path: path2 } = catalogItem;
  try {
    const config = {
      type: GitFetchEnum.trees,
      sha
    };
    const json = await http.git(config);
    const catalog = oneLayerCatalog(json.tree, GitFetchEnum.trees);
    for (const item of catalog) {
      item.path = `${path2}/${item.path}`;
      if (item.type === "file") {
        const finish = await fileBlob(item, configFile, parse);
        finishPaths.push(finish);
      } else if (item.type === "dir") {
        const finishs = await recursiveFileBlob(item, configFile, parse);
        finishPaths.push(...finishs);
      }
    }
  } catch (error) {
    for (const filePath of finishPaths)
      await file.rmSyncFile(`${filePath}`);
    await file.rmSyncEmptyDir(path2);
    log.white("-- quit --");
    if (_level > 1)
      throw new Error("download trees error.");
  } finally {
    _level--;
  }
  return finishPaths;
}
const download = {
  fileBlob,
  recursiveFileBlob,
  oneLayerCatalog,
  treeLayerCatalog
};

async function oraWrapper(cb, param, start = log._yellow("loading..."), end = log._green("success")) {
  const spinner = ora(start).start();
  let result;
  cb && (result = await cb(param));
  spinner.succeed(end);
  return result;
}

function repeatEmptyStr(num) {
  let str = "";
  for (let i = 0; i < num; i++)
    str += " ";
  return str;
}
const tools = {
  repeatEmptyStr
};

class MiddleWare {
  constructor() {
    this.queues = [];
    this.iterator = null;
  }
  construction() {
  }
  use(fn) {
    if (typeof fn !== "function")
      throw new Error("param must be a function");
    this.queues.push(fn.bind(this));
    return this;
  }
  async run(context) {
    this.context = context;
    this.iterator = this.generator();
    let result = this.iterator.next();
    const handlerResult = async () => {
      if (result.done)
        return;
      const res = result.value(this.context);
      if (res && typeof res.then === "function") {
        try {
          await res;
          result = this.iterator.next();
          await handlerResult();
        } catch (error) {
          result = this.iterator.throw(error);
          await handlerResult();
        }
      } else {
        result = this.iterator.next();
        handlerResult();
      }
    };
    await handlerResult();
  }
  cancel(str = "cancel", color = "yellow") {
    if (this.iterator) {
      log[color](str);
      return this.iterator.return("cancel");
    } else {
      throw new Error("not execute run !");
    }
  }
  *generator() {
    const queues = this.queues;
    for (let i = 0; i < queues.length; i++) {
      const fn = queues[i];
      yield fn;
    }
    return "done";
  }
}

async function load(_ctx) {
  const { answers: { confirm }, args: [path, branch], configFile } = _ctx;
  const { parse } = configFile.file;
  let newPath = path;
  if (confirm.isRenamed)
    newPath = file.pathRename(path, confirm.name);
  const config = {
    type: GitFetchEnum.contents,
    sha: newPath,
    branch
  };
  await oraWrapper(async () => {
    const json = await http.git(config);
    if (json.type === "file") {
      console.log("json", json);
      const downloadRelativeDest = path.join(configFile.file.downloadRelativeDest, newPath);
      const filePath = path.resolve(cwd(), downloadRelativeDest);
      await file.writeFileSync(filePath, [json.content]);
    } else {
      const arrs = download.oneLayerCatalog(json, GitFetchEnum.contents);
      for (const fileOption of arrs)
        await dowanloadFunc(fileOption, configFile, parse);
    }
  });
}
async function dowanloadFunc(fileOption, configFile, parse) {
  const { type } = fileOption;
  if (type === "file") {
    await download.fileBlob(fileOption, configFile, parse);
    return;
  }
  if (type === "dir")
    await download.recursiveFileBlob(fileOption, configFile, parse);
}

async function confirm(ctx) {
  const { args: [path] } = ctx;
  const answer = await pro.repeat_confirm_text(path);
  if (!answer.confirm)
    this.cancel();
  ctx.answers.confirm = answer;
}

const app = new MiddleWare();
app.use(confirm).use(load);
async function addAction(configFile, _args) {
  const [path] = _args;
  if (!path)
    throw new Error(chalk.red("Missing require argument: `tempalte`."));
  const context = {
    args: _args,
    answers: {
      confirm: {
        confirm: false,
        isRenamed: false,
        name: ""
      }
    },
    configFile
  };
  await app.run(context);
}
var addAction$1 = errorWrapper(addAction);

let coutLevel = 0;
async function getListAction(configFile, _args) {
  const [repPath, branch, { level }] = _args;
  const config = {
    type: GitFetchEnum.contents,
    sha: repPath,
    branch
  };
  const catalog = await oraWrapper(async () => {
    const json = await http.git(config);
    console.log(json);
    return await download.treeLayerCatalog(json, GitFetchEnum.contents, +level);
  });
  const choices = mapChoices(catalog, level);
  const suggest = async (input, choices2) => {
    return choices2.filter((choice) => {
      return choice.title.toLowerCase().includes(input.toLowerCase());
    });
  };
  const { selects } = await pro.autoMultiselect(choices, `show ${level} layer catalog.`, suggest);
  const selects2 = selects || [];
  if (selects2.length === 0)
    return;
  log.yellow(`note: the path is relative to root of repository. selected:`);
  for (let i = 0; i < selects2.length; i++) {
    const element = selects2[i];
    log.green(element.relativeInputPath);
  }
}
function mapChoices(data, level) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    const markStr = element.type === "dir" ? "\u{1F4C2}" : "\u{1F4C4}";
    const relativeInputPath = element.relativeInputPath ? element.relativeInputPath : element.path;
    result.push({
      title: `${tools.repeatEmptyStr(coutLevel * 3)}${markStr} ${element.path}`,
      value: {
        path: element.path,
        type: element.type,
        relativeInputPath
      }
    });
    if (element.children && coutLevel < level - 1) {
      coutLevel++;
      const childResult = mapChoices(element.children, level);
      coutLevel--;
      result.push(...childResult);
    }
  }
  return result;
}
var getListAction$1 = errorWrapper(getListAction);

const CNONFIG_FILE_LIST = ["dlc.config.ts", "dlc.config.js"];
const defualtParse = async (path2, data) => {
  const content = Buffer.from(data.content, "base64");
  return [content, "utf-8"];
};
const defaultConfig = {
  rootResolvePath: "",
  // 运行时,init 绝对路径
  file: {
    removeWhitePath: [],
    // 删除白名单
    downloadRelativeDest: ".",
    // 目标文件夹
    parse: defualtParse
    // 内容解析函数
  },
  // git 为必填项，这里处理用户字段合理性需要。
  git: {
    owner: "Dofw",
    repo: "vs-theme",
    pafg_token: "",
    defaultBranch: "main"
  }
};
async function getRootPath() {
  const packageName = "package.json";
  let curCwdPath = cwd();
  for (const element of CNONFIG_FILE_LIST) {
    while (curCwdPath) {
      const configFile = path.join(curCwdPath, element);
      const packFile = path.join(curCwdPath, packageName);
      if (fs.existsSync(configFile) && fs.existsSync(packFile))
        return { rootResolvePath: curCwdPath, configFileName: element };
      if (curCwdPath === path.dirname(curCwdPath))
        return void 0;
      curCwdPath = path.dirname(curCwdPath);
    }
  }
}
function normalizeConfigPath(mergeConfig2, rootResolvePath) {
  mergeConfig2.rootResolvePath = rootResolvePath;
  if (!mergeConfig2.file.removeWhitePath && !Array.isArray(mergeConfig2.file.removeWhitePath))
    throw new Error(log._red("removeWhitePath must be string array"));
  mergeConfig2.file.removeWhitePath = mergeConfig2.file.removeWhitePath.map((item) => {
    if (typeof item !== "string")
      throw new Error(log._red("removeWhitePath must be string array"));
    return path.resolve(rootResolvePath, item);
  });
}
function checkGitConfig(config) {
  if (!config.git)
    throw new Error(log._red("git config is not complete"));
  const keys = Object.keys(defaultConfig.git);
  keys.forEach((key) => {
    if (!config.git[key])
      throw new Error(log._red(`${key} is require key in config.git`));
  });
}
function mergeConfig(defaultConfig2, inputConfig) {
  inputConfig = inputConfig || {};
  const keys = Object.keys(defaultConfig2);
  const configKeys = Object.keys(inputConfig);
  configKeys.forEach((key) => {
    if (!keys.includes(key))
      throw new Error(log._red(`${key} is invalid key in config`));
    if (typeof inputConfig[key] === "object") {
      inputConfig[key] = mergeConfig(defaultConfig2[key], inputConfig[key]);
    }
  });
  const result = Object.assign(defaultConfig2, inputConfig);
  return result;
}
const initConfig = errorWrapper(async () => {
  const result = await getRootPath();
  if (!result)
    throw new Error(log._red("current cwd not found config file dlc.config.ts or dlc.config.js!!"));
  const { rootResolvePath, configFileName } = result;
  const configFileResolvePath = path.join(rootResolvePath, configFileName);
  if (!fs.existsSync(configFileResolvePath))
    throw new Error(log._red("config file not found!!"));
  let config = {};
  const loadParams = {
    configEnv: {},
    configFile: configFileResolvePath,
    configRoot: rootResolvePath || cwd()
  };
  const loadResult = await loadConfigFromFile(loadParams.configEnv, loadParams.configFile, loadParams.configRoot);
  const inputConfig = loadResult?.config;
  checkGitConfig(inputConfig);
  config = mergeConfig(defaultConfig, inputConfig);
  normalizeConfigPath(config, rootResolvePath);
  file.init(config);
  http.init(config);
  errorInit();
  return config;
});

function defineConfig(config) {
  return config;
}
(async () => {
  const config = await initConfig();
  const gitConfig = config.git;
  const dlc = new Command();
  dlc.name("dlc-cli").description("study build myself Cli Tool !").version("0.0.1");
  dlc.command("add").argument("<path>", "file or directory path of template repository.").argument("[branch]", "branch to use", gitConfig.defaultBranch).description("add template").action((...args) => {
    addAction$1(config, args);
  });
  dlc.command("list-remote").argument("[path]", "path to use", "").argument("[branch]", "branch to use", gitConfig.defaultBranch).option("-l, --level <num>", "level layer of catalog ", "3").description("view the remote template list").action((...args) => {
    getListAction$1(config, args);
  });
  dlc.parse();
})();

export { defineConfig };
