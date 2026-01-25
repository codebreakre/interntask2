import { useState } from "react";
import { type Value } from "./DropzoneUI";
import { DropzoneUI } from "./DropzoneUI";

export const isFile = (v: Value) => v instanceof File;

export const isString = (v: Value) => typeof v === "string";

export const isFileArray = (v: Value) =>
  Array.isArray(v) && v.every((x) => x instanceof File);

export const isStringArray = (v: Value): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");

export function App() {
  const [fileVariable, setFile] = useState<Value>(null);
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
            if (isFile(newFile)) {
              if (isFileArray(fileVariable)) {
                setFile([...fileVariable, newFile]);
                return;
              } else if (
                isStringArray(fileVariable) ||
                isString(fileVariable)
              ) {
                setError("URL эсвэл Файл оруулахын аль нэгийг сонгоно уу");
                return;
              } else if (isFile(fileVariable)) {
                setFile(newFile);
                return;
              }
              setFile(newFile);
              return;
            }
            if (isString(newFile)) {
              if (isStringArray(fileVariable)) {
                setFile([...fileVariable, newFile]);
                return;
              } else if (isFile(fileVariable) || isFileArray(fileVariable)) {
                setError("URL эсвэл Файл оруулахын аль нэгийг сонгоно уу");
                return;
              } else if (isString(fileVariable)) {
                setFile(newFile);
                return;
              }
              setFile(newFile);
              return;
            }
            if (isFileArray(newFile)) {
                setFile(newFile);
                return;
               
            } else {setFile(null)}
          }}
        ></DropzoneUI>
      </div>
    </div>
  );
}
