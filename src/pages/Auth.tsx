import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Home, Loader2 } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth = () => {
  const navigate = useNavigate();
  const { user, userRole, signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'customer' as 'admin' | 'customer',
  });

  useEffect(() => {
    if (user && userRole) {
      navigate(userRole === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, userRole, navigate]);

  const validateSignIn = () => {
    const newErrors: Record<string, string> = {};
    
    try {
      emailSchema.parse(signInData.email);
    } catch {
      newErrors.signInEmail = 'Invalid email address';
    }
    
    try {
      passwordSchema.parse(signInData.password);
    } catch {
      newErrors.signInPassword = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUp = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signUpData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    try {
      emailSchema.parse(signUpData.email);
    } catch {
      newErrors.signUpEmail = 'Invalid email address';
    }
    
    try {
      passwordSchema.parse(signUpData.password);
    } catch {
      newErrors.signUpPassword = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn()) return;
    
    setLoading(true);
    await signIn(signInData.email, signInData.password);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;
    
    setLoading(true);
    await signUp(signUpData.email, signUpData.password, signUpData.fullName, signUpData.role);
    setLoading(false);
    setSignUpData({ email: '', password: '', fullName: '', role: 'customer' });
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Home className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI HomeSphere
          </h1>
        </div>

        <Card className="bg-background/95 backdrop-blur-lg border-border/50">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={signInData.email}
                      onChange={(e) => {
                        setSignInData({ ...signInData, email: e.target.value });
                        setErrors({ ...errors, signInEmail: '' });
                      }}
                      required
                    />
                    {errors.signInEmail && (
                      <p className="text-sm text-destructive mt-1">{errors.signInEmail}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => {
                        setSignInData({ ...signInData, password: e.target.value });
                        setErrors({ ...errors, signInPassword: '' });
                      }}
                      required
                    />
                    {errors.signInPassword && (
                      <p className="text-sm text-destructive mt-1">{errors.signInPassword}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      value={signUpData.fullName}
                      onChange={(e) => {
                        setSignUpData({ ...signUpData, fullName: e.target.value });
                        setErrors({ ...errors, fullName: '' });
                      }}
                      required
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => {
                        setSignUpData({ ...signUpData, email: e.target.value });
                        setErrors({ ...errors, signUpEmail: '' });
                      }}
                      required
                    />
                    {errors.signUpEmail && (
                      <p className="text-sm text-destructive mt-1">{errors.signUpEmail}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => {
                        setSignUpData({ ...signUpData, password: e.target.value });
                        setErrors({ ...errors, signUpPassword: '' });
                      }}
                      required
                    />
                    {errors.signUpPassword && (
                      <p className="text-sm text-destructive mt-1">{errors.signUpPassword}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="role">Account Type</Label>
                    <Select
                      value={signUpData.role}
                      onValueChange={(value: 'admin' | 'customer') =>
                        setSignUpData({ ...signUpData, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;