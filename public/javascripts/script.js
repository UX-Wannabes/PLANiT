document.addEventListener(
  "DOMContentLoaded",
  () => {
    if (document.getElementById("myChart")) {
      const labels = window.plans.map(e => e._id);
      const data = window.plans.map(e => e.total);
      var ctx = document.getElementById("myChart").getContext("2d");
      var myChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: ["#FF463B", "#F0FF54", "#1B76CC"],
              borderColor: [
                "rgba(255,99,132,1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          legend: { display: false }
        }
      });
    }
  },
  false
);
