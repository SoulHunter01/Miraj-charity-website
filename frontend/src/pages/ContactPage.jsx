import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // for now: just UI
    console.log("Contact form:", formData);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page */}
      <section className="bg-emerald-50/60 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-3xl sm:text-4xl font-bold text-emerald-800 mb-10">
            Contact Us
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left info card */}
            <Card className="border border-emerald-100 bg-emerald-50/40">
              <p className="text-gray-700 leading-relaxed mb-6">
                Have questions? We’re here to help. Fill out the form and our team
                will get back to you as soon as possible.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-emerald-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-700">support@mirajfoundation.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-emerald-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-700">+92 300 1234567</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-emerald-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-700">Lahore, Pakistan</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Right form card */}
            <Card className="border border-emerald-100 bg-white">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full h-11 px-4 rounded-xl border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                  className="w-full h-11 px-4 rounded-xl border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />

                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="w-full h-11 px-4 rounded-xl border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message"
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
                />

                <div className="pt-2 flex justify-center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 px-10"
                  >
                    Send
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
