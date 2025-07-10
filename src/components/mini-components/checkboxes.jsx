import {
  Flex,
  Checkbox,
  CheckboxGroup,
  Fieldset,
  Avatar,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { UsePickRandomColor } from "../../hooks/usePickRandomColor";
import { convertPx } from "../../hooks/useConvertPx";

function Checkboxes({
  title,
  variant,
  options,
  withIcon,
  onChange,
  selectedIds = [],
  isLoading,
  ...props
}) {
  return (
    <Fieldset.Root variant={variant} {...props}>
      <CheckboxGroup
        name="assignedUsers"
        onChange={onChange}
        defaultValue={selectedIds}
      >
        {title && (
          <Fieldset.Legend fontSize="sm" mb="2">
            {title}
          </Fieldset.Legend>
        )}
        <Fieldset.Content h={isLoading && convertPx(80)}>
          {isLoading ? (
            <Flex pl={convertPx(35)} gap={convertPx(8)} alignItems={"center"}>
              {withIcon && (
                <SkeletonCircle size={convertPx(30)}></SkeletonCircle>
              )}
              <Skeleton h={convertPx(24)} w={convertPx(170)}></Skeleton>
            </Flex>
          ) : (
            options &&
            options.map((option) => (
              <Checkbox.Root key={option.id} value={option.id}>
                <Checkbox.HiddenInput />
                <Checkbox.Control
                  visibility={isLoading && "hidden"}
                  borderRadius={"full"}
                  colorPalette={UsePickRandomColor(option.displayName)}
                />
                {withIcon && (
                  <Avatar.Root
                    size="2xs"
                    colorPalette={UsePickRandomColor(option.displayName)}
                  >
                    <Avatar.Fallback />
                    <Avatar.Image
                      src={option.photo}
                      alt={`${option.displayName} profile photo`}
                    />
                  </Avatar.Root>
                )}
                <Checkbox.Label>{option.displayName}</Checkbox.Label>
              </Checkbox.Root>
            ))
          )}
        </Fieldset.Content>
      </CheckboxGroup>
    </Fieldset.Root>
  );
}

export default Checkboxes;
