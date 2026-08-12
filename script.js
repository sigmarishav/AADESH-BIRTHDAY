/* ==========================================
   PAGE SYSTEM
========================================== */

let currentPage = 0;

const pages =
    document.querySelectorAll(".page");

const dots =
    document.querySelectorAll(".progress span");


function showPage(index){

    if(index < 0 || index >= pages.length){
        return;
    }

    pages.forEach(page => {
        page.classList.remove("active");
    });

    pages[index].classList.add("active");

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    if(dots[index]){
        dots[index].classList.add("active");
    }

    currentPage = index;
}


function nextPage(){

    if(currentPage < pages.length - 1){

        showPage(currentPage + 1);

    }

}


/* ==========================================
   RIBBON CUT
========================================== */

let ribbonAlreadyCut = false;


function cutRibbon(){

    if(ribbonAlreadyCut){
        return;
    }

    ribbonAlreadyCut = true;


    const stage =
        document.getElementById("ribbonStage");

    const scissors =
        document.getElementById("scissors");

    const button =
        document.getElementById("ribbonButton");


    if(scissors){
        scissors.classList.add("cutting");
    }


    if(button){
        button.classList.add("disabled");
        button.innerHTML = "✨ OPENING...";
    }


    setTimeout(() => {

        if(stage){
            stage.classList.add("cut");
        }

        createConfettiBurst(100);

        createStars();

    },550);


    setTimeout(() => {

        nextPage();

    },1500);

}


/* ==========================================
   CONFETTI
========================================== */

const colors = [
    "#ed6bc6",
    "#a48cff",
    "#73cfff",
    "#ffd166",
    "#ffffff",
    "#ff88aa"
];


function createConfetti(){

    const piece =
        document.createElement("div");

    piece.className = "confetti";


    piece.style.left =
        Math.random() * 100 + "vw";


    piece.style.background =
        colors[
            Math.floor(
                Math.random() * colors.length
            )
        ];


    piece.style.width =
        (4 + Math.random() * 7) + "px";


    piece.style.height =
        (7 + Math.random() * 12) + "px";


    piece.style.animationDuration =
        (3 + Math.random() * 3) + "s";


    document.body.appendChild(piece);


    setTimeout(() => {
        piece.remove();
    },6500);

}


function createConfettiBurst(amount){

    for(let i = 0; i < amount; i++){

        setTimeout(
            createConfetti,
            i * 8
        );

    }

}


/* ==========================================
   STAR BURST
========================================== */

function createStars(){

    const symbols = [
        "✨",
        "⭐",
        "💗",
        "🎉"
    ];


    for(let i = 0; i < 30; i++){

        const star =
            document.createElement("div");


        star.innerHTML =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        star.style.position = "fixed";

        star.style.left = "50%";

        star.style.top = "48%";

        star.style.zIndex = "600";

        star.style.pointerEvents = "none";


        const angle =
            Math.random() * Math.PI * 2;


        const distance =
            70 + Math.random() * 180;


        star.animate(

            [
                {
                    transform:
                        "translate(-50%,-50%) scale(.2)",

                    opacity:1
                },

                {
                    transform:
                        `translate(
                            calc(-50% + ${Math.cos(angle) * distance}px),
                            calc(-50% + ${Math.sin(angle) * distance}px)
                        )
                        scale(1.3)`,

                    opacity:0
                }
            ],

            {
                duration:
                    700 + Math.random() * 600,

                easing:
                    "cubic-bezier(.16,1,.3,1)",

                fill:"forwards"
            }

        );


        document.body.appendChild(star);


        setTimeout(() => {
            star.remove();
        },1500);

    }

}


/* ==========================================
   BIRTHDAY MUSIC
   Web Audio API
========================================== */

let audioContext = null;

let musicPlaying = false;

let musicTimer = null;


const melody = [

    [261.63,.35],
    [261.63,.35],
    [293.66,.7],
    [261.63,.7],
    [349.23,.7],
    [329.63,1],

    [261.63,.35],
    [261.63,.35],
    [293.66,.7],
    [261.63,.7],
    [392,.7],
    [349.23,1],

    [261.63,.35],
    [261.63,.35],
    [523.25,.7],
    [440,.7],
    [349.23,.7],
    [329.63,.7],
    [293.66,1],

    [466.16,.35],
    [466.16,.35],
    [440,.7],
    [349.23,.7],
    [392,.7],
    [349.23,1.2]

];


function playNote(
    frequency,
    duration,
    startTime
){

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type = "sine";

    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        0.0001,
        startTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.12,
        startTime + 0.03
    );


    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + duration
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start(startTime);

    oscillator.stop(
        startTime + duration + .05
    );

}


function playMelody(){

    if(!musicPlaying){
        return;
    }


    const start =
        audioContext.currentTime + .05;


    let time = start;


    melody.forEach(note => {

        playNote(
            note[0],
            note[1],
            time
        );

        time +=
            note[1] + .05;

    });


    const total =
        melody.reduce(
            (sum,note) =>
                sum + note[1] + .05,
            0
        );


    musicTimer =
        setTimeout(
            playMelody,
            total * 1000
        );

}


function startMusic(){

    if(!audioContext){

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }


    if(
        audioContext.state === "suspended"
    ){

        audioContext.resume();

    }


    musicPlaying = true;


    const musicButton =
        document.getElementById(
            "musicButton"
        );


    musicButton.innerHTML = "🎵";

    musicButton.classList.add("on");


    playMelody();

}


function stopMusic(){

    musicPlaying = false;


    clearTimeout(musicTimer);


    const musicButton =
        document.getElementById(
            "musicButton"
        );


    musicButton.innerHTML = "🔇";

    musicButton.classList.remove("on");

}


function toggleMusic(){

    if(musicPlaying){

        stopMusic();

    }else{

        startMusic();

    }

}


/* ==========================================
   FINAL CELEBRATION
========================================== */

function celebrate(){

    startMusic();


    createConfettiBurst(300);


    setTimeout(() => {
        createConfettiBurst(250);
    },1000);


    setTimeout(() => {
        createConfettiBurst(250);
    },2200);


    const title =
        document.querySelector(".final h1");


    const text =
        document.querySelector(".final p");


    const button =
        document.querySelector(".final .btn");


    if(title){

        title.innerHTML =
            "HAPPY BIRTHDAY,<br>AADESH! 🎂";

    }


    if(text){

        text.innerHTML =
            "May your life always be filled with happiness, success, amazing people and unforgettable memories. Keep smiling, keep shining and enjoy your special day! ❤️";

    }


    if(button){

        button.style.display = "none";

    }

}


/* ==========================================
   PC CURSOR
========================================== */

const customCursor =
    document.getElementById(
        "customCursor"
    );


const desktop =
    window.matchMedia(
        "(hover:hover) and (pointer:fine)"
    ).matches;


if(desktop){

    let mouseX = 0;

    let mouseY = 0;

    let lastSpark = 0;


    document.addEventListener(
        "mousemove",
        function(event){

            mouseX = event.clientX;

            mouseY = event.clientY;


            if(customCursor){

                customCursor.style.left =
                    mouseX + "px";

                customCursor.style.top =
                    mouseY + "px";

            }


            const now = Date.now();


            if(now - lastSpark > 90){

                cursorSpark();

                lastSpark = now;

            }

        }
    );


    function cursorSpark(){

        const spark =
            document.createElement("div");


        spark.className =
            "cursor-spark";


        const icons = [
            "✨",
            "⭐",
            "💗",
            "🎈",
            "🎉"
        ];


        spark.innerHTML =
            icons[
                Math.floor(
                    Math.random() *
                    icons.length
                )
            ];


        spark.style.left =
            mouseX + "px";


        spark.style.top =
            mouseY + "px";


        spark.style.setProperty(
            "--x",
            (Math.random() * 50 - 25) + "px"
        );


        spark.style.setProperty(
            "--y",
            (20 + Math.random() * 50) + "px"
        );


        document.body.appendChild(spark);


        setTimeout(() => {
            spark.remove();
        },800);

    }

}


/* ==========================================
   KEYBOARD
========================================== */

document.addEventListener(
    "keydown",
    function(event){

        if(event.key === "ArrowRight"){
            nextPage();
        }


        if(event.key === "ArrowLeft"){

            showPage(
                Math.max(
                    0,
                    currentPage - 1
                )
            );

        }

    }
);


/* ==========================================
   MOBILE SWIPE
========================================== */

let touchStart = 0;


document.addEventListener(
    "touchstart",
    function(event){

        touchStart =
            event.changedTouches[0].screenX;

    },
    {passive:true}
);


document.addEventListener(
    "touchend",
    function(event){

        const touchEnd =
            event.changedTouches[0].screenX;


        const distance =
            touchEnd - touchStart;


        if(Math.abs(distance) < 60){
            return;
        }


        if(distance < 0){

            nextPage();

        }else{

            showPage(
                Math.max(
                    0,
                    currentPage - 1
                )
            );

        }

    },
    {passive:true}
);


/* ==========================================
   START
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        setTimeout(() => {

            createConfettiBurst(20);

        },600);

    }
);
/* ==========================================
   PC MOUSE WHEEL PAGE NAVIGATION
========================================== */

let wheelLocked = false;

document.addEventListener("wheel", function(event) {

    // Small accidental wheel movements ignore
    if (Math.abs(event.deltaY) < 20) return;

    // Animation ke dauran dobara page change nahi hoga
    if (wheelLocked) return;

    wheelLocked = true;

    if (event.deltaY > 0) {

        // Scroll DOWN → Next Page
        nextPage();

    } else {

        // Scroll UP → Previous Page
        showPage(
            Math.max(0, currentPage - 1)
        );

    }

    // Smooth transition complete hone tak lock
    setTimeout(() => {
        wheelLocked = false;
    }, 900);

}, { passive: true });