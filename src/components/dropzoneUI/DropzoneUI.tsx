import { Group } from "@mantine/core";
import { IconUpload, IconX } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { FileView } from "../fileView/FileView";
import { type ReactNode } from "react";
import { ImageView } from "../image/Image";
import styles from "./dropzone.module.css";
import { PlaceHolder } from "./Placeholder";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAutoAnimate } from "@formkit/auto-animate/react";



export type OnChangeHandler = (value: Value) => void;
export type Value = null | File | string | (File | string)[];
export type Error = ReactNode | null | undefined;

export const isFile = (v: Value) => v instanceof File;


const DEFAULT_FILE_MAX_SIZE = 5 * 1024 ** 2; // 5MB

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


interface SortableItemProps {
  id: string;
  item: File | string;
  onRemove: () => void;
}

function SortableItem({ id, item, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.innerDiv}
    >
      {isFile(item) ? (
        <FileView file={item} onRemove={onRemove} />
      ) : (
        <ImageView value={item} onRemove={onRemove} />
      )}
    </div>
  );
}

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

    const [parent] = useAutoAnimate<HTMLDivElement>();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
  );

  const handleDrop = (files: File[]) => {
    if (!multiple) {
      if (files.length === 1) {
        onChange(files[0]);
      }
      console.log("single file mode");
      return;
    }

    if (!Array.isArray(value)) {
      onChange([...files]);
      console.log("multiple file mode");
      return;
    }

    onChange(dropDuplicateFiles([...value], [...files]));
    console.log("multiple file mode with existing files");
  };

  const removeFile = (index?: number) => {
    if (Array.isArray(value)) {
      const returningArray = value.filter(
        (_, valueIndex) => valueIndex !== index
      );
      onChange(returningArray);
    } else {
      onChange(null);
    }
    console.log("file removed");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !Array.isArray(value)) return;

    if (active.id !== over.id) {
      const oldIndex = value.findIndex((_, i) => getItemId(value[i], i) === active.id);
      const newIndex = value.findIndex((_, i) => getItemId(value[i], i) === over.id);

      onChange(arrayMove(value, oldIndex, newIndex));
    }
  };

  // Generate unique IDs for items
  const getItemId = (item: File | string, index: number) => {
    if (item instanceof File) {
      return `file-${item.name}-${item.size}-${item.lastModified}`;
    }
    return `image-${item}-${index}`;
  };

  // Get array of IDs for SortableContext
  const itemIds = Array.isArray(value)
    ? value.map((item, index) => getItemId(item, index))
    : [];

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
        <Group gap="xl" className={styles.group} ref={parent}>
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
                <>
                  {value.length !== 0 ? (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={itemIds}
                        strategy={verticalListSortingStrategy}
                      >
                        {value.map((item, index) => (
                          <SortableItem
                            key={getItemId(item, index)}
                            id={getItemId(item, index)}
                            item={item}
                            onRemove={() => removeFile(index)}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <PlaceHolder disabled={disabled} mimeType={mimeType} />
                  )}
                </>
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