document.addEventListener("DOMContentLoaded", () => {
  // 1. Toggle German translation hints (.de)
  const deToggle = document.getElementById("toggle-de");
  if (localStorage.getItem("plida_hide_de") === "1") {
    document.body.classList.add("hide-de");
    if (deToggle) deToggle.textContent = "Mostra aiuti (DE)";
  }

  if (deToggle) {
    deToggle.addEventListener("click", () => {
      const hidden = document.body.classList.toggle("hide-de");
      localStorage.setItem("plida_hide_de", hidden ? "1" : "0");
      deToggle.textContent = hidden ? "Mostra aiuti (DE)" : "Nascondi aiuti (DE)";
    });
  }

  // 2. Accordions
  document.querySelectorAll(".accordion-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".accordion").classList.toggle("open");
    });
  });

  const expandAllBtn = document.getElementById("expand-all");
  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", () => {
      const accs = document.querySelectorAll(".accordion");
      const anyClosed = Array.from(accs).some((a) => !a.classList.contains("open"));
      accs.forEach((a) => a.classList.toggle("open", anyClosed));
      expandAllBtn.textContent = anyClosed ? "Chiudi tutto" : "Apri tutto";
    });
  }

  // 3. Copy to clipboard buttons
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-copy-target");
      const targetEl = targetId ? document.getElementById(targetId) : btn.parentElement;
      if (!targetEl) return;

      const clone = targetEl.cloneNode(true);
      clone.querySelectorAll(".de, .copy-btn").forEach((el) => el.remove());
      const cleanText = clone.innerText.replace(/\s+/g, " ").trim();

      navigator.clipboard.writeText(cleanText).then(() => {
        const old = btn.textContent;
        btn.textContent = "Copiato";
        setTimeout(() => {
          btn.textContent = old;
        }, 1400);
      });
    });
  });

  // 4. Persistent checklists (localStorage)
  document.querySelectorAll(".checklist input[type='checkbox']").forEach((cb) => {
    const id = cb.getAttribute("id");
    if (!id) return;
    const saved = localStorage.getItem("plida_chk_" + id) === "1";
    cb.checked = saved;
    cb.closest("li").classList.toggle("done", saved);

    cb.addEventListener("change", () => {
      localStorage.setItem("plida_chk_" + id, cb.checked ? "1" : "0");
      cb.closest("li").classList.toggle("done", cb.checked);
    });
  });

  // 5. Live search filter (for phrases & vocabulary)
  document.querySelectorAll(".filter-input").forEach((input) => {
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      const scopeSelector = input.getAttribute("data-filter-scope") || ".filter-item";
      document.querySelectorAll(scopeSelector).forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? "" : "none";
      });
    });
  });

  // 6. Learning mode (blur Italian phrases until clicked)
  const learnBtn = document.getElementById("toggle-learn");
  if (learnBtn) {
    learnBtn.addEventListener("click", () => {
      const active = document.body.classList.toggle("learn-hidden");
      learnBtn.textContent = active ? "Disattiva modalità test" : "Modalità test (nascondi IT)";
      if (!active) {
        document.querySelectorAll(".it-phrase.revealed").forEach((el) => el.classList.remove("revealed"));
      }
    });

    document.querySelectorAll(".it-phrase").forEach((el) => {
      el.addEventListener("click", () => {
        if (document.body.classList.contains("learn-hidden")) {
          el.classList.toggle("revealed");
        }
      });
    });
  }

  // 7. Live Word Counter (for writing practice)
  const practiceArea = document.getElementById("word-counter-input");
  const wordCountOut = document.getElementById("word-count-out");
  const charCountOut = document.getElementById("char-count-out");
  if (practiceArea && wordCountOut) {
    const updateCount = () => {
      const val = practiceArea.value.trim();
      const words = val ? val.split(/\s+/).length : 0;
      wordCountOut.textContent = words;
      if (charCountOut) charCountOut.textContent = practiceArea.value.length;
    };
    practiceArea.addEventListener("input", updateCount);
    updateCount();
  }

  // 8. Grammar mini-quiz
  document.querySelectorAll(".quiz-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const box = btn.closest(".quiz-box");
      const allBtns = box.querySelectorAll(".quiz-btn");
      const isCorrect = btn.getAttribute("data-correct") === "1";
      const feedback = box.querySelector(".quiz-feedback");
      const explanation = btn.getAttribute("data-note") || "";

      allBtns.forEach((b) => b.classList.remove("correct", "wrong"));
      btn.classList.add(isCorrect ? "correct" : "wrong");

      if (feedback) {
        feedback.textContent = (isCorrect ? "Corretto. " : "Non esattamente. ") + explanation;
      }
    });
  });
});