import { useEffect, useRef } from "react";
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3 } from "@babylonjs/core";
import { createGaussianSplattingFromSpz } from "@spz-loader/babylonjs";

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);

      // Create a basic camera and attach it to the scene
      const camera = new ArcRotateCamera(
        "Camera", // Camera name
        Math.PI / 2, // Alpha (horizontal rotation)
        Math.PI / 4, // Beta (vertical rotation)
        10, // Radius (distance from target)
        new Vector3(0, 0, 0), // Target position
        scene // The scene to attach the camera to
      );
      camera.attachControl(canvasRef.current, true); // Enable user controls (zoom, pan, rotate)

      // Add a basic light to the scene
      const light = new HemisphericLight("Light", new Vector3(0, 1, 0), scene);

      const loadSpz = async () => {
        try {
          // Path to your `.spz` file
          const spzPath = "/racoonfamily.spz";

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
