"use strict";

// מספר המורה (אופציונלי). אם מוגדר כאן או בכתובת (?t=0501234567) – שדה המספר מוסתר מהתלמידים.
const TEACHER_PHONE = "";

const STORAGE_KEY = "cushing_quiz_state_v2";

const DIAGNOSES = {
  pituitary: "אדנומה בהיפופיזה (Cushing's Disease)",
  adrenal: "אדנומה באדרנל (Adrenal Adenoma)",
  iatrogenic: "קושינג יטרוגני (נטילת סטרואידים חיצוניים)",
  ectopic: "הפרשה אקטופית של ACTH (Ectopic ACTH)"
};

// ממצאי המעבדה והדוחות נכתבו לצורך הסימולציה, בהתאם לטבלת ההחלטה של המורה.
const CASES = {
  pituitary: {
    name: "נועה, בת 34",
    subtitle: "עלייה במשקל, פנים עגולות ואדמומיות וסימני מתיחה סגולים בבטן",
    story: "נועה הגיעה למרפאה בשל עלייה של 11 ק״ג בבטן ובצוואר בשמונת החודשים האחרונים, הופעת פנים עגולות ('פני ירח') וסימני מתיחה סגולים רחבים בדופן הבטן. אינה נוטלת תרופות קבועות.",
    patientImage: "images/pituitary_patient.jpg",
    patientAlt: "איור: אישה יושבת במרפאה, פניה עגולים ואדומים ועל בטנה סימני מתיחה סגולים",
    imagingImage: "images/pituitary_imaging.jpg",
    imagingAlt: "תמונת הדמיה להמחשה: CT בטן (משמאל) ו-MRI מוח (מימין)",
    report: "CT בטן: שתי בלוטות האדרנל מוגדלות. MRI מוח: מיקרו-אדנומה בקוטר 6 מ״מ בהיפופיזה.",
    labs: [
      { name: "סטרואידים (קורטיזול)", num: "42 µg/dL", word: "גבוה מאוד ↑↑", status: "high", ref: "תקין: 5–23 µg/dL" },
      { name: "ACTH", num: "96 pg/mL", word: "גבוה ↑", status: "high", ref: "תקין: 10–60 pg/mL" },
      { name: "CRH", num: "< 5 pg/mL", word: "נמוך ↓", status: "low", ref: "ערך נמוך מהתקין" }
    ],
    explanation: "הקורטיזול וה-ACTH גבוהים: מקור הבעיה הוא בהפרשת יתר של ACTH, והאדרנלים מגורים על ידו ולכן מוגדלים בשני הצדדים. ה-MRI מראה אדנומה בהיפופיזה – היא המקור של ה-ACTH העודף (מחלת קושינג). הקורטיזול הגבוה מפעיל משוב שלילי על ההיפותלמוס, ולכן ה-CRH נמוך."
  },
  adrenal: {
    name: "יוסי, בן 48",
    subtitle: "השמנה בטנית, יתר לחץ דם חדש וחולשת שרירי הירכיים",
    story: "יוסי פנה לרופא המשפחה עקב עלייה בלחץ הדם (165/100), השמנה בטנית בולטת עם גפיים דקות, פנים סמוקות ועגולות וקושי לעלות במדרגות. שולל נטילת משאפים, כדורים או זריקות סטרואידים.",
    patientImage: "images/adrenal_patient.jpg",
    patientAlt: "איור: גבר יושב במרפאה בזמן מדידת לחץ דם, עם בטן בולטת וסימני מתיחה",
    imagingImage: "images/adrenal_imaging.jpg",
    imagingAlt: "תמונת CT בטן להמחשה, חיצים מסמנים את בלוטות האדרנל",
    report: "CT בטן: גוש עגול ומוגדר היטב בקוטר 2.8 ס״מ בבלוטת האדרנל השמאלית (חץ); האדרנל הימני דק ומנוון (ראש חץ).",
    labs: [
      { name: "סטרואידים (קורטיזול)", num: "48 µg/dL", word: "גבוה מאוד ↑↑", status: "high", ref: "תקין: 5–23 µg/dL" },
      { name: "ACTH", num: "< 3 pg/mL", word: "נמוך מאוד ↓↓", status: "low", ref: "תקין: 10–60 pg/mL" },
      { name: "CRH", num: "< 5 pg/mL", word: "נמוך ↓", status: "low", ref: "ערך נמוך מהתקין" }
    ],
    explanation: "הגידול באדרנל השמאלי מפריש קורטיזול באופן אוטונומי, ללא תלות ב-ACTH. הקורטיזול הגבוה מפעיל משוב שלילי חזק שמדכא גם את ה-CRH בהיפותלמוס וגם את ה-ACTH בהיפופיזה. בהיעדר גירוי של ACTH, האדרנל השני (הימני) מנוון."
  },
  iatrogenic: {
    name: "דוד, בן 55",
    subtitle: "פני ירח, שטפי דם תת-עוריים באמות ועלייה ברמות הסוכר",
    story: "דוד סובל מדלקת מפרקים שגרונית, ומזה חצי שנה הוא נוטל תרופה קבועה בכדורים במינון גבוה. לאחרונה הופיעו שטפי דם ספונטניים באמות הידיים, פנים עגולות, כרס בולטת והצטברות שומן בעורף.",
    patientImage: "images/iatrogenic_patient.jpg",
    patientAlt: "איור: גבר במרפאה מחזיק בקבוק תרופות, עם פנים עגולים ושטפי דם באמות הידיים",
    imagingImage: "images/iatrogenic_imaging.jpg",
    imagingAlt: "תמונת CT בטן להמחשה",
    report: "CT בטן: שתי בלוטות האדרנל דקות ומנוונות. אין גושים או תהליכים תופסי מקום.",
    labs: [
      { name: "סטרואידים (קורטיזול + סטרואידים תרופתיים)", num: "", word: "גבוה מאוד ↑↑", status: "high", ref: "סך הפעילות הסטרואידלית בגוף" },
      { name: "ACTH", num: "< 2 pg/mL", word: "נמוך מאוד ↓↓", status: "low", ref: "תקין: 10–60 pg/mL" },
      { name: "CRH", num: "< 5 pg/mL", word: "נמוך ↓", status: "low", ref: "ערך נמוך מהתקין" }
    ],
    explanation: "דוד נוטל סטרואידים כתרופה (כגון פרדניזון) לטיפול בדלקת המפרקים. הסטרואידים מהתרופה גורמים לתסמיני קושינג ומפעילים משוב שלילי חזק, ולכן ה-CRH וה-ACTH נמוכים. בהיעדר גירוי של ACTH שתי בלוטות האדרנל מנוונות. (הערה: במציאות, הקורטיזול שהגוף עצמו מייצר נמוך במצב כזה; בתרגיל 'סטרואידים' מייצג את הפעילות הסטרואידלית הכוללת.)"
  },
  ectopic: {
    name: "רחל, בת 62",
    subtitle: "חולשת שרירים משמעותית, כהות עור ויתר לחץ דם וסוכר שהופיעו בתוך חודשים ספורים",
    story: "רחל, מעשנת כבדה מזה 40 שנה, פנתה למרפאה בשל חולשת שרירים שהחמירה במהירות בשלושת החודשים האחרונים, ירידה קלה במשקל, עור כהה יותר ויתר לחץ דם וסוכרת שהופיעו לאחרונה. בבדיקות הדם נמצא גם אשלגן נמוך (2.9 mmol/L). אינה נוטלת תרופות סטרואידיות.",
    patientImage: "images/ectopic_patient.jpg",
    patientAlt: "איור: אישה מבוגרת במרפאה, עם פנים עגולים ועור כהה",
    imagingImage: "images/ectopic_imaging.jpg",
    imagingAlt: "תמונת הדמיה להמחשה: MRI מוח ו-CT בטן",
    report: "MRI מוח: ההיפופיזה תקינה בגודלה ובמבנה, ללא נגע. CT בטן: שתי בלוטות האדרנל מוגדלות.",
    labs: [
      { name: "סטרואידים (קורטיזול)", num: "61 µg/dL", word: "גבוה מאוד ↑↑", status: "high", ref: "תקין: 5–23 µg/dL" },
      { name: "ACTH", num: "240 pg/mL", word: "גבוה מאוד ↑↑", status: "high", ref: "תקין: 10–60 pg/mL" },
      { name: "CRH", num: "< 5 pg/mL", word: "נמוך ↓", status: "low", ref: "ערך נמוך מהתקין" }
    ],
    explanation: "ה-ACTH והקורטיזול גבוהים מאוד, אך ההיפופיזה תקינה בהדמיה – לכן ה-ACTH אינו מגיע מההיפופיזה. גידול מחוץ להיפופיזה (למשל גידול נוירואנדוקריני בריאה, בעיקר אצל מעשנים) מפריש ACTH ללא בקרה. האדרנלים מגורים ומוגדלים בשני הצדדים, והקורטיזול הגבוה מדכא את ה-CRH. מקור הגידול יאותר בהמשך בהדמיות נוספות (למשל חזה). הקורטיזול הגבוה מאוד גורם גם לאשלגן נמוך ולחולשת שרירים, ועודף ACTH מגביר פיגמנטציה של העור."
  }
};

const DEFAULT_ORDER = ["pituitary", "adrenal", "iatrogenic", "ectopic"];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ערבוב שלא מחזיר את הסדר המקורי (כדי שסדר המקרים לא יתאים לסדר רשימת האבחנות)
function shuffleNotSame(arr) {
  let a;
  do { a = shuffle(arr); } while (a.every((v, i) => v === arr[i]));
  return a;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- state ----------
const state = {
  order: shuffleNotSame(DEFAULT_ORDER),
  optionOrder: shuffleNotSame(DEFAULT_ORDER),
  answers: {},
  studentName: "",
  teacherPhone: "",
  revealed: false,
  sentOnce: false,
  revealedBeforeSend: false
};
DEFAULT_ORDER.forEach((k) => { state.answers[k] = { selected: "", reasoning: "" }; });

let currentTab = 0; // 0..3 or "summary"

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  if (saved) {
    const validOrder = (o) => Array.isArray(o) && o.length === 4 && DEFAULT_ORDER.every((k) => o.includes(k));
    if (validOrder(saved.order)) state.order = saved.order;
    if (validOrder(saved.optionOrder)) state.optionOrder = saved.optionOrder;
    DEFAULT_ORDER.forEach((k) => { if (saved.answers && saved.answers[k]) Object.assign(state.answers[k], saved.answers[k]); });
    ["studentName", "teacherPhone", "revealed", "sentOnce", "revealedBeforeSend"].forEach((f) => { if (saved[f] !== undefined) state[f] = saved[f]; });
  }
} catch (e) { /* אחסון חסום – ממשיכים בלי שמירה */ }

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

// ---------- helpers ----------
const $ = (id) => document.getElementById(id);
const TAB_BASE = "tab-btn py-2.5 px-1 rounded-xl font-bold text-xs sm:text-sm border transition flex flex-col items-center justify-center gap-0.5 ";
const TAB_ON = TAB_BASE + "bg-indigo-600 text-white border-indigo-600 shadow-sm";
const TAB_OFF = TAB_BASE + "bg-white text-slate-700 border-slate-200 hover:bg-slate-50";

function showToast(msg) {
  const t = $("toast-box");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.add("hidden"), 2600);
}

function isDone(key) {
  const a = state.answers[key];
  return Boolean(a.selected || a.reasoning.trim());
}

function teacherPhone() {
  const fromUrl = new URLSearchParams(location.search).get("t") || "";
  return (TEACHER_PHONE || fromUrl || state.teacherPhone || "").replace(/\D/g, "");
}

function renderTabs() {
  $("nav-tabs").innerHTML = state.order.map((key, i) => `
    <button type="button" data-tab="${i}" class="${String(currentTab) === String(i) ? TAB_ON : TAB_OFF}">
      <span>מטופל/ת ${i + 1}</span>
      <span class="text-[10px] ${String(currentTab) === String(i) ? "opacity-90" : "text-slate-400"}">${isDone(key) ? "✓ נענה" : "ממתין"}</span>
    </button>`).join("");
  $("nav-tabs").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => switchTab(Number(b.dataset.tab))));

  const sum = $("tab-summary");
  sum.textContent = "✅ סיימתי! סיכום ושליחה למורה";
  sum.className = "mt-2 w-full py-2.5 rounded-xl font-bold text-sm border transition " +
    (currentTab === "summary" ? "bg-emerald-600 text-white border-emerald-600" : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100");
}

function updateProgress() {
  const n = state.order.filter(isDone).length;
  const b = $("progress-badge");
  b.textContent = `${n} מתוך 4 נענו`;
  b.className = "px-2.5 py-0.5 rounded-full font-bold " + (n === 4 ? "bg-emerald-100 text-emerald-800" : "bg-indigo-50 text-indigo-700");
  renderTabs();
}

function imgBox(src, alt, dark) {
  return `<img src="${src}" alt="${esc(alt)}" loading="lazy" class="max-w-full h-auto rounded-lg ${dark ? "object-contain" : "object-cover"} max-h-64"
    onerror="this.outerHTML='<div class=&quot;text-xs text-slate-400 py-10 text-center&quot;>התמונה בהכנה</div>'" />`;
}

// ---------- case view ----------
function renderCase(index) {
  const key = state.order[index];
  const c = CASES[key];
  const ans = state.answers[key];
  const last = index === state.order.length - 1;

  const labs = c.labs.map((l) => `
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
      <span class="text-xs font-bold text-slate-600">${esc(l.name)}</span>
      <div class="text-sm font-extrabold px-2.5 py-1 rounded-lg border inline-block self-start ${l.status === "high" ? "bg-rose-100 text-rose-800 border-rose-200" : "bg-sky-100 text-sky-800 border-sky-200"}">
        ${l.num ? `<span class="ltr-num">${esc(l.num)}</span> ` : ""}<span>${esc(l.word)}</span>
      </div>
      <span class="text-[11px] text-slate-400">${esc(l.ref)}</span>
    </div>`).join("");

  const options = state.optionOrder.map((k) => {
    const on = ans.selected === k;
    return `
      <button type="button" role="radio" aria-checked="${on}" data-cause="${k}" class="cause-btn radio-card w-full text-right p-3.5 rounded-xl border-2 flex items-center gap-2.5 ${on ? "selected border-indigo-600" : "border-slate-200 bg-white"}">
        <span class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-xs ${on ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"}">${on ? "✓" : ""}</span>
        <span class="text-xs sm:text-sm font-bold text-slate-800">${esc(DIAGNOSES[k])}</span>
      </button>`;
  }).join("");

  $("case-view-container").innerHTML = `
    <article class="fade-in bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="bg-gradient-to-l from-indigo-600 to-indigo-700 px-5 py-4 text-white">
        <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">מטופל/ת ${index + 1} מתוך 4</span>
        <h2 class="text-lg sm:text-xl font-extrabold mt-1">${esc(c.name)}</h2>
        <p class="text-xs sm:text-sm text-indigo-100 mt-0.5">${esc(c.subtitle)}</p>
      </div>

      <div class="p-4 sm:p-5 space-y-5">
        <div class="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong class="text-indigo-950">סיפור המקרה:</strong> ${esc(c.story)}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col">
            <div class="px-3.5 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700">🧑‍⚕️ הסתמנות קלינית במרפאה</div>
            <div class="p-2 bg-white flex-1 flex items-center justify-center">${imgBox(c.patientImage, c.patientAlt, false)}</div>
          </div>
          <div class="rounded-xl border border-slate-200 overflow-hidden bg-slate-900 text-white flex flex-col">
            <div class="px-3.5 py-2 bg-slate-800 border-b border-slate-700 text-xs font-bold text-emerald-400">🖥️ הדמיה (להמחשה)</div>
            <div class="p-2 bg-black flex-1 flex items-center justify-center">${imgBox(c.imagingImage, c.imagingAlt, true)}</div>
            <div class="px-3.5 py-2.5 bg-slate-800/90 text-xs text-slate-200 leading-snug border-t border-slate-700">
              <strong class="text-emerald-300">דוח רדיולוגי:</strong> ${esc(c.report)}
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-extrabold text-slate-900">🧪 בדיקות דם</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">${labs}</div>
        </div>

        <div class="pt-4 border-t border-slate-200 space-y-4">
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-900">🤔 מהי הסיבה לתסמונת קושינג אצל ${esc(c.name.split(",")[0])}?</h3>
            <p class="text-xs text-slate-500">בחרו אבחנה מהרשימה, ו/או כתבו בטקסט חופשי את ההסבר שלכם לפי בדיקות הדם וההדמיה.</p>
          </div>
          <div role="radiogroup" aria-label="סיבה לקושינג" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">${options}</div>
          <div>
            <label for="reasoning" class="block text-xs font-bold text-slate-700 mb-1.5">✍️ נימוק (איך רמות ה-ACTH וה-CRH וממצאי ההדמיה מסבירים את הבחירה?):</label>
            <textarea id="reasoning" rows="3" maxlength="600" placeholder="כתבו כאן את ההסבר שלכם..." class="w-full p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">${esc(ans.reasoning)}</textarea>
          </div>
          <div class="flex items-center justify-between gap-3 pt-2">
            ${index > 0 ? `<button type="button" id="btn-prev" class="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition">→ הקודם</button>` : "<div></div>"}
            ${last
              ? `<button type="button" id="btn-finish" class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition">סיימתי! לסיכום ✓</button>`
              : `<button type="button" id="btn-next" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-sm transition">הבא ←</button>`}
          </div>
        </div>
      </div>
    </article>`;

  $("case-view-container").querySelectorAll(".cause-btn").forEach((b) => b.addEventListener("click", () => {
    state.answers[key].selected = b.dataset.cause;
    saveState();
    renderCase(index);
    updateProgress();
  }));
  $("reasoning").addEventListener("input", (e) => {
    state.answers[key].reasoning = e.target.value;
    saveState();
    updateProgress();
  });
  const go = (id, fn) => { const el = $(id); if (el) el.addEventListener("click", fn); };
  go("btn-prev", () => switchTab(index - 1));
  go("btn-next", () => switchTab(index + 1));
  go("btn-finish", () => switchTab("summary"));
}

// ---------- summary ----------
function buildMessage() {
  const name = state.studentName.trim() || "תלמיד/ה";
  const lines = ["🩺 *סיכום תרגול: תסמונת קושינג – אבחנה מבדלת*", `👤 *שם:* ${name}`, ""];
  state.order.forEach((key, i) => {
    const a = state.answers[key];
    lines.push(`*${i + 1}. ${CASES[key].name}*`);
    lines.push(`   • סיבה: ${a.selected ? DIAGNOSES[a.selected] : "לא נבחרה"}`);
    lines.push(`   • נימוק: ${a.reasoning.trim() || "ללא נימוק"}`);
    lines.push("");
  });
  const flag = state.sentOnce ? state.revealedBeforeSend : state.revealed;
  if (flag) lines.push("ℹ️ הערה: צפיתי במפתח התשובות לפני השליחה.");
  return lines.join("\n").trim();
}

function renderSummary() {
  const n = state.order.filter(isDone).length;
  const pill = $("summary-completion-pill");
  pill.textContent = n === 4 ? "כל 4 המקרים נענו ✅" : `נענו ${n} מתוך 4`;
  pill.className = "px-3 py-1 rounded-full text-xs font-bold " + (n === 4 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800");

  $("summary-cards-list").innerHTML = state.order.map((key, i) => {
    const a = state.answers[key];
    return `
      <div class="p-3.5 rounded-xl border ${isDone(key) ? "border-slate-200 bg-slate-50" : "border-amber-300 bg-amber-50/50"} flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">${i + 1}</span>
            <span class="font-extrabold text-sm text-slate-900">${esc(CASES[key].name)}</span>
          </div>
          <p class="text-xs text-slate-700"><strong>בחירה:</strong> ${a.selected ? `<span class="text-indigo-700 font-bold">${esc(DIAGNOSES[a.selected])}</span>` : '<span class="text-amber-700">טרם נבחר</span>'}</p>
          <p class="text-xs text-slate-600"><strong>נימוק:</strong> ${a.reasoning.trim() ? esc(a.reasoning.trim()) : '<span class="text-slate-400">לא נכתב</span>'}</p>
        </div>
        <button type="button" data-edit="${i}" class="edit-btn self-start sm:self-center px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-indigo-700 border border-slate-200 text-xs font-bold shrink-0">✏️ עריכה</button>
      </div>`;
  }).join("");
  $("summary-cards-list").querySelectorAll(".edit-btn").forEach((b) => b.addEventListener("click", () => switchTab(Number(b.dataset.edit))));

  $("whatsapp-preview-text").textContent = buildMessage();

  $("solutions-cards").innerHTML = state.order.map((key, i) => {
    const sel = state.answers[key].selected;
    const badge = sel
      ? (sel === key ? '<span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">✓ זיהוי מדויק</span>' : '<span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">כדאי לבדוק שוב</span>')
      : "";
    return `
      <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <span class="font-extrabold text-slate-900">${i + 1}. ${esc(CASES[key].name)} – <span class="text-indigo-700">${esc(DIAGNOSES[key])}</span></span>
          ${badge}
        </div>
        <p class="text-slate-600 leading-relaxed">${esc(CASES[key].explanation)}</p>
      </div>`;
  }).join("");

  applySolutionsVisibility();
}

function applySolutionsVisibility() {
  $("solutions-panel").classList.toggle("hidden", !state.revealedShown);
  $("solutions-btn-label").textContent = state.revealedShown ? "הסתר מפתח תשובות" : "הצג מפתח תשובות והסבר";
}

function switchTab(tab) {
  currentTab = tab;
  const isSummary = tab === "summary";
  $("case-view-container").classList.toggle("hidden", isSummary);
  $("summary-view-container").classList.toggle("hidden", !isSummary);
  if (isSummary) renderSummary(); else renderCase(tab);
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function copyText(text, msg) {
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); showToast(msg); } catch (e) { showToast("לא ניתן להעתיק אוטומטית"); }
    document.body.removeChild(ta);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(msg)).catch(fallback);
  } else fallback();
}

function markSent() {
  if (!state.sentOnce) { state.sentOnce = true; state.revealedBeforeSend = state.revealed; saveState(); }
}

// ---------- init ----------
window.addEventListener("DOMContentLoaded", () => {
  $("student-name").value = state.studentName;
  $("teacher-phone").value = state.teacherPhone;
  if (TEACHER_PHONE || new URLSearchParams(location.search).get("t")) $("phone-wrap").classList.add("hidden");

  $("student-name").addEventListener("input", (e) => {
    state.studentName = e.target.value; saveState();
    if (currentTab === "summary") $("whatsapp-preview-text").textContent = buildMessage();
  });
  $("teacher-phone").addEventListener("input", (e) => { state.teacherPhone = e.target.value; saveState(); });

  $("tab-summary").addEventListener("click", () => switchTab("summary"));

  $("btn-copy-summary").addEventListener("click", () => {
    markSent();
    copyText(buildMessage(), "הסיכום הועתק! אפשר להדביק בוואטסאפ 📋");
  });

  $("btn-send-whatsapp").addEventListener("click", () => {
    markSent();
    const raw = teacherPhone();
    const phone = raw ? (raw.startsWith("0") ? "972" + raw.slice(1) : raw) : "";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });

  $("btn-toggle-solutions").addEventListener("click", () => {
    state.revealedShown = !state.revealedShown;
    if (state.revealedShown) state.revealed = true;
    saveState();
    $("whatsapp-preview-text").textContent = buildMessage();
    applySolutionsVisibility();
  });

  const modal = $("modal-axis");
  const open = () => modal.classList.remove("hidden");
  const close = () => modal.classList.add("hidden");
  $("btn-axis-guide").addEventListener("click", open);
  $("btn-close-axis").addEventListener("click", close);
  $("btn-close-axis-bottom").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  switchTab(0);
  window.scrollTo(0, 0);
});
