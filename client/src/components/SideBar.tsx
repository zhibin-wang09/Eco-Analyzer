import React from 'react';
import { VStack, Heading, Text, Box, Divider, List, ListItem, ListIcon } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

const Sidebar = ({ selectedState }: { selectedState: string | null }) => {
    return (
    <Box
      width={{ base: "100%", md: "300px" }}
      height={{ base: "auto", md: "100%" }}
      bg="gray.50"
      p={4}
      borderRadius="md"
      boxShadow="md"
      overflowY="auto"
    >
      <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="lg">
          {selectedState ? `${selectedState} Information` : 'State Information'}
        </Heading>
        <Divider />
        <Box>
          <Heading as="h3" size="md" mb={2}>Quick Facts</Heading>
          <List spacing={2}>
            <ListItem>
              <ListIcon as={InfoOutlineIcon} color="blue.500" />
              Population: Placeholder
            </ListItem>
            <ListItem>
              <ListIcon as={InfoOutlineIcon} color="blue.500" />
              Capital: Placeholder
            </ListItem>
            <ListItem>
              <ListIcon as={InfoOutlineIcon} color="blue.500" />
              Largest City: Placeholder
            </ListItem>
          </List>
        </Box>
        <Box>
          <Heading as="h3" size="md" mb={2}>Political Info</Heading>
          <Text>Party Control: Placeholder</Text>
        </Box>
        <Box>
          <Heading as="h3" size="md" mb={2}>Demographics</Heading>
          <Text>Placeholder item 1</Text>
          <Text>Placeholder item 2</Text>
          <Text>Placeholder item 3</Text>
          <Text>Placeholder item 4</Text>
          <Text>Placeholder item 5</Text>
          <Text>Placeholder item 6</Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;