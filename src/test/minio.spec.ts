import { MinioBll, createMinioBll } from "../bll/minio";
import * as fs from "fs";

describe("Minio测试", () => {
  let minioBll: MinioBll;
  let stream: any;
  let bucket_name: string;
  beforeAll(async () => {
    minioBll = createMinioBll();
    try {
      stream = fs.createReadStream(require("./test.txt"));
    } catch {
      stream = null;
    }
  });

  it("判断桶是否存在", async () => {
    const name = "amerss-" + Date.now().toString().charAt(5);
    const res = await minioBll.bucketExists(name);
    expect(res).toBe(false);
  });

  it("创建桶", async () => {
    bucket_name = "amerss" + Math.random();
    await minioBll.makeBucket(bucket_name);
    const res = await minioBll.bucketExists(bucket_name);
    expect(res).toBe(true);
  });

  it("上传对象", async () => {
    if ((stream = null)) return;
    const uploadedObject = await minioBll.putObject(
      bucket_name,
      "test.txt",
      stream
    );
    expect(uploadedObject).toBeUndefined();
  });
});
