(() => {
  'use strict';

  const LS_KEYS = {
    users: 'neonctf_users_v1',
    sessions: 'neonctf_session_v1',
    progress: 'neonctf_progress_v1',
    leaderboard: 'neonctf_leaderboard_v1',
  };

  const LEVELS = [
    { id: 'easy', name: 'Easy', pointsPerFlag: 50, tasks: 10 },
    { id: 'medium', name: 'Medium', pointsPerFlag: 100, tasks: 10 },
    { id: 'hard', name: 'Hard', pointsPerFlag: 200, tasks: 10 },
  ];

  // NOTE: These are educational/simulated challenges.
  const CHALLENGES = {
    easy: [
      {
        id: 'e1',
        type: 'encoding',
        title: 'Base64 Wake-up',
        desc: 'Decode the hidden Base64 string to reveal the flag.',
        prompt: 'Base64: bmVvbmN0Zi1iYXNlNjQtc3RhcnQ=',
        answer: 'neonctf-base64-start',
        hint: 'Decode the Base64 payload and recover the flag in the platform format: neonctf-...'
      },
      {
        id: 'e2',
        type: 'cipher',
        title: 'Caesar Shift',
        desc: 'A Caesar cipher shift is protecting the flag.',
        prompt: 'Cipher (shift +3): wkhqhwcq...',
        answer: 'neonctf-caesar-3',
        hint: 'Decrypt the Caesar shift by shifting letters backward by 3, then format as: neonctf-...'
      },
      {
        id: 'e3',
        type: 'hidden-text',
        title: 'Invisible Text',
        desc: 'Look closely at the hint text: some letters are “hidden” in plain sight.',
        prompt: 'Extract the letters from: "NeoNCTF" (take alternating characters).',
        // Hint extracts NoCF from "NeoNCTF". Expected flag should match that logic.
        answer: 'neonctf-nocf',
        hint: 'Take every 2nd character starting from index 0. Then submit as: neonctf-nocf.'
      },
      {
        id: 'e4',
        type: 'logic',
        title: 'Two Truths',
        desc: 'Choose the correct flag pattern.',
        prompt: 'Flags start with neonctf- and contain exactly one dash after the prefix.',
        answer: 'neonctf-logic-01',
        hint: 'Think in terms of pattern composition.'
      },
      {
        id: 'e5',
        type: 'hex',
        title: 'Hex to ASCII',
        desc: 'Convert hex bytes into ASCII.',
        prompt: 'Hex: 6e 65 6f 6e 63 74 66 2d 68 65 78',
        answer: 'neonctf-hex',
        hint: 'Each pair is a byte in ASCII.'
      },
      {
        id: 'e6',
        type: 'encoding',
        title: 'URL Decode',
        desc: 'URL-encoded text needs decoding.',
        prompt: 'Value: neonctf%2Durl%2Ddecode',
        answer: 'neonctf-url-decode',
        hint: 'Use percent-decoding.'
      },
      {
        id: 'e7',
        type: 'logic',
        title: 'Mathy Flag',
        desc: 'Compute the result and format as: neonctf-math-<result>',
        prompt: 'Result: (7*8) - 23',
        answer: 'neonctf-math-33',
        hint: '7*8=56; 56-23=33.'
      },
      {
        id: 'e8',
        type: 'xor',
        title: 'XOR Toy',
        desc: 'A toy XOR was applied byte-wise with key 0x2A. Recover the plaintext.',
        prompt: 'Toy ciphertext (hex): 44 4f 46 46 44 62',
        answer: 'neonctf',
        hint: 'XOR again with the same key.'
      },
      {
        id: 'e9',
        type: 'hidden-text',
        title: 'Spacing Secret',
        desc: 'Read the description for a hidden pattern: count the exclamation marks.',
        prompt: 'This is easy!!!',
        answer: 'neonctf-3bang',
        hint: 'Count the !!! and map 3 → suffix.'
      },
      {
        id: 'e10',
        type: 'cipher',
        title: 'ROT13 Check',
        desc: 'Apply ROT13 to reveal the flag.',
        prompt: 'ROT13 text: abz nyv l...' ,
        answer: 'neonctf-rot13',
        hint: 'ROT13 swaps A↔N, B↔O, etc.'
      },
    ],
    medium: [
      {
        id: 'm1',
        type: 'web-simulated',
        title: 'Reflected XSS (Sim)',
        desc: 'A vulnerable page reflects input. For learning only: craft a payload that would trigger the flag reveal in this simulation.',
        prompt: 'Try payload: <input> and submit. Correct flags are of the form neonctf-xss-<n>.',
        answer: 'neonctf-xss-1',
        hint: 'This is simulated—use the exact expected flag payload hint: neonctf-xss-1.'
      },
      {
        id: 'm2',
        type: 'web-simulated',
        title: 'SQLi Auth Bypass (Sim)',
        desc: 'The login accepts a vulnerable query. Craft input to bypass auth in a controlled simulation.',
        prompt: 'Try user: admin and input: "' + ' OR 1=1--' + '" (simulation).',
        answer: 'neonctf-sqli-1',
        hint: 'Use the exact flag the simulation expects.'
      },
      {
        id: 'm3',
        type: 'jwt',
        title: 'JWT Structure',
        desc: 'Decode the JWT header and identify the algorithm. Then format the flag: neonctf-jwt-<alg>.',
        prompt: 'JWT header base64: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        answer: 'neonctf-jwt-HS256',
        hint: 'Base64 decode JSON: look for "alg".'
      },
      {
        id: 'm4',
        type: 'cookies',
        title: 'Cookie Guessing (Sim)',
        desc: 'A cookie value influences the page. In this simulation, submit the cookie flag directly.',
        prompt: 'Cookie format: session=<flag>',
        answer: 'neonctf-cookie-session',
        hint: 'The flag is the cookie value you should submit.'
      },
      {
        id: 'm5',
        type: 'logic',
        title: 'Type Coercion',
        desc: 'A JS snippet compares values with loose equality. Determine the intended match.',
        prompt: 'Condition (sim): if (input == 1337) accept.',
        answer: 'neonctf-coercion-true',
        hint: 'Submit the exact expected flag for the simulation.'
      },
      {
        id: 'm6',
        type: 'cipher',
        title: 'Vigenère Lite',
        desc: 'Decrypt using key: NEON. Then get the flag.',
        prompt: 'Cipher text: LXFOPVEFRNHR (classic demo style)',
        answer: 'neonctf-vigenere',
        hint: 'Use the provided key; this is a training version.'
      },
      {
        id: 'm7',
        type: 'encoding',
        title: 'Double Decode',
        desc: 'Decode twice: first Base64, then URL decode.',
        prompt: 'Value: bmVvbmN0ZiUyRiUyRndpZ24=',
        answer: 'neonctf%2F%2Fvign',
        hint: 'First step yields another URL-encoded string.'
      },
      {
        id: 'm8',
        type: 'web-simulated',
        title: 'Path Traversal (Sim)',
        desc: 'Attempt to access a file outside the allowed directory in a controlled simulation.',
        prompt: 'Use payload pattern: ../.. and submit the resulting flag.',
        answer: 'neonctf-traversal-1',
        hint: 'The simulation expects neonctf-traversal-1.'
      },
      {
        id: 'm9',
        type: 'logic',
        title: 'Order Matters',
        desc: 'A checklist must be completed in the right order.',
        prompt: 'Correct order: A→C→B. Flag: neonctf-order-ACB',
        answer: 'neonctf-order-ACB',
        hint: 'Read the arrow chain.'
      },
      {
        id: 'm10',
        type: 'hash',
        title: 'Weak Hash (Sim)',
        desc: 'Given hash, find the plaintext in a small dictionary simulation.',
        prompt: 'sha256("neon") = 8ddc... (simulation). Submit the plaintext flag format.',
        answer: 'neonctf-hash-neon',
        hint: 'In the simulation, the plaintext is neon.'
      },
    ],
    hard: [
      {
        id: 'h1',
        type: 'web-simulated',
        title: 'Stored XSS (Sim)',
        desc: 'A comment is stored and later rendered. Submit a payload that the simulation recognizes.',
        prompt: 'Submit the expected flag: neonctf-storedxss-1',
        answer: 'neonctf-storedxss-1',
        hint: 'Simulation recognizes the exact flag.'
      },
      {
        id: 'h2',
        type: 'jwt',
        title: 'JWT Claim Hunt (Sim)',
        desc: 'Given a decoded payload, pick the correct claim to unlock.',
        prompt: 'Payload claim: {"role":"user","plan":"free"}. Change plan in reasoning.',
        answer: 'neonctf-jwt-plan-premium',
        hint: 'This is a simulated progression; use the exact expected flag.'
      },
      {
        id: 'h3',
        type: 'logic',
        title: 'Constraint Grid',
        desc: 'Solve constraints to determine a numeric suffix.',
        prompt: 'Constraints: x>2, x<10, x is even, x+3=11 → find x.',
        answer: 'neonctf-constraint-8',
        hint: 'From x+3=11, x=8.'
      },
      {
        id: 'h4',
        type: 'cipher',
        title: 'Affine Cipher',
        desc: 'Decrypt affine cipher (a=5, b=8) in this training puzzle.',
        prompt: 'Cipher: jv... (training).',
        answer: 'neonctf-affine-1',
        hint: 'Use the provided parameters; training expects final flag.'
      },
      {
        id: 'h5',
        type: 'hidden-text',
        title: 'Stego-ish Text',
        desc: 'Hidden in the first letters of each sentence.',
        prompt: 'Sentences start with: N E O N C T F',
        answer: 'neonctf-stego',
        hint: 'Concatenate the starts.'
      },
      {
        id: 'h6',
        type: 'web-simulated',
        title: 'CSRF Token Logic (Sim)',
        desc: 'A simulated endpoint validates a CSRF token. Submit the recognized token flag.',
        prompt: 'CSRF token should equal the flag.',
        answer: 'neonctf-csrf-rotate',
        hint: 'Use the exact expected flag.'
      },
      {
        id: 'h7',
        type: 'logic',
        title: 'Boolean Algebra',
        desc: 'Simplify: (A ∧ B) ∨ (A ∧ ¬B) → ?',
        prompt: 'Determine simplified expression, then map to suffix: A.',
        answer: 'neonctf-boolean-A',
        hint: 'Factor A out: A ∧ (B ∨ ¬B) = A.'
      },
      {
        id: 'h8',
        type: 'encoding',
        title: 'Base32 Decoding',
        desc: 'Decode Base32 to recover the flag.',
        prompt: 'Base32: OFBQXG5AONQXG2A=',
        answer: 'neonctf-base32',
        hint: 'Use standard Base32 decoding.'
      },
      {
        id: 'h9',
        type: 'hash',
        title: 'Rainbow Table (Sim)',
        desc: 'A simulated hash lookup returns the plaintext.',
        prompt: 'Find plaintext for md5("neonctf"). Submit plaintext.',
        answer: 'neonctf',
        hint: 'Simulation dictionary includes neonctf.'
      },
      {
        id: 'h10',
        type: 'web-simulated',
        title: 'JWT Algorithm Confusion (Sim)',
        desc: 'In this simulation, the correct flag identifies the safest behavior.',
        prompt: 'Submit the flag: neonctf-jwt-none-blocked',
        answer: 'neonctf-jwt-none-blocked',
        hint: 'Prefer verifying signature algorithm strictly.'
      },
    ],
  };

  const MASTER_QUESTIONS = [
    { id: 'q1', question: 'Name one purpose of CSRF tokens.', answer: 'prevent_cross_site_request_forgery' },
    { id: 'q2', question: 'What does HTTP-only cookies help mitigate?', answer: 'cookie_theft_via_xss' },
    { id: 'q3', question: 'Which header can mitigate clickjacking?', answer: 'x_frame_options' },
    { id: 'q4', question: 'Explain least privilege in one phrase.', answer: 'minimize_access' },
    { id: 'q5', question: 'What does CSP primarily reduce?', answer: 'xss_injection' },
    { id: 'q6', question: 'What is the goal of input validation?', answer: 'reject_malicious_or_invalid_data' },
    { id: 'q7', question: 'Why should secrets never be in frontend code?', answer: 'they_are_public' },
    { id: 'q8', question: 'What is JWT typically used for?', answer: 'stateless_authentication' },
    { id: 'q9', question: 'Which is safer: hashing or encryption for passwords? (word)', answer: 'hashing' },
    { id: 'q10', question: 'What does SQLi exploit?', answer: 'unsafely_concatenated_queries' },
    { id: 'q11', question: 'What helps prevent reflected XSS?', answer: 'context_aware_output_encoding' },
    { id: 'q12', question: 'What is a replay attack?', answer: 'reusing_captured_requests' },
    { id: 'q13', question: 'What does “same-origin policy” enforce?', answer: 'origin_isolation' },
    { id: 'q14', question: 'What does hashing with salt help against?', answer: 'rainbow_tables' },
    { id: 'q15', question: 'What should be done after discovering a vulnerability?', answer: 'patch_and_report' },
  ];

  function $(sel, root = document) {
    return root.querySelector(sel);
  }
  function $all(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function toast(msg, tone = 'ok') {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    if (tone === 'err') el.style.borderColor = 'rgba(255,59,59,.45)';
    else el.style.borderColor = 'rgba(0,255,136,.35)';
    setTimeout(() => el.classList.remove('show'), 2200);
  }

  function safeJsonParse(s, fallback) {
    try {
      return JSON.parse(s);
    } catch {
      return fallback;
    }
  }

  function loadUsers() {
    return safeJsonParse(localStorage.getItem(LS_KEYS.users) || 'null', []) || [];
  }
  function saveUsers(users) {
    localStorage.setItem(LS_KEYS.users, JSON.stringify(users));
  }

  function currentSession() {
    return safeJsonParse(localStorage.getItem(LS_KEYS.sessions) || 'null', null);
  }
  function setSession(session) {
    if (!session) localStorage.removeItem(LS_KEYS.sessions);
    else localStorage.setItem(LS_KEYS.sessions, JSON.stringify(session));
  }

  function getProgress() {
    const p = safeJsonParse(localStorage.getItem(LS_KEYS.progress) || 'null', null);
    if (p && typeof p === 'object') return p;
    return {};
  }

  function setProgress(p) {
    localStorage.setItem(LS_KEYS.progress, JSON.stringify(p));
  }

  function getLeaderboard() {
    return safeJsonParse(localStorage.getItem(LS_KEYS.leaderboard) || 'null', null) || [];
  }
  function saveLeaderboard(rows) {
    localStorage.setItem(LS_KEYS.leaderboard, JSON.stringify(rows));
  }

  function normalizeUserKey(username, phone) {
    return `${String(username).toLowerCase().trim()}|${String(phone).trim()}`;
  }

  async function sha256Hex(str) {
    const enc = new TextEncoder().encode(str);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    const bytes = Array.from(new Uint8Array(buf));
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function ensureUserProgress(userKey) {
    const p = getProgress();
    if (!p[userKey]) {
      p[userKey] = {
        createdAt: nowISO(),
        points: 0,
        solved: { easy: {}, medium: {}, hard: {}, master: {} },
        certificates: {},
        masterUnlocked: false
      };
      setProgress(p);
    }
    return getProgress()[userKey];
  }

  function computeLevelSolvedCount(userProg, levelId) {
    const map = userProg?.solved?.[levelId] || {};
    return Object.values(map).filter(Boolean).length;
  }

  function computeTotalPoints(userProg) {
    return userProg?.points || 0;
  }

  function updateLeaderboard(userKey, username) {
    const p = getProgress();
    const prog = p[userKey];
    if (!prog) return;
    const total = prog.points || 0;

    let lb = getLeaderboard();
    const existingIdx = lb.findIndex(r => r.userKey === userKey);
    if (existingIdx >= 0) {
      lb[existingIdx].score = total;
      lb[existingIdx].username = username;
      lb[existingIdx].updatedAt = nowISO();
    } else {
      lb.push({ userKey, username, score: total, updatedAt: nowISO() });
    }

    lb.sort((a, b) => b.score - a.score);
    lb = lb.slice(0, 25);
    saveLeaderboard(lb);
  }

  function renderLeaderboard() {
    const list = $('#leaderboard');
    const lb = getLeaderboard();
    if (!lb.length) {
      list.innerHTML = '<div class="muted">No scores yet. Be the first.</div>';
      return;
    }
    const rows = lb.slice(0, 8);
    list.innerHTML = rows
      .map((r, i) => `
        <div class="lb-row">
          <div class="lb-name">#${i + 1} ${escapeHtml(r.username || 'user')}</div>
          <div class="lb-score">${r.score}</div>
        </div>
      `)
      .join('');
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '<')
      .replaceAll('>', '>')
      .replaceAll('"', '"')
      .replaceAll("'", '&#039;');
  }

  function downloadTextFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function generateCertificate(userProg, username, levelId) {
    const levelName = LEVELS.find(l => l.id === levelId)?.name || levelId;
    const solvedCount = computeLevelSolvedCount(userProg, levelId);
    const issue = new Date().toLocaleDateString();

    const pointsForLevel = solvedCount * (LEVELS.find(l => l.id === levelId)?.pointsPerFlag || 0);

    const text = [
      'NeonCTF — Completion Certificate',
      '--------------------------------',
      `Issued to: ${username}`,
      `Level: ${levelName}`,
      `Completed tasks: ${solvedCount}/10`,
      `Points earned (level): ${pointsForLevel}`,
      `Issued on: ${issue}`,
      '',
      'This certifies completion of beginner-friendly cybersecurity challenges.',
      'Simulated training only — always prioritize safe learning.',
      '',
      `Verification ID: ${userProg?.certificates?.[levelId]?.id || 'N/A'}`,
    ].join('\n');

    return text;
  }

  function maybeUnlockMaster(userKey, userProg, username) {
    const counts = LEVELS.map(l => computeLevelSolvedCount(userProg, l.id));
    const all3 = counts.every(c => c >= 10);
    if (!all3) {
      userProg.masterUnlocked = false;
      return false;
    }

    if (!userProg.masterUnlocked) {
      userProg.masterUnlocked = true;
      const p = getProgress();
      p[userKey] = userProg;
      setProgress(p);
      toast('Master Challenge unlocked!', 'ok');
      renderMasterIfNeeded(userKey, username);
      return true;
    }
    return true;
  }

  function markSolved(userKey, username, levelId, challengeId, flagInput) {
    const p = getProgress();
    const prog = p[userKey];
    const level = LEVELS.find(l => l.id === levelId);
    if (!prog || !level) return { ok: false, reason: 'bad_state' };

    const already = !!prog.solved?.[levelId]?.[challengeId];
    if (already) return { ok: false, reason: 'already_solved' };

    const points = level.pointsPerFlag;
    prog.solved[levelId][challengeId] = true;
    prog.points = (prog.points || 0) + points;

    // Generate certificate on level completion
    const solvedCount = computeLevelSolvedCount(prog, levelId);
    if (solvedCount >= 10) {
      if (!prog.certificates[levelId]) {
        prog.certificates[levelId] = {
          id: `CERT-${levelId.toUpperCase()}-${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
          generatedAt: nowISO(),
        };
        // download immediately
        const certText = generateCertificate(prog, username, levelId);
        downloadTextFile(`NeonCTF-${levelId}-certificate-${username.replaceAll(/[^a-z0-9_-]/gi,'').slice(0,18)}.txt`, certText);
        toast(`${level.name} certificate generated!`, 'ok');
      }
    }

    // persist
    p[userKey] = prog;
    setProgress(p);

    updateLeaderboard(userKey, username);
    renderLeaderboard();
    return { ok: true, points, completed: solvedCount >= 10 };
  }

  function renderProgressSidebar(userProg) {
    for (const lvl of LEVELS) {
      const el = $(`[data-level-progress="${lvl.id}"]`);
      const count = computeLevelSolvedCount(userProg, lvl.id);
      el.textContent = `${count}/${lvl.tasks}`;
      el.classList.toggle('neon', count >= 10);
    }

    const master = $('#masterUnlock');
    if (userProg.masterUnlocked) {
      master.innerHTML = `
        <div class="neon">Master Challenge unlocked.</div>
        <div class="muted" style="margin-top:6px">Answer the advanced cybersecurity questions to earn a bonus.</div>
      `;
    } else {
      const need = LEVELS.reduce((acc, l) => {
        const c = computeLevelSolvedCount(userProg, l.id);
        return acc + (c >= 10 ? 0 : (10 - c));
      }, 0);
      master.textContent = need > 0 ? `Solve remaining tasks to unlock Master Challenge (${need} left).` : 'Unlocking...';
    }
  }

  function challengeTagClass(levelId) {
    if (levelId === 'easy') return 'easy';
    if (levelId === 'medium') return 'medium';
    return 'hard';
  }

  function renderLevel(levelId, userKey, username) {
    const view = $('#levelView');
    const userProg = getProgress()[userKey];
    const solvedMap = userProg?.solved?.[levelId] || {};
    const level = LEVELS.find(l => l.id === levelId);

    const challenges = CHALLENGES[levelId] || [];
    view.innerHTML = `
      <div class="content-head" style="margin-bottom:8px">
        <div>
          <h2>${level.name} Challenges</h2>
          <p class="muted">Submit flags to earn points. Hints are available per challenge.</p>
        </div>
      </div>

      <div class="grid-challenges"></div>
    `;

    const grid = $('.grid-challenges', view);
    grid.innerHTML = challenges.map((ch, idx) => {
      const already = !!solvedMap[ch.id];
      const tag = challengeTagClass(levelId);
      return `
        <article class="challenge-card" data-challenge-id="${ch.id}">
          <div class="challenge-top">
            <div>
              <div class="tag ${tag}">#${idx + 1} • ${level.name}</div>
              <div class="challenge-title">${escapeHtml(ch.title)}</div>
            </div>
            <div class="points" aria-label="Points for challenge">
              +${level.pointsPerFlag} pts
            </div>
          </div>

          <p class="challenge-desc">${escapeHtml(ch.desc)}</p>

          <div class="challenge-code">${escapeHtml(ch.prompt || '')}</div>

          ${already ? `
            <div class="flag-banner">✅ Solved</div>
          ` : `
            <form class="flag-form" autocomplete="off">
              <div class="form-row">
                <input class="flag-input" name="flag" placeholder="Enter flag e.g. ${escapeHtml('neonctf-...')}" required />
                <button class="small-btn btn btn-primary" type="submit">Submit</button>
              </div>
              <div style="display:flex; gap:10px; align-items:center; margin-top:10px; flex-wrap:wrap">
                <button class="small-btn btn" type="button" data-show-hint>Show hint</button>
                <span class="muted" data-hint-status></span>
              </div>
              <div class="hint hidden" data-hint-box></div>
            </form>
          `}
        </article>
      `;
    }).join('');

    // Bind events
    $all('[data-show-hint]', view).forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.challenge-card');
        const hintBox = $('[data-hint-box]', card);
        if (!hintBox) return;
        if (!hintBox.classList.contains('hidden')) {
          hintBox.classList.add('hidden');
          hintBox.textContent = '';
          $('[data-hint-status]', card).textContent = '';
          return;
        }
        const chId = card.getAttribute('data-challenge-id');
        const ch = (CHALLENGES[levelId] || []).find(c => c.id === chId);
        if (!ch) return;
        hintBox.innerHTML = `Hint: ${escapeHtml(ch.hint || 'No hint available.')}`;
        hintBox.classList.remove('hidden');
        const status = $('[data-hint-status]', card);
        status.textContent = 'Hints are optional.';
      });
    });

    $all('.flag-form', view).forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const card = form.closest('.challenge-card');
        const chId = card.getAttribute('data-challenge-id');
        const input = $('.flag-input', form);
        const flag = String(input.value || '').trim();
        const ch = (CHALLENGES[levelId] || []).find(c => c.id === chId);
        if (!ch) return;

        const ok = flag === ch.answer;
        if (!ok) {
          toast('Wrong flag. Try a hint or re-check the encoding/cipher.', 'err');
          input.value = '';
          return;
        }

        // Visual pop
        const pop = document.createElement('div');
        pop.className = 'pop';
        card.appendChild(pop);

        const res = markSolved(userKey, username, levelId, chId, flag);
        pop.addEventListener('animationend', () => pop.remove());

        if (!res.ok && res.reason === 'already_solved') {
          toast('Already solved.', 'err');
          return;
        }

        toast(`Correct! +${res.points} points`, 'ok');
        // Re-render current level to update cards
        renderLevel(levelId, userKey, username);
        const prog = getProgress()[userKey];
        renderProgressSidebar(prog);
        maybeUnlockMaster(userKey, prog, username);

        // If completed all 3, also refresh master view state
        if (LEVELS.every(l => computeLevelSolvedCount(prog, l.id) >= 10)) {
          updateContentTabsState(true);
        }
      });
    });
  }

  function updateContentTabsState(masterUnlocked) {
    const tab = $(`.content-tab[data-view="master"]`);
    tab.disabled = !masterUnlocked;
    tab.style.opacity = masterUnlocked ? '1' : '.45';
    tab.style.pointerEvents = masterUnlocked ? 'auto' : 'none';
  }

  function renderMasterIfNeeded(userKey, username) {
    const userProg = getProgress()[userKey];
    const unlocked = !!userProg?.masterUnlocked;
    updateContentTabsState(unlocked);
    if (!unlocked) return;

    const view = $('#levelView');
    const solvedMaster = userProg?.solved?.master || {};
    view.innerHTML = `
      <div class="content-head" style="margin-bottom:8px">
        <div>
          <h2>Master Challenge</h2>
          <p class="muted">Answer cybersecurity fundamentals. Earn bonus points by completing all questions.</p>
        </div>
      </div>

      <div class="master-grid"></div>
    `;

    const grid = $('.master-grid', view);
    grid.innerHTML = MASTER_QUESTIONS.map((q, i) => {
      const done = !!solvedMaster[q.id];
      return `
        <article class="challenge-card">
          <div class="challenge-top">
            <div>
              <div class="tag hard">Q#${i + 1} • Master</div>
              <div class="challenge-title">${escapeHtml(q.question)}</div>
            </div>
            <div class="points">+50 pts</div>
          </div>
          ${done ? `<div class="flag-banner">✅ Answered</div>` : `
            <form class="master-form" data-qid="${q.id}">
              <div class="form-row">
                <input class="master-input" placeholder="Enter answer key" required />
                <button class="small-btn btn btn-primary" type="submit">Submit</button>
              </div>
              <div class="muted" style="margin-top:10px; line-height:1.4">
                Tip: answers are short keys (underscores). No hints to keep it challenging.
              </div>
            </form>
          `}
        </article>
      `;
    }).join('');

    $all('.master-form', view).forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const qid = form.getAttribute('data-qid');
        const input = $('.master-input', form);
        const userAns = String(input.value || '').trim();
        const q = MASTER_QUESTIONS.find(x => x.id === qid);
        if (!q) return;
        if (userAns !== q.answer) {
          toast('Incorrect answer key.', 'err');
          input.value = '';
          return;
        }

        const p = getProgress();
        const prog = p[userKey];
        prog.solved.master[qid] = true;
        prog.points = (prog.points || 0) + 50;
        p[userKey] = prog;
        setProgress(p);
        updateLeaderboard(userKey, username);
        renderLeaderboard();

        toast('Correct! +50 pts', 'ok');
        renderMasterIfNeeded(userKey, username);
        renderProgressSidebar(prog);

        // bonus when done all
        const all = MASTER_QUESTIONS.every(q => !!prog.solved.master[q.id]);
        if (all) {
          toast('Master Challenge completed — bonus awarded!', 'ok');
          prog.points += 200;
          setProgress(p);
          updateLeaderboard(userKey, username);
          renderLeaderboard();
          renderProgressSidebar(prog);
          renderMasterIfNeeded(userKey, username);
        }
      });
    });
  }

  function showAppForSession(session) {
    const app = $('#appShell');
    app.classList.remove('hidden');

    const authShell = $('#auth');
    if (authShell) authShell.style.display = 'none';

    const userLabel = $('#appUserLabel');
    userLabel.textContent = session.username;

    // progress, tabs, view
    const prog = ensureUserProgress(session.userKey);
    $('#pointsLabel').textContent = String(computeTotalPoints(prog));
    renderProgressSidebar(prog);
    renderLeaderboard();

    updateContentTabsState(!!prog.masterUnlocked);

    const tabs = $all('.content-tab');
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        tabs.forEach(x => x.classList.remove('active'));
        t.classList.add('active');

        const view = t.getAttribute('data-view');
        if (view === 'master') {
          renderMasterIfNeeded(session.userKey, session.username);
        } else {
          renderLevel(view, session.userKey, session.username);
        }
      });
    });

    $('#logoutBtn').addEventListener('click', () => {
      setSession(null);
      location.reload();
    });

    // default tab
    const firstTab = $(`.content-tab[data-view="easy"]`);
    if (firstTab) firstTab.click();
  }

  function initScrollAnimation() {
    // simple “dribbble-like” knob reacting to scroll on home card
    const knob = $('[data-scroll-knob]');
    const meter = $('.hero-meter');
    if (!knob || !meter) return;

    const onScroll = () => {
      const hero = $('#home');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (0 - rect.top) / Math.max(1, rect.height - window.innerHeight * 0.35)));
      const y = 52 * progress;
      knob.style.transform = `translate(${0}px, ${y}px) translateY(-50%)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initAuthUI() {
    const tabs = $all('[data-auth-tab]');
    const panels = $all('[data-auth-panel]');

    function activate(which) {
      tabs.forEach(t => {
        const k = t.getAttribute('data-auth-tab');
        const selected = k === which;
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
      });
      panels.forEach(p => {
        const k = p.getAttribute('data-auth-panel');
        p.classList.toggle('hidden', k !== which);
      });
    }

    tabs.forEach(t => {
      t.addEventListener('click', () => {
        activate(t.getAttribute('data-auth-tab'));
      });
    });

    // Forms
    $('#loginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const username = form.username.value;
      const phone = form.phone.value;
      const password = form.password.value;

      const users = loadUsers();
      const user = users.find(u => normalizeUserKey(u.username, u.phone) === normalizeUserKey(username, phone));
      if (!user) {
        toast('Account not found.', 'err');
        return;
      }

      const hashed = await sha256Hex(password);
      if (hashed !== user.passwordHash) {
        toast('Incorrect password.', 'err');
        return;
      }

      const userKey = normalizeUserKey(username, phone);
      ensureUserProgress(userKey);
      setSession({ userKey, username, phone });
      toast('Signed in!', 'ok');
      showAppForSession({ userKey, username, phone });
    });

    $('#signupForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const username = form.username.value;
      const phone = form.phone.value;
      const password = form.password.value;

      if (!username || !phone || !password) return;
      const users = loadUsers();
      const userKey = normalizeUserKey(username, phone);
      const exists = users.some(u => normalizeUserKey(u.username, u.phone) === userKey);
      if (exists) {
        toast('Account already exists.', 'err');
        return;
      }

      const passwordHash = await sha256Hex(password);
      users.push({ username, phone, passwordHash, createdAt: nowISO() });
      saveUsers(users);

      ensureUserProgress(userKey);
      setSession({ userKey, username, phone });
      toast('Account created!', 'ok');
      showAppForSession({ userKey, username, phone });
    });

    $('#resetForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const username = form.username.value;
      const phone = form.phone.value;
      const newPassword = form.newPassword.value;

      const users = loadUsers();
      const userKey = normalizeUserKey(username, phone);
      const idx = users.findIndex(u => normalizeUserKey(u.username, u.phone) === userKey);
      if (idx < 0) {
        toast('Account not found.', 'err');
        return;
      }
      const passwordHash = await sha256Hex(newPassword);
      users[idx].passwordHash = passwordHash;
      saveUsers(users);
      toast('Password reset successful. Sign in now.', 'ok');
      // switch to login tab
      const loginTab = $(`[data-auth-tab="login"]`);
      if (loginTab) loginTab.click();
    });
  }

  function initNavScroll() {
    $all('[data-scrollto]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 82;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  function initMobileNavToggle() {
    const btn = $('[data-nav-toggle]');
    if (!btn) return;
    const nav = $('.top-nav');
    if (!nav) return;

    btn.addEventListener('click', () => {
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.right = '18px';
      nav.style.top = '64px';
      nav.style.padding = '12px';
      nav.style.background = 'rgba(10,14,39,.9)';
      nav.style.border = '1px solid rgba(255,255,255,.1)';
      nav.style.borderRadius = '16px';
      nav.style.zIndex = 60;
    });
  }

  function initPageState() {
    const session = currentSession();
    const app = $('#appShell');
    const authCta = $('#auth');

    if (session?.userKey) {
      if (authCta) authCta.style.display = 'none';
      app.classList.remove('hidden');
      showAppForSession(session);
    } else {
      app.classList.add('hidden');
      if (authCta) authCta.style.display = 'grid';
    }
  }

  function setupDifficultyTabsDefault() {
    // no-op; handled by showAppForSession
  }

  function init() {
    initScrollAnimation();
    initNavScroll();
    initMobileNavToggle();
    initAuthUI();
    initPageState();
    renderLeaderboard();
  }

  init();
})();

