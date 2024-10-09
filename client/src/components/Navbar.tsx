import { Box, Center, Heading, HStack, Select, Text } from "@chakra-ui/react";

interface NavbarProps {
  onSelectChange: (val: string) => void;
  select: string;
  onStateChange: (val: string) => void;
  state: string;
}

export default function Navbar({
  onSelectChange,
  select,
  onStateChange,
  state,
}: NavbarProps) {
  return (
    <HStack>
      <Heading as="h1" size="l" textAlign="center">
        Team Hurricane: US Political Map
      </Heading>
      <Center>
        <HStack gap="4">
          <Select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              onStateChange(e.target.value);
            }}
            value={state}
          >
            <option disabled>State</option>
            <option>New York</option>
            <option>Arkansas</option>
          </Select>
        </HStack>
      </Center>
    </HStack>
  );
}
