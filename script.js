// ============================================================
// EDIT THIS SECTION when you have your real colors and prices.
// Each line = one generation option in the dropdown.
//   name  -> text shown to the customer
//   color -> hex color shown next to the name (e.g. "#0000FF")
//   price -> price per shirt for that generation, in dollars
// ============================================================
const GENERATIONS = [
  { name: "Gen Z",       color: "#3B82F6", price: 20 },
  { name: "Millennial",  color: "#22C55E", price: 20 },
  { name: "Gen X",       color: "#EF4444", price: 20 },
  { name: "Boomer",      color: "#EAB308", price: 20 },
];

const MAX_QUANTITY = 10;
// ============================================================

const generationSelect = document.getElementById("generation");
const quantitySelect = document.getElementById("quantity");
const sizeSelect = document.getElementById("size");
const legendList = document.getElementById("legend");
const orderBody = document.getElementById("orderBody");
const totalShirtsEl = document.getElementById("totalShirts");
const totalPriceEl = document.getElementById("totalPrice");
const addBtn = document.getElementById("addBtn");
const customerNameInput = document.getElementById("customerName");
const copyBtn = document.getElementById("copyBtn");
const copyOutput = document.getElementById("copyOutput");
const emailBtn = document.getElementById("emailBtn");

const ORDER_EMAIL = "Vontreava1@outlook.com";

let orderLines = [];

function populateGenerationDropdown() {
  GENERATIONS.forEach((gen) => {
    const option = document.createElement("option");
    option.value = gen.name;
    option.textContent = `${gen.name} - $${gen.price.toFixed(2)}`;
    generationSelect.appendChild(option);
  });
}

function populateLegend() {
  GENERATIONS.forEach((gen) => {
    const item = document.createElement("li");
    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.backgroundColor = gen.color;
    item.appendChild(swatch);
    item.appendChild(document.createTextNode(gen.name));
    legendList.appendChild(item);
  });
}

function populateQuantityDropdown() {
  for (let i = 1; i <= MAX_QUANTITY; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    quantitySelect.appendChild(option);
  }
}

function findGeneration(name) {
  return GENERATIONS.find((gen) => gen.name === name);
}

function addOrderLine() {
  const genName = generationSelect.value;
  const size = sizeSelect.value;
  const quantity = parseInt(quantitySelect.value, 10);
  const generation = findGeneration(genName);

  orderLines.push({
    generation: generation.name,
    size,
    quantity,
    priceEach: generation.price,
  });

  renderOrderTable();
}

function removeOrderLine(index) {
  orderLines.splice(index, 1);
  renderOrderTable();
}

function renderOrderTable() {
  orderBody.innerHTML = "";

  orderLines.forEach((line, index) => {
    const row = document.createElement("tr");

    const lineTotal = line.priceEach * line.quantity;

    row.innerHTML = `
      <td>${line.generation}</td>
      <td>${line.size}</td>
      <td>${line.quantity}</td>
      <td>$${line.priceEach.toFixed(2)}</td>
      <td>$${lineTotal.toFixed(2)}</td>
      <td></td>
    `;

    const removeCell = row.querySelector("td:last-child");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-btn";
    removeBtn.addEventListener("click", () => removeOrderLine(index));
    removeCell.appendChild(removeBtn);

    orderBody.appendChild(row);
  });

  updateGrandTotals();
}

function updateGrandTotals() {
  const totalShirts = orderLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalPrice = orderLines.reduce(
    (sum, line) => sum + line.quantity * line.priceEach,
    0
  );

  totalShirtsEl.textContent = totalShirts;
  totalPriceEl.textContent = totalPrice.toFixed(2);
}

function buildOrderText() {
  const name = customerNameInput.value.trim() || "(name not entered)";
  const totalShirts = orderLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalPrice = orderLines.reduce(
    (sum, line) => sum + line.quantity * line.priceEach,
    0
  );

  const lines = [
    "Grant-Byerly Family Reunion T-Shirt Order",
    `Customer: ${name}`,
    "",
    "Items:",
  ];

  if (orderLines.length === 0) {
    lines.push("  (no items added yet)");
  } else {
    orderLines.forEach((line) => {
      const lineTotal = (line.priceEach * line.quantity).toFixed(2);
      lines.push(
        `  - ${line.generation}, Size ${line.size}, Qty ${line.quantity} @ $${line.priceEach.toFixed(2)} = $${lineTotal}`
      );
    });
  }

  lines.push(
    "",
    `Grand Total Shirts: ${totalShirts}`,
    `Grand Total Price: $${totalPrice.toFixed(2)}`,
    "",
    "Payment: Zelle 2147898868 or Cash App $edisongrant",
    "Please note \"T-shirt order\" with your payment."
  );

  return lines.join("\n");
}

async function copyOrderText() {
  const text = buildOrderText();
  copyOutput.value = text;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied!";
  } catch (err) {
    copyOutput.select();
    copyBtn.textContent = "Select the text below and copy manually";
  }

  setTimeout(() => {
    copyBtn.textContent = "Copy Order as Text";
  }, 2000);
}

function emailOrder() {
  const name = customerNameInput.value.trim() || "Customer";
  const subject = `Grant-Byerly Family Reunion T-Shirt Order - ${name}`;
  const body = buildOrderText();

  const mailtoUrl = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
}

populateGenerationDropdown();
populateLegend();
populateQuantityDropdown();
addBtn.addEventListener("click", addOrderLine);
copyBtn.addEventListener("click", copyOrderText);
emailBtn.addEventListener("click", emailOrder);
