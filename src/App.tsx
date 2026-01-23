import { useState } from "react";
import { type Value } from "./DropzoneUI";
import { DropzoneUI } from "./DropzoneUI";

export function App() {
  const [fileVariable, setFile] = useState<Value>(null);
  const [error, setError] = useState("error");

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
          onChange={(newFile: File | File[] | null) => {
            if (newFile === null) {
              setFile(null);
              return;
            }

            if (newFile instanceof File) {
              if (Array.isArray(fileVariable)) {
                if (fileVariable.every((f) => f instanceof File)) {
                  const item = fileVariable.find(
                    (file) => file.name === newFile.name,
                  );
                  if (item) {
                    setError(`the item already exists ${newFile.name}`);
                    return;
                  } else {
                    setFile([...fileVariable, newFile]);
                  }
                }
              } else if (fileVariable === null) {
                setFile(newFile);
              } else if (fileVariable instanceof File) {
                if (fileVariable.name !== newFile.name) {
                  setFile([fileVariable, newFile]);
                  return;
                }
                setError(`the item already exists ${newFile.name}`);
              }
            }
            if (Array.isArray(newFile) && newFile[0] instanceof File) {
              if (
                Array.isArray(fileVariable) &&
                fileVariable.every((f) => f instanceof File)
              ) {
                const existingFiles = fileVariable as File[]; // Now TypeScript knows it's File[]

                const hasDuplicate = newFile.some((fileA) =>
                  existingFiles.some((fileB) => fileB.name === fileA.name),
                );

                if (hasDuplicate) {
                  setError("Davhardsn file bn");
                } else {
                  setFile([...existingFiles, ...newFile]);
                }
              } else {
                setFile(newFile);
              }
            }
          }}
        ></DropzoneUI>
      </div>
    </div>
  );
}
