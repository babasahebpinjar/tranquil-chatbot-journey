
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getDailyQuote } from "@/utils/api";

interface DailyQuoteProps {
  className?: string;
}

const DailyQuote: React.FC<DailyQuoteProps> = ({ className }) => {
  const quote = getDailyQuote();
  const [text, author] = quote.split(" - ");

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-spiritual-deep text-4xl font-light mb-2">"</div>
          <p className="text-lg font-light italic">{text}</p>
          {author && (
            <div className="text-sm text-muted-foreground mt-2">
              — {author}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyQuote;
