"use client";

import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, CheckCircle, Gift, Hourglass } from 'lucide-react';
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
    <div className="container mx-auto px-2 py-8 max-w-6xl">
      <SectionTitle className="mb-10 text-center">Get In Touch</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Form */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <Card className="bg-white/90 border-none shadow-xl rounded-2xl flex flex-col h-full justify-between">
            <CardHeader className="bg-gradient-to-r from-primary/90 to-pink-500/80 rounded-t-2xl p-6">
              <CardTitle className="text-2xl sm:text-3xl text-white font-headline flex items-center">
                <Send className="mr-3 h-7 w-7 text-white"/> Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input id="name" type="text" name="name" placeholder="Your Name" className="mt-1.5" disabled={state.submitting} required />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input id="email" type="email" name="email" placeholder="you@example.com" className="mt-1.5" disabled={state.submitting} required />
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="text-xs text-destructive mt-1" />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                  <Input id="subject" type="text" name="subject" placeholder="How can we help?" className="mt-1.5" disabled={state.submitting} required />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                  <Textarea id="message" name="message" placeholder="Your message..." rows={5} className="mt-1.5" disabled={state.submitting} required />
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="text-xs text-destructive mt-1" />
                </div>
                <Button type="submit" size="lg" className="w-full bg-primary text-white hover:bg-primary/90 rounded-lg" disabled={state.submitting}>
                  {state.submitting ? (<><Hourglass className="mr-2 h-4 w-4 animate-pulse" />Sending...</>) : ("Send Message")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Right: Info Sections */}
        <div className="flex flex-col gap-8 h-full">
          <Card className="bg-white/90 border-none shadow-xl rounded-2xl flex-1 flex flex-col justify-between min-h-[180px]">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xl sm:text-2xl text-primary font-headline font-bold flex items-center"><Mail className="mr-2 h-6 w-6 text-primary"/>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-6 pt-2 flex-1 flex flex-col justify-center">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black mb-0.5">Email Us</h3>
                  <a href="mailto:just4u.eml@gmail.com" className="text-base text-muted-foreground hover:text-primary transition-colors">just4u.eml@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black mb-0.5">Call Us</h3>
                  <a href="tel:+919435175238" className="text-base text-muted-foreground hover:text-primary transition-colors">+91 94351 75238 <span className="text-xs">(Mon - Sat, 10 AM - 8 PM)</span></a>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 border-none shadow-xl rounded-2xl flex-1 flex flex-col justify-between min-h-[140px]">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xl sm:text-2xl text-primary font-headline font-bold flex items-center"><Hourglass className="mr-2 h-6 w-6 text-primary"/>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-2 flex-1 flex flex-col justify-center">
              <p className="text-base text-muted-foreground"><span className="font-semibold text-black">Customer Support:</span> Monday - Saturday, 10:00 AM - 06:00 PM (IST)</p>
              <p className="text-base text-muted-foreground"><span className="font-semibold text-black">Online Store:</span> Open 24/7 for browsing and orders!</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 border-none shadow-xl rounded-2xl flex-1 flex flex-col justify-between min-h-[180px]">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xl sm:text-2xl text-primary font-headline font-bold flex items-center"><Gift className="mr-2 h-6 w-6 text-primary"/>Gift Enquiry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-2 flex-1 flex flex-col justify-center">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black mb-0.5">T-19/20, GOLDIGHI MALL</h3>
                  <p className="text-base text-muted-foreground">SILCHAR-788 001, ASSAM<br/>Tel: <a href="tel:03842224017" className="hover:text-primary">03842 224017</a></p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black mb-0.5">R.M. ROAD, BILPAR</h3>
                  <p className="text-base text-muted-foreground">SILCHAR-788001, ASSAM<br/>Tel: <a href="tel:03842222396" className="hover:text-primary">03842 222396</a></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
