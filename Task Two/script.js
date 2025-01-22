document.addEventListener("DOMContentLoaded", () => {
  let initialBill = 0;
  let annualIncreaseRate = 0;
  document.querySelector(".payCurrent").innerText = `$${initialBill}`;
  document.querySelector(".payFuture").innerText = `$${initialBill}`;

  let inflationChart;
  let years = 25;

  function drawChart(initialBill, annualIncreaseRate) {
    const labels = [];
    const data = [];
    let cumulativeCost = 0;

    for (let year = 1; year <= years; year++) {
      labels.push(year);
      const futureBill = initialBill * Math.pow(1 + annualIncreaseRate, year);
      data.push(futureBill.toFixed(2));
      cumulativeCost += 12 * futureBill;
    }

    console.log(
      `Cumulative cost over ${years} years: $${cumulativeCost.toFixed(2)}`
    );

    const ctx = document.getElementById("inflationChart").getContext("2d");

    // Destroy existing chart if it exists
    if (inflationChart) {
      inflationChart.destroy();
    }

    // Create a new chart
    inflationChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Electric Bill ($)",
            data: data,
            fill: true,
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            borderColor: "orange",
            pointBackgroundColor: "orange",
            tension: 0.4,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: { display: true, text: "Years" },
          },
          y: {
            title: { display: true, text: "Electric Bill ($)" },
            beginAtZero: false,
          },
        },
      },
    });
  }

  drawChart(initialBill, annualIncreaseRate);
  document.querySelector(".inputForm").addEventListener("submit", (e) => {
    e.preventDefault();
    initialBill = Number(document.getElementById("inputBill").value);
    annualIncreaseRate =
      Number(document.getElementById("yearRate").value) / 100;

    if (!initialBill && !annualIncreaseRate) {
      initialBill = 0;
      annualIncreaseRate = 0;
      document.querySelector(".payCurrent").innerText = `$${initialBill}`;
      document.querySelector(".payFuture").innerText = `$${initialBill}`;

      drawChart(initialBill, annualIncreaseRate, years);
    } else {
      years = 25;
      document.querySelector(".payCurrent").innerText = `$${initialBill}`;
      document.querySelector(".payFuture").innerText = `$ ${(initialBill * Math.pow(1 + annualIncreaseRate, years)).toFixed(1)}`;

      drawChart(initialBill, annualIncreaseRate, years);
    }
    document.querySelector("#yearsRange").addEventListener("change", (e) => {
      e.preventDefault();
      years = e.target.value;
      drawChart(initialBill, annualIncreaseRate, years);
      document
        .querySelector("#yearsRange")
        .removeEventListener("change", (e) => {
          e.preventDefault();
          years = 25;
          drawChart(initialBill, annualIncreaseRate, years);
        });
    });

    document.querySelector(".inputForm").reset();
  });
});
