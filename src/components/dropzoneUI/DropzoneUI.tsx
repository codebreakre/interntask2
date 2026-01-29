import { Group, Text } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { FileView } from "../fileView/FileView";
import { type ReactNode } from "react";
import { ImageView } from "../image/Image";
import styles from "./dropzone.module.css";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
const PLACEHOLDER_ON_DISABLED_TRUE = "Зураг чирж оруулах боломжгүй";
const PLACEHOLDER_ON_DISABLED_FALSE = "төрлийн файлыг чирж оруулах боломжтой";

const dropDuplicateFiles = (
  originalArray: (string | File)[],
  mergingArray: (string | File)[],
): (string | File)[] => {
  const returningArray = [...originalArray];
  mergingArray.forEach((mergeItem) => {
    let isDuplicate = false;
    originalArray.forEach((originalsItem) => {
      if (
        (originalsItem instanceof File &&
          mergeItem instanceof File &&
          mergeItem.name === originalsItem.name) ||
        mergeItem === originalsItem
      ) {
        isDuplicate = true;
        return;
      }
    });
    if (!isDuplicate) returningArray.push(mergeItem);
  });
  return [...returningArray];
};

const reorderArray = (
  array: any,
  draggedItemIndex: number,
  insertingIndex: number,
) => {
  const newArray = [...array];
  const item = newArray[draggedItemIndex];
  newArray.splice(draggedItemIndex, 1);
  newArray.splice(insertingIndex, 0, item);
  return newArray;
};

export function DropzoneUI({
  label,
  withAsterik,
  mimeType,
  disabled = false,
  onChange,
  value,
  error,
  multiple = false,
  maxSize = DEFAULT_FILE_MAX_SIZE,
}: DropzoneUIProps) {
  {
    const [parent] = useAutoAnimate();
    const [child] = useAutoAnimate();

    const dragstartHandler = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData("draggedItem", event.currentTarget.id);
    };
    const dragoverHandler = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    };
    const dropHandler = (event: React.DragEvent<HTMLDivElement>) => {
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      const draggedItemIndex = parseInt(
        event.dataTransfer.getData("draggedItem"),
      );
      const insertingIndex = parseInt(event.currentTarget.id);
      onChange(reorderArray(value, draggedItemIndex, insertingIndex));
    };

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
        const returningArray = value.filter(
          (_, valueIndex) => valueIndex !== index,
        );
        onChange(returningArray);
      } else {
        onChange(null);
      }
    };

    return (
      <div className={styles.outerContainer}>
        <div className={styles.labelContainer}>
          <p className={error ? styles.error : styles.noError}>{label}</p>
          {withAsterik === true && !disabled ? (
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
          className={styles.container}
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
            <Dropzone.Accept>
              <IconUpload
                size={52}
                color="var(--mantine-color-blue-6)"
                stroke={1.5}
              />
            </Dropzone.Accept>

            {value !== null ? (
              <>
                {Array.isArray(value) ? (
                  <div ref={parent} className={styles.itemContainer}>
                    {value.length !== 0 ? (
                      value.map((item, index) => (
                        <div
                          key={item instanceof File ? `file-${item.name}` : `image-${item}`}
                          id={`${index}`}
                          className={styles.innerDiv}
                          draggable
                          onDragStart={dragstartHandler}
                          onDragOver={dragoverHandler}
                          onDrop={dropHandler}
                        >
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
                      ))
                    ) : (
                      <PlaceHolder disabled={disabled} mimeType={mimeType} />
                    )}
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
                <PlaceHolder disabled={disabled} mimeType={mimeType} />
              </>
            )}
          </Group>
        </Dropzone>
        <span className={styles.error}>{error}</span>
      </div>
    );
  }
}

const PlaceHolder = ({
  disabled,
  mimeType,
}: {
  disabled?: boolean;
  mimeType?: string;
}) => {
  if (disabled) {
    return (
      <>
        <Text size="sm" c="dimmed" inline mt={7}>
          {PLACEHOLDER_ON_DISABLED_TRUE}
        </Text>
      </>
    );
  }
  return (
    <>
      <Dropzone.Idle>
        <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
      </Dropzone.Idle>
      <Text size="sm" c="dimmed" inline mt={7}>
        <em>{mimeType}</em> {PLACEHOLDER_ON_DISABLED_FALSE}
      </Text>
    </>
  );
};
