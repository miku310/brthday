// -------- TEXTES ----------
const firstMessage = "Someone’s special day is coming 🥳";
const secondMessage = "Kch whd 9al … 22nd Birthday ? 🎂";
const thirdMessage = "COUCOU L BIRTHDAY BOY  😏🎈"; 

// -------- UTIL : machine à écrire (retourne Promise) ----------
function typeWriter(text, element, speed = 60) {
  return new Promise((resolve) => {
    element.textContent = "";
    let idx = 0;
    // show caret (border-right) while typing
    element.style.borderRight = "3px solid rgba(255,255,255,0.9)";
    function step() {
      if (idx < text.length) {
        element.textContent += text.charAt(idx);
        idx++;
        setTimeout(step, speed);
      } else {
        // remove caret after short pause
        setTimeout(() => { element.style.borderRight = "none"; resolve(); }, 350);
      }
    }
    step();
  });
}

// -------- Séquence principale (async pour ordre précis) ----------
async function runIntroSequence() {
  const centerEl = document.getElementById("centerIntro");
  const topBanner = document.getElementById("topBanner");
  const countdownBox = document.getElementById("countdownBox");
  const photoContainer = document.getElementById("photoContainer");

  // 1) première phrase au centre, puis disparaît
  await typeWriter(firstMessage, centerEl, 60);
  // petite pause puis fade out + clear
  await new Promise(r => setTimeout(r, 700));
  centerEl.classList.add("hide-fade");
  await new Promise(r => setTimeout(r, 600));
  centerEl.textContent = "";
  centerEl.classList.remove("hide-fade");

  // 2) deuxième phrase au même centre, puis disparaît
  await typeWriter(secondMessage, centerEl, 60);
  await new Promise(r => setTimeout(r, 700));
  centerEl.classList.add("hide-fade");
  await new Promise(r => setTimeout(r, 600));
  centerEl.textContent = "";
  centerEl.classList.remove("hide-fade");

  // 3) affiche la 3ème phrase en haut (elle reste)
  topBanner.textContent = thirdMessage;
  topBanner.classList.add("visible");

  // petite pause, puis afficher le countdown box et démarrer le timer
  await new Promise(r => setTimeout(r, 500));
  countdownBox.classList.add("visible");
  startCountdown(); // démarre le countdown

  // 4) après le countdown box visible, afficher la photo en bas
  // (donne un délai pour l'apparition douce)
  await new Promise(r => setTimeout(r, 900));
  photoContainer.classList.add("visible");
}

// -------- Countdown (à appeler une seule fois) ----------
const countdownEl = document.getElementById("countdown");
const countdownDate = new Date("2025-10-12T15:47:00").getTime();
let countdownInterval = null;

function startCountdown() {
  if (countdownInterval) return; // déjà démarré
  countdownInterval = setInterval(() => {
    const now = Date.now();
    const diff = countdownDate - now;
    if (diff <= 0) {
      clearInterval(countdownInterval);
      countdownEl.textContent = "heheheehe it's happening !!! 🎉";
      setTimeout(showBirthdayScreen, 1800); // transition après le message
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    countdownEl.textContent = `${days} d ${hours} h ${minutes} m ${seconds} s`;
  }, 1000);
}

// -------- Hearts generator (optionnel, si tu veux garder) ----------
(function createHeartsLoop() {
  const container = document.querySelector(".hearts-container");
  if (!container) return;
  function create() {
    const h = document.createElement("div");
    h.className = "heart";
    h.style.left = Math.random() * 100 + "vw";
    const s = 12 + Math.random() * 18;
    h.style.width = s + "px";
    h.style.height = s + "px";
    h.style.opacity = 0.6 + Math.random() * 0.4;
    h.style.animationDuration = 4 + Math.random() * 4 + "s";
    container.appendChild(h);
    setTimeout(() => h.remove(), 9000);
  }
  setInterval(create, 350);
})();

// -------- Start everything on load ----------
window.addEventListener("load", () => {
  const music = document.getElementById("bgMusicGlobal");
  if (music) {
    music.pause();
    music.currentTime = 0;
    music.play().catch(err => {
      // Certains navigateurs bloquent l'autoplay sans interaction utilisateur
      console.log("Playback blocked:", err);
    });
  }
  // Lance la séquence d’intro si besoin
  if (typeof runIntroSequence === "function") runIntroSequence();
});

// 🎬 Transition d'écran
function changeScreen(newContent, nextFunction = null) {
  const main = document.getElementById("mainContent");
  main.classList.add("fade-transition");
  setTimeout(() => {
    main.innerHTML = newContent;
    main.classList.remove("fade-transition");
    if (nextFunction) setTimeout(nextFunction, 300);
  }, 400);
}

// 🎂 Page d'anniversaire
function showBirthdayScreen() {
  const html = `
    <div class="birthday-screen fade-in">
      <h1> 🎂 Happy Birthday, mon coeur 💖 </h1>
      <p class="subtext"> I made this just for you... ready? <br>
      E9RA JDHA KAMLL 👉👈</p>
      <button id="showLetter" class="button"> Open your letter 💌 </button>
    </div>`;
  changeScreen(html, () => {
    document.getElementById("showLetter").onclick = showEnigme;
  });
}

// 🧩 Énigme
function showEnigme() {
  const html = `
    <div class="enigme-screen fade-in">
      <h2> HEHEHE WAIIIT HSSBTLK SAYBAA...😈</h2>
      <p>There’s a word that came from you,
      you gave it a new meaning,
      and now it makes me melt every time you say it...
      what is it? ❤️</p>
      <input type="text" id="reponse" placeholder="ur answer plz 💌" class="input-box">
      <button id="submitEnigme" class="button">Valider</button>
      <p id="feedback" class="feedback"></p>
    </div>`;
  changeScreen(html, () => {
    document.getElementById("submitEnigme").onclick = checkEnigme;
  });
}

function checkEnigme() {
  const reponse = document.getElementById("reponse").value.trim().toLowerCase();
  const feedback = document.getElementById("feedback");
  if (["Muffin", "muffin"].includes(reponse)) {
    feedback.innerHTML = " GG MON NISSOOOUUUU 😎, time to read my little letter for you 💖";
    setTimeout(() => {
      showLetter();
      // Démarrer la musique juste après que la lettre soit affichée
      setTimeout(() => {
        const music = document.getElementById("bgMusic");
        if (music) {
          music.pause();
          music.currentTime = 0;
          music.play().catch(err => console.log("Playback blocked:", err));
        }
      }, 400); // attendre que le DOM soit prêt
    }, 1500);
  } else feedback.innerHTML = " Hmmm 🥲, try again 🔪 ...";
}

// 💌 Lettre
function showLetter() {
  const html = `
    <div class="letter-screen fade-in">
      <audio id="bgMusic" src="Patrick Watson - Je te laisserai des mots (Official French Lyric Video).mp4" loop preload="none"></audio>
      <h2>💌 Just you, me, and a few words that mean everything</h2>
      <p id="animatedLetter" class="letter"></p>
      <div class="next-arrow" id="nextArrow" style="display:none">&#8595;</div>
    </div>`;

  changeScreen(html, () => {
    // Lancer l’écriture progressive de la lettre
    const letterText = `
    Tu faisais des efforts à me parler et m’écrire en français depuis un moment maintenant,
    et j’ai remarqué cette petite intention 🥹... c’est très mignon yal mignon😇.
    <br>
    Du coup, là, c’est à moi de te parler dans ta langue préférée 😌...
    <br><br>
    My love, today is your day... the day the world was lucky enough to welcome you 👼.
    I have a thousand things to tell you, buuuut above all... thank you 
    Thank you for being you, for being here, for being mine and for being the smile in my days 🫠.
    <br><br>
    You never leave my thoughts... literally (sakn fiya batl au moins khlsss) 🐣.
    When I think about what I’m thinking, I find you sitting there, so comfortably, inside my head 🦧.
    Even when I smile, even when I sleep, your little face shows up in my dreams 👻
    You’ve become my favorite habit 🌚.
    <br><br>
    You’re in love songs, in movies, in sad things and happy things...
    you’re a little mix of everything ☄️.
    I crave you... your gaze, your eyes, your arms 🫂.
    You’re my calm...and of course, my favorite chaos (kch nhar ytl3li skr w t9tlni w tthna) 😭.
    <br><br>
    And honestly, sometimes I still feel like I have a crush on you 😶‍🌫️.
    My heart skips when you call me, when you text me,
    even when you just show up... like it’s the first time all over again 💘.
    <br><br>
    I love you endlessly... without limits, without end ...
    for today, for tomorrow, for always ♾️.
    <br><br>
    I dream of a better life for us,
    one where we love each other more every single day,
    where we build our little family together 👨‍👩‍👧‍👦.
    <br><br>
    And since it’s your day🎊,
    I wish you the happiest and most beautiful birthday ever 🎂...
    the first of many more that I want to celebrate by your side 🎈.
    May God bless you with everything beautiful...
    happiness, success, peace 🎀,
    and always... lots of love (mine of course brrk) 🥰.
    <br><br>
    Thank you for being born 🫰,
    and for coming into my life through that little unexpected window 🐞.
    Now that you’re here 💑,
    even if you ever wanted to leave (khmm fiha brk tchoo) ☠️,
    I’d never let you go. 💫`;

    typeWriterLetter(letterText, document.getElementById("animatedLetter"), 30);
    // La musique démarre uniquement quand on commence à lire la lettre (clic sur le texte)
    // Pour éviter tout démarrage anticipé, on s'assure que la balise audio est bien en pause et non chargée au départ
    const music = document.getElementById("bgMusic");
    if (music) {
      music.pause();
      music.currentTime = 0;
    }
    const animatedLetterEl = document.getElementById("animatedLetter");
    let musicStarted = false;
    if (animatedLetterEl) {
      animatedLetterEl.onclick = () => {
        if (!musicStarted) {
          music.play().catch(err => console.log("Playback blocked:", err));
          musicStarted = true;
        }
      };
    }

    // Flèche pour passer à la page finale
    const nextArrow = document.getElementById("nextArrow");
    if (nextArrow) {
      nextArrow.onclick = showLoveScreen;
    }
  });
}

function showLoveScreen() {
  const html = `
    <div class="love-screen fade-in">
      <div class="love-text">This is my heart... my love for you, growing every second ❤️</div>
      <canvas id="heartCanvasFinal" width="400" height="320"></canvas>
    </div>`;
  changeScreen(html, () => {
    drawFinalHeart();
  });
}

function drawFinalHeart() {
  const canvas = document.getElementById("heartCanvasFinal");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(200, 160);

  // Paramètres pour plusieurs coeurs
  const heartCount = 12;
  const heartColors = ["#ff4b8b", "#ffb6e6", "#ff004c", "#ff7f50", "#ff69b4"];
  let i = 1;
  function drawOneHeart(scale, color, doneCallback) {
    let t = 0;
    function animate() {
      if (t > Math.PI * 2) {
        doneCallback();
        return;
      }
      const x = 16 * Math.pow(Math.sin(t), 3) * scale;
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(x, y, 5, 5);
      t += 0.04;
      requestAnimationFrame(animate);
    }
    animate();

  }

  function drawLoop() {
    if (i > heartCount) {
      ctx.restore();
      setTimeout(showSeeYouPage, 5000);
      return;
    }
    const scale = i * 0.7;
    const color = heartColors[i % heartColors.length];
    drawOneHeart(scale, color, () => {
      i++;
      setTimeout(drawLoop, 120); // petit délai entre chaque coeur
    });
  }
  drawLoop();
}

// ✨ Fonction d’écriture progressive du texte (avec support HTML)
function typeWriterLetter(htmlText, element, speed = 40) {
  let i = 0;
  const text = htmlText;
  function type() {
    if (i < text.length) {
      element.innerHTML = text.substring(0, i + 1);
      i++;
      setTimeout(type, speed);
    } else {
      // Affiche la flèche quand toute la lettre est affichée
      const nextArrow = document.getElementById("nextArrow");
      if (nextArrow) nextArrow.style.display = "block";
    }
  }
  type();
}

// 🌇 Page "See you again at 17:00"
function showSeeYouPage() {
  const html = `
    <div class="see-you-screen fade-in">
      <div class="stars"></div>
      <h1>See you again at <strong>17:00</strong> 💫<br>
      Enough for now, mon coeur 🕊️</h1>
      <div id="countdown17h" class="countdown">00:00:00</div>
      <img src="Screenshot 2025-10-27 153243.png" alt="Petit ange" class="see-you-photo">
      <p class="note">Until then, think of me... 🌙</p>
    </div>`;

  changeScreen(html, start17hCountdown);
}

// 🕔 Countdown vers 17h
function start17hCountdown() {
  const countdownEl = document.getElementById("countdown17h");
  const now = new Date();
  const target = new Date();
  target.setFullYear(2025, 9, 26); // année, mois (0=janvier), jour
  target.setHours(17, 0, 0, 0);
  if (now > target) target.setDate(target.getDate() + 1);

  const interval = setInterval(() => {
    const diff = target - new Date();
    if (diff <= 0) {
      clearInterval(interval);
      countdownEl.textContent = "It's time 💖";
      setTimeout(() => {
        showPlaylistPage();
      }, 2000);
      return;
   }

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownEl.textContent = 
      `${hours.toString().padStart(2,'0')} : ${minutes.toString().padStart(2,'0')} : ${seconds.toString().padStart(2,'0')}`;
  }, 1000);
}

function showPlaylistPage() {
  const musics = [
    { title: "Bullet  - NF", url: "https://www.youtube.com/watch?v=FvuR4gvwEU4&list=RDFvuR4gvwEU4&start_radio=1" },
    { title: "You're Special  - NF", url: "https://www.youtube.com/watch?v=d51lAHNbeAM&list=RDd51lAHNbeAM&start_radio=1" },
    { title: "If the World Was Ending  - JP Saxe ft. Julia Michaels", url: "https://www.youtube.com/watch?v=1jO2wSpAoxA&list=RD1jO2wSpAoxA&start_radio=1" },
    { title: "Rewrite The Stars  - Zac Efron & Zendaya", url: "https://www.youtube.com/watch?v=Scq65uGROKk&list=RDScq65uGROKk&start_radio=1" },
    { title: "The Night We Met  - Lord Huron", url: "https://www.youtube.com/watch?v=KtlgYxa6BMU&list=RDKtlgYxa6BMU&start_radio=1" },
    { title: "Dusk Till Dawn  - ZAYN ft. Sia", url: "https://www.youtube.com/watch?v=tt2k8PGm-TI&list=RDtt2k8PGm-TI&start_radio=1" },
    { title: "Until I Found You  - Stephen Sanchez", url: "https://www.youtube.com/watch?v=GxldQ9eX2wo&list=RDGxldQ9eX2wo&start_radio=1" },
    { title: "That Part  - Lauren Spencer Smith", url: "https://www.youtube.com/watch?v=8F7U3VeFMqs&list=RD8F7U3VeFMqs&start_radio=1" },
    { title: "Car's Outside  - James Arthur", url: "https://www.youtube.com/watch?v=PRH23hUc_tA&list=RDPRH23hUc_tA&start_radio=1" },
    { title: "The First Time  - Damiano David", url: "https://www.youtube.com/watch?v=-GyMBnskaFE&list=RD-GyMBnskaFE&start_radio=1" },
    { title: "Constellations  - Jade LeMac ", url: "https://www.youtube.com/watch?v=wIHjRuhXAto&list=RDwIHjRuhXAto&start_radio=1" },
    { title: "Daylight   - David Kushner ", url: "https://www.youtube.com/watch?v=MoN9ql6Yymw&list=RDMoN9ql6Yymw&start_radio=1" },
    { title: "Glimpse of Us  - Joji ", url: "https://www.youtube.com/watch?v=FvOpPeKSf_4&list=RDFvOpPeKSf_4&start_radio=1" },
    { title: "Longtemps  - Amir ", url: "https://www.youtube.com/watch?v=t_0C9rQBCSE&list=RDEMHEoWAEYHHiTQSanshGobZw&index=12" },
    { title: "Avant toi  - VITAA & SLIMANE", url: "https://www.youtube.com/watch?v=d6BzCEkGd3I&list=RDEMryA0g-s_yC2nyI_p5jvIBg&index=25" },
    { title: "Éternel  - Hatik", url: "https://www.youtube.com/watch?v=0sof3qPykvA&list=RD0sof3qPykvA&index=1" },
    { title: "En boucle  - Adèle Castillon", url: "https://www.youtube.com/watch?v=spBcWVIlYQg&list=RDspBcWVIlYQg&start_radio=1" },
    { title: "I LOVE YOU  - Rilès", url: "https://www.youtube.com/watch?v=C2MoOX8Rp7I&list=RDC2MoOX8Rp7I&start_radio=1" },
    { title: "A l'Ammoniaque  - PNL", url: "https://www.youtube.com/watch?v=Vl-GJaitlNs&list=RDVl-GJaitlNs&start_radio=1" },
    { title: "معقول انساك  - زينة عماد", url: "https://www.youtube.com/watch?v=VeVG3Dcx6cE&list=RDVeVG3Dcx6cE&start_radio=1" },
    { title: "بعشق روحك  - مروان خوري", url: "https://www.youtube.com/watch?v=0hs8mLODmsc&list=RD0hs8mLODmsc&start_radio=1" },
    { title: "hamlaghkem  - LANI RABAH", url: "https://www.youtube.com/watch?v=WjHyQ08gz4A&list=RDWjHyQ08gz4A&start_radio=1" },

  ];

  // Génération du HTML pour chaque musique
  const itemsHTML = musics.map(
    (m, i) => `
      <div class="playlist-item">
        <span>${i + 1}. ${m.title}</span>
        <a href="${m.url}" target="_blank">🎧</a>
      </div>`
  ).join("");

  const html = `
  <div class="playlist-screen fade-in">
    <h1>💿 Our Playlist 💖</h1>
    <p class="subtext">22 songs, one for each little moment with you 🎶</p>
    <div class="playlist-container">
      ${itemsHTML}
    </div>
    <div class="next-arrow" id="nextArrowPlaylist" style="display:block">&#8595;</div>
  </div>`;
  changeScreen(html, () => {
  const nextArrow = document.getElementById("nextArrowPlaylist");
  if (nextArrow) nextArrow.onclick = showMoviesPage;
  });
}

const playlistContainer = document.getElementById("playlistContainer");

playlist.forEach(song => {
  const item = document.createElement("div");
  item.className = "playlist-item";
  item.innerHTML = `
    <span>${song.title}</span>
    <a href="${song.url}" target="_blank">🎧 Écouter</a>
  `;
  playlistContainer.appendChild(item);
});

function showMoviesPage() {
const movies = [
  { title: "See you on venus 🪐" },
  { title: "The Notebook 💌" },
  { title: "Ce que le jour doit à la nuit ☀️" },
  { title: "Clouds ☁️" },
  { title: "The Greatest Showman 🎪" },
  { title: "Hello, Goodbye, and Everything In Between 💔" },
  { title: "Purple Hearts 💜" },
  { title: "Sidelined: The QB and Me 🏉" },
  { title: "Maxton Hall 🥇" },
  { title: "To All the Boys I've Loved Before 💖" },
  { title: "Five Feet Apart 🌷" },
  { title: "How I Met Your Mother 💛" },
  { title: "The Map That Leads to You 🗺️" },
  { title: "Peaky Blinders 🎩🔥" },
  { title: "Love at First Sight 👀💘" },
  { title: "The 100 ⚡" },
  { title: "All the Bright Places 🌈" },
  { title: "The Fault in Our Stars 💫" },
  { title: "Along for the Ride 🚲🌙" },
  { title: "Midnight Sun 🌅" },
  { title: "A Walk to Remember 🌸" },
  { title: "DEAR JOHN 💪" },

];


  const itemsHTML = movies.map(
    (m, i) => `<div class="movie-item fade-in-delay" style="animation-delay:${i * 0.1}s">${i + 1}. ${m.title}</div>`
  ).join("");

  const html = `
  <div class="movies-screen fade-in">
    <h1>🎬 Movies / Shows to Watch Together</h1>
    <p class="subtext">our little cinema list before your next birthday 🍿</p>
    <div class="movies-container">
      ${itemsHTML}
    </div>
    <div class="next-arrow" id="nextArrowMovies" style="display:block">&#8595;</div>
  </div>`;
  changeScreen(html, () => {
  const nextArrow = document.getElementById("nextArrowMovies");
  if (nextArrow) nextArrow.onclick = showVideoPage;
  });
}


// Ajoute ceci dans script.js
function showVideoPage() {
  const html = `
    <div class="video-section fade-in" style="display:flex; justify-content:center; align-items:center; height:100vh;">
      <div class="video-box">
        <h2>I couldn’t bring your favorite celebrities… but I did something else 😌💫<br>
        You didn’t need them anyway...you’re my favorite star 🫠 and the main character here 🎬💫</h2>
        <video controls class="surprise-video" id="mainVideo">
          <source src="VID_20251027_144855.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <p class="caption"> ✨ Hope you love it.....that’s kind of why I love you. ✨ </p>
        <div class="next-arrow" id="nextArrowVideo">&#8595;</div>
      </div>
    </div>
  `;
  changeScreen(html, () => {
    const video = document.getElementById("mainVideo");
    const music = document.getElementById("bgMusicGlobal");
    if (video && music) {
      video.addEventListener("play", () => {
        music.pause();
      });
    }
    const nextArrow = document.getElementById("nextArrowVideo");
    if (nextArrow) nextArrow.onclick = showCakeScreen;
  });
}

// function showCakeScreen() {
//   // Affiche la page du gâteau et masque les autres écrans dynamiques
//   document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
//   const cakeScreen = document.getElementById('cakeScreen');
//   if (cakeScreen) {
//     cakeScreen.classList.remove('hidden');
//     // Lance la détection du souffle et l’animation des bougies
//     initCandleBlow();
//     // (Optionnel) Scroll vers le gâteau si besoin :
//     cakeScreen.scrollIntoView({ behavior: "smooth" });
//   }
//   const btn = document.getElementById("afterCandleBtn");
//   if (btn) btn.onclick = showFuturePage;
// }
function showCakeScreen() {
  changeScreen(`
    <div class="cake-container fade-in">
      <div class="cake">
        <div class="plate"></div>
        <div class="cake-body"></div>
        <div class="icing"></div>
        <div class="candles">
          <div class="candle"><div class="flame"></div></div>
          <div class="candle"><div class="flame"></div></div>
          <div class="candle"><div class="flame"></div></div>
        </div>
      </div>
      <p class="cake-text">✨ Make a wish... and blow the candles ✨</p>
      <div id="nextArrowCake" class="next-arrow hidden">&#8595;</div>
    </div>
  `, () => {
    initCandleBlow();
    const nextArrow = document.getElementById("nextArrowCake");
    if (nextArrow) nextArrow.onclick = showCakeMessagePage;
  });
}

function showCakeMessagePage() {
  changeScreen(`
    <div class="cake-message-page fade-in">
      <div class="cake-extra-text">
        <hr>
        <p>
          You made your wish…<br>
          and since your heart walks with mine, I made one too.
        </p>
        <p>
          Something beautiful happens with our dates…<br>
          You were born on the 22nd, I was born on the 3rd.<br><br>
          Together, we make 25.
        </p>
        <p>
          And right after October and November…<br>
          there’s a 25th that feels like our own beautiful snowy day.
        </p>
        <p>
          Maybe it’s nothing.<br>
          Maybe it’s everything.<br>
          But somehow… i want it to be our special date
        </p>
      </div>
      <div class="next-arrow" id="nextArrowCakeMsg">&#8595;</div>
    </div>
 `, () => {
    const nextArrow = document.getElementById("nextArrowCakeMsg");
    if (nextArrow) nextArrow.onclick = showFuturePage;
  });
}
  
function initCandleBlow() {
  // Fonction pour éteindre les flammes et afficher le texte
  function blowCandles() {
    document.querySelectorAll(".flame, .flame2, .flame3").forEach(f => {
      f.style.transition = "opacity 0.3s";
      f.style.opacity = 0;
    });
    const text = document.querySelector(".text");
    if (text) {
      text.style.transition = "top 0.5s, opacity 0.5s";
      text.style.top = "-90px";
      text.style.opacity = 1;
    }
   // Affiche la flèche pour continuer
    const nextArrow = document.getElementById("nextArrowCake");
    if (nextArrow) nextArrow.classList.remove("hidden");
  }

  // Demande l'accès au micro
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function detectBlow() {
          analyser.getByteTimeDomainData(dataArray);
          // Calcul du volume moyen
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            let val = (dataArray[i] - 128) / 128;
            sum += val * val;
          }
          let volume = Math.sqrt(sum / dataArray.length);

          // Si le volume dépasse un seuil, on considère que c'est un souffle
          if (volume > 0.2) { // Ajuste ce seuil si besoin
            blowCandles();
          } else {
            requestAnimationFrame(detectBlow);
          }
        }
        detectBlow();
      })
      .catch(function(err) {
        alert("Microphone access denied or not available.");
      });
  } else {
    alert("getUserMedia not supported in this browser.");
  }
}



function showFuturePage() {
  const html = `
    <div class="future-page fade-in">
      <h2> And one day… we’ll make this real 💍</h2>
      <img src="unnamed.jpg" alt="Nous dans le futur" class="future-photo">
      <p class="future-caption">"Only you and me, always and forever…💍<br>
       I always thought you were the love of my life, but now i realize... you are the love of my soul.<br>
       Life may end, but the soul never dies.<br>
       Hmlaghk Anisiw❤️"</p>
      <div class="next-arrow" id="nextArrowFuture">&#8595;</div>
    </div>
  `;
  changeScreen(html, () => {
    // Relance la musique de fond ici
    const music = document.getElementById("bgMusicGlobal");
    if (music) {
      music.currentTime = 0;
      music.play().catch(()=>{});
    }
    const nextArrow = document.getElementById("nextArrowFuture");
    if (nextArrow) nextArrow.onclick = showFinalScreen;
  });
}

function showFinalScreen() {
  const html = `
    <div class="final-screen fade-in">
      <div class="falling-stars"></div>
      <div class="final-quote">
        “No matter what happens next, this will always be our story.”
      </div>
    </div>
  `;
  changeScreen(html, () => {
    startFallingStars(10); // 10 secondes d'étoiles
    // Après 10s, écran noir
    setTimeout(() => {
      document.querySelector('.final-screen').style.transition = "background 1.5s";
      document.querySelector('.final-screen').style.background = "#000";
      document.querySelector('.final-quote').style.opacity = 0;
    }, 10000);
  });
}

function startFallingStars(durationSeconds) {
  const container = document.querySelector('.falling-stars');
  let running = true;
  function createStar() {
    if (!running) return;
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.animationDuration = (2 + Math.random() * 2) + 's';
    container.appendChild(star);
    setTimeout(() => star.remove(), 4000);
    if (running) setTimeout(createStar, 200 + Math.random() * 400);
  }
  createStar();
  setTimeout(() => { running = false; }, durationSeconds * 1000);
}