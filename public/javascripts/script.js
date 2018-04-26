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
              backgroundColor: ["#FF463B", "orange", "#1B76CC"],
              borderColor: [
                "white",
                "white",
                "white"
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
