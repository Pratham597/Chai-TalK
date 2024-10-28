// PageNotFound.jsx
import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <Box
      textAlign="center"
      py={10}
      px={6}
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Box maxW="md" mx="auto">
        <Heading
          as="h1"
          fontSize="6xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          404
        </Heading>
        <Text fontSize="xl" mt={4} color="gray.600">
          Oops! The page you are looking for does not exist.
        </Text>
        <Text mt={2} color="gray.500">
          It seems you might have mistyped the URL, or the page has moved.
        </Text>
        <Link to="/">
          <Button
            mt={8}
            colorScheme="teal"
            bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
            color="white"
            _hover={{
              bgGradient: 'linear(to-r, teal.500, teal.600, teal.700)',
            }}
          >
            Go back to Home
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default PageNotFound;
