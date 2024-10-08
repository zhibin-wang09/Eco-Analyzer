import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import MainLayout from "./components/Main";
import "./App.css"

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