import { Group, Text } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { type DropzoneUIProps } from "./DropzoneSection";
import { FileView } from "./FileView";
import { useState } from "react";
import { Button } from "@mantine/core";

export function DropzoneUI(object: DropzoneUIProps) {
  const [height, setHeigth] = useState(220);

  return (
    <div className="flex flex-col justify-start items-start gap-2 w-full">
      <div className="flex flex-row">
        <p>{object.label}</p>
        {object.withAsterik === true ? <p>*</p> : null}
      </div>
      <Dropzone
        activateOnDrag={object.disabled}
        activateOnClick={object.disabled}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={5 * 1024 ** 2}
        accept={[object.mimeType]}
        onDrop={(files: File[]) => {
          files.map((file) => {
            object.onChangeHandle(file);
            setHeigth(100);
            console.log(object.value);
          });
        }}
        style={{ width: "100%", transition: "transform 0.3s ease-in-out" }}
      >
        <Group
          justify="center"
          gap="xl"
          style={{
            pointerEvents: "auto", // allow scrolling

            height: height, // fixed height
            transition: "height 0.3s ease",
            overflow: "auto", // vertical scroll
            width: "100%",
          }}
        >
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>

          {object.value !== null ? (
            <div className="flex flex-col justify-start items-start h-full w-full overflow-auto ">
              {object.value instanceof File ? (
                <FileView file={object.value} />
              ) : (
                <div>
                  {object.value.map((file) => {
                    return <FileView file={file} />;
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <Dropzone.Accept>
                <IconUpload
                  size={52}
                  color="var(--mantine-color-blue-6)"
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Idle>
                <IconPhoto
                  size={52}
                  color="var(--mantine-color-dimmed)"
                  stroke={1.5}
                />
              </Dropzone.Idle>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed
                5mb
              </Text>
            </div>
          )}
        </Group>
      </Dropzone>
      {object.value === null ? null : (
        <div className="flex w-full flex-row justify-end ">
          <Button
          onClick={() => {
            object.onChangeHandle(null);
            setHeigth(220);
          }}
          className="width-"
        >
          {" "}
          Цуцлах
        </Button>
        </div>
      )}
    </div>
  );
}
