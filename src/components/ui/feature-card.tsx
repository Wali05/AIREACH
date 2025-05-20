import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card className={cn(
      "p-1 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10 backdrop-blur-sm", 
      className
    )}>
      <CardContent className="p-6">
        <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-6">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
