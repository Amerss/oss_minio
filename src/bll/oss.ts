import * as OSS from "ali-oss";
import * as dotenv from "dotenv";
import * as path from "path";
import { IConfig, ListAll } from "src/types";
dotenv.config();

/**
 * OSS实例操作对象
 * @author 张震
 * @param client OSS
 * @param config OSS配置 做过滤
 */
export class OSSBll {
  // OSS实例
  private readonly ossClient: OSS;
  // 用于分页获取全部数据
  maker: string | null;
  // 过滤配置
  config: IConfig | null;

  constructor(client: OSS, config?: IConfig) {
    this.ossClient = client;
    this.maker = null;
    this.config = config ?? null;
  }

  /**
   * 列出所有bucket
   * @author 张震
   * @param query
   * @param options
   * @returns bucket列表
   */
  async listBuckets(
    query: OSS.ListBucketsQueryType | null = {},
    options?: OSS.RequestOptions
  ): Promise<any> {
    try {
      const result = await this.ossClient.listBuckets(query, options);
      return result;
    } catch (e) {
      return e;
    }
  }

  /**
   * 列出文件
   * @author 张震
   * @param query
   * @param options
   * @returns 文件列表 Promise<OSS.ListObjectResult>
   */
  async list(
    query: OSS.ListObjectsQuery | null = null,
    options?: OSS.RequestOptions
  ): Promise<OSS.ListObjectResult> {
    if (!query) query = Object.assign({}, { "max-keys": 100 });
    // 根据配置项获取文件列表
    if (this.config) {
      query["encoding-type"] = this.config["encoding-type"];
    }
    const result = await this.ossClient.list(query, options);
    return result;
  }

  /**
   * 用分页的方式列出所有文件
   * @author 张震
   * @param query ListObjectsQuery | null
   * @param options RequestOptions
   * @returns 所有文件信息 Promise<ListAll>
   */
  async listAll(
    query: OSS.ListObjectsQuery | null = null,
    options?: OSS.RequestOptions
  ): Promise<ListAll> {
    const defaultQuery: OSS.ListObjectsQuery = {
      "max-keys": 100,
      marker: this.maker,
    };
    // 合并默认查询和用户传入的查询
    const effectiveQuery = Object.assign({}, defaultQuery, query);
    // 获取文件列表
    let result: OSS.ListObjectResult = await this.ossClient.list(
      effectiveQuery,
      options
    );
    // 存储获取到的文件
    let allObjects: OSS.ObjectMeta[] = result.objects;
    // 如果有下一页，则继续获取
    while (result.isTruncated) {
      this.maker = result.nextMarker;
      effectiveQuery.marker = this.maker; // 更新effectiveQuery
      result = await this.ossClient.list(effectiveQuery, options);
      allObjects.push(...result.objects);
    }
    // 根据配置项获取文件
    if (this.config && this.config.suffix && this.config.suffix.length > 0) {
      allObjects = allObjects.filter((item: OSS.ObjectMeta) => {
        let suffix = path.extname(item.name).toLowerCase();
        return this.config.suffix.includes(suffix);
      });
    }
    if (this.config && this.config.prefix && this.config.prefix.length > 0) {
      allObjects = allObjects.filter((item: OSS.ObjectMeta) =>
        this.config.prefix.some((prefix) => item.name.includes(prefix))
      );
    }
    return {
      objects: allObjects,
      prefixes: result.prefixes,
      isTruncated: false, // 已经遍历完所有文件，此处为false
    };
  }

  /**
   * 下载文件流
   * @author 张震
   * @param objectName string 文件名
   * @param options  OSS.GetStreamOptions
   * @returns 文件流信息 Promise<OSS.GetStreamResult>
   */
  async getStream(
    objectName: string,
    options?: OSS.GetStreamOptions
  ): Promise<OSS.GetStreamResult> {
    try {
      const result = await this.ossClient.getStream(objectName, options);
      return result;
    } catch (error) {
      console.error(`Failed to download ${objectName}:`, error);
    }
  }
}

/**
 * 创建OSSBll实例
 * @author 张震
 * @param options Partial<OSS.Options> OSS配置项
 * @param config IConfig 文件导出配置项
 * @returns OSSBll实例
 */
export const createOSSBll = (
  options?: Partial<OSS.Options>,
  config?: IConfig
) => {
  const defaultOptions = {
    region: process.env.OSS_REGION,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET,
  };
  options && Object.assign(defaultOptions, options);
  const ossClient = new OSS(defaultOptions);
  return new OSSBll(ossClient, config);
};
