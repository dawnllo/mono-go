import path from "path";
import chalk from "chalk";
import * as file from "../core/file.js";
import config from "../core/config.js";

/**
 * 解析template, remote or local
 * @param {*} ctx 上下文
 */
export default async function parse(ctx) {
  const local = await isLocal(ctx.template);
  if (local) {
    ctx.url = local;
    return;
  }

  // const remote = isRemote(ctx.template);
  // if (remote) {
  //   return;
  // }

  throw new Error(
    chalk.red("ctx.template, is not comply with the rules of Local or Remote. ")
  );
}

/**
 * 是否是local
 * @param {*} template
 * @returns dir or false
 * @example
 * 1. relative path, e.g. './foo', '../foo'
 * 2. absolute path, e.g. '/foo', 'C:\\foo'
 * 3. tildify path in windows, e.g. '~/foo'
 */
async function isLocal(template) {
  if (!/^[./]|^[a-zA-Z]:|^~[/\\]/.test(template)) {
    return false;
  }

  const localStr = path.resolve(file.untildify(template));
  const type = await file.exists(localStr);

  //暂考虑dir
  if (type === "dir") {
    return localStr;
  } else {
    throw new Error(
      `Local template not found: \`${template}\` is not a directory`
    );
  }
}

/**
 * 是否是remote
 * @param {*} template
 * 1. short name, e.g. 'nm'
 * 2. full name, e.g. 'zce/nm'
 * 3. with branch, e.g. 'zce/nm#next'
 * 4. full url, e.g. 'https://github.com/zce/nm/archive/master.zip'
 */
function isRemote(template) {
  if (/^https?:/.test(input)) return input;

  const [fullname, maybeBranch] = input.split("#");
  const [maybeOwner, maybeName] = fullname.split("/");

  const isEmpty = (input) => input == null || input === "";

  const branch = isEmpty(maybeBranch) ? config.branch : maybeBranch;
  const name = isEmpty(maybeName) ? maybeOwner : maybeName;
  const owner = isEmpty(maybeName) ? config.official : maybeOwner;

  return true;
}
