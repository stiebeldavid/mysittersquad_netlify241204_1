import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createUser, findUserByMobile } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Card, CardContent } from "@/components/ui/card";

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
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/lovable-uploads/ba8bdb57-a6ba-4ff3-a3b3-a8892f151b01.png')",
        }}
      >
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Headlines */}
            <div className="space-y-6">
              <h1 className="text-6xl font-bold text-primary mb-4">
                MySitterSquad
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight animate-slide-up">
                Schedule Your Babysitters Easier
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 animate-slide-up">
                Book child care in a snap, from your trusted circle of babysitters!
              </p>
            </div>

            {/* Right Column - Sign Up Form */}
            <Card className="p-6 bg-white/90 shadow-xl animate-slide-up">
              <CardContent>
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
                  <PhoneNumberInput
                    value={formData.mobile}
                    onChange={(value) =>
                      setFormData({ ...formData, mobile: value || "" })
                    }
                    placeholder="Mobile Number"
                    className="bg-white/80 border-gray-200"
                    required
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                  <p className="text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Button 
                      variant="link" 
                      onClick={() => navigate("/login")}
                      className="text-primary hover:text-primary/90"
                    >
                      Login
                    </Button>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/80 py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="space-y-4 text-center p-6 rounded-lg hover:bg-white/80 transition-colors">
                <h3 className="text-2xl font-semibold text-gray-800">Your Trusted Network</h3>
                <p className="text-gray-600">
                  Interact and request babysitting from people you already know and trust. No strangers.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-4 text-center p-6 rounded-lg hover:bg-white/80 transition-colors">
                <h3 className="text-2xl font-semibold text-gray-800">One-Click Requests</h3>
                <p className="text-gray-600">
                  Send your request to multiple babysitters with one click. Avoid the messaging chaos.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-4 text-center p-6 rounded-lg hover:bg-white/80 transition-colors">
                <h3 className="text-2xl font-semibold text-gray-800">Easy Scheduling</h3>
                <p className="text-gray-600">
                  Create and manage babysitting requests effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;