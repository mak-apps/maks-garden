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
