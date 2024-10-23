import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Main from "./components/Main";
import "./App.css"

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Main />
    </ChakraProvider>
  );
};

export default App;