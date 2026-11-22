(() => {
  // main.ts
  var I18N = { "en": { "token": "Token", "name": "Name", "symbol": "Symbol", "supply": "Supply", "launch": "Launch", "deploy": "\u{1F680} Deploy to bonding curve", "stats": "Live stats", "price": "price", "mcap": "market cap", "holders": "holders", "liq": "liquidity", "deployed": "deployed!", "per": "per" }, "de": { "token": "Token", "name": "Name", "symbol": "Symbol", "supply": "Supply", "launch": "Launch", "deploy": "\u{1F680} Auf Bonding Curve deployen", "stats": "Live-Statistiken", "price": "preis", "mcap": "market cap", "holders": "halter", "liq": "liquidit\xE4t", "deployed": "deployt!", "per": "pro" } };
  var lang = localStorage.getItem("lang") || "en";
  var t = (k) => I18N[lang][k] || k;
  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i]").forEach((el) => el.textContent = t(el.dataset.i));
    document.querySelectorAll(".lang button").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
  }
  document.querySelectorAll(".lang button").forEach((b) => b.onclick = () => {
    lang = b.dataset.lang;
    localStorage.setItem("lang", lang);
    applyLang();
  });
  var cv = document.getElementById("cv");
  var ctx = cv.getContext("2d");
  var $ = (id) => document.getElementById(id);
  var W;
  var H;
  var price = 1e-6;
  var mcap = 0;
  var holders = 0;
  var liq = 0;
  var deployed = false;
  var curve = [];
  function resize() {
    const r = cv.parentElement.getBoundingClientRect();
    W = cv.width = r.width * devicePixelRatio;
    H = cv.height = r.height * devicePixelRatio;
  }
  addEventListener("resize", resize);
  resize();
  function rnd() {
    return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  }
  function tick() {
    if (!deployed) return;
    const hype = Math.min(1, holders / 500);
    price *= 1 + 2e-3 + 0.03 * hype * rnd() + 0.01;
    mcap = price * (+$("supply").value || 1e9);
    holders += Math.floor(Math.random() * 3 * (1 + hype * 5));
    liq = mcap * 0.4;
    curve.push(price);
    if (curve.length > 300) curve.shift();
    render();
  }
  function render() {
    ctx.fillStyle = "#07090f";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(60,80,140,.12)";
    for (let i = 1; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(W * i / 10, 0);
      ctx.lineTo(W * i / 10, H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, H * i / 10);
      ctx.lineTo(W, H * i / 10);
      ctx.stroke();
    }
    if (curve.length > 1) {
      const min = Math.min(...curve), max = Math.max(...curve), rg = max - min || 1;
      ctx.beginPath();
      curve.forEach((p, i) => {
        const x = i / (curve.length - 1) * W, y = H - 20 - (p - min) / rg * (H * 0.7);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.strokeStyle = "#ff6ec7";
      ctx.lineWidth = 2.5 * devicePixelRatio;
      ctx.shadowColor = "#ff6ec7";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.beginPath();
    ctx.arc(W * 0.25, H * 0.45, Math.min(W, H) * 0.14, 0, 7);
    const g = ctx.createRadialGradient(W * 0.25 - 20, H * 0.45 - 20, 10, W * 0.25, H * 0.45, Math.min(W, H) * 0.14);
    g.addColorStop(0, "#ffd479");
    g.addColorStop(1, "#ff6ec7");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.fillStyle = "#07090f";
    ctx.font = "bold " + Math.min(W, H) * 0.09 + "px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(($("symbol").value || "?").slice(0, 4), W * 0.25, H * 0.45);
    $("stats").innerHTML = "<b>" + ($("symbol").value || "???") + "</b> " + t("price") + ": $" + price.toExponential(3) + "<br>" + t("mcap") + ": $" + (mcap / 1e6).toFixed(2) + "M<br>" + t("holders") + ": " + holders.toLocaleString() + "<br>" + t("liq") + ": $" + (liq / 1e6).toFixed(2) + "M";
  }
  $("deploy").onclick = () => {
    deployed = true;
    $("deploy").disabled = true;
    $("deploy").textContent = t("deployed");
    const b = $("banner");
    b.textContent = $("name").value + " (" + $("symbol").value + ") " + t("deployed");
    b.style.display = "block";
    setTimeout(() => b.style.display = "none", 4e3);
    render();
  };
  ["name", "symbol", "supply"].forEach((id) => $(id).addEventListener("input", render));
  render();
  setInterval(tick, 800);
  applyLang();
})();
