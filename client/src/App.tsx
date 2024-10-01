import React, { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import MainLayout from "./components/Main";
import Modal from "./components/Modal";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('active-modal');
    } else {
      document.body.classList.remove('active-modal');
    }
  }, [isModalOpen]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {isModalOpen && <Modal onClose={toggleModal} />}
      {!isModalOpen && (
        <ChakraProvider>
          <MainLayout setIsModalOpen = {setIsModalOpen} isModalOpen = {isModalOpen}/>
        </ChakraProvider>
      )}
    </>
  );
};

export default App;