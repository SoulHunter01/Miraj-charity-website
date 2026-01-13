import { useMemo, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Card from "../components/common/Card";

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border border-emerald-100 rounded-2xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-emerald-50/40 transition-colors"
      >
        <span className="font-semibold text-gray-900">{item.q}</span>
        <ChevronDown
          className={`w-5 h-5 text-emerald-700 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 text-gray-600 leading-relaxed">
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const faqs = useMemo(
    () => [
      {
        q: "What is Miraj Foundation fundraising platform?",
        a: "It’s an AI-enabled platform where individuals and organizations can create fundraisers and receive donations from supporters. We focus on transparency, safety, and impact.",
      },
      {
        q: "How do I start a fundraiser?",
        a: "Click on “Start a Fundraiser”, choose a category, add your goal, write your story, and upload images. Once published, you can share your fundraiser with your network.",
      },
      {
        q: "Is there any platform fee?",
        a: "ABC",
      },
      {
        q: "How do donors make payments?",
        a: "Donors can donate via supported payment methods (e.g., cards, bank transfer). For your MVP, you can show donation as UI only and integrate a payment gateway later.",
      },
      {
        q: "How do I withdraw funds?",
        a: "Withdrawals depend on your backend/payment setup. For now, you can show a simple process: verification → request withdrawal → funds transfer.",
      },
      {
        q: "Is my donation secure?",
        a: "Yes. We use secure practices and encryption standards. You can also add trust signals like verification badges and fraud checks as you expand.",
      },
      {
        q: "Can I edit my fundraiser after publishing?",
        a: "Yes. You can update your story, goal, and media. Some changes may require review depending on your platform’s rules.",
      },
      {
        q: "How can I contact support?",
        a: "Use the Contact Us page from the footer button, or reach out via email/phone listed there.",
      },
    ],
    []
  );

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200 text-emerald-800 text-sm font-semibold shadow-sm">
            <HelpCircle className="w-4 h-4" />
            FAQs
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>

          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Quick answers to the most common questions. If you still need help,
            use the Contact Us button in the footer.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border border-emerald-100 bg-emerald-50/30">
            <div className="space-y-4">
              {faqs.map((item, idx) => (
                <FaqItem
                  key={item.q}
                  item={item}
                  isOpen={openIndex === idx}
                  onToggle={() =>
                    setOpenIndex((prev) => (prev === idx ? -1 : idx))
                  }
                />
              ))}
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
