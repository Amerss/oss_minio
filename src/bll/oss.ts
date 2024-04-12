import * as OSS from 'ali-oss';
import * as dotenv from 'dotenv';
dotenv.config();

const ossClient = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
});

async function listBuckets(options = {}) {
  try {
    // 列举当前账号所有地域下的存储空间。
    const result = await ossClient.listBuckets(options);
    console.log('ossBuckets:', result);
  } catch (err) {
    console.log(err);
  }
}

listBuckets();
