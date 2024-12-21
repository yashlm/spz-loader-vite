import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";
import { createGaussianSplattingFromSpz } from "@spz-loader/babylonjs";

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);

      const loadSpz = async () => {
        try {
          // Path to your `.spz` file
          const spzPath = "/hornedlizard.spz";

          // Fetch the .spz file
          const spzBuffer = await fetch(spzPath).then((res) => res.arrayBuffer());

          // Load the Gaussian Splatting data
          await createGaussianSplattingFromSpz(spzBuffer, scene);
        } catch (error) {
          console.error("Error loading .spz file:", error);
        }
      };

      loadSpz();

      // Render loop
      engine.runRenderLoop(() => {
        scene.render();
      });

      // Clean up on unmount
      return () => {
        engine.dispose();
      };
    }
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

export default App;
