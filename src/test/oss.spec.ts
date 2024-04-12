import { OSSBll, createOSSBll } from "../bll/oss";

describe("OSS测试", () => {
  let ossBll: OSSBll;

  beforeAll(() => {
    ossBll = createOSSBll();
  });

  it("测试获取bucket列表", async () => {
    const result = await ossBll.listBuckets();
    expect(result.buckets).toBeInstanceOf(Array);
  });

  it("列出文件", async () => {
    const result = await ossBll.list();
    expect(result.objects).toBeInstanceOf(Array);
  });

  it("列出所有文件", async () => {
    const result = await ossBll.listAll();
    expect(result.isTruncated).toBe(false);
  });
});
