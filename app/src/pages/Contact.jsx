// import React from "react";
// import { Navbar } from "../components/index";

// const Contact = () => {
//   return (
//     <>
//       <Navbar />
//       <div>Contact Page</div>
//     </>
//   );
// };

// export default Contact;

import { useEffect, useState } from "react";

function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isMessageSent, setIsMessageSent] = useState(false);

  function submit(e) {
    // This will prevent page refresh
    e.preventDefault();
    setIsMessageSent(true);
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMessageSent(false);
      setMessage("");
      setEmail("");
    }, 1500);
    return () => clearTimeout(timer);
  }, [isMessageSent]);

  return (
    <div>
      <h1 className="text-4xl font-bold mt-10 ml-10">Contact Page</h1>
      <div className="flex mx-24 mt-32">
        <form
          onSubmit={submit}
          className="flex flex-col border border-black px-6 py-6 rounded-sm bg-gray-100"
        >
          <label htmlFor="email" className="mx-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-b-[#4491e9] border-2 border-gray-100 h-11 w-full my-2 placeholder:font-serif p-2"
            placeholder="Enter your email"
          />

          <label htmlFor="message" className="mx-1 mt-4">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border-b-[#4491e9] border-2 border-gray-100  w-full my-2 placeholder:font-serif p-2"
            placeholder="Write a message"
          />

          <button
            type="submit"
            className="bg-black p-1 w-20 ml-20 text-white rounded-sm mt-3"
          >
            Send
          </button>
          {isMessageSent && (
            <div className="mt-8 text-center">Thank you for your feedback</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Contact;
