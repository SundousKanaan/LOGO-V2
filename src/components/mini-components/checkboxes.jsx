import { Checkbox, CheckboxGroup, Fieldset, Avatar } from "@chakra-ui/react";
import { UsePickRandomColor } from "../../hooks/usePickRandomColor";

function Checkboxes({ title, variant, options, withIcon, onChange, ...props }) {
  return (
    <Fieldset.Root variant={variant} {...props}>
      <CheckboxGroup name="assignedUsers" onChange={onChange}>
        {title && (
          <Fieldset.Legend fontSize="sm" mb="2">
            {title}
          </Fieldset.Legend>
        )}
        <Fieldset.Content>
          {options.map((option) => (
            <Checkbox.Root key={option.id} value={option.id}>
              <Checkbox.HiddenInput />
              <Checkbox.Control
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
          ))}
        </Fieldset.Content>
      </CheckboxGroup>
    </Fieldset.Root>
  );
}

export default Checkboxes;
