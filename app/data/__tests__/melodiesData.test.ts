import { describe, expect, it } from "vitest";
import {
  loadAllVideoData,
  loadStageVideos,
  StageKey,
  stageVideoUrls,
} from "../melodiesData";
import type { LevelVideos } from "../melodiesData";

function countVideos(stageData: LevelVideos) {
  return Object.values(stageData).reduce(
    (total, videos) => total + (videos?.length ?? 0),
    0,
  );
}

describe("melodies data loaders", () => {
  it("loads a stage on demand", async () => {
    const data = await loadStageVideos(StageKey.Kindergarten);

    expect(data.first.length).toBeGreaterThan(0);
    expect(data.second.length).toBeGreaterThan(0);
  });

  it("keeps video URL arrays aligned with melody data", async () => {
    const allData = await loadAllVideoData();

    for (const stage of Object.values(StageKey)) {
      const stageData = allData[stage];
      expect(countVideos(stageData)).toBeGreaterThan(0);

      for (const [level, videos] of Object.entries(stageData)) {
        const urls = stageVideoUrls[stage][level as keyof typeof stageVideoUrls[typeof stage]];
        expect(urls?.length ?? 0).toBe(videos?.length ?? 0);
      }
    }
  });
});
