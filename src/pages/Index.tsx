
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="bg-card border shadow-md p-8 rounded-lg">
          <BookOpen className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-5xl font-playfair font-bold mt-6 mb-4">BookWorm Portal</h1>
          <p className="text-xl text-muted-foreground font-inter mb-8">
            Your gateway to knowledge across multiple libraries and academic resources
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/search")}
            className="text-lg px-8 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Start Searching
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
