import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <p className="text-muted-foreground">ไม่พบหน้าที่ค้นหา</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            ขออภัย หน้าที่คุณกำลังค้นหาไม่มีอยู่ในระบบ
          </p>
          <Button asChild>
            <a href="/">
              กลับสู่หน้าแรก
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
