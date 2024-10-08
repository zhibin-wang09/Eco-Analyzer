import React, { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import MainLayout from "./components/Main";
import Modal from "./components/Modal";

const App: React.FC = () => {

  return (
    <>

        <ChakraProvider>
          <MainLayout/>
        </ChakraProvider>
      
    </>
  );
};

export default App;