import { Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconPhoto } from "@tabler/icons-react";

const PLACEHOLDER_ON_DISABLED_TRUE = "Зураг чирж оруулах боломжгүй";
const PLACEHOLDER_ON_DISABLED_FALSE = "төрлийн файлыг чирж оруулах боломжтой";

export const PlaceHolder = ({
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
