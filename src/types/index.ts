import OSS from "ali-oss";

/**
 * 过滤配置
 */
export interface IConfig {
  /**
   * bucket name
   */
  name?: string;
  /**
   * 文件后缀名
   */
  suffix?: string[];
  /**
   * 前缀搜索
   */
  prefix?: string[];
  /**
   * 搜索类型
   */
  "encoding-type"?: "url" | "";
  /**
   * 正则表达式
   */
  regular?: string[];
}

/**
 * 获取所有文件的返回类型
 */
export interface ListAll {
  /**
   * 所有文件
   */
  objects: OSS.ObjectMeta[];
  /**
   * 前缀
   */
  prefixes: string[];
  /**
   * 是否全部获取
   */
  isTruncated: boolean;
}
