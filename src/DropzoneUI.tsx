import { Group, Text } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { FileView } from "./FileView";
import { Button } from "@mantine/core";
import { type ReactNode } from "react";
import { isFile, isString, isFileArray, isStringArray } from "./App";

export type OnChangeHandler = (value: Value) => void;
export type Value = File | null | File[] | string | string[]; // string is url
export type Error = ReactNode | null | undefined;

export interface DropzoneUIProps {
  label: string;
  withAsterik: boolean;
  mimeType: string;
  disabled: boolean;
  onChange: OnChangeHandler;
  value: Value;
  error: Error;
  multiple: boolean;
}

export function DropzoneUI(object: DropzoneUIProps) {

  return (
    <div className="flex flex-col justify-start items-start gap-2 w-full">
      <div className="flex flex-row">
        <p>{object.label}</p>
        {object.withAsterik === true ? <p>*</p> : null}
      </div>
      <Dropzone
        activateOnDrag={!object.disabled}
        activateOnClick={!object.disabled}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={5 * 1024 ** 2}
        mih={110}
        accept={[object.mimeType]}
        onDrop={(files: File[]) => {
          if (object.multiple === true) {
            if (isFileArray(object.value)) {
              const next = [...object.value];
              files.forEach((fileA) => {
                if (!next.some((fileB) => fileB.name === fileA.name))
                  next.push(fileA);
              });
              object.onChange(next);
              return;
            } else {
              object.onChange(files);
            }
          } else {
            if (files.length === 1) {
              object.onChange(files[0]);
              return;
            }
          }
        }}
        style={{ width: "100%" }}
      >
        <Group
          gap="xl"
          style={{
            pointerEvents: "auto", // allow scrolling
            transition: "height 0.3s ease",
            width: "100%",
          }}
        >
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>

          {object.value !== null ? (
            <div className="w-full">
              {isFileArray(object.value) ? (
                <div className="w-full">
                  {object.value.map((singleFile) => {
                    console.log(object.value);
                    return (
                      <div className="flex flex-row gap-2 justify-between w-full items-center hover:bg-blue-300">
                        <FileView file={singleFile} />
                        <Button  size="compact-xs" variant="outline" color="red"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isFileArray(object.value)) {
                              const next = object.value.filter((f) => f.name !== singleFile.name);
                              object.onChange(next);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  {isFile(object.value) ? (
                    <div className="flex flex-row gap-2">
                      <FileView file={object.value} />
                      <Button size="compact-xs" variant="outline" color="red" onClick={(e) =>{
                          e.preventDefault();
                          e.stopPropagation();
                          object.onChange(null)
                      }}>Delete</Button>
                    </div>
                  ) : null}
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
              <Text size="sm" c="dimmed" inline mt={7}>
                Оруулахыг хүссэн файлаа чирж авчрах боломжтой.
              </Text>
            </div>
          )}
        </Group>
      </Dropzone>
      <p>{object.error}</p>
    </div>
  );
}
