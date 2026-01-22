import { DropzoneSection } from "./DropzoneSection";
import { useState } from "react";
import { type DropzoneUIProps } from "./DropzoneSection";

export function App() {
  const [file, setFile] = useState<File | null | File[]>(null);
  const dropZoneObject1: DropzoneUIProps = {
    label: "Файл",
    withAsterik: true,
    mimeType: "image/png",
    disabled: true,
    value: file,
    error: null,
    onChangeHandle: (newFile) => {
      if (!newFile) {
        setFile(null);
        return;
      }
      if (file === null) {
        setFile(newFile);
      } else if (file instanceof File) {
        setFile([file, newFile]);
      } else if (Array.isArray(file)) {
        setFile([...file, newFile]);
      }
    },
    multiple: false,
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="flex justify-center items-start h-screen w-2/3">
        <DropzoneSection object={dropZoneObject1} />
      </div>
    </div>
  );
}
