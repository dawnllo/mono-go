#!/usr/bin/env node
'use strict';

var process = require('node:process');
var path = require('node:path');
var fs = require('node:fs');
var node_buffer = require('node:buffer');
var vite = require('vite');
var chalk = require('chalk');
var prompts = require('prompts');
require('ora');

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

async function confirm(message) {
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
  const step1 = await confirm(confirmMsg);
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
    const targetPath = path.resolve(process.cwd(), name);
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
  confirm,
  text,
  list,
  autoMultiselect,
  confirm_text,
  repeat_confirm_text: repeatFactory(),
  repeatFactory
};

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

const CNONFIG_FILE_LIST = ["dlc.config.ts", "dlc.config.js"];
const defualtParse = async (path2, data) => {
  return [node_buffer.Buffer.from(data.content, "base64"), "utf-8"];
};
const defaultConfig = {
  root: ".",
  rootResolvePath: "",
  // 运行时,init 绝对路径
  file: {
    // 文件下载/操作相关
    removeWhitePath: [],
    downloadRelativePath: ".",
    parse: defualtParse
    // 内容解析函数
  },
  git: {
    owner: "Dofw",
    repo: "vs-theme",
    pafg_token: "",
    defaultBranch: "main"
  }
};
async function getRootPath() {
  const packageName = "package.json";
  let curCwdPath = process.cwd();
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
const initConfig = errorWrapper(async () => {
  const result = await getRootPath();
  if (!result)
    throw new Error(log._red("config file not found"));
  const { rootResolvePath, configFileName } = result;
  const configFileResolvePath = path.join(rootResolvePath, configFileName);
  let mergeConfig = {};
  if (fs.existsSync(configFileResolvePath)) {
    const loadParams = {
      configEnv: {},
      configFile: configFileResolvePath,
      configRoot: rootResolvePath || process.cwd()
    };
    const loadResult = await vite.loadConfigFromFile(loadParams.configEnv, loadParams.configFile, loadParams.configRoot);
    mergeConfig = Object.assign(defaultConfig, loadResult?.config);
  } else {
    mergeConfig = defaultConfig;
  }
  console.log("mergeConfig", mergeConfig);
  file.init(mergeConfig);
  http.init(mergeConfig);
  errorInit();
  return mergeConfig;
});

function defineConfig(config) {
  return config;
}
(async () => {
  await initConfig();
})();

exports.defineConfig = defineConfig;
