import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createUser, findUserByMobile } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const existingUser = await findUserByMobile(formData.mobile);
      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "A user with this mobile number already exists.",
        });
        return;
      }

      const record = await createUser(
        formData.firstName,
        formData.lastName,
        formData.mobile
      );

      if (record) {
        setUser({
          id: record.id,
          firstName: record.fields['First Name'] as string,
          lastName: record.fields['Last Name'] as string,
          mobile: record.fields.Mobile as string,
        });
        navigate('/');
        toast({
          title: "Welcome to MySitterSquad!",
          description: "Your account has been created successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm shadow-sm h-14 px-4">
        <div className="h-full max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold text-primary">MySitterSquad</span>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/login")}
            className="text-primary hover:text-primary/90"
          >
            Login
          </Button>
        </div>
      </nav>

      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/lovable-uploads/174009da-8c34-4772-9bae-d734e0d5f625.png')",
        }}
      >
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Headlines */}
            <div className="space-y-6 p-6 rounded-lg bg-black/10 backdrop-blur-sm">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 text-shadow-lg hidden md:block">
                MySitterSquad
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight animate-slide-up text-shadow-lg">
                Book Trusted Babysitters in Seconds
              </h2>
              <p className="text-xl text-white text-shadow">
                Say goodbye to scheduling stress—arrange reliable child care in just a few clicks!
              </p>
            </div>

            {/* Right Column - Sign Up Form */}
            <Card className="p-6 bg-white/90 shadow-xl animate-slide-up">
              <CardContent>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Sign Up For Free</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="First Name"
                    className="bg-white/80 border-gray-200"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Last Name"
                    className="bg-white/80 border-gray-200"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <PhoneNumberInput
                      id="mobile"
                      value={formData.mobile}
                      onChange={(value) =>
                        setFormData({ ...formData, mobile: value || "" })
                      }
                      placeholder="Enter your mobile number"
                      className="bg-white/80 border-gray-200"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                  <div className="text-center text-gray-600">
                    Already have an account?{" "}
                    <Button 
                      variant="link" 
                      onClick={() => navigate("/login")}
                      className="text-primary hover:text-primary/90 p-0"
                    >
                      Login
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
