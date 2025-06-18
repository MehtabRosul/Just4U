
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn, UserPlus, KeyRound } from 'lucide-react';
import { SiteLogo } from '@/components/layout/SiteLogo';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});
type LoginInputs = z.infer<typeof loginSchema>;

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});
type SignUpInputs = z.infer<typeof signUpSchema>;

export default function AuthPage() {
  const router = useRouter();
  const { user, signInWithGoogle, signInWithEmailPass, createUserWithEmailPass, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);


  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const { register: registerSignUp, handleSubmit: handleSignUpSubmit, formState: { errors: signUpErrors }, reset: resetSignUpForm } = useForm<SignUpInputs>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/account');
    }
  }, [user, authLoading, router]);

  const onLogin: SubmitHandler<LoginInputs> = async (data) => {
    setIsSubmitting(true);
    const success = await signInWithEmailPass(data.email, data.password);
    if (success) {
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push('/account');
    }
    // Error toast is handled within signInWithEmailPass
    setIsSubmitting(false);
  };

  const onSignUp: SubmitHandler<SignUpInputs> = async (data) => {
    setIsSubmitting(true);
    const success = await createUserWithEmailPass(data.email, data.password);
    if (success) {
      toast({ title: "Sign Up Successful", description: "Welcome! Your account has been created." });
      router.push('/account');
      resetSignUpForm();
    }
    // Error toast is handled within createUserWithEmailPass
    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    await signInWithGoogle();
    // Redirection and toast are handled by useAuth and useEffect
    // No need to set isGoogleSubmitting to false here if redirection happens
    // but if it might fail and stay on page:
    setIsGoogleSubmitting(false); 
  };
  
  if (authLoading && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-background via-secondary to-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <div className="mb-8">
        <SiteLogo />
      </div>
      <Card className="w-full max-w-md shadow-2xl bg-card border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline text-card-foreground">Welcome</CardTitle>
          <CardDescription className="text-muted-foreground">
            Access your account or create a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
              <TabsTrigger value="login" className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-card-foreground">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    {...registerLogin("email")}
                    className={`mt-1 ${loginErrors.email ? 'border-destructive focus:ring-destructive' : 'border-input text-card-foreground bg-background placeholder:text-input-placeholder'}`}
                  />
                  {loginErrors.email && <p className="text-xs text-destructive mt-1">{loginErrors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="login-password" className="text-card-foreground">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    {...registerLogin("password")}
                    className={`mt-1 ${loginErrors.password ? 'border-destructive focus:ring-destructive' : 'border-input text-card-foreground bg-background placeholder:text-input-placeholder'}`}
                  />
                  {loginErrors.password && <p className="text-xs text-destructive mt-1">{loginErrors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUpSubmit(onSignUp)} className="space-y-4">
                <div>
                  <Label htmlFor="signup-email" className="text-card-foreground">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    {...registerSignUp("email")}
                    className={`mt-1 ${signUpErrors.email ? 'border-destructive focus:ring-destructive' : 'border-input text-card-foreground bg-background placeholder:text-input-placeholder'}`}
                  />
                  {signUpErrors.email && <p className="text-xs text-destructive mt-1">{signUpErrors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="signup-password" className="text-card-foreground">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Choose a strong password"
                    {...registerSignUp("password")}
                    className={`mt-1 ${signUpErrors.password ? 'border-destructive focus:ring-destructive' : 'border-input text-card-foreground bg-background placeholder:text-input-placeholder'}`}
                  />
                  {signUpErrors.password && <p className="text-xs text-destructive mt-1">{signUpErrors.password.message}</p>}
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-card-foreground">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    {...registerSignUp("confirmPassword")}
                    className={`mt-1 ${signUpErrors.confirmPassword ? 'border-destructive focus:ring-destructive' : 'border-input text-card-foreground bg-background placeholder:text-input-placeholder'}`}
                  />
                  {signUpErrors.confirmPassword && <p className="text-xs text-destructive mt-1">{signUpErrors.confirmPassword.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
                   {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting}
          >
            {isGoogleSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.2 512 0 398.8 0 256S110.2 0 244 0c70.8 0 133.4 29.2 178.7 76.9L380.4 170.7C354.1 147.4 302.9 127.6 244 127.6c-66.8 0-120.9 54.3-120.9 121.2s54.1 121.2 120.9 121.2c47.4 0 86.1-29.2 102.9-69.7H244V261.8h244z"></path>
            </svg>
            }
            Sign in with Google
          </Button>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
