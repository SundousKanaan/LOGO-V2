import { EmptyState, VStack } from "@chakra-ui/react";
import { HiColorSwatch } from "react-icons/hi";

export default function NoPage() {
  return (
    <EmptyState.Root display="grid" placeItems="center" height="100%">
      <EmptyState.Content>
        <EmptyState.Indicator>
          <HiColorSwatch />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>No page found.</EmptyState.Title>
          <EmptyState.Description>
            Try another page or check the URL.
          </EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
