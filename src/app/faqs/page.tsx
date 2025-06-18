
"use client";

import { SectionTitle } from '@/components/shared/SectionTitle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

const faqData = [
  {
    question: "What types of personalized gifts do you offer?",
    answer: "We offer a wide range of personalized gifts including custom mugs, 3D crystals, photo frames, engraved wooden items, caricatures, photo lamps, personalized apparel, and much more. Explore our 'Personalised Gifts' section for the full collection."
  },
  {
    question: "How long does it take to receive a personalized order?",
    answer: "Production time for personalized items typically ranges from 2-5 business days, depending on the complexity of the customization. Shipping time is additional and varies based on your location. You can see estimated delivery times at checkout."
  },
  {
    question: "Can I see a preview of my personalized item before it's made?",
    answer: "For many of our personalized items, especially those involving photo uploads or custom text, we offer a digital preview option. This will be indicated on the product page. For complex items like caricatures or 3D models, our artists create a proof that may be sent for approval if significant customization is involved."
  },
  {
    question: "What are your shipping options and costs?",
    answer: "We offer standard and express shipping options. Shipping costs are calculated at checkout based on the order weight and delivery pincode. We often have free shipping offers above a certain order value."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking number and a link to the courier's website. You can also track your order through the 'Track Orders' link in our website footer or from your account dashboard."
  },
  {
    question: "What is your return policy for personalized gifts?",
    answer: "Due to the custom nature of personalized gifts, they are generally non-returnable unless there is a manufacturing defect or an error on our part (e.g., incorrect personalization). Please review your customization details carefully before ordering. If you receive a damaged or incorrect item, please contact our customer support within 48 hours of delivery."
  },
  {
    question: "Do you offer bulk order discounts for corporate gifts?",
    answer: "Yes, we provide special pricing for bulk orders, especially for corporate gifting, events, and employee welcome kits. Please visit our 'Corporate Gifts' section or contact our sales team through the 'Get in Touch' page for a custom quote."
  },
  {
    question: "How do I care for my 3D crystal or photo lamp?",
    answer: "For 3D crystals, gently wipe with a soft, lint-free cloth. Avoid harsh chemicals. For photo lamps, ensure they are kept away from moisture and direct sunlight to preserve the photo quality. Specific care instructions may be provided with your product."
  }
];

export default function FAQsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle className="mb-10 text-center">Frequently Asked Questions</SectionTitle>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqData.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="bg-card border border-border rounded-lg shadow-sm px-2 sm:px-4">
              <AccordionTrigger className="text-left hover:no-underline py-3 sm:py-4 text-sm sm:text-base font-medium text-card-foreground">
                <div className="flex items-center">
                    <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary flex-shrink-0" />
                    {faq.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 sm:pb-4 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6 sm:pl-8">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-2">Can't find the answer you're looking for?</p>
        <Button asChild>
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
