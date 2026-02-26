import { Dithering } from "@paper-design/shaders-react";

export function DitheringBall() {
  return (
    <Dithering
      className="mx-auto"
      width={200}
      height={200}
      colorBack="#00000000"
      colorFront="#9d9d9d"
      shape="sphere"
      type="4x4"
      size={2}
      speed={1}
      scale={0.6}
    />
  );
}
