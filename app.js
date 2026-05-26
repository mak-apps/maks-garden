const API_URL = "https://script.google.com/macros/s/AKfycbypVty17FejYppFwFWvRm16Q4W6QC5ZzU4fIIkxA42P11cXu88c_6v3J8O15liQr8Komg/exec";



async function loadBeds() {

  try {

    const response = await fetch(API_URL);

    const data = await response.json();

    console.log(data);

  } catch(error) {

    console.error("Garden bridge failure:", error);

  }

}



function openBed(bedId) {

  const bedContent = document.getElementById("bed-content");

  bedContent.innerHTML = `
    <h3>${bedId}</h3>

    <p>
      🌱 Future bed history will appear here.
    </p>

    <ul>
      <li>Plantings</li>
      <li>Soil amendments</li>
      <li>Pests and treatments</li>
      <li>Harvest notes</li>
    </ul>
  `;
}



loadBeds();
