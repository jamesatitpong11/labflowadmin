import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Stethoscope,
  AlertCircle,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const demoCredentials = [
    { role: "ผู้ดูแลระบบ", username: "satitpong", password: "admin123456" },
    { role: "แพทย์", username: "doctor", password: "doctor123" },
    { role: "พยาบาล", username: "nurse", password: "nurse123" },
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.username || !formData.password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      setIsLoading(false);
      return;
    }

    try {
      // Try API login with database
      const response = await apiService.login({
        username: formData.username,
        password: formData.password
      });

      if (response.success && response.data) {
        // Store token and user data
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userUsername", response.data.user.username);
        localStorage.setItem("userName", response.data.user.name);
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("userEmail", response.data.user.email);
        
        // Use AuthContext login function
        login(response.data.user.username, response.data.user.name, response.data.user.role, response.data.user.email);
        
        // Navigate to dashboard
        navigate("/");
      } else {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (username: string, password: string) => {
    setFormData(prev => ({ ...prev, username, password }));
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/15 to-pink-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-r from-yellow-400/15 to-orange-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25 transform hover:scale-105 transition-transform duration-300">
            <img src="https://img2.pic.in.th/pic/logo9a23fce12053a876.png" className="h-18 w-18 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              LabFlow Admin
            </h1>
            <p className="text-gray-600 text-lg">ระบบจัดการทางการแพทย์</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto"></div>
          </div>
        </div>

        {/* Enhanced Login Form */}
        <Card className="group relative overflow-hidden backdrop-blur-xl bg-white/90 border-0 shadow-2xl shadow-black/10 rounded-3xl hover:shadow-3xl transition-all duration-500">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-2xl font-semibold text-gray-800">เข้าสู่ระบบ</CardTitle>
            <p className="text-center text-gray-600 text-sm mt-2">กรุณาใส่ข้อมูลเพื่อเข้าสู่ระบบ</p>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">ชื่อผู้ใช้</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="กรอกชื่อผู้ใช้ของคุณ"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">รหัสผ่าน</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="กรอกรหัสผ่านของคุณ"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                    }
                    disabled={isLoading}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                    จดจำการเข้าสู่ระบบ
                  </Label>
                </div>
                <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700 p-0 h-auto font-medium">
                  ลืมรหัสผ่าน?
                </Button>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>กำลังเข้าสู่ระบบ...</span>
                  </div>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
            </form>

          </CardContent>
        </Card>


        {/* Footer */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>เวอร์ชัน 1.0.0</span>
            <span>•</span>
            <span>ปลอดภัย & เชื่อถือได้</span>
          </div>
          <p className="text-xs text-gray-400">
            © 2024 LabFlow Admin. สงวนลิขสิทธิ์.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
