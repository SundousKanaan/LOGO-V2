import { Heading } from "@chakra-ui/react";

export default function HeadingItem({ children, ...props }) {
  return (
    <Heading
      width="fit-content"
      fontFamily="body"
      margin="0"
      color="secondaryColor"
      css={{
        _firstLetter: {
          textTransform: "uppercase",
        },
      }}
      {...props}
    >
      {children}
    </Heading>
  );
}
