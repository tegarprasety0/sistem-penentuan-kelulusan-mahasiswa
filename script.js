(() => {
  "use strict";

  /* ---------------- konfigurasi aturan ---------------- */

  const STORE_KEY = "aljabar-boolean-kelulusan-v1";
  const FIELDS = ["ujian", "tugas", "kehadiran"];

  const ATOMS = [
    { id: "A", field: "ujian", threshold: 70, label: "Ujian ≥ 70" },
    { id: "B", field: "tugas", threshold: 60, label: "Tugas ≥ 60" },
    { id: "C", field: "kehadiran", threshold: 75, label: "Kehadiran ≥ 75" },
    { id: "D", field: "ujian", threshold: 85, label: "Ujian ≥ 85" },
    { id: "E", field: "tugas", threshold: 80, label: "Tugas ≥ 80" },
    { id: "F", field: "kehadiran", threshold: 70, label: "Kehadiran ≥ 70" }
  ];

  const PATHS = [
    { label: "J₁", atoms: ["A", "B", "C"] },
    { label: "J₂", atoms: ["D", "E", "F"] }
  ];

  const FIELD_LABEL = { ujian: "ujian", tugas: "tugas", kehadiran: "kehadiran" };

  const byId = (id) => document.getElementById(id);

  const form = byId("form");
  const nameInput = byId("nama");
  const verdict = byId("verdict");
  const verdictValue = byId("verdictValue");
  const verdictNote = byId("verdictNote");
  const pathsEl = byId("paths");
  const pathFinal = byId("pathFinal");
  const recordsBody = byId("recordsBody");
  const archiveTable = byId("archiveTable");
  const archiveEmpty = byId("archiveEmpty");
  const archiveCount = byId("archiveCount");
  const archiveStatus = byId("archiveStatus");
  const scrollHint = byId("scrollHint");
  const clearAllBtn = byId("clearAll");
  const atomBody = byId("atomBody");

  let storageOK = true;
  let flashId = null;
  let statusTimer = 0;

  /* ---------------- penyimpanan ---------------- */

  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter((record) => {
        return (
          record &&
          typeof record.id === "string" &&
          typeof record.nama === "string" &&
          FIELDS.every((field) => Number.isFinite(record[field])) &&
          typeof record.lulus === "boolean" &&
          Number.isFinite(record.at)
        );
      });
    } catch (error) {
      storageOK = false;
      return [];
    }
  }

  function persist() {
    if (!storageOK) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(records));
    } catch (error) {
      storageOK = false;
      showStorageWarning();
    }
  }

  function showStorageWarning() {
    const foot = document.querySelector(".foot");
    if (!foot || document.getElementById("storageWarning")) return;
    const warning = document.createElement("span");
    warning.id = "storageWarning";
    warning.textContent = "Penyimpanan peramban tidak tersedia";
    warning.style.color = "var(--accent)";
    foot.appendChild(warning);
  }

  let records = loadRecords();

  /* ---------------- util ---------------- */

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function formatTime(timestamp) {
    try {
      return new Date(timestamp).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "";
    }
  }

  function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function setArchiveStatus(text) {
    archiveStatus.textContent = text;
    archiveStatus.classList.add("is-on");
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => {
      archiveStatus.classList.remove("is-on");
      archiveStatus.textContent = "";
    }, 2600);
  }

  /* ---------------- tabel atom ---------------- */

  const atomRows = new Map();

  ATOMS.forEach((atom) => {
    const row = document.createElement("tr");
    row.dataset.atom = atom.id;
    row.innerHTML =
      '<td><span class="atom-key">' + atom.id + "</span></td>" +
      "<td>" + atom.label + "</td>" +
      '<td class="num" data-value>&ndash;</td>' +
      '<td class="num"><span class="bit" data-bit>&ndash;</span></td>';
    atomBody.appendChild(row);
    atomRows.set(atom.id, row);
  });

  /* ---------------- baca & evaluasi ---------------- */

  function readInputs() {
    const values = {};
    let complete = true;

    FIELDS.forEach((field) => {
      const input = byId(field);
      const raw = input.value.trim();
      const numeric = Number(raw);
      const valid = raw !== "" && Number.isFinite(numeric) && numeric >= 0 && numeric <= 100;
      values[field] = valid ? Math.round(numeric) : null;
      if (!valid) complete = false;
    });

    return {
      values: values,
      complete: complete,
      name: nameInput.value.trim().replace(/\s+/g, " ")
    };
  }

  function evaluate(values) {
    const bits = {};
    ATOMS.forEach((atom) => {
      bits[atom.id] = values[atom.field] >= atom.threshold;
    });

    const path1 = bits.A && bits.B && bits.C;
    const path2 = bits.D && bits.E && bits.F;

    return { bits: bits, path1: path1, path2: path2, lulus: path1 || path2 };
  }

  function failedAtoms(path, bits, values) {
    return ATOMS.filter((atom) => path.atoms.indexOf(atom.id) !== -1 && !bits[atom.id])
      .map((atom) => atom.id + " (" + FIELD_LABEL[atom.field] + " " + values[atom.field] + " < " + atom.threshold + ")")
      .join(", ");
  }

  function buildNote(name, values, result) {
    const prefix = name ? name + " — " : "";

    if (result.lulus) {
      const via = [];
      if (result.path1) via.push("J₁");
      if (result.path2) via.push("J₂");
      return prefix + "L = 1 karena " + via.join(" dan ") + " terpenuhi. Mahasiswa dinyatakan lulus.";
    }

    return (
      prefix +
      "L = 0 dan ¬L = 1. J₁ gagal pada " +
      failedAtoms(PATHS[0], result.bits, values) +
      "; J₂ gagal pada " +
      failedAtoms(PATHS[1], result.bits, values) +
      "."
    );
  }

  /* ---------------- render evaluasi ---------------- */

  function renderIdle() {
    verdict.dataset.state = "idle";
    verdictValue.textContent = "—";
    verdictNote.textContent = "Lengkapi ketiga nilai (0–100) untuk mengevaluasi.";

    ATOMS.forEach((atom) => {
      const row = atomRows.get(atom.id);
      row.querySelector("[data-value]").textContent = "–";
      const bit = row.querySelector("[data-bit]");
      bit.textContent = "–";
      bit.className = "bit";
    });

    pathsEl.innerHTML = '<div class="path-empty">Menunggu nilai lengkap.</div>';
    pathFinal.innerHTML = "<span>L = J₁ ∨ J₂ = –</span><span>¬L = –</span>";
  }

  function renderEvaluation() {
    const input = readInputs();

    if (!input.complete) {
      renderIdle();
      return;
    }

    const result = evaluate(input.values);

    verdict.dataset.state = result.lulus ? "pass" : "fail";
    verdictValue.textContent = result.lulus ? "Lulus" : "Tidak lulus";
    verdictNote.textContent = buildNote(input.name, input.values, result);

    ATOMS.forEach((atom) => {
      const row = atomRows.get(atom.id);
      row.querySelector("[data-value]").textContent = input.values[atom.field];
      const bit = row.querySelector("[data-bit]");
      bit.textContent = result.bits[atom.id] ? "1" : "0";
      bit.className = "bit " + (result.bits[atom.id] ? "is-1" : "is-0");
    });

    pathsEl.innerHTML = PATHS.map((path) => {
      const bits = path.atoms.map((id) => result.bits[id]);
      const value = bits.every(Boolean);
      const renderedBits = bits
        .map((bit) => '<b class="' + (bit ? "is-1" : "is-0") + '">' + (bit ? 1 : 0) + "</b>")
        .join(' <span class="eq">∧</span> ');

      return (
        '<div class="path">' +
        '<span class="path__id">' + path.label + "</span>" +
        '<span class="path__calc">' + path.atoms.join(" ∧ ") +
        ' <span class="eq">=</span> ' + renderedBits + "</span>" +
        '<span class="path__res ' + (value ? "is-1" : "is-0") + '">' + (value ? 1 : 0) + "</span>" +
        "</div>"
      );
    }).join("");

    pathFinal.innerHTML =
      '<span class="strong">L = J₁ ∨ J₂ = <b class="' + (result.lulus ? "is-1" : "is-0") + '">' + (result.lulus ? 1 : 0) + "</b></span>" +
      "<span>¬L = <b class=\"" + (result.lulus ? "is-0" : "is-1") + '">' + (result.lulus ? 0 : 1) + "</b></span>";
  }

  /* ---------------- render arsip ---------------- */

  function resetClearAll() {
    window.clearTimeout(clearAllBtn.dataset.timer);
    clearAllBtn.dataset.armed = "";
    clearAllBtn.textContent = "Hapus semua";
    clearAllBtn.classList.remove("is-armed");
  }

  function renderArchive() {
    const total = records.length;
    const passed = records.filter((record) => record.lulus).length;

    archiveCount.textContent =
      total + " data · " + passed + " lulus · " + (total - passed) + " tidak lulus";

    clearAllBtn.disabled = total === 0;
    resetClearAll();

    archiveTable.hidden = total === 0;
    archiveEmpty.hidden = total !== 0;
    scrollHint.hidden = total === 0;

    recordsBody.innerHTML = records
      .map((record, index) => {
        const status = record.lulus
          ? '<span class="tag tag--pass">Lulus</span>'
          : '<span class="tag tag--fail">Tidak lulus</span>';
        const bitClass = record.lulus ? "is-1" : "is-0";

        return (
          '<tr class="' + (record.id === flashId ? "is-new" : "") + '">' +
          '<td class="num col-no">' + String(index + 1).padStart(2, "0") + "</td>" +
          "<td><span class=\"rec-name\">" + escapeHTML(record.nama) + "</span>" +
          '<span class="rec-time">' + escapeHTML(formatTime(record.at)) + "</span></td>" +
          '<td class="num">' + record.ujian + "</td>" +
          '<td class="num">' + record.tugas + "</td>" +
          '<td class="num">' + record.kehadiran + "</td>" +
          '<td class="num"><span class="lbit ' + bitClass + '">' + (record.lulus ? 1 : 0) + "</span></td>" +
          "<td>" + status + "</td>" +
          '<td class="col-actions">' +
          '<button type="button" class="link" data-act="load" data-id="' + record.id + '">Muat</button>' +
          '<button type="button" class="link link--danger" data-act="delete" data-id="' + record.id + '">Hapus</button>' +
          "</td>" +
          "</tr>"
        );
      })
      .join("");

    flashId = null;
  }

  /* ---------------- validasi ---------------- */

  function setFieldError(field, message) {
    const wrapper = document.querySelector('.field[data-field="' + field + '"]');
    if (wrapper) wrapper.classList.add("is-invalid");
    const paragraph = byId("err-" + field);
    if (paragraph) {
      paragraph.textContent = message;
      paragraph.hidden = false;
    }
  }

  function clearFieldError(field) {
    const wrapper = document.querySelector('.field[data-field="' + field + '"]');
    if (wrapper) wrapper.classList.remove("is-invalid");
    const paragraph = byId("err-" + field);
    if (paragraph) {
      paragraph.textContent = "";
      paragraph.hidden = true;
    }
  }

  function clearAllErrors() {
    ["nama"].concat(FIELDS).forEach(clearFieldError);
  }

  function validate() {
    const invalid = [];

    if (!nameInput.value.trim()) {
      setFieldError("nama", "Nama mahasiswa wajib diisi.");
      invalid.push(nameInput);
    } else {
      clearFieldError("nama");
    }

    FIELDS.forEach((field) => {
      const input = byId(field);
      const raw = input.value.trim();
      const numeric = Number(raw);

      if (raw === "") {
        setFieldError(field, "Nilai wajib diisi.");
        invalid.push(input);
      } else if (!Number.isFinite(numeric) || numeric < 0 || numeric > 100) {
        setFieldError(field, "Nilai harus berada pada rentang 0–100.");
        invalid.push(input);
      } else {
        clearFieldError(field);
      }
    });

    return invalid;
  }

  /* ---------------- aksi data ---------------- */

  function saveRecord(event) {
    event.preventDefault();

    const invalid = validate();
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const input = readInputs();
    const result = evaluate(input.values);
    const record = {
      id: createId(),
      nama: input.name,
      ujian: input.values.ujian,
      tugas: input.values.tugas,
      kehadiran: input.values.kehadiran,
      lulus: result.lulus,
      at: Date.now()
    };

    records.unshift(record);
    flashId = record.id;
    persist();
    renderArchive();
    setArchiveStatus("Tersimpan");

    nameInput.value = "";
    renderEvaluation();
    nameInput.focus();
  }

  function loadRecord(id) {
    const record = records.find((item) => item.id === id);
    if (!record) return;

    nameInput.value = record.nama;
    FIELDS.forEach((field) => {
      byId(field).value = record[field];
      byId(field + "Range").value = record[field];
      clearFieldError(field);
    });
    clearFieldError("nama");
    renderEvaluation();

    document.querySelector(".panel--input").scrollIntoView({ behavior: "smooth", block: "center" });
    try {
      nameInput.focus({ preventScroll: true });
    } catch (error) {
      nameInput.focus();
    }
  }

  function removeRecord(id) {
    records = records.filter((record) => record.id !== id);
    persist();
    renderArchive();
    setArchiveStatus("Data dihapus");
  }

  /* ---------------- event ---------------- */

  form.addEventListener("submit", saveRecord);

  form.addEventListener("reset", () => {
    clearAllErrors();
    window.setTimeout(renderEvaluation, 0);
  });

  form.addEventListener("input", (event) => {
    const field = event.target.id;
    if (field === "nama" || FIELDS.indexOf(field) !== -1) {
      clearFieldError(field);
      renderEvaluation();
    }
  });

  FIELDS.forEach((field) => {
    const range = byId(field + "Range");
    const number = byId(field);

    range.addEventListener("input", () => {
      number.value = range.value;
      clearFieldError(field);
      renderEvaluation();
    });

    number.addEventListener("input", () => {
      if (number.value !== "") {
        let numeric = Number(number.value);
        if (Number.isFinite(numeric)) {
          if (numeric > 100) {
            numeric = 100;
            number.value = "100";
          } else if (numeric < 0) {
            numeric = 0;
            number.value = "0";
          }
          range.value = String(Math.max(0, Math.min(100, Math.round(numeric))));
        }
      }
      clearFieldError(field);
    });
  });

  recordsBody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-act]");
    if (!button) return;

    const id = button.dataset.id;

    if (button.dataset.act === "load") {
      loadRecord(id);
      return;
    }

    if (button.dataset.armed === "1") {
      removeRecord(id);
      return;
    }

    button.dataset.armed = "1";
    button.textContent = "Yakin?";
    button.classList.add("is-armed");
    button.dataset.timer = String(
      window.setTimeout(() => {
        if (!button.isConnected) return;
        button.dataset.armed = "";
        button.textContent = "Hapus";
        button.classList.remove("is-armed");
      }, 2800)
    );
  });

  clearAllBtn.addEventListener("click", () => {
    if (records.length === 0) return;

    if (clearAllBtn.dataset.armed !== "1") {
      clearAllBtn.dataset.armed = "1";
      clearAllBtn.textContent = "Klik lagi";
      clearAllBtn.classList.add("is-armed");
      clearAllBtn.dataset.timer = String(window.setTimeout(resetClearAll, 3200));
      return;
    }

    records = [];
    persist();
    renderArchive();
    setArchiveStatus("Arsip dikosongkan");
  });

  /* ---------------- mulai ---------------- */

  renderEvaluation();
  renderArchive();
  if (!storageOK) showStorageWarning();
})();


