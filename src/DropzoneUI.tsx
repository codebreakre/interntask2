import { Group, Text } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { FileView } from "./FileView";
import { Button } from "@mantine/core";
import { useRef } from "react";
import { type ReactNode } from "react";

export type OnChangeHandler = (value: File | File[] | null) => void;
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
  const count = useRef(0);

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
            object.onChange(files);
          } else {
            if (files.length !== 1) {
              console.log("error: only 1 item allowed");
            } else {
              object.onChange(files);
            }
          }
        }}
        style={{ width: "100%" }}
      >
        <Group
          justify="center"
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
            <div>
              {Array.isArray(object.value) ? (
                <div>
                  {object.value.map((singleFile) => {
                     console.log(object.value);
                    return <div className="flex flex-row gap-2"><FileView file={singleFile} /> <button
                    onClick={()=>
                    {
                      
                    }
                    }
                    >x</button></div>;

                    
                  })}
                </div>
              ) : (
                <div>
                   <FileView file={object.value} />
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
      {object.value === null ? null : (
        <div className="flex w-full flex-row justify-end ">
          <Button
            onClick={() => {
              object.onChange(null);
              count.current = 0;
            }}
          >
            {" "}
            Цуцлах
          </Button>
        </div>
      )}
      <p>{object.error}</p>
    </div>
  );
}
