import React, { useContext } from "react";
import { TabPanel, Tab, TabPanels, TabList, Tabs } from "@chakra-ui/react";
import Login from '../Components/Authentication/Login'
import SignUp from '../Components/Authentication/SignUp'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {Helmet} from "react-helmet"
const HomePage = () => {
  let navigate=useNavigate()
  useEffect(() => {
    const user=JSON.parse(localStorage.getItem("user"))
    if(user) navigate('/chat') 
  }, [navigate])
  
  return (
    <>
    <Helmet>
      <title>Chai-TalK | User</title>
    </Helmet>
      <div  className="container h-full my-auto mx-auto  flex flex-col gap-2">
        <h1 className="text-4xl p-4 w-[100%] sm:w-[75%] md:w-[50%]  mx-auto text-center bg-white text-black rounded-md">
          Chai-TalK
        </h1>
        <div className="w-[100%] sm:w-[75%]  md:w-[50%] mx-auto bg-white rounded-md p-4 ">
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList mb='1em'>
              <Tab width='50%'>Login</Tab>
              <Tab width='50%'>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login/>
              </TabPanel>
              <TabPanel>
                <SignUp/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default HomePage;
