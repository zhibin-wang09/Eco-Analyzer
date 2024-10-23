import React, { useEffect, useState } from 'react';
import { Box, Flex, VStack, Heading, Text, keyframes, SlideFade, ScaleFade } from '@chakra-ui/react';
import { ReactNode } from 'react';

// Define fade-in animation for colors
const fadeInColor = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

interface UIProps {
  children: ReactNode;
}

const UI: React.FC<UIProps> = ({ children }) => {
  const [showNav, setShowNav] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    // Extended timing for animations
    const navTimer = setTimeout(() => setShowNav(true), 800);
    const bannerTimer = setTimeout(() => setShowBanner(true), 1600);
    const contentTimer = setTimeout(() => setShowContent(true), 2400);
    const footerTimer = setTimeout(() => setShowFooter(true), 3200);

    return () => {
      clearTimeout(navTimer);
      clearTimeout(bannerTimer);
      clearTimeout(contentTimer);
      clearTimeout(footerTimer);
    };
  }, []);

  const fadeAnimation = `${fadeInColor} 2s ease-in`;

  return (
    <Box 
      bg="#FFF0E6" 
      minHeight="100vh"
      animation={fadeAnimation}
    >
      <Flex direction="column" width="100%" p={4} gap={4}>
        <SlideFade 
          in={showNav} 
          offsetY="-20px"
          transition={{ enter: { duration: 1.2 } }}
        >
          <Box 
            as="nav" 
            bg="rgba(255, 240, 229, 0)" 
            p={4} 
            backdropFilter="blur(5px)" 
            position="sticky" 
            top={0} 
            zIndex={10}
            borderRadius="xl"
            boxShadow="sm"
            transition="background-color 2s ease-in-out, box-shadow 0.3s ease-in-out"
            _hover={{ bg: "rgba(255, 240, 229, 0.70)" }}
          >
            <Flex justify="center" align="center">
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                color="#494946"
                opacity={0}
                animation={`${fadeInColor} 2s ease-in forwards`}
                transition="all 0.3s ease-in-out"
                _hover={{ transform: 'scale(1.05)' }}
              >
                Team Hurricane
              </Text>
            </Flex>
          </Box>
        </SlideFade>

        <VStack spacing={8} align="stretch">
          <ScaleFade 
            in={showBanner} 
            initialScale={0.9}
            transition={{ enter: { duration: 1.2 } }}
          >
            <Box 
              bg="#F7CFF2"
              borderRadius="xl" 
              p={8}
              boxShadow="lg"
              opacity={0}
              animation={`${fadeInColor} 2s ease-in forwards`}
              transition="transform 0.3s ease-in-out, background-color 2s ease-in-out"
              _hover={{ transform: 'translateY(-2px)' }}
            >
              <Heading 
                as="h1" 
                size="2xl" 
                textAlign="center" 
                color="#272726" 
                mb={4}
                opacity={0}
                animation={`${fadeInColor} 2.5s ease-in forwards`}
              >
                US Political Map Visualization
              </Heading>
              <Text 
                textAlign="center" 
                color="#494946"
                opacity={0}
                animation={`${fadeInColor} 3s ease-in forwards`}
              >
                Explore electoral data for Arkansas and New York with our interactive tool.
              </Text>
            </Box>
          </ScaleFade>

          <ScaleFade 
            in={showContent} 
            initialScale={0.95}
            transition={{ enter: { duration: 1.2 } }}
          >
            <Flex>
              <Box 
                flex={1} 
                bg="#E4EDC4" 
                borderRadius="xl" 
                p={6} 
                mr={4}
                boxShadow="md"
                opacity={0}
                animation={`${fadeInColor} 2s ease-in forwards`}
                transition="all 0.3s ease-in-out, background-color 2s ease-in-out"
                _hover={{ boxShadow: "lg" }}
              >
                {children}
              </Box>
            </Flex>
          </ScaleFade>

          <SlideFade 
            in={showFooter} 
            offsetY="20px"
            transition={{ enter: { duration: 1.2 } }}
          >
            <Box 
              bg="#E3E34A" 
              borderRadius="xl" 
              p={8} 
              textAlign="center"
              boxShadow="md"
              opacity={0}
              animation={`${fadeInColor} 2s ease-in forwards`}
              transition="all 0.3s ease-in-out, background-color 2s ease-in-out"
              _hover={{ boxShadow: "lg" }}
            >
              <Heading 
                as="h2" 
                size="xl" 
                color="#272726" 
                mb={4}
                opacity={0}
                animation={`${fadeInColor} 2.5s ease-in forwards`}
              >
                Information
              </Heading>
              <Text 
                color="#494946" 
                mb={4}
                opacity={0}
                animation={`${fadeInColor} 3s ease-in forwards`}
              >
                Data current as of 10/21/2024
              </Text>
            </Box>

            <Box 
              as="footer" 
              mt={8} 
              p={4} 
              textAlign="center" 
              color="#72726E"
              opacity={0}
              animation={`${fadeInColor} 4s ease-in forwards`}
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