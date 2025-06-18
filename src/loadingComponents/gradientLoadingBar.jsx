import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const gradientMove = keyframes`
0% { background-position: 200% 0%; }
  100% { background-position: 0% 0%; }
`;

function GradientLoadingBar({ ...props }) {
  return (
    <Box
      w="100%"
      borderRadius={"sm"}
      {...props}
      bgGradient="linear-gradient(45deg, rgb(213, 213, 213) 0%, rgb(185,185,185) 30%, rgb(255,255,255) 45%, rgb(255,255,255) 55%, rgb(213, 213, 213) 70%, rgb(213, 213, 213) 100%)"
      backgroundSize="200% 100%"
      animation={`${gradientMove} 2s linear infinite`}
    />
  );
}

export default GradientLoadingBar;
