import { render, screen } from "@testing-library/react";
import LazyVideo from "../LazyVideo";

describe("LazyVideo", () => {
  it("renders video with source and title", () => {
    render(
      <LazyVideo
        src="https://example.com/video.mp4"
        title="Sample Video"
        poster="https://example.com/poster.jpg"
      />
    );
    const video = screen.getByTitle("Sample Video");
    expect(video).toBeInTheDocument();
    expect(video.getAttribute("preload")).toBe("auto");
    // وجود مصدر للفيديو
    const source = (video as HTMLVideoElement).querySelector("source");
    expect(source).toBeTruthy();
  });
});
