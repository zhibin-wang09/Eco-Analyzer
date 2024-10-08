import { Center, Heading, HStack, Select } from "@chakra-ui/react";

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
              onSelectChange(e.target.value);
            }}
            value={select}
          >
            <option>Default</option>
            <option>Show Precincts</option>
            <option>Show Congressional Districts</option>
          </Select>
          <Select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              onStateChange(e.target.value);
            }}
            value={state}
          >
            <option>Default</option>
            <option>New York</option>
            <option>Arkansas</option>
          </Select>
        </HStack>
      </Center>
    </HStack>
  );
}
