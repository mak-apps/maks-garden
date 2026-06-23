const API_URL = "https://script.google.com/macros/s/AKfycbzNpKSJH4Vr0T5L9Dm9EMzo3Z8rAy9QQAh46fYLxFUpZVTxUfviUQ1-SHHS-RtqUuLj1A/exec";

let gardenBeds = [];
let plantingLog = [];
let harvests = [];
let treatments = [];

async function loadGardenData() {
  const bedContent = document.getElementById("bed-content");

  try {
    bedContent.innerHTML = "🌱 Loading garden data...";

    const response = await fetch(API_URL);
    const data = await response.json();

    gardenBeds = data.beds || [];
plantingLog = data.plantingLog || [];
harvests = data.harvests || [];
    treatments = data.treatments || [];

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
const backGarden = document.querySelector(".back-garden-grid");
const berries = document.querySelector(".berries-grid");
const orchard = document.querySelector(".orchard-grid");

mainGarden.innerHTML = "";
greenhouse.innerHTML = "";
backGarden.innerHTML = "";
berries.innerHTML = "";
orchard.innerHTML = ""; 

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

const currentCrops =
  bed.CurrentUse ||
  bedPlantings.map(log => log.Crop).join(", ");
    
card.innerHTML = `
  <strong>${bed.BedName}</strong><br>
  <small>${currentCrops || "Empty bed"}</small>
`;
    card.onclick = () => openBed(bed.BedID);

  if (bed.Area === "Greenhouse") {
  greenhouse.appendChild(card);
} else if (bed.Area === "Main Garden") {
  mainGarden.appendChild(card);
} else if (bed.Area === "Back Garden") {
  backGarden.appendChild(card);
} else if (bed.Area === "Berry Area" || bed.Area === "Berries") {
  berries.appendChild(card);
} else if (bed.Area === "Orchard") {
  orchard.appendChild(card);
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
  const bedTreatments = treatments.filter(entry =>
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
  let treatmentHtml = "";

if (bedTreatments.length === 0) {
  treatmentHtml = `<p>No treatment records yet for this bed.</p>`;
} else {
  treatmentHtml = bedTreatments.map(entry => `
    <div class="treatment-card">
      <h4>${entry.Issue || "Garden issue"}</h4>

      <p><strong>Date:</strong> ${formatDate(entry.Date)}</p>

      <p><strong>Treatment:</strong><br>
      ${entry.Treatment || "Not recorded"}</p>

      <p><strong>Result:</strong><br>
      ${entry.Result || "Not recorded"}</p>

      <p><strong>Notes:</strong><br>
      ${entry.Notes || "No notes yet."}</p>
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
<h3>Update Bed Info</h3>

<form onsubmit="saveBedInfo(event, '${bed.BedID}')">

<label>Current Use</label>
<input name="CurrentUse"
       value="${bed.CurrentUse || ""}">

<label>Sun</label>
<input name="Sun"
       value="${bed.Sun || ""}">

<label>Size</label>
<input name="Size"
       value="${bed.Size || ""}">

<label>Notes</label>
<textarea name="Notes">${bed.Notes || ""}</textarea>

<button type="submit">
💾 Save Bed Info
</button>

</form>

<hr>


    <h3>Planting History</h3>
${plantingHtml}

<hr>

<h3>Harvest History</h3>
${harvestHtml}

<hr>

<h3>Problems & Treatments</h3>
${treatmentHtml}

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

<hr>

<h3>Add Harvest</h3>

<form onsubmit="saveHarvest(event, '${bed.BedID}')">

<label>Crop</label>
<input name="Crop" required placeholder="Garlic, peas, tomatoes...">

<label>Harvest Date</label>
<input name="HarvestDate" type="date">

<label>Quantity</label>
<input name="Quantity" placeholder="5 lbs, 2 baskets, 18 bulbs">

<label>Notes</label>
<textarea name="Notes" placeholder="First harvest, excellent size..."></textarea>

<button type="submit">Save Harvest</button>

</form>

<hr>

<h3>Add Treatment</h3>

<form onsubmit="saveTreatment(event, '${bed.BedID}')">

<label>Problem</label>
<input name="Problem" required placeholder="Slugs, ants, cabbage moths...">

<label>Treatment Date</label>
<input name="TreatmentDate" type="date">

<label>Treatment</label>
<input name="Treatment" placeholder="Row cover, BT, compost, hand picking...">

<label>Notes</label>
<textarea name="Notes" placeholder="What happened and what you tried..."></textarea>

<button type="submit">Save Treatment</button>

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
async function saveHarvest(event, bedId) {

    event.preventDefault();

    const form = event.target;

    const harvest = {
        BedID: bedId,
        Crop: form.Crop.value,
        HarvestDate: form.HarvestDate.value,
        Quantity: form.Quantity.value,
        Notes: form.Notes.value
    };

    try {

        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "addHarvest",
                data: harvest
            })
        });

        alert("Harvest saved!");

        loadGardenData();

    } catch (error) {

        console.error(error);

        alert("Could not save harvest.");

    }

}

async function saveTreatment(event, bedId) {

    event.preventDefault();

    const form = event.target;

    const treatment = {
        BedID: bedId,
        Problem: form.Problem.value,
        TreatmentDate: form.TreatmentDate.value,
        Treatment: form.Treatment.value,
        Notes: form.Notes.value
    };

    try {

        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "addTreatment",
                data: treatment
            })
        });

        alert("Treatment saved!");

        loadGardenData();

    } catch (error) {

        console.error(error);

        alert("Could not save treatment.");

    }

}
async function saveBedInfo(event, bedId) {

    event.preventDefault();

    const form = event.target;

    const bedInfo = {
        BedID: bedId,
        CurrentUse: form.CurrentUse.value,
        Sun: form.Sun.value,
        Size: form.Size.value,
        Notes: form.Notes.value
    };

    try {

        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "updateBed",
                data: bedInfo
            })
        });

        alert("Bed information updated!");

        openBed(bedId);

    } catch (error) {

        console.error(error);

        alert("Could not update bed.");

    }

}
