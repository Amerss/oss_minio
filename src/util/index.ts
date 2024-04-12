import * as path from "path";
import * as fs from "fs";
import { IConfig } from "../types/index";

/**
 * 获取过滤器配置
 * @author 张震
 * @returns IConfig | IConfig[] | null
 */
export const getFilterConfig = (): IConfig | IConfig[] | null => {
  try {
    const rootDir = findRootDir(__dirname);
    const filePath = path.join(rootDir, "filter.config.json");
    let configJson: string = fs.readFileSync(filePath, "utf-8");
    const config: IConfig | IConfig[] = JSON.parse(configJson);
    if (
      Array.isArray(config) ||
      (typeof config === "object" && config !== null)
    ) {
      return config;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * 获取根目录路径
 * @author 张震
 * @returns string 根目录路径
 */
export const findRootDir = (currentDir: string): string => {
  const packageJsonPath = path.join(currentDir, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    return currentDir;
  }
  const parentDir = path.dirname(currentDir);
  if (parentDir === currentDir) {
    throw new Error("Could not find project root directory");
  }
  return findRootDir(parentDir);
};
