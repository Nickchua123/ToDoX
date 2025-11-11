// src/pages/ContactPage.jsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Input, Textarea, Button, Card, CardContent } from "@/components/ui";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      {/* Header full-width */}
      <Header />

      {/* Main */}
      <main className="bg-white py-10">
        <div className="container mx-auto px-4">
          {/* Tiêu đề */}
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-10">
            Liên hệ với chúng tôi
          </h1>

          {/* Thông tin liên hệ */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card className="text-center shadow-md rounded-xl p-6">
              <CardContent>
                <MapPin className="w-8 h-8 text-[#ff6347] mx-auto mb-3" />
                <h3 className="font-medium text-lg mb-2">Địa chỉ</h3>
                <p className="text-gray-600">
                  235 Hoàng Quốc Việt, Bắc Từ Liêm, Hà Nội
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md rounded-xl p-6">
              <CardContent>
                <Mail className="w-8 h-8 text-[#ff6347] mx-auto mb-3" />
                <h3 className="font-medium text-lg mb-2">Email</h3>
                <p className="text-gray-600">support@epu.edu.vn</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md rounded-xl p-6">
              <CardContent>
                <Phone className="w-8 h-8 text-[#ff6347] mx-auto mb-3" />
                <h3 className="font-medium text-lg mb-2">Hotline</h3>
                <p className="text-gray-600">024 2218 5606</p>
              </CardContent>
            </Card>
          </div>

          {/* Bản đồ + form liên hệ */}
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Google Map */}
            <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md">
              <iframe
                title="Google Map - 235 Hoàng Quốc Việt"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.907920131589!2d105.779659315457!3d21.038318992849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3df7b391a5%3A0xc0f8c7d51a2cb80f!2zMjM1IEhvw6BuZyBRdeG7kWMgVmnhu4d0LCBD4buVIE5odeG6vywgVGjDoG5oIHBo4buRIEjDoG5vLCBIw6AgTuG7mWkgMTAwMDAw!5e0!3m2!1svi!2s!4v1731090000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Form liên hệ */}
            <form className="bg-white shadow-md rounded-xl p-6 space-y-4">
              <Input placeholder="Họ và tên" className="border-gray-300" />
              <Input
                placeholder="Email"
                type="email"
                className="border-gray-300"
              />
              <Input placeholder="Số điện thoại" className="border-gray-300" />
              <Textarea
                placeholder="Nội dung"
                className="border-gray-300"
                rows={4}
              />
              <Button
                type="submit"
                className="bg-[#ff6347] hover:bg-[#e5553d] text-white font-medium w-full"
              >
                Gửi thông tin
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer full-width */}
      <Footer />
    </>
  );
}
