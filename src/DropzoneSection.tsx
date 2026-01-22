import { DropzoneUI } from "./DropzoneUI";
import { type ReactNode } from "react";
import { type DropzoneProps } from '@mantine/dropzone';

type OnChangeHandler = (value: File | null) => void;
type Value = File | null | File[]; // string is url
type Error = ReactNode | null | undefined;


export interface DropzoneUIProps extends Partial<DropzoneProps> {
  label: string;
  withAsterik: boolean;
  mimeType: string;
  disabled: boolean;
  onChangeHandle: OnChangeHandler;
  value : Value;
  error: Error;
  multiple:boolean;
}


export const DropzoneSection = ({
  object
}: {
  object: DropzoneUIProps;
}) => {
  return (
      <DropzoneUI 
        withAsterik={object.withAsterik}
        disabled={object.disabled}
        value={object.value}
        error={object.error}
        label={object.label}
        mimeType={object.mimeType}
        onChangeHandle={object.onChangeHandle}
        multiple = {object.multiple}
      />
  );
};
