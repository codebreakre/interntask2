import { useState } from "react";
import { type Value } from "./DropzoneUI";
import { DropzoneUI } from "./DropzoneUI";

export const isFile = (v: Value) => v instanceof File;

export const isString = (v: Value) => typeof v === "string";

export function App() {
  const [fileVariable, setFile] = useState<Value>("https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D");
  const [error, setError] = useState("");

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="flex justify-center items-start h-screen w-2/3">
        <DropzoneUI
          label={"Файл"}  
          withAsterik={true}
          mimeType={"image/png"}
          disabled={false}
          error={error}
          multiple={true}
          value={fileVariable}
          onChange={(newFile: Value) => {
                  if(Array.isArray(newFile)) {
                    if(newFile.length === 0) {
                      setFile(null);
                    }
                    setFile(newFile);
                  } else {
                    setFile(newFile);
                  }

                console.log(fileVariable);
          }
        }
            
        ></DropzoneUI>
      </div>
    </div>
  );
}
