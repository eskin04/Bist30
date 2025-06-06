const toggleButton = document.getElementById("chatbot-toggle");
const iframe = document.getElementById("chatbot-frame");

// İKON tıklanınca sadece iframe göster
toggleButton.addEventListener("click", () => {
  if (iframe.style.display === "none" || iframe.style.display === "") {
    iframe.style.display = "block";
  } else {
    iframe.style.display = "none";
  }
  // toggleButton.style.display = "none"; ← BUNU ARTIK SİLİYORUZ
});

// iframe içinden mesaj geldiğinde kapat
window.addEventListener("message", (event) => {
  if (event.data === "close-chatbot") {
    iframe.style.display = "none";
  }
});
