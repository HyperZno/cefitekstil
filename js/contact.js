document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const SERVICE_ID = "cefi_2134";
    const ADMIN_TEMPLATE_ID = "yonetici_2134";
    const CUSTOMER_TEMPLATE_ID = "musteri_2134";
    const PUBLIC_KEY = "xhWXdtNxV9fZiMySD";

    const formData = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    try {
      // Yöneticiye
      await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, formData, PUBLIC_KEY);
      console.log("✅ Yöneticiye gönderildi");

      // Müşteriye
      await emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE_ID, formData, PUBLIC_KEY);
      console.log("✅ Müşteriye gönderildi");

      alert("Mesajınız başarıyla gönderildi ✅");
      form.reset();
    } catch (error) {
      console.error("❌ Email gönderme hatası:", error);
      alert("Mail gönderilemedi, lütfen tekrar deneyin.");
    }
  });
});
