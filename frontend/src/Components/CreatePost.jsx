import { AddIcon } from "@chakra-ui/icons";
import { BsFillImageFill } from "react-icons/bs";
import { BiSolidVideo } from "react-icons/bi";
import { Box } from "@chakra-ui/react";
import { PiLinkSimpleBold } from "react-icons/pi";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import usePreviewVideo from "../hooks/usePreviewVideo";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from '../atoms/postAtom'
import useShowToast from "../hooks/useShowToast";
import{useParams} from 'react-router-dom'

const MAX_CHAR = 500;
const CreatePost = () => {
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const { handleVideoChange, videoUrl, setVideoUrl } = usePreviewVideo();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [postText, setPostText] = useState("");
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const[posts,setPosts]=useRecoilState(postsAtom)
  const [loading, setLoading] = useState(false);
  const{username}=useParams();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
          video:videoUrl,
          link:linkUrl,
        }),
      });

      const data = await res.json();
      console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post created successfully", "success");
      if(username===user.username){

        setPosts([data,...posts]);
      }
      onClose();
      setPostText("");
      setImgUrl("");
      setVideoUrl("");
      setLinkUrl("");
    } catch (error) {
      showToast("Error", error, "error");
    }
    finally {
			setLoading(false);
		}
  };

  const LinkEmbedModal = () => (
  <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Embed Link</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl>
          <Input
            placeholder="Paste your URL here.."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button  colorScheme="blue" mr={3} onClick={() => {
          setIsLinkModalOpen(false); 
          showToast("Success","Link Embedded","success");
        }}>
          Embed
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        size={{ base: "sm", sm: "md" }}
        onClick={onOpen}
      >
        <AddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="What's in Your Mind!!"
                onChange={handleTextChange}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              <Box display="flex" alignItems="center">
                <Box>
                  <Input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={imageRef}
                    onChange={handleImageChange}
                  />
                  <BsFillImageFill
                    style={{ marginLeft: "5px", cursor: "pointer" }}
                    size={16}
                    onClick={() => imageRef.current.click()}
                  />
                </Box>
                <Box>
                  <Input
                    type="file"
                    accept="video/*"
                    hidden
                    ref={videoRef}
                    onChange={handleVideoChange}
                  />
                  <BiSolidVideo
                    style={{ marginLeft: "5px", cursor: "pointer" }}
                    size={20}
                    onClick={() => videoRef.current.click()}
                  />
                </Box>
                <Box>
                <LinkEmbedModal />
                  <PiLinkSimpleBold
                    style={{ marginLeft: "5px", cursor: "pointer" }}
                    size={18}
                    onClick={() => setIsLinkModalOpen(true)}
                   
                  />
                </Box>
              </Box>
            </FormControl>
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
            {videoUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Box as="video" controls width="400px">
                  <source src={videoUrl} type="video/mp4" />
                </Box>
                <CloseButton
                  onClick={() => {
                    setVideoUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
