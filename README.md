# **spz-loader Vite Application**

This project is a React-based application that utilizes **Babylon.js** and `spz-loader` to load and render `.spz` files, a type of 3D Gaussian Splatting file format. 

## **Features**
- Load `.spz` files and render them in a 3D scene using Babylon.js.
- Interactive 3D rendering with zoom, pan, and rotate support via an ArcRotateCamera.
- Modular and extensible React setup with Babylon.js integration.

---

## **Requirements**
- Node.js (v20 or later)
- pnpm (v9 or later)
- Docker (optional, if using spz-loader build features)
- A valid `.spz` file for testing

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/yashlm/spz-loader-vite.git
cd spz-loader-vite
```

### **2. Install Dependencies**
Install the required packages using `pnpm`:
```bash
pnpm install
```

### **3. Install Babylon.js and spz-loader**
Add the required libraries:
```bash
pnpm add @babylonjs/core @spz-loader/babylonjs
```

### **4. Add Your `.spz` File**
Place your `.spz` file in the `public` directory. For example:
```
/public/example.spz
```

### **5. Update `vite.config.js`**
Ensure the project can handle `.spz` files as static assets. Update the `vite.config.js` file with:
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.spz"], // Treat .spz files as assets
});
```

---

## **Running the Application**

### **Start the Development Server**
```bash
pnpm run dev
```
Navigate to `http://localhost:5173` in your browser to see the application.

### **Build for Production**
To create a production build:
```bash
pnpm run build
```

Serve the production build locally:
```bash
pnpm serve
```

---

## **Project Structure**
```
spz-loader-react/
├── public/
│   ├── example.spz          # Place your .spz file here
├── src/
│   ├── App.jsx              # Main React component
│   ├── main.jsx             # React entry point
├── package.json
├── pnpm-lock.yaml
├── vite.config.js           # Vite configuration
└── README.md
```

---

## **Code Explanation**

### **App.jsx**
The main component initializes a Babylon.js scene with an ArcRotateCamera, a HemisphericLight, and renders the loaded `.spz` file:
```jsx
import React, { useEffect, useRef } from "react";
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3 } from "@babylonjs/core";
import { createGaussianSplattingFromSpz } from "@spz-loader/babylonjs";

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);

      const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 10, new Vector3(0, 0, 0), scene);
      camera.attachControl(canvasRef.current, true);

      const light = new HemisphericLight("Light", new Vector3(0, 1, 0), scene);

      const loadSpz = async () => {
        try {
          const spzPath = "/example.spz";
          const spzBuffer = await fetch(spzPath).then((res) => res.arrayBuffer());
          await createGaussianSplattingFromSpz(spzBuffer, scene);
        } catch (error) {
          console.error("Error loading .spz file:", error);
        }
      };

      loadSpz();

      engine.runRenderLoop(() => {
        scene.render();
      });

      return () => {
        engine.dispose();
      };
    }
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

export default App;
```

---

## **Troubleshooting**

### **Error: No Camera Defined**
Ensure the `ArcRotateCamera` is properly added to the scene.

### **Error Loading `.spz` File**
- Verify the `.spz` file path.
- Check that the file is in the `public` directory.

### **Permission Issues with Docker**
If using the full `spz-loader` build process, ensure Docker is running and your scripts have the correct permissions:
```bash
chmod +x packages/core/lib/spz-wasm/build.sh
```

---

## **Contributing**
1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with detailed changes.

---
