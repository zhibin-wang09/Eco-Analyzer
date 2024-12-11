import React, { useEffect, useState } from 'react';
import { Box, Flex, VStack, Text, keyframes, SlideFade, ScaleFade } from '@chakra-ui/react';
import { ReactNode } from 'react';

const fadeInColor = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

interface UIProps {
  children: ReactNode;
}

const UI: React.FC<UIProps> = ({ children }) => {
  const [showNav, setShowNav] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const navTimer = setTimeout(() => setShowNav(true), 800);
    const contentTimer = setTimeout(() => setShowContent(true), 1600);

    return () => {
      clearTimeout(navTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const fadeAnimation = `${fadeInColor} 2s ease-in`;

  return (
    <Box 
      bg="#FFF0E6" 
      minHeight="100vh"
      maxWidth="1600px"
      margin="0 auto"
      animation={fadeAnimation}
      position="relative"
      overflow="hidden"
    >
      <Flex direction="column" width="100%" p={2} gap={2}>
        <SlideFade 
          in={showNav} 
          offsetY="-20px"
          transition={{ enter: { duration: 1.2 } }}
        >
          <Box 
            as="nav" 
            bg="rgba(255, 240, 229, 0)" 
            py={1}
            px={2}
            backdropFilter="blur(5px)" 
            position="sticky" 
            top={0} 
            zIndex={10}
            borderRadius="lg"
            boxShadow="sm"
            transition="background-color 2s ease-in-out, box-shadow 0.3s ease-in-out"
            _hover={{ bg: "rgba(255, 240, 229, 0.70)" }}
          >
            <Flex justify="center" align="center">
              <Text 
                fontSize="md"
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

        <VStack spacing={4} align="stretch">
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
                p={4} 
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

          <Box 
            as="footer" 
            mt={4} 
            p={2} 
            textAlign="center" 
            color="#72726E"
            opacity={0}
            animation={`${fadeInColor} 4s ease-in forwards`}
          >
            © 2024. Team Hurricane
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};

export default UI;
