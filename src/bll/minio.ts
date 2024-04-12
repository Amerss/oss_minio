import * as Minio from "minio";
import * as dotenv from "dotenv";
import { Readable } from "stream";
dotenv.config();

/**
 * Minio实例操作对象
 * @author 张震
 * @param client Minio.Client
 */
export class MinioBll {
  private readonly minioClient: Minio.Client;

  constructor(client: Minio.Client) {
    this.minioClient = client;
  }

  /**
   * 判断桶是否存在
   * @author 张震
   * @param bucketName string 桶名称
   * @returns Promise<boolean>
   */
  async bucketExists(bucketName: string): Promise<boolean> {
    return await this.minioClient.bucketExists(bucketName);
  }

  /**
   * 创建桶
   * @author 张震
   * @param bucketName string 桶名称
   */
  async makeBucket(bucketName: string): Promise<void> {
    return await this.minioClient.makeBucket(bucketName);
  }

  /**
   * 上传文件
   * @author 张震
   * @param bucketName string 桶名称
   * @param objectName string 文件名
   * @param stream Readable 输入流
   */
  async putObject(
    bucketName: string,
    objectName: string,
    stream: Readable | Buffer | string
  ): Promise<void> {
    try {
      await this.minioClient.putObject(bucketName, objectName, stream);
    } catch (error) {
      console.error(
        `Failed to upload object ${objectName} to bucket ${bucketName}:`,
        error
      );
    }
  }

  /**
   * 判断文件是否存在
   * @author 张震
   * @param bucketName string 桶名称
   * @param prefix string 前缀
   * @param recursive boolean
   * @param startAfter string
   */
  // async doesObjectExist(
  //   bucketName: string,
  //   prefix?: string,
  //   recursive?: boolean,
  //   startAfter?: string
  // ) {
  //   try {
  //     // 使用 listObjectsV2 方法，设置 Prefix 为要查找的文件名
  //     const objects = await this.minioClient.listObjectsV2(
  //       bucketName,
  //       prefix,
  //       recursive,
  //       startAfter
  //     );
  //     // 如果找到了至少一个匹配的对象，则说明桶内存在同名文件
  //     return objects;
  //   } catch (error) {
  //     // 如果在列出对象时发生错误，如权限问题或桶不存在等，这里可以根据需要处理或直接抛出
  //     console.error(`Error checking for object existence: ${error.message}`);
  //     throw error;
  //   }
  // }
}

/**
 * 创建MinioBll实例
 * @author 张震
 * @param options Minio配置项
 * @returns MinioBll实例
 */
export const createMinioBll = (options?: Partial<Minio.ClientOptions>) => {
  const defaultOptions = {
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  };
  options && Object.assign(defaultOptions, options);
  const MinioClient = new Minio.Client(defaultOptions);
  return new MinioBll(MinioClient);
};
