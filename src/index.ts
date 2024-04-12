import OSS from "ali-oss";
import { OSSBll, createOSSBll } from "./bll/oss";
import { createMinioBll } from "./bll/minio";
import { getFilterConfig } from "./util";
import { IConfig } from "./types";
/**
 * 同步OSS数据至Minio
 * @author 张震
 * @returns Promise<void>
 */
async function sync(): Promise<void> {
  // 生成OSS实例
  const rootOss = createOSSBll();
  // 生成Minio实例
  const rootMinio = createMinioBll();
  // 获取桶信息
  const { buckets } = await rootOss.listBuckets();
  // 获取配置文件
  const filterConfig = getFilterConfig();

  // 根据桶信息生成oss实例放入队列中
  const bucketBllList = buckets.map((v: OSS.Bucket) => {
    let config: IConfig | null = null;
    // 根据配置文件类型 给实例加上配置
    if (Array.isArray(filterConfig)) {
      config = filterConfig.find((item) => item.name === v.name) || null;
    } else {
      config = filterConfig;
    }
    return createOSSBll(
      {
        bucket: v.name,
        region: v.region,
      },
      config
    );
  });
  // 遍历桶队列，将桶中的文件下载下来
  for (let i = 0; i < bucketBllList.length; i++) {
    console.info(`开始同步${buckets[i].name}`);
    const client = bucketBllList[i] as OSSBll;
    // 举例该桶下所有文件
    const data = await client.listAll();
    // 判断桶内是否有文件
    if (data.objects && data.objects.length > 0) {
      // 判断Minio内是否存在该桶
      const isMinioBucketExists: boolean = await rootMinio.bucketExists(
        buckets[i].name
      );
      if (!isMinioBucketExists) {
        await rootMinio.makeBucket(buckets[i].name);
      }
      // 遍历所有文件信息
      for (const object of data.objects) {
        console.info(`正在迁移${object.name}`);
        // 流式获取文件
        const ossReadStream: OSS.GetStreamResult = await client.getStream(
          object.name
        );
        // 流式上传文件至Minio
        await rootMinio.putObject(
          buckets[i].name,
          object.name,
          ossReadStream.stream
        );
      }
      console.info(`${buckets[i].name} 迁移结束`);
    } else {
      console.info(`${buckets[i].name} 无文件可迁移`);
    }
  }
}

sync();
