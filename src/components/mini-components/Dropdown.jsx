import { Portal, Select } from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";

function Dropdown({
  collection,
  defaultValue,
  handleChange,
  withIndicator = false,
  placeholder = "Select an option",
  children,
  buttonProps,
  ...props
}) {
  return (
    <Select.Root
      collection={collection}
      width={withIndicator ? convertPx(90) : "fit-content"}
      defaultValue={[defaultValue]}
      onValueChange={handleChange}
      h={convertPx(25)}
      {...props}
    >
      <Select.Control h={"inherit"} border={"none"}>
        <Select.Trigger
          minHeight={"100%"}
          pl={convertPx(8)}
          display={placeholder !== "" ? "flex" : "none"}
          _hover={{
            cursor: "pointer",
          }}
          {...buttonProps}
        >
          <Select.ValueText maxW={"fit-content"} placeholder={placeholder} />
        </Select.Trigger>
        <Select.IndicatorGroup
          pr={convertPx(8)}
          display={withIndicator ? "flex" : "none"}
        >
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner style={{ zIndex: 9000 }}>
          <Select.Content gap={convertPx(8)}>{children}</Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

export default Dropdown;
