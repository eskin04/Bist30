const toggleButton = document.getElementById("chatbot-toggle");
const iframe = document.getElementById("chatbot-frame");

// İKON tıklanınca sadece iframe göster
toggleButton.addEventListener("click", () => {
  iframe.style.display = "block";
  // toggleButton.style.display = "none"; ← BUNU ARTIK SİLİYORUZ
});

// iframe içinden mesaj geldiğinde kapat
window.addEventListener("message", (event) => {
  if (event.data === "close-chatbot") {
    iframe.style.display = "none";
  }
});
