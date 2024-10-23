import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { VisualizationType } from './ChartDataItemInterface';

interface InferenceMenuProps {
  setSelectedVisualization: (type: VisualizationType) => void;
}

const InferenceMenu: React.FC<InferenceMenuProps> = ({ setSelectedVisualization }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSelection = (visualization: VisualizationType) => {
    setSelectedVisualization(visualization);
    onClose();
  };

  return (
    <Box position="relative" zIndex="2">
      <Box
        onMouseEnter={() => {
          setIsHovered(true);
          onOpen();
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onClose();
        }}
      >
        <Button
          bg={isHovered ? "#F7CFF2" : "white"}
          color="#494946"
          _hover={{ bg: "#F7CFF2" }}
          transition="all 0.2s"
          rightIcon={<ChevronDownIcon />}
        >
          Inference Analysis
        </Button>

        <Box
          position="absolute"
          right="0"
          top="100%"
          mt={2}
          style={{ 
            visibility: isOpen ? 'visible' : 'hidden',
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <Box
            p={4}
            bg="#FFF0E6"
            rounded="md"
            shadow="md"
            border="1px solid"
            borderColor="gray.100"
            width="300px"
          >
            <VStack align="stretch" spacing={2}>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                color="#494946"
                _hover={{ bg: "#F7CFF2" }}
                bg="#E4EDC4"
                mb={1}
                onClick={() => handleSelection('goodman')}
              >
                Goodman's Ecological Regression
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                color="#494946"
                _hover={{ bg: "#F7CFF2" }}
                bg="#E4EDC4"
                mb={1}
                onClick={() => handleSelection('kings')}
              >
                King's Ecological Inference
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                color="#494946"
                _hover={{ bg: "#F7CFF2" }}
                bg="#E4EDC4"
                mb={1}
                onClick={() => handleSelection('rxc')}
              >
                RxC Ecological Inference
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                color="#494946"
                _hover={{ bg: "#F7CFF2" }}
                bg="#E4EDC4"
                onClick={() => handleSelection('hierarchical')}
              >
                Hierarchical Ecological Inference
              </Button>
            </VStack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InferenceMenu;