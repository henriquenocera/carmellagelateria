fetch("https://sabores.carmellagelateria.com.br/.netlify/functions/getFlavors")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    displayData(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

const displayData = (data) => {
  let n = 0;
  const container = document.getElementById("data-container");
  let content = "";

  data.data_batel.forEach((item) => {
    n++;
    content += `
      <div class="data-item">
        <div> ${item.name}</div>
      </div>
    `;
  });

  container.innerHTML = content;
};
