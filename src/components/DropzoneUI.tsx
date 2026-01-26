import { Group, Text } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { FileView } from "./FileView";
import { Button } from "@mantine/core";
import { type ReactNode } from "react";
import { isFile } from "../App";
import { ImageView } from "./Image";
import styles from "./dropzone.module.css"

export type OnChangeHandler = (value: Value) => void;
export type Value = null | File | string | (File | string)[];
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
    <div className={styles.outerContainer}>
      <div className={styles.labelContainer}>
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
          if (object.multiple === false) {
            if (files.length === 1) {
              object.onChange(files[0]);
            }
            // multiple ni true uyd ajillana
          } else {
            if (object.value === null) {
              object.onChange([...files]);
            } else if (typeof object.value === "string") {
              object.onChange([object.value, ...files]);
            } else if (object.value instanceof File) {
              const item = files.find((f) => {
                if (object.value instanceof File) {
                  f.name === object.value.name;
                }
              });
              if (item) {
                object.onChange([...files]);
              } else {
                object.onChange([object.value, ...files]);
              }
            } else if (Array.isArray(object.value)) {
              const next = [...object.value];
              files.map((item) => {
                let isMatch = false;
                if (Array.isArray(object.value)) {
                  object.value.map((itemm) => {
                    if (itemm instanceof File && item.name === itemm.name) {
                      isMatch = true;
                    }
                  });
                }
                if (!isMatch) next.push(item);
              });
              object.onChange([...next]);
            }
          }
        }}
        style={{ width: "100%" }}
      >
        <Group
          gap="xl"
          style={{  width: "100%" }}
        >
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>

          {object.value !== null ? (
            <div className={styles.container}>
              {Array.isArray(object.value) ? (
                <div  className={styles.container}>
                  {object.value.map((item) => {
                    return (
                      <div  className={styles.container}>
                        {isFile(item) ? (
                          <div  className={styles.itemContainer}>
                            <FileView file={item} />
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (Array.isArray(object.value)) {
                                  const next = object.value.filter((file) => {
                                    if (
                                      file instanceof File &&
                                      item instanceof File
                                    ) {
                                      return file.name !== item.name;
                                    }
                                    return file !== item;
                                  });
                                  object.onChange(
                                    next.length > 0 ? next : null,
                                  );
                                }
                              }}
                            >
                              delete
                            </Button>
                          </div>
                        ) : (
                          <div  className={styles.itemContainer}>
                            <ImageView value={item} />
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (Array.isArray(object.value)) {
                                  const next = object.value.filter((file) => {
                                    return file !== item;
                                  });
                                  object.onChange(
                                    next.length > 0 ? next : null,
                                  );
                                }
                              }}
                            >
                              delete
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.itemContainer}>
                  {isFile(object.value) ? (
                    <div>
                      <FileView file={object.value} />
                    </div>
                  ) : (
                    <div>
                      <ImageView value={object.value} />
                    </div>
                  )}
                  <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          object.onChange(null);
                        }}
                      >
                        delete
                      </Button>
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
                {object.mimeType} төрлийн файлуудыг чирж оруулах боломжтой
              </Text>
            </div>
          )}
        </Group>
      </Dropzone>
      <p>{object.error}</p>
    </div>
  );
}
