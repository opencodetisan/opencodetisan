// components/InternalPage.js
import React from "react";
import { Box, Flex, Heading, Text, IconButton } from "@chakra-ui/react";
import { IoSettingsOutline } from "react-icons/io5"; 

function InternalPage() {
  return (
    <Box bg="primary.50" color="primary.900" minHeight="100vh">
      <Flex p={4}>
        {/* Left Menu Bar */}
        <Box w="250px" bg="white" boxShadow="md" p={4}>
          {/* Menu items */}
          <Heading fontSize="xl">Menu</Heading>
          <Text>Item 1</Text>
          <Text>Item 2</Text>
          
        </Box>

        {/* Main Content Area */}
        <Box flex="1" p={4}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading fontSize="2xl">Page Title</Heading>
            <IconButton
              icon={<IoSettingsOutline />}
              aria-label="Settings"
              colorScheme="secondary"
            />
          </Flex>
          <Text>Hello Gais</Text>
          {/* Add more content */}
        </Box>
      </Flex>
    </Box>
  );
}

export default InternalPage;
