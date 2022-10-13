import os from "os";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

/**
 * 判断path指的对象
 * @param input input path
 * @return dir、file、other、false
 */
export const exists = async (input) => {
  try {
    const stat = await fs.promises.stat(input);
    if (stat.isDirectory()) {
      return "dir";
    } else if (stat.isFile()) {
      return "file";
    } else {
      return "other";
    }
  } catch (err) {
    if (err.code !== "ENOENT") { //enoent 文件或目录不存在。
      throw err;
    }
    return false;
  }
};

export const isFile = async (input)=> {
  const result = await exists(input);
  return result === "file";
};

export const isDirectory = async (input) => {
  const result = await exists(input);
  return result === "dir";
};

export const isEmpty = async (input) => {
  const files = await fs.promises.readdir(input);
  return files.length === 0;
};


//********************************以下待了解 */
/**
 * Make directory recursive.
 * require node >= v10.12
 * @param input input path
 * @param options recursive by default
 */
export const mkdir = async (
  input,
  options
) => {
  await fs.promises.mkdir(input, { recursive: true, ...options });
};

/**
 * Remove input dir or file. recursive when dir
 * require node >= v14.14.0
 * @param input input path
 * @param options recursive & force by default
 * @todo https://github.com/sindresorhus/trash
 */
export const remove = async (
  input,
  options
) => {
  await fs.promises.rm(input, { recursive: true, force: true, ...options });
};

/**
 * Read file as a buffer.
 * @param input file name
 */
export const read = async (input) => {
  return await fs.promises.readFile(input);
};

/**
 * Write file with mkdir recursive.
 * @param input file name
 * @param contents file contents
 */
export const write = async (
  input,
  contents
) => {
  await mkdir(path.dirname(input));
  return await fs.promises.writeFile(input, contents);
};

/**
 * Detect buffer is binary.
 * @param input buffer
 */
export const isBinary = (input) => {
  // Detect encoding
  // 65533 is the unknown char
  // 8 and below are control chars (e.g. backspace, null, eof, etc)
  return input.some((item) => item === 65533 || item <= 8);
};

/**
 * Tildify absolute path.
 * @param input absolute path
 * @see https://github.com/sindresorhus/tildify
 */
export const tildify = (input) => {
  const home = os.homedir();

  // https://github.com/sindresorhus/tildify/issues/3
  input = path.normalize(input) + path.sep;

  if (input.indexOf(home) === 0) {
    input = input.replace(home + path.sep, `~${path.sep}`);
  }

  return input.slice(0, -1);
};

/**
 * Untildify tilde path.
 * @param input tilde path
 * @see https://github.com/sindresorhus/untildify
 */
export const untildify = (input) => {
  const home = os.homedir();

  input = input.replace(/^~(?=$|\/|\\)/, home);

  return path.normalize(input);
};

/**
 * Extract zip file.
 * @param input input path or stream
 * @param output output path
 * @param strip strip output path
 * @see https://github.com/shinnn/node-strip-dirs
 */
export const extract = async (
  input,
  output,
  strip = 0
) =>
  await new Promise((resolve) => {
    const zip = new AdmZip(input);

    strip === 0 ||
      zip.getEntries().forEach((entry) => {
        const items = entry.entryName.split(/\/|\\/);
        const start = Math.min(strip, items.length - 1);
        const stripped = items.slice(start).join("/");
        entry.entryName = stripped === "" ? entry.entryName : stripped;
      });

    // https://github.com/cthackers/adm-zip/issues/389
    // https://github.com/cthackers/adm-zip/issues/407#issuecomment-990086783
    // keep original file permissions
    zip.extractAllToAsync(output, true, true, (err) => {
      /* istanbul ignore if */
      if (err != null) throw err;
      resolve();
    });
  });
