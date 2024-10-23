import React from 'react';
import { Box, Flex, VStack, Heading, Text, Button, HStack, Image } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface UIProps {
  children: ReactNode;
}

const UI: React.FC<UIProps> = ({ children }) => {
  return (
    <Box bg="#FFF0E6" minHeight="100vh">
      <Flex direction="column" width="100%" p={4} gap={4}>
        <Box as="nav" bg="rgba(255, 240, 229, 0.70)" p={4} backdropFilter="blur(5px)" position="sticky" top={0} zIndex={10}>
          <Flex justify="center" align="center">
            <Text fontSize="xl" fontWeight="bold" color="#494946">Team Hurricane</Text>
            {/* <HStack spacing={4}>
              <Button variant="ghost" color="#494946">Sources</Button>
              <Button variant="outline" borderColor="#72726E" color="#494946">Contact</Button>
            </HStack> */}
          </Flex>
        </Box>

        <VStack spacing={8} align="stretch">
          <Box bg="#F7CFF2" borderRadius="xl" p={8}>
            <Heading as="h1" size="2xl" textAlign="center" color="#272726" mb={4}>
              US Political Map Visualization
            </Heading>
            <Text textAlign="center" color="#494946">
              Explore electoral data for Arkansas and New York with our interactive tool.
            </Text>
          </Box>

          <Flex>
            <Box flex={1} bg="#E4EDC4" borderRadius="xl" p={6} mr={4}>
              {children}
            </Box>
          </Flex>

          <Box bg="#E3E34A" borderRadius="xl" p={8} textAlign="center">
            <Heading as="h2" size="xl" color="#272726" mb={4}>Information</Heading>
            <Text color="#494946" mb={4}>Data current as of 10/21/2024</Text>
          </Box>
        </VStack>

        <Box as="footer" mt={8} p={4} textAlign="center" color="#72726E">
          © 2024. Team Hurricane
        </Box>
      </Flex>
    </Box>
  );
};

export default UI;