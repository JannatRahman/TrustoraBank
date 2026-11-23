
"use client";

import { useState, type FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Send,
  MessageCircle,
  CheckCircle2,
  Headphones,
  ShieldCheck,
} from "lucide-react";

const contactDetails = [
  {
    icon: Mail,
    title: "Email Us",
    description: "For general questions and support",
    value: "support@trustorabank.com",
    href: "mailto:support@trustorabank.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak with our support team",
    value: "+880 1XXX-XXXXXX",
    href: "tel:+8801XXXXXXXXX",
  },
  {
    icon: MapPin,
    title: "Our Location",
    description: "Digital banking platform",
    value: "Available online",
    href: undefined,
  },
];

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <section
      id="contact"
      className="scroll-mt-24 overflow-hidden bg-[#F9F7F7] px-5 py-24 text-[#112D4E] sm:py-28 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* SECTION INTRO */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3F72AF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3F72AF]" />
            Get in Touch
          </span>

          <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            We're here to{" "}
            <span className="text-[#3F72AF]">help.</span>
          </h2>

          <p className="mt-5 text-sm leading-8 text-[#6B7280] sm:text-base">
            Have a question about your account, our services, or
            something else? Send us a message and let us know how
            we can help.
          </p>
        </div>

        {/* MAIN CONTACT LAYOUT */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">

          {/* LEFT: CONTACT INFORMATION */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[#172554] p-8 text-white shadow-xl shadow-[#112D4E]/10 sm:p-10">

            {/* DECORATIVE ELEMENTS */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-white/10" />

            <div className="relative">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DBE2EF]">
                Contact Information
              </span>

              <h3 className="mt-5 max-w-sm text-3xl font-bold leading-tight sm:text-4xl">
                Let's start a conversation.
              </h3>

              <p className="mt-5 max-w-sm text-sm leading-7 text-[#DBE2EF]">
                Whether you need assistance or simply want to learn
                more about Trustora, we're ready to hear from you.
              </p>

              {/* CONTACT DETAILS */}
              <div className="mt-12 space-y-7">
                {contactDetails.map((detail) => {
                  const Icon = detail.icon;

                  const content = (
                    <div className="group flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 transition-colors duration-300 group-hover:bg-white/20">
                        <Icon className="h-5 w-5 text-[#DBE2EF]" />
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm font-semibold text-white">
                          {detail.title}
                        </p>

                        <p className="mt-1 text-xs text-[#DBE2EF]/70">
                          {detail.description}
                        </p>

                        <p className="mt-2 break-all text-sm font-medium text-white">
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  );

                  return detail.href ? (
                    <a
                      key={detail.title}
                      href={detail.href}
                      className="block cursor-pointer no-underline"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={detail.title}>{content}</div>
                  );
                })}
              </div>

              {/* SUPPORT NOTE */}
              <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.07] p-5">
                <div className="flex items-center gap-3">
                  <Headphones className="h-5 w-5 text-[#DBE2EF]" />

                  <p className="text-sm font-semibold text-white">
                    Need assistance?
                  </p>
                </div>

                <p className="mt-2 text-xs leading-6 text-[#DBE2EF]/80">
                  Send us your question using the contact form.
                  Our support team can follow up once the messaging
                  service is connected.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="rounded-[2rem] border border-[#DBE2EF] bg-white p-7 shadow-sm sm:p-10 lg:p-12">

            {submitted ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#DBE2EF]/60 text-[#3F72AF]">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <h3 className="mt-7 text-2xl font-bold text-[#112D4E]">
                  Thank you for reaching out!
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-7 text-[#6B7280]">
                  Your demo submission was received in this page.
                  No message has been sent to Trustora yet.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#172554] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#112D4E]"
                >
                  Send Another Message
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#3F72AF]">
                    Send a Message
                  </span>

                  <h3 className="mt-4 text-2xl font-bold text-[#112D4E] sm:text-3xl">
                    How can we help you?
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                    Fill out the form below and tell us a little
                    about what you need.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-9 space-y-6">

                  {/* NAME AND EMAIL */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-2 block text-sm font-semibold text-[#112D4E]"
                      >
                        Full Name
                      </label>

                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        autoComplete="name"
                        required
                        maxLength={100}
                        className="w-full rounded-xl border border-[#DBE2EF] bg-[#F9F7F7]/60 px-4 py-3.5 text-sm text-[#112D4E] outline-none transition-all placeholder:text-gray-400 focus:border-[#3F72AF] focus:bg-white focus:ring-4 focus:ring-[#3F72AF]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-2 block text-sm font-semibold text-[#112D4E]"
                      >
                        Email Address
                      </label>

                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        maxLength={254}
                        className="w-full rounded-xl border border-[#DBE2EF] bg-[#F9F7F7]/60 px-4 py-3.5 text-sm text-[#112D4E] outline-none transition-all placeholder:text-gray-400 focus:border-[#3F72AF] focus:bg-white focus:ring-4 focus:ring-[#3F72AF]/10"
                      />
                    </div>
                  </div>

                  {/* SUBJECT */}
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="mb-2 block text-sm font-semibold text-[#112D4E]"
                    >
                      Subject
                    </label>

                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What is your message about?"
                      required
                      maxLength={150}
                      className="w-full rounded-xl border border-[#DBE2EF] bg-[#F9F7F7]/60 px-4 py-3.5 text-sm text-[#112D4E] outline-none transition-all placeholder:text-gray-400 focus:border-[#3F72AF] focus:bg-white focus:ring-4 focus:ring-[#3F72AF]/10"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="contact-message"
                        className="text-sm font-semibold text-[#112D4E]"
                      >
                        Your Message
                      </label>

                      <span className="text-xs text-gray-400">
                        {form.message.length}/1000
                      </span>
                    </div>

                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows={6}
                      required
                      minLength={10}
                      maxLength={1000}
                      className="w-full resize-none rounded-xl border border-[#DBE2EF] bg-[#F9F7F7]/60 px-4 py-3.5 text-sm leading-7 text-[#112D4E] outline-none transition-all placeholder:text-gray-400 focus:border-[#3F72AF] focus:bg-white focus:ring-4 focus:ring-[#3F72AF]/10"
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#172554] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#172554]/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#112D4E] hover:shadow-xl"
                  >
                    Send Message
                    <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </button>

                  <p className="flex items-center justify-center gap-2 text-center text-xs leading-5 text-[#9CA3AF]">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    Please don't include passwords, PINs, or sensitive banking details.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>

        {/* BOTTOM SUPPORT STRIP */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-[#DBE2EF] bg-white px-6 py-6 sm:flex-row sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DBE2EF]/60 text-[#3F72AF]">
              <MessageCircle className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#112D4E]">
                We're always happy to hear from you.
              </p>

              <p className="mt-1 text-xs text-[#6B7280]">
                Your questions and feedback help us improve.
              </p>
            </div>
          </div>

          <a
            href="mailto:support@trustorabank.com"
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 text-sm font-bold text-[#3F72AF] no-underline transition-colors hover:text-[#172554]"
          >
            Email Support
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
