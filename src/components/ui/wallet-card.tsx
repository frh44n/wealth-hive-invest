
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";

interface WalletCardProps {
  title: string;
  amount: number;
  type: "deposit" | "withdrawal" | "total";
  currency?: string;
}

export function WalletCard({ title, amount, type, currency = "₹" }: WalletCardProps) {
  const icons = {
    deposit: <ArrowDownLeft className="h-5 w-5 text-investment-green" />,
    withdrawal: <ArrowUpRight className="h-5 w-5 text-investment-red" />,
    total: <Wallet className="h-5 w-5 text-investment-blue" />
  };
  
  const colors = {
    deposit: "bg-green-50 border-investment-green",
    withdrawal: "bg-red-50 border-investment-red",
    total: "bg-blue-50 border-investment-blue"
  };
  
  return (
    <Card className={`${colors[type]} border`}>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">
            {currency}{amount.toFixed(2)}
          </p>
        </div>
        <div className="p-2 rounded-full bg-white">
          {icons[type]}
        </div>
      </CardContent>
    </Card>
  );
}
