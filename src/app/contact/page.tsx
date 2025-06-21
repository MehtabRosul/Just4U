
"use client";

import { useState } from 'react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from '@emailjs/browser';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormInputs> = (data) => {
    setIsSubmitting(true);
    
    const templateParams = {
        from_name: data.name,
        from_email: data.email,
        to_name: 'Just4UGifts Admin',
        subject: data.subject,
        message: data.message,
    };

    emailjs.send('service_mmjwu98', 'template_h011ksl', templateParams, '6J95jhpJq1H5ujSlF')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        reset();
      }, (error) => {
        console.log('FAILED...', error);
        console.error("Error sending email via EmailJS: ", error);
        toast({
          title: "Submission Failed",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      }).finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle className="mb-10 text-center">Get In Touch</SectionTitle>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Contact Form */}
        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-card-foreground font-headline flex items-center">
              <Send className="mr-3 h-6 w-6 text-primary"/> Send Us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  {...register("name")}
                  className={`mt-1.5 ${errors.name ? 'border-destructive focus:ring-destructive' : 'border-input'}`}
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`mt-1.5 ${errors.email ? 'border-destructive focus:ring-destructive' : 'border-input'}`}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="How can we help?"
                  {...register("subject")}
                  className={`mt-1.5 ${errors.subject ? 'border-destructive focus:ring-destructive' : 'border-input'}`}
                  disabled={isSubmitting}
                />
                {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <Label htmlFor="message" className="text-sm font-medium text-foreground">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  rows={5}
                  {...register("message")}
                  className={`mt-1.5 ${errors.message ? 'border-destructive focus:ring-destructive' : 'border-input'}`}
                  disabled={isSubmitting}
                />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
              </div>

              <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
           <Card className="bg-card border-border shadow-md">
            <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-card-foreground font-headline">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start">
                    <Mail className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-foreground">Email Us</h3>
                        <a href="mailto:support@just4ugifts.com" className="text-sm text-muted-foreground hover:text-primary">
                            support@just4ugifts.com
                        </a>
                    </div>
                </div>
                 <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-foreground">Call Us</h3>
                        <a href="tel:+911234567890" className="text-sm text-muted-foreground hover:text-primary">
                            +91 123 456 7890 (Mon-Sat, 10 AM - 6 PM)
                        </a>
                    </div>
                </div>
                 <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-foreground">Our Office</h3>
                        <p className="text-sm text-muted-foreground">
                            123 Gift Lane, Celebration City, India 400001
                        </p>
                    </div>
                </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border shadow-md">
            <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-card-foreground font-headline">Operating Hours</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-1"><span className="font-medium text-foreground">Customer Support:</span> Monday - Saturday, 10:00 AM - 06:00 PM (IST)</p>
                <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Online Store:</span> Open 24/7 for browsing and orders!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
