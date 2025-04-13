
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Coins } from "lucide-react";

interface PlanCardProps {
  id: string;
  name: string;
  price: number;
  validity: number;
  dailyEarning: number;
  image?: string;
  description?: string;
  onBuy: (id: string) => void;
}

export function PlanCard({
  id,
  name,
  price,
  validity,
  dailyEarning,
  image,
  description,
  onBuy
}: PlanCardProps) {
  const totalReturn = dailyEarning * validity;
  const roi = ((totalReturn - price) / price) * 100;
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-40 bg-cover bg-center" 
        style={{ 
          backgroundImage: image 
            ? `url(${image})` 
            : `linear-gradient(to right, #9b87f5, #7E69AB)` 
        }}
      />
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{name}</h3>
        {description && <p className="text-gray-500 text-sm my-2">{description}</p>}
        
        <div className="my-4">
          <div className="text-2xl font-bold">₹{price.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Investment amount</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <div>
              <div className="text-sm font-medium">{validity} Days</div>
              <div className="text-xs text-gray-500">Validity</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Coins className="h-4 w-4 mr-2 text-primary" />
            <div>
              <div className="text-sm font-medium">₹{dailyEarning}/day</div>
              <div className="text-xs text-gray-500">Daily Earning</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-2 rounded-md text-center my-2">
          <div className="text-sm font-medium">
            Total ROI: <span className="text-investment-green">{roi.toFixed(2)}%</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-primary hover:bg-primary-dark"
          onClick={() => onBuy(id)}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
