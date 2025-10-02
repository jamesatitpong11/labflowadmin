import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor = "text-primary",
  onClick,
}: MetricCardProps) {
  const changeColor = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <Card 
      className={`group relative overflow-hidden bg-white/95 backdrop-blur-xl border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${onClick ? 'cursor-pointer' : ''}`} 
      style={{borderRadius: 'var(--radius-card-mobile)'}}
      onClick={onClick}
    >
      {/* iOS-style background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-50/40 group-hover:from-blue-50/60 group-hover:to-indigo-50/40 transition-all duration-300"></div>
      
      {/* Content */}
      <div className="relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors leading-tight">
            {title}
          </CardTitle>
          <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300 shadow-sm">
            <Icon className={`h-3 w-3 md:h-5 md:w-5 ${iconColor} group-hover:scale-110 transition-transform duration-300`} />
          </div>
        </CardHeader>
        <CardContent className="pt-0 p-3 md:p-6 md:pt-0">
          <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-blue-900 transition-colors">
            {value}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`inline-flex items-center px-2 py-0.5 md:py-1 rounded-full text-xs font-medium shadow-sm ${
              changeType === 'positive' 
                ? 'bg-green-100/80 text-green-700 border border-green-200/50' 
                : changeType === 'negative' 
                ? 'bg-red-100/80 text-red-700 border border-red-200/50' 
                : 'bg-gray-100/80 text-gray-700 border border-gray-200/50'
            }`}>
              {change}
            </div>
          </div>
        </CardContent>
      </div>
      
      {/* iOS-style subtle border */}
      <div className="absolute inset-0 rounded-2xl border border-gray-200/30 group-hover:border-blue-200/60 transition-all duration-300"></div>
    </Card>
  );
}