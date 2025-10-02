import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { apiService } from "@/services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roles = [
    { value: "ผู้ดูแลระบบ", label: "ผู้ดูแลระบบ" },
    { value: "แพทย์", label: "แพทย์" },
    { value: "พยาบาล", label: "พยาบาล" },
    { value: "เจ้าหน้าที่", label: "เจ้าหน้าที่" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate input
    if (!formData.email || !formData.password || !formData.name || !formData.role) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง");
      setIsLoading(false);
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      setIsLoading(false);
      return;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      });

      if (response.success) {
        setSuccess("สร้างบัญชีสำเร็จ! กำลังเปลี่ยนเส้นทางไปหน้าเข้าสู่ระบบ...");
        
        // Clear form
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
          role: "",
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.message || "เกิดข้อผิดพลาดในการสร้างบัญชี");
      }
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/25 transform hover:scale-105 transition-transform duration-300">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              สร้างบัญชีใหม่
            </h1>
            <p className="text-gray-600 text-lg">สำหรับระบบ LabFlow Admin</p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto"></div>
          </div>
        </div>

        {/* Back to Login */}
        <div className="flex justify-center">
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>

        {/* Register Form */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-black/10">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-2xl font-semibold text-gray-800">ลงทะเบียนผู้ใช้ใหม่</CardTitle>
            <p className="text-center text-gray-600 text-sm mt-2">กรุณากรอกข้อมูลเพื่อสร้างบัญชี</p>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="กรอกชื่อ-นามสกุลของคุณ"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">อีเมล</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="กรอกอีเมลของคุณ"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Role Field */}
              <div className="space-y-3">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">บทบาท</Label>
                <Select value={formData.role} onValueChange={handleRoleChange} disabled={isLoading}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200">
                    <SelectValue placeholder="เลือกบทบาทของคุณ" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">รหัสผ่าน</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="กรอกรหัสผ่านของคุณ (อย่างน้อย 6 ตัวอักษร)"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200"
                    disabled={isLoading}
                    required
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

              {/* Confirm Password Field */}
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">ยืนยันรหัสผ่าน</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>กำลังสร้างบัญชี...</span>
                  </div>
                ) : (
                  "สร้างบัญชี"
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

export default Register;
