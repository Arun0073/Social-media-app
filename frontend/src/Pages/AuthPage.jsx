import SignupCard from "../Components/Signup";
import LoginCard from "../Components/Login";
import { useRecoilValue } from "recoil";
import authScreenAtom from "../atoms/authAtom";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  return( 
  <>
  {authScreenState === "login" ? <LoginCard /> : <SignupCard />}
  </>
  );
};

export default AuthPage;
