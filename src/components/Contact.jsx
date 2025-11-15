// src/components/Contact.jsx
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // Improved handleSubmit: validates env vars, logs useful info, and handles errors
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Read env variables exposed by Vite
    const SERVICE = import.meta.env.VITE_APP_EMAILJS_SERVICE_ID;
    const TEMPLATE = import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY;

    // Helpful debug logs (remove or comment out in production)
    console.log("EMAILJS -> SERVICE:", SERVICE);
    console.log("EMAILJS -> TEMPLATE:", TEMPLATE);
    console.log("EMAILJS -> PUBLIC_KEY:", PUBLIC_KEY);

    // Basic validation: ensure env values exist
    if (!SERVICE || !TEMPLATE || !PUBLIC_KEY) {
      alert("Email service is not configured. Please add EmailJS keys to your .env and restart the dev server.");
      console.error("Missing EmailJS env vars", { SERVICE, TEMPLATE, PUBLIC_KEY });
      return;
    }

    // Simple validation for form fields (optional but recommended)
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert("Please fill in your name, email and a message before sending.");
      return;
    }

    setLoading(true);

    const templateParams = {
      from_name: form.name,
      to_name: "Rohit Kumar Yadav",               // change display name if you want
      from_email: form.email,
      to_email: "rohityadavit45@gmail.com",      // your destination email
      message: form.message,
    };

    console.log("EMAILJS -> templateParams:", templateParams);

    try {
      const res = await emailjs.send(SERVICE, TEMPLATE, templateParams, PUBLIC_KEY);
      console.log("EmailJS success:", res);

      setLoading(false);
      alert("Thank you. I will get back to you as soon as possible.");

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error("EmailJS error:", err);
      setLoading(false);

      // Show a helpful error message for a 400 response
      if (err && err.status === 400) {
        alert("Email service returned a Bad Request. Check your EmailJS keys, template config and template params. See console for details.");
      } else {
        alert("Ahh, something went wrong. Please try again.");
      }
    }
  };

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75] bg-black-100 p-8 rounded-2xl'
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-12 flex flex-col gap-8'
        >
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Name</span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder="What's your good name?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your email</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder="What's your web address?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Message</span>
            <textarea
              rows={7}
              name='message'
              value={form.message}
              onChange={handleChange}
              placeholder='What you want to say?'
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
            />
          </label>

          <button
            type='submit'
            className='bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary'
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px]'
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
