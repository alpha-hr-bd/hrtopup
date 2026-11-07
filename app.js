const PRODUCTS = [
  {name:"Weekly Lite", price:44, category:"membership", note:"Weekly membership"},
  {name:"Weekly", price:163, category:"membership", note:"Weekly membership"},
  {name:"Monthly", price:805, category:"membership", note:"Monthly membership"},
  {name:"25 Diamonds", price:24, category:"diamonds", note:"Diamond pack"},
  {name:"50 Diamonds", price:39, category:"diamonds", note:"Diamond pack"},
  {name:"100 Diamonds", price:73, category:"diamonds", note:"Diamond pack"},
  {name:"115 Diamonds", price:83, category:"diamonds", note:"Diamond pack"},
  {name:"240 Diamonds", price:164, category:"diamonds", note:"Diamond pack"},
  {name:"355 Diamonds", price:242, category:"diamonds", note:"Diamond pack"},
  {name:"480 Diamonds", price:321, category:"diamonds", note:"Diamond pack"},
  {name:"505 Diamonds", price:342, category:"diamonds", note:"Diamond pack"},
  {name:"610 Diamonds", price:409, category:"diamonds", note:"Diamond pack"},
  {name:"725 Diamonds", price:484, category:"diamonds", note:"Diamond pack"},
  {name:"1090 Diamonds", price:723, category:"diamonds", note:"Diamond pack"},
  {name:"1240 Diamonds", price:822, category:"diamonds", note:"Diamond pack"},
  {name:"2530 Diamonds", price:1635, category:"diamonds", note:"Diamond pack"},
  {name:"5060 Diamonds", price:3240, category:"diamonds", note:"Diamond pack"},
  {name:"7590 Diamonds", price:4860, category:"diamonds", note:"Diamond pack"},
  {name:"10120 Diamonds", price:6490, category:"diamonds", note:"Diamond pack"},
  {name:"12,650 Diamonds", price:8250, category:"diamonds", note:"Diamond pack"}
];

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const emptyState = document.getElementById("emptyState");
let selectedProduct = null;
let activeFilter = "all";

function money(value) {
  return "৳" + Number(value).toLocaleString("en-BD");
}

function renderProducts() {
  let list = PRODUCTS.map((product, index) => ({...product, index}));
  if (activeFilter !== "all") list = list.filter(p => p.category === activeFilter);
  const query = searchInput.value.trim().toLowerCase();
  if (query) list = list.filter(p => p.name.toLowerCase().includes(query));
  if (sortSelect.value === "low") list.sort((a,b) => a.price - b.price);
  if (sortSelect.value === "high") list.sort((a,b) => b.price - a.price);

  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-top"><span class="product-icon">${p.category === "membership" ? "✦" : "◆"}</span><span class="stock">● In Stock</span></div>
      <h3>${p.name}</h3><div class="type">${p.note}</div>
      <div class="product-bottom"><div class="price">${money(p.price)} <small>BDT</small></div>
      <button class="select-btn ${selectedProduct?.index === p.index ? "selected" : ""}" data-index="${p.index}">${selectedProduct?.index === p.index ? "Selected ✓" : "Select"}</button></div>
    </article>`).join("");
  emptyState.hidden = list.length > 0;
}

function selectProduct(index) {
  selectedProduct = {...PRODUCTS[index], index};
  document.getElementById("selectedName").textContent = selectedProduct.name;
  document.getElementById("selectedPrice").textContent = money(selectedProduct.price);
  document.querySelectorAll(".select-btn").forEach(button => {
    const active = Number(button.dataset.index) === index;
    button.classList.toggle("selected", active);
    button.textContent = active ? "Selected ✓" : "Select";
  });
  document.getElementById("order").scrollIntoView({behavior:"smooth", block:"start"});
}

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-index]");
  if (button) selectProduct(Number(button.dataset.index));
});
searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
  renderProducts();
}));

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2100);
}

document.getElementById("copyBkash").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("01607400190");
    showToast("bKash number copied");
  } catch {
    showToast("bKash number: 01607400190");
  }
});

document.getElementById("orderForm").addEventListener("submit", event => {
  event.preventDefault();
  const message = document.getElementById("formMessage");
  if (!selectedProduct) {
    message.textContent = "Please select a package from the store first.";
    document.getElementById("packages").scrollIntoView({behavior:"smooth"});
    return;
  }

  const uid = document.getElementById("playerUid").value.trim();
  const playerName = document.getElementById("playerName").value.trim();
  const amount = document.getElementById("amountSent").value.trim();
  const sender = document.getElementById("senderNumber").value.trim();
  const trx = document.getElementById("trxId").value.trim();
  const note = document.getElementById("orderNote").value.trim();
  if (!/^\d{5,20}$/.test(uid)) {
    message.textContent = "Please enter a valid Player UID (5–20 digits).";
    document.getElementById("playerUid").focus();
    return;
  }
  if (!/^01[3-9]\d{8}$/.test(sender)) {
    message.textContent = "Please enter a valid Bangladesh mobile number.";
    document.getElementById("senderNumber").focus();
    return;
  }

  const lines = [
    "HR TOP UP - NEW ORDER",
    "----------------------",
    `Package: ${selectedProduct.name}`,
    `Package price: ${money(selectedProduct.price)}`,
    `Player UID: ${uid}`,
    `In-game name: ${playerName || "Not provided"}`,
    `Amount sent: ${money(amount)}`,
    `bKash sender: ${sender}`,
    `Transaction ID: ${trx}`,
    `Note: ${note || "None"}`,
    "----------------------",
    "Please verify payment and order details."
  ];
  const url = "https://wa.me/8801812478792?text=" + encodeURIComponent(lines.join("\n"));
  message.textContent = "WhatsApp opened. Review the message and press Send to submit your order.";
  window.open(url, "_blank", "noopener,noreferrer");
});

document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
