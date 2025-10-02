import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiService } from "@/services/api";

interface User {
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  name: string;
  role: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, name: string, role?: string, email?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("authToken");
      
      if (token) {
        try {
          const response = await apiService.verifyToken(token);
          if (response.success && response.data?.user) {
            setUser(response.data.user);
          } else {
            // Invalid token, clear storage
            localStorage.removeItem("authToken");
            localStorage.removeItem("userUsername");
            localStorage.removeItem("userName");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          // Clear invalid token
          localStorage.removeItem("authToken");
          localStorage.removeItem("userUsername");
          localStorage.removeItem("userName");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userEmail");
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (username: string, name: string, role: string = "ผู้ใช้งาน", email?: string) => {
    const userData = { username, name, role, email };
    setUser(userData);
    // Note: Don't override the token here as it's set in the Login component
    localStorage.setItem("userUsername", username);
    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", role);
    if (email) {
      localStorage.setItem("userEmail", email);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userUsername");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
