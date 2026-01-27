import { Group, Text } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { FileView } from "../fileView/FileView";
import { type ReactNode } from "react";
import { ImageView } from "../image/Image";
import styles from "./dropzone.module.css";

export type OnChangeHandler = (value: Value) => void;
export type Value = null | File | string | (File | string)[];
export type Error = ReactNode | null | undefined;

export const isFile = (v: Value) => v instanceof File;

export interface DropzoneUIProps {
  label?: string;
  withAsterik?: boolean;
  mimeType: string;
  disabled?: boolean;
  onChange: OnChangeHandler;
  value: Value;
  error?: Error;
  multiple?: boolean;
  maxSize?: number;
}

const DEFAULT_FILE_MAX_SIZE = 5 * 1024 ** 2; // 5MB

const dropDuplicateFiles = (
  array1: (string | File)[],
  array2: (string | File)[],
): (string | File)[] => {
  const next = [...array1];
  array2.forEach((item) => {
    let isMatch = false;
    array1.forEach((itemm) => {
      if (
        (itemm instanceof File &&
          item instanceof File &&
          item.name === itemm.name) ||
        item === itemm
      ) {
        isMatch = true;
        return;
      }
    });
    if (!isMatch) next.push(item);
  });
  return [...next];
};

export function DropzoneUI({
  label,
  withAsterik,
  mimeType,
  disabled,
  onChange,
  value,
  error,
  multiple = false,
  maxSize = DEFAULT_FILE_MAX_SIZE,
}: DropzoneUIProps) {
  {
    const handleDrop = (files: File[]) => {
      if (!multiple) {
        if (files.length === 1) {
          onChange(files[0]);
        }
        return;
      }

      if (!Array.isArray(value)) {
        onChange([...files]);
        return;
      }

      onChange(dropDuplicateFiles([...value], [...files]));
    };

    const removeFile = (index?: number) => {
      if (Array.isArray(value)) {
        const next = value.filter((_, valueIndex) => valueIndex !== index);
        onChange(next);
      } else {
        onChange(null);
      }
    };

    return (
      <div className={styles.outerContainer}>
        <div className={styles.labelContainer}>
          <p className={error ? styles.error : styles.noError}>{label}</p>
          {withAsterik === true ? (
            <p className={error ? styles.error : styles.noError}>*</p>
          ) : null}
        </div>
        <Dropzone
          activateOnDrag={!disabled}
          activateOnClick={!disabled}
          maxSize={maxSize}
          mih={110}
          accept={[mimeType]}
          onDrop={handleDrop}
          style={{ width: "100%" }}
        >
          <Group
            gap="xl"
            style={{
              pointerEvents: "auto",
              width: "100%",
            }}
          >
            <Dropzone.Reject>
              <IconX
                size={52}
                color="var(--mantine-color-red-6)"
                stroke={1.5}
              />
            </Dropzone.Reject>

            {value !== null ? (
              <>
                {Array.isArray(value) ? (
                  <div className={styles.itemContainer}>
                    {value.map((item, index) => {
                      return (
                        <div className={styles.innerDiv}>
                          {isFile(item) ? (
                            <FileView
                              file={item}
                              onRemove={() => removeFile(index)}
                            />
                          ) : (
                            <ImageView
                              value={item}
                              onRemove={() => removeFile(index)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    {isFile(value) ? (
                      <FileView file={value} onRemove={() => removeFile()} />
                    ) : (
                      <ImageView value={value} onRemove={() => removeFile()} />
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
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
                  {mimeType} төрлийн файлуудыг чирж оруулах боломжтой
                </Text>
              </>
            )}
          </Group>
        </Dropzone>
        <span className={styles.error}>{error}</span>
      </div>
    );
  }
}
