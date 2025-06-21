
"use client";

import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

export default function ContactPage() {
  const [state, handleSubmit] = useForm("xblyaeez");

  if (state.succeeded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SectionTitle className="mb-10 text-center">Message Sent!</SectionTitle>
        <Card className="bg-card border-border shadow-lg max-w-lg mx-auto text-center p-6 sm:p-8">
          <CardHeader>
             <CheckCircle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-green-500 mb-4" />
            <CardTitle className="text-xl sm:text-2xl text-card-foreground">Thank You!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your message has been sent successfully. We'll get back to you as soon as possible.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="mt-1.5 border-input"
                  disabled={state.submitting}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="mt-1.5 border-input"
                  disabled={state.submitting}
                  required
                />
                 <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                    className="text-xs text-destructive mt-1"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="How can we help?"
                  className="mt-1.5 border-input"
                  disabled={state.submitting}
                  required
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-sm font-medium text-foreground">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message..."
                  rows={5}
                  className="mt-1.5 border-input"
                  disabled={state.submitting}
                  required
                />
                <ValidationError 
                    prefix="Message" 
                    field="message"
                    errors={state.errors}
                    className="text-xs text-destructive mt-1"
                />
              </div>

              <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={state.submitting}>
                {state.submitting ? (
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
