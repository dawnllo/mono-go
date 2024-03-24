import path from "path";
import prompts from "prompts";
import chalk from "chalk";
import log from "../core/log.js";
import * as file from "../core/file.js";

/**
 * 确定文件目标
 * 存在：用户交互，是否重写、或取消重新输入。
 * 不存在：进行下一步。
 */
export default async (ctx, ware) => {
  ctx.dest = path.resolve(ctx.project);
  log.green(`目标文件:`, ctx.dest);

  // DOTO 磊哥封
  let stat = await file.exists(ctx.dest);
  if (!stat) return;
  if (stat === "file" || stat === "other")
    throw new Error(chalk.red(`Cannot create ${ctx.project}: File exists.`));

  // dir
  if (await file.isDirEmpty(ctx.dest)) return;

  // isCurrent
  const isCurrent = ctx.dest === process.cwd();

  // prompts
  const { choose, end } = await prompts([
    {
      name: "start",
      type: "confirm",
      message: isCurrent
        ? "Create in current directory?"
        : "Target directory already exists. Continue?",
    },
    {
      name: "choose",
      type: (prev) => {
        return prev ? "select" : null;
      },
      message: `${
        isCurrent ? "Current" : "Target"
      } directory is not empty. How to continue?`,
      hint: " ",
      choices: [
        { title: "Merge", value: "merge" },
        { title: "Overwrite", value: "overwrite" },
        { title: "Cancel", value: "cancel" },
      ],
    },
    {
      name: "end",
      type: (prev) => {
        return prev === "overwrite" ? "confirm" : null;
      },
      message: "are you sure to do?",
    },
  ]);

  // cancel
  if (choose == null || choose === "cancel") {
    ware.cancle("ok, you already canceled.");
  }

  // overwrite 3保险insurance
  if (end && ctx.options.force) {
    await file.remove(ctx.dest);
  } else {
    ware.cancle("Warn: if you sure overwrite, please add -f or --force.");
  }
};
