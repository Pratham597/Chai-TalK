import React from "react";
import {  IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent,
      ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton

          display={{ base: "flex" }}
          icon={<i class="fa-solid fa-eye"></i>}
          onClick={onOpen}
        />
      )}

      <Modal isCentered  isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent h={'310px'}>
            <ModalHeader
                fontSize='40px'
                fontFamily='Open sans'
                display='flex'
                justifyContent='center'
            >{user.name}
            </ModalHeader>
            <ModalCloseButton/>
            <ModalBody display={'flex'} flexDir={'column'} alignItems='center' justifyContent={'space-between'}>
                <Image
                borderRadius="full"
                boxSize="150px"
                src={user.profilePic}
                alt="User Profile"
                
                />
                <Text
                    fontFamily="Open sans"
                    fontSize={{base:'15px',md:'20px'}}
                >
                    {user.email}
                </Text>
            </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
