import {
  applyAssets,
  applyManifest,
  defineRunnerPlugin,
  getRunner,
} from '@moruteaven/matchabuild';

/**
 * uTools 插件式宿主：复用内核内置的 vite runner 产出前端，
 * 再叠加插件清单（plugin.json / preload.js / logo + package.json type=commonjs）。
 *
 * 清单与资产能力来自内核导出的 applyManifest / applyAssets（通用实现，数据驱动）。
 */
export default defineRunnerPlugin({
  id: 'utools',

  async build(target, ctx) {
    const front = await getRunner('vite').build(target, ctx);
    // 顺序很重要：先让 logo 等资源就位，再校验 plugin.json 内部引用
    await applyAssets(target, ctx);
    await applyManifest(target, ctx);
    return { ...front, runner: 'utools' };
  },

  async dev(target, ctx) {
    await getRunner('vite').dev(target, ctx);
  },
});
