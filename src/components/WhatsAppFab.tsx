import { MessageCircle } from "lucide-react";

interface WhatsAppFabProps {
  phone?: string;
  message?: string;
}

export function WhatsAppFab({
  phone = "919876543210",
  message = "Hello PAPR, I have an enquiry regarding academic kits & custom printing.",
}: WhatsAppFabProps) {
  const text = encodeURIComponent(message);

  return (
    <a
      href={`https://wa.me/${phone}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact PAPR on WhatsApp"
      className="fixed bottom-20 right-4 z-30 inline-flex items-center gap-2 rounded-full border border-[#EDE9E1] bg-[#F7F5EF]/95 px-3.5 py-2 text-xs font-black text-[#302033] shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-105 md:bottom-6 md:right-6"
    >
      <MessageCircle className="h-4 w-4 text-[#208B58]" />
      <span className="hidden sm:inline font-sans text-xs">PAPR Concierge</span>
    </a>
  );
}
