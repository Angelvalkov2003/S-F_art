"use client";

import {
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent">За Нас</h1>
      </div>
      
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 min-h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/AboutUs.webp"
            alt="За Нас"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Overlay for better text readability - more saturated */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-rose-50/50 to-orange-50/50"></div>
        </div>
        
        {/* Content Card */}
        <div className="relative z-10 p-8 md:p-12 flex items-center justify-center min-h-[600px]">
          <div className="bg-gradient-to-br from-pink-200/80 via-rose-200/80 to-orange-200/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl border-2 border-pink-300/50 shadow-xl max-w-4xl w-full">
            <div className="text-lg text-gray-800 leading-relaxed space-y-5 text-justify">
              <p>
                Всичко започна с желание да внесем повече уют и смисъл в ежедневието.
              </p>
              <p>
                Първата лампа беше направена за близък човек — с любимите му цветове и малко фантазия.
              </p>
              <p>
                Оттогава създаваме лампи, които говорят без думи — подаръци с послание, спомени, запечатани в светлина.
              </p>
              <p>
                Всеки модел е уникален, създаден по идея на клиента и изработен с внимание към всеки детайл.
              </p>
              <p className="italic">
                Защото за нас това не е просто продукт, а начин да дадем частица светлина от нас на вас.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex flex-wrap justify-center items-center gap-8">
          {/* Email */}
          <a
            href="mailto:s_fart@abv.bg"
            className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-orange-50 border-2 border-pink-200 hover:border-pink-400 hover:shadow-lg transition-all transform hover:scale-105 w-32 h-32"
            aria-label="Имейл"
          >
            <EnvelopeIcon className="h-10 w-10 text-pink-400" />
            <span className="text-sm text-gray-700 font-medium text-center">s_fart@abv.bg</span>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/share/1BH1LU1GvJ"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-orange-50 border-2 border-pink-200 hover:border-pink-400 hover:shadow-lg transition-all transform hover:scale-105 w-32 h-32"
            aria-label="Facebook"
          >
            <svg
              className="h-10 w-10 text-pink-400"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-700 font-medium text-center">Facebook</span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/s_f_art/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-orange-50 border-2 border-pink-200 hover:border-pink-400 hover:shadow-lg transition-all transform hover:scale-105 w-32 h-32"
            aria-label="Instagram"
          >
            <svg
              className="h-10 w-10 text-pink-400"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-700 font-medium text-center">Instagram</span>
          </a>

          {/* Phone */}
          <a
            href="tel:+359899037420"
            className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-orange-50 border-2 border-pink-200 hover:border-pink-400 hover:shadow-lg transition-all transform hover:scale-105 w-32 h-32"
            aria-label="Телефон"
          >
            <PhoneIcon className="h-10 w-10 text-pink-400" />
            <span className="text-sm text-gray-700 font-medium text-center">0899037420</span>
          </a>
        </div>
      </div>
    </div>
  );
}

