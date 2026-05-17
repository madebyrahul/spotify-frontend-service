import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast, { Toaster } from "react-hot-toast";

const server = "http://56.228.32.50:5000";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  playlist: string[];
}

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  btnLoading: boolean,
  loginUser: (
     email: string,
     password: string,
     navigate: (path: string) => void,
  ) => Promise<void> ,
  registerUser: (
    name: string,
    email: string,
    password: string,
    navigate: (path: string) => void,
  ) => Promise<void> ,
  logoutUser: ()=> Promise<void>,
  addToPlaylist: (id : string)=> Promise<void>,
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching user data:", error);
      setLoading(false);
      setIsAuth(false);
    }
  };

  const loginUser = async (
    email: string,
    password: string,
    navigate: (path: string) => void,
  ) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/login`, {
        email,
        password,
      });
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setBtnLoading(false);
      setIsAuth(true);
      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
      setBtnLoading(false);
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string,
    navigate: (path: string) => void,
  ) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/register`, {
        name,
        email,
        password,
      });
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setBtnLoading(false);
      setIsAuth(true);
      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
      setBtnLoading(false);
    }
  };

  const logoutUser = async()=>{
    localStorage.removeItem("token");
    setUser(null)
    setIsAuth(false)
    toast.success("User logout successfully")
  }

  const addToPlaylist = async(id : string)=>{
    try {
      const {data} = await axios.post(`${server}/api/v1/song/${id}`, {} ,{
         headers: {
            token: localStorage.getItem("token")
         }
      })
      toast.success(data.message)
      fetchUser()
    } catch (error : unknown) {
       if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "failed to add song to playlist");
      } else {
        toast.error("failed to add song to playlist");
      }
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuth,
        btnLoading,
        loginUser,
        registerUser,
        logoutUser,
        addToPlaylist,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const useUserData = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
};
