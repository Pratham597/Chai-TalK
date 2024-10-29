import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { data } from "autoprefixer";
import { Helmet } from "react-helmet";
import axios from 'axios'
const api=import.meta.env.VITE_API_URL


const Login = () => {
  const toast = useToast();
  const [form, setForm] = useState({ emailLogin: "", passwordLogin: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //Handler for input.

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //Handler for submit.
  const submitHandler = async () => {
    

    if(!form.emailLogin || !form.passwordLogin){
      toast({
        title: 'Please fill all fields',
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return 
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);
      const { data } = await axios.post(`${api}/api/user/login`, { ...form }, config);
      
      toast({
        title: 'Login Successful',
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/chat");
    } catch (error) {
      let err=JSON.parse(error.request.response).message
      toast({
        title: `${err}`,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
    
  };

  return (
    <>
      <VStack>
        <FormControl isRequired id="emailLogin">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="emailLogin"
            id="emailLogin"
            onChange={handleChange}
            value={form.emailLogin}
          />
        </FormControl>
        <FormControl isRequired id="passwordLogin">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="passwordLogin"
            id="passwordLogin"
            onChange={handleChange}
            value={form.passwordLogin}
          />
        </FormControl>

        <Button
          colorScheme="green"
          width={"100%"}
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>

        <Button
          colorScheme="red"
          width={"100%"}
          onClick={() => {
            setForm({
              emailLogin: "guest@example.com",
              passwordLogin: "12345678",
            });
          }}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
    </>
  );
};

export default Login;
