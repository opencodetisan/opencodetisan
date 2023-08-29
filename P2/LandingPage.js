
import React from "react";
import { Box, Flex, Heading, Text, Button } from "@chakra-ui/react";

function LandingPage() {
  return (
    <Box bg="primary.900" color="white" minHeight="100vh">
      <Flex direction="column" align="center" justify="center" h="100%">
        <Heading fontSize="3xl">Welcome to Our Website</Heading>
        <Text fontSize="xl">Explore our services and products.</Text>
        <Button colorScheme="secondary" mt={4}>
          Get Started
        </Button>
      </Flex>
    </Box>
  );
}

export default LandingPage;

