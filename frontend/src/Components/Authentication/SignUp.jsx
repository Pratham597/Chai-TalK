import React from "react";
import { Button, VStack } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
const api=import.meta.env.VITE_API_URL
const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState();
  const toast = useToast();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    confirmPassword: "",
    password: "",
  });
  const [OTP, setOTP] = useState();
  const [otpsent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [actualOTP, setActualOTP] = useState()
  const handleChange = (e) => {
    //Exceptionally handling the value for picture.
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const postDetails = async (pics) => {
    setLoading(true);
    if (pics == undefined) {
      toast({
        title: "Please select an Image.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      // chai-talk
      // https://api.cloudinary.com/v1_1/{cloud_name}/image/upload

      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Chai-Talk");
      data.append("cloud-name", "chai-talk");

      let res = await fetch(
        "https://api.cloudinary.com/v1_1/chai-talk/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      res = await res.json();
      setPic(res.url.toString());
      setLoading(false);
    } else {
      toast({
        title: "Please select an Image.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    if (
      form.email.length == 0 ||
      form.confirmPassword.length == 0 ||
      form.password.length == 0 ||
      form.name.length == 0
    ) {
      toast({
        title: "Please filled the all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    else if(form.password!== form.confirmPassword){
      toast({
        title: "Passwords mismatched!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    if(parseInt(actualOTP)!==parseInt(OTP)) {
      toast({
        title: "OTP verification failed!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return 
    }
    setLoading(true);
    try {
      const config={
        headers: {
          "Content-Type": "application/json",
        }
      }
      let {data}=await axios.post(`${api}/api/user`,{...form,profilePic:pic,verify:true},config)
      toast({
        title: "Registration Succesfull",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      localStorage.setItem("user",JSON.stringify(data));
      navigate("/chat");
    } catch (error) {
      let err=JSON.parse(error.request.response).message
      toast({
        title: `${err}`,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      })
    }
    setLoading(false);
  };

  const handleVerify= async ()=>{
    if (
      form.email.length == 0 ||
      form.confirmPassword.length == 0 ||
      form.password.length == 0 ||
      form.name.length == 0
    ) {
      toast({
        title: "Please filled the all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    else if(form.password!== form.confirmPassword){
      toast({
        title: "Passwords mismatched!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    setOtpLoading(true)
    try {
      const config={
        headers: {
          "Content-Type": "application/json",
        }
      }
      const {data}=await axios.post(`${api}/api/user/verifyEmail`,{...form,profilePic:pic},config)
      setActualOTP(data.message)
      setOtpSent(true)
      setOtpLoading(false)
    } catch (error) {
      let err=JSON.parse(error.request.response).message
      toast({
        title: `${err}`,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setOtpLoading(false)
    }
  }
  return (

    <>
      <VStack spacing={"5px"}>
      <FormControl isRequired id="name">
        <FormLabel>Name</FormLabel>
        <Input
          name="name"
          id="name"
          placeholder="Enter your name"
          onChange={handleChange}
          value={form.name}
        />
      </FormControl>

      <FormControl isRequired id="email">
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          id="email"
          placeholder="Enter your email"
          onChange={handleChange}
          type="email"
          value={form.email}
        />
      </FormControl>

      <FormControl isRequired id="password">
        <FormLabel>Password</FormLabel>
        <Input
          name="password"
          id="password"
          placeholder="Enter your password"
          onChange={handleChange}
          type="password"
          value={form.password}
        />
      </FormControl>

      <FormControl isRequired id="confirmPassword">
        <FormLabel>Confirm Password</FormLabel>
        <Input
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Enter your password"
          onChange={handleChange}
          type="password"
          value={form.confirmPassword}
        />
      </FormControl>

      <FormControl isRequired id="pic">
        <FormLabel>Upload your picture</FormLabel>
        <Input
          p={1.5}
          accept="image/"
          placeholder="Enter your password"
          type="file"
          name="pic"
          id="pic"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

        <FormControl display={'flex'} justifyContent={'space-between'} mt={'2'}>
          <Input
            p={1.5}
            w={'60%'}
            type="number"
            placeholder="Enter OTP"
            onChange={(e)=>setOTP(e.target.value)}
            value={OTP}
          />
          <Button
          w={'30%'}
            colorScheme="red"
            onClick={handleVerify}
            isLoading={otpLoading}
            isDisabled={otpsent}
          >
            {otpsent?'OTP SENT':'SEND OTP'}
          </Button>
        </FormControl>

      <Button
        colorScheme="green"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
    </>
  );
};

export default SignUp;
