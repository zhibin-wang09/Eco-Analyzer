import React, { useEffect, useState } from 'react';
import { Box, Flex, VStack, Heading, Text, Button, HStack, SlideFade, ScaleFade } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface UIProps {
  children: ReactNode;
}

const UI: React.FC<UIProps> = ({ children }) => {
  const [showNav, setShowNav] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    // Stagger the animations
    const navTimer = setTimeout(() => setShowNav(true), 300);
    const bannerTimer = setTimeout(() => setShowBanner(true), 800);
    const contentTimer = setTimeout(() => setShowContent(true), 1300);
    const footerTimer = setTimeout(() => setShowFooter(true), 1800);

    return () => {
      clearTimeout(navTimer);
      clearTimeout(bannerTimer);
      clearTimeout(contentTimer);
      clearTimeout(footerTimer);
    };
  }, []);

  return (
    <Box bg="#FFF0E6" minHeight="100vh">
      <Flex direction="column" width="100%" p={4} gap={4}>
        <SlideFade in={showNav} offsetY="-20px">
          <Box 
            as="nav" 
            bg="rgba(255, 240, 229, 0.70)" 
            p={4} 
            backdropFilter="blur(5px)" 
            position="sticky" 
            top={0} 
            zIndex={10}
            borderRadius="xl"
            boxShadow="sm"
          >
            <Flex justify="center" align="center">
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                color="#494946"
                transition="all 0.3s ease-in-out"
                _hover={{ transform: 'scale(1.05)' }}
              >
                Team Hurricane
              </Text>
            </Flex>
          </Box>
        </SlideFade>

        <VStack spacing={8} align="stretch">
          <ScaleFade in={showBanner} initialScale={0.9}>
            <Box 
              bg="#F7CFF2" 
              borderRadius="xl" 
              p={8}
              boxShadow="lg"
              transition="transform 0.3s ease-in-out"
              _hover={{ transform: 'translateY(-2px)' }}
            >
              <Heading 
                as="h1" 
                size="2xl" 
                textAlign="center" 
                color="#272726" 
                mb={4}
              >
                US Political Map Visualization
              </Heading>
              <Text textAlign="center" color="#494946">
                Explore electoral data for Arkansas and New York with our interactive tool.
              </Text>
            </Box>
          </ScaleFade>

          <ScaleFade in={showContent} initialScale={0.95}>
            <Flex>
              <Box 
                flex={1} 
                bg="#E4EDC4" 
                borderRadius="xl" 
                p={6} 
                mr={4}
                boxShadow="md"
                transition="all 0.3s ease-in-out"
                _hover={{ boxShadow: "lg" }}
              >
                {children}
              </Box>
            </Flex>
          </ScaleFade>

          <SlideFade in={showFooter} offsetY="20px">
            <Box 
              bg="#E3E34A" 
              borderRadius="xl" 
              p={8} 
              textAlign="center"
              boxShadow="md"
              transition="all 0.3s ease-in-out"
              _hover={{ boxShadow: "lg" }}
            >
              <Heading as="h2" size="xl" color="#272726" mb={4}>Information</Heading>
              <Text color="#494946" mb={4}>Data current as of 10/21/2024</Text>
            </Box>

            <Box 
              as="footer" 
              mt={8} 
              p={4} 
              textAlign="center" 
              color="#72726E"
              opacity={0.8}
            >
              © 2024. Team Hurricane
            </Box>
          </SlideFade>
        </VStack>
      </Flex>
    </Box>
  );
};

export default UI;