const API_URL = "https://script.google.com/macros/s/AKfycbzNpKSJH4Vr0T5L9Dm9EMzo3Z8rAy9QQAh46fYLxFUpZVTxUfviUQ1-SHHS-RtqUuLj1A/exec";

let gardenBeds = [];
let plantingLog = [];

async function loadGardenData() {
  const bedContent = document.getElementById("bed-content");

  try {
    bedContent.innerHTML = "🌱 Loading garden data...";

    const response = await fetch(API_URL);
    const data = await response.json();

    gardenBeds = data.beds || [];
    plantingLog = data.plantingLog || [];

    renderBeds();
    bedContent.innerHTML = "Tap a bed to view details.";

  } catch (error) {
    console.error("Garden bridge failure:", error);
    bedContent.innerHTML = "⚠️ Could not load garden data. Try refreshing.";
  }
}

function renderBeds() {
  const mainGarden = document.querySelector(".bed-grid");
  const greenhouse = document.querySelector(".greenhouse-grid");

  mainGarden.innerHTML = "";
  greenhouse.innerHTML = "";

  gardenBeds.forEach(bed => {
    const card = document.createElement("div");

    if (bed.Area === "Greenhouse") {
      card.className = "greenhouse-bed";
    } else {
      card.className = "bed-card";
    }

    card.textContent = bed.BedName;
    card.onclick = () => openBed(bed.BedID);

    if (bed.Area === "Greenhouse") {
      greenhouse.appendChild(card);
    } else if (bed.Area === "Main Garden") {
      mainGarden.appendChild(card);
    }
  });
}

function formatDate(dateValue) {
  if (!dateValue) return "Not recorded";

  const date = new Date(dateValue);

  if (isNaN(date)) {
    return dateValue;
  }

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function openBed(bedId) {
  const bed = gardenBeds.find(item => String(item.BedID) === String(bedId));
  const bedContent = document.getElementById("bed-content");

  if (!bed) {
    bedContent.innerHTML = `<p>Bed not found.</p>`;
    return;
  }

  const bedPlantings = plantingLog.filter(entry =>
    String(entry.BedID) === String(bedId)
  );

  let plantingHtml = "";

  if (bedPlantings.length === 0) {
    plantingHtml = `<p>No planting records yet for this bed.</p>`;
  } else {
    plantingHtml = bedPlantings.map(entry => `
      <div class="planting-card">
        <h4>${entry.Crop || "Unnamed crop"}</h4>
        <p><strong>Variety:</strong> ${entry.Variety || "Not recorded"}</p>
        <p><strong>Plant date:</strong> ${formatDate(entry.PlantDate)}</p>
        <p><strong>Harvest date:</strong> ${formatDate(entry.HarvestDate)}</p>
        <p><strong>Notes:</strong><br>${entry.Notes || "No notes yet."}</p>
      </div>
    `).join("");
  }

  bedContent.innerHTML = `
    <h3>${bed.BedName}</h3>

    <p><strong>Area:</strong> ${bed.Area || "Not recorded"}</p>
    <p><strong>Size:</strong> ${bed.Size || "Not recorded yet"}</p>
    <p><strong>Sun:</strong> ${bed.Sun || "Not recorded yet"}</p>
    <p><strong>Current use:</strong> ${bed.CurrentUse || "Not recorded yet"}</p>

    <p><strong>Notes:</strong><br>
    ${bed.Notes || "No notes yet."}</p>

    <hr>

    <h3>Planting History</h3>
    ${plantingHtml}
  `;
}

loadGardenData();
