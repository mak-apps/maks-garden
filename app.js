const API_URL = "https://script.google.com/macros/s/AKfycbzNpKSJH4Vr0T5L9Dm9EMzo3Z8rAy9QQAh46fYLxFUpZVTxUfviUQ1-SHHS-RtqUuLj1A/exec";

let gardenBeds = [];
let plantingLog = [];
let harvests = [];

async function loadGardenData() {
  const bedContent = document.getElementById("bed-content");

  try {
    bedContent.innerHTML = "🌱 Loading garden data...";

    const response = await fetch(API_URL);
    const data = await response.json();

    gardenBeds = data.beds || [];
plantingLog = data.plantingLog || [];
harvests = data.harvests || [];

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
      const hasPlantings = plantingLog.some(entry =>
  String(entry.BedID) === String(bed.BedID)
);

const hasHarvests = harvests.some(entry =>
  String(entry.BedID) === String(bed.BedID)
);

card.className = "bed-card";

if (bed.Area === "Greenhouse") {
  card.classList.add("greenhouse-bed");
} else if (hasHarvests) {
  card.classList.add("harvest-bed");
} else if (hasPlantings) {
  card.classList.add("active-bed");
} else {
  card.classList.add("empty-bed");
}
    }

    const bedPlantings = plantingLog.filter(
  log => log.BedID == bed.BedID
);

const currentCrops = bedPlantings.map(
  log => log.Crop
).join(", ");

card.innerHTML = `
  <strong>${bed.BedName}</strong><br>
  <small>${currentCrops || "Empty bed"}</small>
`;
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
const bedHarvests = harvests.filter(entry =>
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
let harvestHtml = "";

if (bedHarvests.length === 0) {
  harvestHtml = `<p>No harvest records yet for this bed.</p>`;
} else {
  harvestHtml = bedHarvests.map(entry => `
    <div class="harvest-card">
      <h4>${entry.Crop || "Unnamed crop"}</h4>
      <p><strong>Harvest date:</strong> ${formatDate(entry.HarvestDate)}</p>
      <p><strong>Quantity:</strong> ${entry.Quantity || "Not recorded"}</p>
      <p><strong>Quality:</strong> ${entry.Quality || "Not recorded"}</p>
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

<hr>

<h3>Harvest History</h3>
${harvestHtml}

<hr>

<h3>Add New Planting</h3>

<form onsubmit="savePlanting(event, '${bed.BedID}')">
  <label>Crop</label>
  <input name="Crop" required placeholder="Peas, tomato, garlic...">

  <label>Variety</label>
  <input name="Variety" placeholder="Green Arrow, Sungold...">

  <label>Plant Date</label>
  <input name="PlantDate" type="date">

  <label>Notes</label>
  <textarea name="Notes" placeholder="Trellis added, started indoors, slug patrol..."></textarea>

  <button type="submit">Save Planting</button>
</form>
  `;
}

loadGardenData();
async function savePlanting(event, bedId) {
  event.preventDefault();

  const form = event.target;

  const planting = {
    BedID: bedId,
    Crop: form.Crop.value,
    Variety: form.Variety.value,
    PlantDate: form.PlantDate.value,
    HarvestDate: "",
    Notes: form.Notes.value
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(planting)
    });

    form.reset();
    await loadGardenData();
    openBed(bedId);

  } catch (error) {
    alert("Could not save planting. The squirrel dropped the seed packet.");
    console.error(error);
  }
}
