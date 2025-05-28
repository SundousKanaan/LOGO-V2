import { RadioGroup } from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";

// ! data value should be an array of objects with value and label properties
// ! data={[
// !       { value: "1", label: "List 1" },
// !       { value: "2", label: "List 2" },
// !       { value: "3", label: "List 3" },
// !      ]}

function RadioButtons({
  data,
  openedList,
  withIndicator = false,
  props,
  sendDataToParent,
}) {
  function handleSelectChange(e) {
    sendDataToParent(e.target.value);
  }

  return (
    <RadioGroup.Root
      overflowX={"auto"}
      scrollSnapType={"x mandatory"}
      mb={convertPx(16)}
      onChange={handleSelectChange}
    >
      {data.map((item, index) => (
        <RadioGroup.Item
          key={index}
          value={item.value}
          bg={openedList === item.value ? "themeColor" : "transparent"}
          color={openedList === item.value ? "white" : "secondaryColor"}
          borderRadius={convertPx(4)}
          padding={convertPx(7) + " " + convertPx(12)}
          mr={convertPx(16)}
          scrollSnapAlign={"center"}
          _hover={{
            cursor: openedList !== item.value && "pointer",
            bg: openedList !== item.value && "lightThemeColor",
          }}
          {...props}
        >
          <RadioGroup.ItemHiddenInput />
          {withIndicator && <RadioGroup.ItemIndicator />}
          <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}

export default RadioButtons;
