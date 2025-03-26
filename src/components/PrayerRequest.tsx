
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface PrayerRequestProps {
  onClose: () => void;
}

const PrayerRequest: React.FC<PrayerRequestProps> = ({ onClose }) => {
  const [prayer, setPrayer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prayer.trim()) {
      toast({
        title: "Empty Request",
        description: "Please enter your prayer request",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Prayer Received",
      description: "Your prayer request has been received with love and compassion.",
    });
    
    setPrayer("");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-center">Prayer Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground mb-4">
              Share your prayer with us. Your request will be held with reverence and compassion.
            </div>
            
            <Textarea
              placeholder="Type your prayer request here..."
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            
            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-spiritual-deep hover:bg-spiritual-deep/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Prayer"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PrayerRequest;
