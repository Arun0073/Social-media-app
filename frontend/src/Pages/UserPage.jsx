import { useEffect, useState } from "react";
import UserHeader from "../Components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from '../Components/Post'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useRecoilState } from "recoil";
import postsAtom from '../atoms/postAtom'

const UserPage = () => {
  const{user,loading}=useGetUserProfile()
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
   

    const getPosts = async () => {
      setFetchingPosts(true);
      if (!user) return;
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [username, showToast,user,setPosts]);
  if (!user && loading) {
    <Flex justifyContent={"center"}>
      <Spinner size="xl" />
    </Flex>;
  }
  if (!user && loading) {
    <h1>User not Found</h1>;
  }
  if (!user) return null;
  return (
    <>
      <UserHeader user={user} />

      {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;
