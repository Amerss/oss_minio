import * as Minio from 'minio';
import * as fs from 'fs';
import { promisify } from 'util';
const readdir = promisify(fs.readdir);
import * as dotenv from 'dotenv';
dotenv.config();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

class MinioBll {
  static async importDatatoMinio(importPath) {
    try {
      // 读取指定路径下的文件夹列表
      const folders = await readdir(importPath);
      // 遍历文件夹列表
      for (const folder of folders) {
        // 如果文件夹名称与配置的私有桶或公有桶名称匹配
        if (
          folder === global.PRIVATE_CONFIG.bucket ||
          folder === global.OSS_CONFIG.bucket
        ) {
          // 检查存储桶是否存在
          const bucketExists = await minioClient.bucketExists(folder);
          // 如果存储桶不存在，则创建它
          if (!bucketExists) {
            await minioClient.makeBucket(folder);
          }
          console.time(`上传文件到 ${folder} 耗时`);
          // 递归上传文件到 MinIO
          //   await this.uploadFilesRecursive(
          //     path.join(importPath, folder),
          //     folder,
          //     folder,
          //   );
          console.timeEnd(`上传文件到 ${folder} 耗时`);
        }
      }
      console.log('数据导入完成');
    } catch (err) {
      console.error('导入数据时出错:', err);
    }
  }
}

async function getBuckets() {
  try {
    // 列举当前账号所有地域下的存储空间。
    const result = await minioClient.listBuckets();
    console.log('minioBuckets:', result);
  } catch (err) {
    console.log(err);
  }
}

getBuckets();
export default MinioBll;
