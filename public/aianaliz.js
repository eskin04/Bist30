document.getElementById("tahmin-btn").addEventListener("click", async () => {
  const hisse = document.getElementById("stockInput").value.trim().toUpperCase();
  const btn = document.getElementById("tahmin-btn");
  const loading = document.getElementById("loading");
  const chartCanvas = document.getElementById("chart");
  const dailyChartCanvas = document.getElementById("dailyChangeChart");

  if (!hisse) return alert("Lütfen geçerli bir hisse sembolü girin (örn: THYAO)");

  if (window.stockChartInstance) window.stockChartInstance.destroy();
  if (window.dailyChangeInstance) window.dailyChangeInstance.destroy();

  btn.disabled = true;
  loading.style.display = "flex";

  try {
    const res = await fetch(`/api/tahminli_fiyat?hisse=${hisse}`);
    if (!res.ok) throw new Error("API hatası");
    const { tahmin, veriler } = await res.json();

    renderVeriler(veriler, hisse);
    renderDirectionPieChart(tahmin.fiyat.map(Number));


    const fiyat = tahmin.fiyat.map(Number);
    const x = fiyat.map((_, i) => i);
    const n = fiyat.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = fiyat.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * fiyat[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;
    const trend = x.map(xi => m * xi + b);

    const ctx = chartCanvas.getContext("2d");
    window.stockChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: tahmin.tarih,
        datasets: [
          {
            label: `${hisse} Tahmini`,
            data: fiyat,
            borderColor: 'rgba(13, 110, 253, 1)',
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
            fill: true,
          },
          {
            label: `${hisse} Trend Doğrusu`,
            data: trend,
            borderColor: 'orange',
            borderDash: [5, 5],
            fill: false,
            tension: 0,
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: value => `${value} TL`
            }
          }
        }
      }
    });

    const dailyChanges = getDailyChanges(fiyat);
    const dailyCtx = dailyChartCanvas.getContext("2d");
    window.dailyChangeInstance = new Chart(dailyCtx, {
      type: 'bar',
      data: {
        labels: tahmin.tarih,
        datasets: [{
          label: `${hisse} Günlük % Değişim`,
          data: dailyChanges,
          backgroundColor: dailyChanges.map(v => v >= 0 ? 'rgba(25, 135, 84, 0.7)' : 'rgba(220, 53, 69, 0.7)'),
          borderColor: dailyChanges.map(v => v >= 0 ? 'rgba(25, 135, 84, 1)' : 'rgba(220, 53, 69, 1)'),
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.raw}%`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: value => `${value}%`
            }
          }
        }
      }
    });

    // Volatilite hesapla (günlük % değişim)
const volatilite = [];
for (let i = 1; i < fiyat.length; i++) {
  const v = Math.abs((fiyat[i] - fiyat[i - 1]) / fiyat[i - 1]) * 100;
  volatilite.push(parseFloat(v.toFixed(2)));
}

// Önceki volatilite grafiğini sil
if (window.volatiliteChartInstance) {
  window.volatiliteChartInstance.destroy();
}

// Volatilite grafiği oluştur
const volCtx = document.getElementById("volatiliteChart").getContext("2d");
window.volatiliteChartInstance = new Chart(volCtx, {
  type: 'bar',
  data: {
    labels: tahmin.tarih.slice(1), // ilk gün yok çünkü fark hesaplandı
    datasets: [{
      label: `${hisse} Tahmini Volatilite (%)`,
      data: volatilite,
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.raw}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "% Oynaklık"
        }
      }
    }
  }
});

// Hareketli Ortalama Grafiği
const maCanvas = document.getElementById("movingAverageChart");
maCanvas.style.display = "block";

const movingAverage = [];
for (let i = 0; i < fiyat.length; i++) {
  if (i < 2) {
    movingAverage.push(null); // ilk 2 güne MA yok
  } else {
    const avg = (fiyat[i] + fiyat[i - 1] + fiyat[i - 2]) / 3;
    movingAverage.push(avg);
  }
}

new Chart(maCanvas.getContext("2d"), {
  type: 'line',
  data: {
    labels: tahmin.tarih,
    datasets: [
      {
        label: `${hisse} Tahmini Fiyat`,
        data: fiyat,
        borderColor: 'rgba(13, 110, 253, 1)',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        fill: false,
        tension: 0.3,
        pointRadius: 4,
      },
      {
        label: '3 Günlük Ortalama',
        data: movingAverage,
        borderColor: 'rgba(255, 193, 7, 1)',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        fill: false,
        borderDash: [4, 2],
        tension: 0.2,
        pointRadius: 2,
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: value => `${value} TL`
        }
      }
    }
  }
});

document.getElementById("grafik-alani").style.display = "block";



  } catch (err) {
    console.error(err);
    alert("Tahmin alınamadı. Hisse sembolü geçerli mi?");
  } finally {
    loading.style.display = "none";
    btn.disabled = false;
  }
});

function renderVeriler(veri, hisse) {
  const box = document.getElementById("veri-box");
  box.innerHTML = `
    <h5>📊 ${hisse} Verileri</h5>
    <div class="veri-row"><div class="veri-label">ALIŞ</div><div class="veri-value">${veri.alis}</div></div>
    <div class="veri-row"><div class="veri-label">SATIŞ</div><div class="veri-value">${veri.satis}</div></div>
    <div class="veri-row"><div class="veri-label">FARK</div><div class="veri-value">${veri.fark}</div></div>
    <div class="veri-row"><div class="veri-label">ÖNCEKİ KAPANIŞ</div><div class="veri-value">${veri.onceki}</div></div>
    <div class="veri-row"><div class="veri-label">EN YÜKSEK</div><div class="veri-value">${veri.yuksek}</div></div>
    <div class="veri-row"><div class="veri-label">EN DÜŞÜK</div><div class="veri-value">${veri.dusuk}</div></div>
    <div class="veri-row"><div class="veri-label">HACİM</div><div class="veri-value">${veri.hacim}</div></div>
    <div class="veri-row"><div class="veri-label">HACİM(LOT)</div><div class="veri-value">${veri.hacimlot}</div></div>
    ${veri.lastPrice ? `<div class="veri-row"><div class="veri-label">KAPANIŞ</div><div class="veri-value">${veri.lastPrice}</div></div>` : ""}
  `;
}

function getDailyChanges(data) {
  const result = [0];
  for (let i = 1; i < data.length; i++) {
    const change = ((data[i] - data[i - 1]) / data[i - 1]) * 100;
    result.push(parseFloat(change.toFixed(2)));
  }
  return result;
}

function renderDirectionPieChart(fiyatlar) {
  const directions = { up: 0, down: 0, same: 0 };

  for (let i = 1; i < fiyatlar.length; i++) {
    if (fiyatlar[i] > fiyatlar[i - 1]) directions.up++;
    else if (fiyatlar[i] < fiyatlar[i - 1]) directions.down++;
    else directions.same++;
  }

  const ctx = document.getElementById("directionPieChart").getContext("2d");

  if (window.pieChartInstance) window.pieChartInstance.destroy();

  window.pieChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Artış Günleri', 'Azalış Günleri', 'Sabit Günler'],
      datasets: [{
        data: [directions.up, directions.down, directions.same],
        backgroundColor: ['#198754', '#dc3545', '#6c757d']
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Tahmini Fiyatların Günlük Yön Dağılımı'
        }
      }
    }
  });
}

