import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import  { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme} >
    <ChakraProvider>
        <App />
    </ChakraProvider> 
    </ThemeProvider>
)
