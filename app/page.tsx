import SendTestEmail from "@/components/SendTestEmail";
import Image from "next/image";
import { IoMdMail } from "react-icons/io";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-gray-50 gap-4">
      <span className="flex items-center gap-1">
        <IoMdMail size={24} className="text-green-500" />
        Teevong.com
      </span>
      <SendTestEmail />
    </div>
  );
}
