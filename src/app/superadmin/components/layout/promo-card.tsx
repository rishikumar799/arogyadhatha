'use client';
import { Rocket } from 'lucide-react';

export default function PromoCard() {
  return (
    <div className="mt-auto p-4">
        <div className="bg-[#4CAF50] text-white p-6 rounded-lg text-center">
            <div className="flex justify-center mb-4">
                <Rocket size={48} />
            </div>
            <h3 className="text-xl font-bold mb-2">Hello,</h3>
            <p className="text-sm">Enjoy the best experience for your brand.</p>
        </div>
    </div>
  );
}
