import { MessageCircle, MessageCircleText } from "lucide-react";

const WHATSAPP_NUMBER = import.meta.env.VITE_BUSINESS_PHONE || "+91-9761696089";

const DEFAULT_MESSAGE =
  "Hello, I am interested in your export products. Please share more details.";

export default function WhatsAppButton({
  phoneNumber = WHATSAPP_NUMBER,
  message = DEFAULT_MESSAGE,
  floating = true,
}) {
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className={
        floating
          ? "fixed bottom-6 right-6 z-50 flex px-5 py-2 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
          : "inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-medium text-white transition-colors hover:bg-[#1DA851] focus:outline-none focus:ring-4 focus:ring-green-300"
      }
    >
      <MessageCircleText size={floating ? 29 : 22} strokeWidth={2.2} />
        <span className="ml-2 text-sm"> WhatsApp us </span>
      {!floating &&<span>Chat on WhatsApp</span>}
    </a>
  );
}
