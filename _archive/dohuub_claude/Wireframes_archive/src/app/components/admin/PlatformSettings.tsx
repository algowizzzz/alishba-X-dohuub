import { useState } from "react";
import {
  Save,
  Trash2,
  Plus,
  Eye,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  EyeOff,
  CreditCard,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface ServiceOffer {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface BenefitPoint {
  id: string;
  text: string;
}

export function PlatformSettings() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const [activeTab, setActiveTab] = useState("help");

  // Help & Support Tab State
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: "1",
      question: "How do I book a service?",
      answer: "Browse services, select provider, choose date/time, confirm booking",
    },
    {
      id: "2",
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards, debit cards, PayPal, Apple Pay, and Google Pay",
    },
    {
      id: "3",
      question: "How do I change my location?",
      answer: "Go to account settings and update your location preferences",
    },
    {
      id: "4",
      question: "What is the AI Assistant?",
      answer: "24/7 intelligent chatbot that helps you find services and track bookings",
    },
  ]);
  const [supportEmail, setSupportEmail] = useState("support@dohuub.com");

  // Terms of Service Tab State
  const [termsContent, setTermsContent] = useState(`
    <h3>1. Acceptance of Terms</h3>
    <p>By accessing and using DoHuub's services, you accept and agree to be bound by the terms and provisions of this agreement.</p>
    <h3>2. Use of Services</h3>
    <p>DoHuub provides a platform connecting users with service providers. You agree to use our services only for lawful purposes.</p>
    <h3>3. Booking and Payments</h3>
    <p>All bookings are subject to availability and confirmation. Payment is required at the time of booking.</p>
  `);

  // Privacy Policy Tab State
  const [privacyContent, setPrivacyContent] = useState(`
    <h3>1. Information We Collect</h3>
    <p>We collect information that you provide directly to us, including name, email, phone number, and location.</p>
    <h3>2. How We Use Your Information</h3>
    <p>We use the information we collect to provide, maintain, and improve our services.</p>
    <h3>3. Information Sharing</h3>
    <p>We do not sell your personal information. We may share your information with service providers to complete your bookings.</p>
  `);

  // About DoHuub Tab State
  const [mission, setMission] = useState(
    "DoHuub is your all-in-one lifestyle super-app, designed to simplify your daily life by connecting you with trusted service providers. From cleaning and handyman services to beauty treatments and caregiving support, we bring infinite services right to your fingertips."
  );

  const [serviceOffers, setServiceOffers] = useState<ServiceOffer[]>([
    {
      id: "1",
      icon: "🧹",
      title: "Cleaning Services",
      description: "Professional home and office cleaning",
    },
    {
      id: "2",
      icon: "🔧",
      title: "Handyman Services",
      description: "Expert repairs and maintenance",
    },
    {
      id: "3",
      icon: "🛒",
      title: "Groceries & Food",
      description: "Fresh groceries and meals delivered",
    },
    {
      id: "4",
      icon: "💅",
      title: "Beauty on Demand",
      description: "Salon services at your location",
    },
    {
      id: "5",
      icon: "🏠",
      title: "Rental Properties",
      description: "Find your perfect home",
    },
    {
      id: "6",
      icon: "❤️",
      title: "Caregiving Services",
      description: "Ride assistance and companionship",
    },
  ]);

  const [benefitPoints, setBenefitPoints] = useState<BenefitPoint[]>([
    { id: "1", text: "Verified and trusted service providers" },
    { id: "2", text: "Secure and seamless payment processing" },
    { id: "3", text: "Real-time order tracking and updates" },
    { id: "4", text: "24/7 AI-powered customer support" },
    { id: "5", text: "Flexible scheduling and instant booking" },
    { id: "6", text: "Transparent pricing with no hidden fees" },
  ]);

  const [contactInfo, setContactInfo] = useState({
    email: "support@dohuub.com",
    phone: "1-800-DOHUUB1",
    phoneNumeric: "1-800-364-8821",
    addressLine1: "123 Service Lane, Suite 100",
    addressLine2: "San Francisco, CA 94105",
    website: "www.dohuub.com",
  });

  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://instagram.com/dohuub",
    facebook: "https://facebook.com/dohuub",
    twitter: "https://twitter.com/dohuub",
    linkedin: "https://linkedin.com/company/dohuub",
  });

  // Payment Settings Tab State
  const [stripePublishableKey, setStripePublishableKey] = useState(
    "pk_test_51234567890abcdef..."
  );
  const [stripeSecretKey, setStripeSecretKey] = useState(
    "sk_test_51234567890abcdef..."
  );
  const [showSecretKey, setShowSecretKey] = useState(false);

  // FAQ Functions
  const addFAQ = () => {
    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question: "",
      answer: "",
    };
    setFaqs([...faqs, newFAQ]);
  };

  const updateFAQ = (id: string, field: "question" | "answer", value: string) => {
    setFaqs(
      faqs.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq))
    );
  };

  const deleteFAQ = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  // Benefit Point Functions
  const addBenefitPoint = () => {
    const newPoint: BenefitPoint = {
      id: Date.now().toString(),
      text: "",
    };
    setBenefitPoints([...benefitPoints, newPoint]);
  };

  const updateBenefitPoint = (id: string, text: string) => {
    setBenefitPoints(
      benefitPoints.map((point) => (point.id === id ? { ...point, text } : point))
    );
  };

  const deleteBenefitPoint = (id: string) => {
    setBenefitPoints(benefitPoints.filter((point) => point.id !== id));
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="settings"
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Settings
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage help documentation, terms, privacy, and company information
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Desktop Tabs */}
            <div className="hidden lg:block">
              <TabsList className="w-full justify-start bg-white border border-[#E5E7EB] rounded-t-xl h-[52px] p-0 mb-0">
                <TabsTrigger
                  value="help"
                  className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
                >
                  Help & Support
                </TabsTrigger>
                <TabsTrigger
                  value="terms"
                  className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
                >
                  Terms of Service
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
                >
                  Privacy Policy
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
                >
                  About DoHuub
                </TabsTrigger>
                <TabsTrigger
                  value="payments"
                  className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
                >
                  Payment Settings
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Mobile Tab Selector */}
            <div className="lg:hidden mb-4">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="h-12 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="help">Help & Support</SelectItem>
                  <SelectItem value="terms">Terms of Service</SelectItem>
                  <SelectItem value="privacy">Privacy Policy</SelectItem>
                  <SelectItem value="about">About DoHuub</SelectItem>
                  <SelectItem value="payments">Payment Settings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tab Content Container */}
            <div className="bg-white border border-[#E5E7EB] border-t-0 rounded-b-xl lg:rounded-t-none p-6 lg:p-8">
              {/* Help & Support Tab */}
              <TabsContent value="help" className="mt-0 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937] mb-2">
                    Help & Support
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-6">
                    Manage FAQs and contact information
                  </p>

                  {/* FAQs Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-[#1F2937]">
                        Frequently Asked Questions
                      </h3>
                      <Button onClick={addFAQ} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New FAQ
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {faqs.map((faq) => (
                        <div
                          key={faq.id}
                          className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-5"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 mr-4">
                              <Label htmlFor={`question-${faq.id}`} className="mb-1.5">
                                Question
                              </Label>
                              <Input
                                id={`question-${faq.id}`}
                                value={faq.question}
                                onChange={(e) =>
                                  updateFAQ(faq.id, "question", e.target.value)
                                }
                                placeholder="How do I book a service?"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteFAQ(faq.id)}
                              className="text-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEE2E2] mt-6"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div>
                            <Label htmlFor={`answer-${faq.id}`} className="mb-1.5">
                              Answer
                            </Label>
                            <Textarea
                              id={`answer-${faq.id}`}
                              value={faq.answer}
                              onChange={(e) =>
                                updateFAQ(faq.id, "answer", e.target.value)
                              }
                              placeholder="Browse services, select provider, choose date/time, confirm booking"
                              rows={3}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Us Section */}
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-[#1F2937] mb-4">
                      Contact Us
                    </h3>
                    <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-5">
                      <Label htmlFor="support-email" className="mb-1.5">
                        Email Support
                      </Label>
                      <Input
                        id="support-email"
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        placeholder="support@dohuub.com"
                      />
                    </div>
                  </div>

                  <Button className="w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </TabsContent>

              {/* Terms of Service Tab */}
              <TabsContent value="terms" className="mt-0">
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937] mb-2">
                    Terms of Service
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-6">
                    Edit platform terms of service
                  </p>

                  <div className="mb-6">
                    <Textarea
                      value={termsContent}
                      onChange={(e) => setTermsContent(e.target.value)}
                      rows={15}
                      className="font-mono text-sm"
                      placeholder="Enter terms of service content..."
                    />
                    <div className="flex items-center justify-between mt-4 text-xs text-[#6B7280]">
                      <span>{termsContent.replace(/<[^>]*>/g, "").length} characters</span>
                      <span>Last updated: Jan 7, 2026</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Privacy Policy Tab */}
              <TabsContent value="privacy" className="mt-0">
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937] mb-2">
                    Privacy Policy
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-6">
                    Edit platform privacy policy
                  </p>

                  <div className="mb-6">
                    <Textarea
                      value={privacyContent}
                      onChange={(e) => setPrivacyContent(e.target.value)}
                      rows={15}
                      className="font-mono text-sm"
                      placeholder="Enter privacy policy content..."
                    />
                    <div className="flex items-center justify-between mt-4 text-xs text-[#6B7280]">
                      <span>{privacyContent.replace(/<[^>]*>/g, "").length} characters</span>
                      <span>Last updated: Jan 7, 2026</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* About DoHuub Tab */}
              <TabsContent value="about" className="mt-0 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937] mb-2">
                    About DoHuub
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-6">
                    Edit company information and mission
                  </p>

                  {/* Our Mission */}
                  <div className="mb-8">
                    <Label htmlFor="mission" className="mb-1.5">
                      Our Mission
                    </Label>
                    <Textarea
                      id="mission"
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                      rows={4}
                      maxLength={300}
                    />
                    <p className="text-xs text-[#6B7280] mt-1">
                      {mission.length}/300 characters
                    </p>
                  </div>

                  {/* What We Offer */}
                  <div className="mb-8">
                    <h3 className="text-base font-semibold text-[#1F2937] mb-4">
                      What We Offer
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {serviceOffers.map((offer) => (
                        <div
                          key={offer.id}
                          className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-5"
                        >
                          <div className="text-2xl mb-3">{offer.icon}</div>
                          <h4 className="text-base font-semibold text-[#1F2937] mb-2">
                            {offer.title}
                          </h4>
                          <p className="text-sm text-[#6B7280]">{offer.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why Choose DoHuub */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-[#1F2937]">
                        Why Choose DoHuub?
                      </h3>
                      <Button onClick={addBenefitPoint} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Bullet Point
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {benefitPoints.map((point) => (
                        <div key={point.id} className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input
                              value={point.text}
                              onChange={(e) =>
                                updateBenefitPoint(point.id, e.target.value)
                              }
                              placeholder="Enter benefit point"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBenefitPoint(point.id)}
                            className="text-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEE2E2]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-8">
                    <h3 className="text-base font-semibold text-[#1F2937] mb-4">
                      Contact Us
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-email" className="mb-1.5">
                          Email
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) =>
                            setContactInfo({ ...contactInfo, email: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact-phone" className="mb-1.5">
                          Phone
                        </Label>
                        <Input
                          id="contact-phone"
                          value={contactInfo.phone}
                          onChange={(e) =>
                            setContactInfo({ ...contactInfo, phone: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact-phone-numeric" className="mb-1.5">
                          Phone (numeric)
                        </Label>
                        <Input
                          id="contact-phone-numeric"
                          value={contactInfo.phoneNumeric}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              phoneNumeric: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact-website" className="mb-1.5">
                          Website
                        </Label>
                        <Input
                          id="contact-website"
                          value={contactInfo.website}
                          onChange={(e) =>
                            setContactInfo({ ...contactInfo, website: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact-address1" className="mb-1.5">
                          Address Line 1
                        </Label>
                        <Input
                          id="contact-address1"
                          value={contactInfo.addressLine1}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              addressLine1: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact-address2" className="mb-1.5">
                          Address Line 2
                        </Label>
                        <Input
                          id="contact-address2"
                          value={contactInfo.addressLine2}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              addressLine2: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-[#1F2937] mb-4">
                      Follow Us
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F8F9FA] flex items-center justify-center flex-shrink-0">
                          <Instagram className="w-5 h-5 text-[#E4405F]" />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={socialLinks.instagram}
                            onChange={(e) =>
                              setSocialLinks({
                                ...socialLinks,
                                instagram: e.target.value,
                              })
                            }
                            placeholder="https://"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F8F9FA] flex items-center justify-center flex-shrink-0">
                          <Facebook className="w-5 h-5 text-[#1877F2]" />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={socialLinks.facebook}
                            onChange={(e) =>
                              setSocialLinks({
                                ...socialLinks,
                                facebook: e.target.value,
                              })
                            }
                            placeholder="https://"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F8F9FA] flex items-center justify-center flex-shrink-0">
                          <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={socialLinks.twitter}
                            onChange={(e) =>
                              setSocialLinks({
                                ...socialLinks,
                                twitter: e.target.value,
                              })
                            }
                            placeholder="https://"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F8F9FA] flex items-center justify-center flex-shrink-0">
                          <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={socialLinks.linkedin}
                            onChange={(e) =>
                              setSocialLinks({
                                ...socialLinks,
                                linkedin: e.target.value,
                              })
                            }
                            placeholder="https://"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </TabsContent>

              {/* Payment Settings Tab */}
              <TabsContent value="payments" className="mt-0 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937] mb-2">
                    Payment Settings
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-6">
                    Configure Stripe API keys to accept payments on your platform
                  </p>

                  {/* Info Alert */}
                  <div className="bg-[#F0F9FF] border border-[#BFDBFE] rounded-xl p-4 mb-8">
                    <div className="flex gap-3">
                      <CreditCard className="w-5 h-5 text-[#1E40AF] flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-[#1E40AF] mb-1">
                          Stripe Integration
                        </h3>
                        <p className="text-sm text-[#1E3A8A]">
                          Connect your Stripe account to process payments securely. Get your API keys from{" "}
                          <a
                            href="https://dashboard.stripe.com/apikeys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-[#1E40AF]"
                          >
                            Stripe Dashboard
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stripe Publishable Key */}
                  <div className="mb-6">
                    <Label htmlFor="stripe-publishable-key" className="mb-1.5">
                      Stripe Publishable Key
                    </Label>
                    <Input
                      id="stripe-publishable-key"
                      value={stripePublishableKey}
                      onChange={(e) => setStripePublishableKey(e.target.value)}
                      placeholder="pk_test_51234567890abcdef..."
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-[#6B7280] mt-1">
                      This key is public and safe to use in your frontend code
                    </p>
                  </div>

                  {/* Stripe Secret Key */}
                  <div className="mb-8">
                    <Label htmlFor="stripe-secret-key" className="mb-1.5">
                      Stripe Secret Key
                    </Label>
                    <div className="relative">
                      <Input
                        id="stripe-secret-key"
                        value={stripeSecretKey}
                        onChange={(e) => setStripeSecretKey(e.target.value)}
                        placeholder="sk_test_51234567890abcdef..."
                        type={showSecretKey ? "text" : "password"}
                        className="font-mono text-sm pr-12"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      >
                        {showSecretKey ? (
                          <EyeOff className="w-4 h-4 text-[#6B7280]" />
                        ) : (
                          <Eye className="w-4 h-4 text-[#6B7280]" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-[#DC2626] mt-1">
                      ⚠️ Keep this key secure and never share it publicly
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button className="w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      Save API Keys
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Test Connection
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}