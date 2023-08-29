
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    primary: {
      50: "#ffffff", // White
      900: "#000000", // Black
    },
    
  },
  fonts: {
    body: "Helvetica Neue, sans-serif",
    heading: "Helvetica Neue, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "primary.50", 
        color: "primary.900", 
      },
    },
  },
});

export default theme;
