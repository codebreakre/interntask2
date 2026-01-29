import { useState } from "react";
import { type Value } from "./components/dropzoneUI/DropzoneUI";
import { DropzoneUI } from "./components/dropzoneUI/DropzoneUI";



export function App() {
  const [fileVariable, setFile] = useState<Value>([]);
  const [error, setError] = useState("");

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="flex justify-center items-start h-screen w-2/3">
        <DropzoneUI
          label={"Файл"}  
          withAsterik={true}
          mimeType={"image/png"}
          disabled={false}
          error={""}
          multiple={true}
          value={fileVariable}
          onChange={setFile}
        />
      </div>
    </div>
  );
}
