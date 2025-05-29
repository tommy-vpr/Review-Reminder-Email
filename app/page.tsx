import SendTestEmail from "@/components/SendTestEmail";
import Image from "next/image";
import { IoMdMail } from "react-icons/io";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <SendTestEmail />
    </div>
  );
}
