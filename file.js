// ==========================================
// BARSAAT
// Rain Animation + YouTube Music Player
// ==========================================


// ==========================================
// RAIN ANIMATION
// ==========================================

const rainContainer =
    document.getElementById("rain-container");

const RAIN_COUNT = 180;


// Create a single rain drop
function createRainDrop() {

    const drop = document.createElement("span");

    drop.classList.add("rain-drop");


    // Random horizontal position
    const left =
        Math.random() * 100;


    // Random length
    const height =
        15 + Math.random() * 35;


    // Random falling speed
    const duration =
        0.45 + Math.random() * 0.7;


    // Random animation delay
    const delay =
        Math.random() * 2;


    // Random opacity
    const opacity =
        0.15 + Math.random() * 0.45;


    drop.style.left = `${left}%`;

    drop.style.height = `${height}px`;

    drop.style.opacity = opacity;

    drop.style.animationDuration =
        `${duration}s`;

    drop.style.animationDelay =
        `${delay}s`;


    rainContainer.appendChild(drop);
}


// Generate all rain drops
function createRain() {

    for (let i = 0; i < RAIN_COUNT; i++) {

        createRainDrop();

    }

}


// Start rain
createRain();


// ==========================================
// YOUTUBE MUSIC PLAYER
// ==========================================

const PLAYLIST_ID =
    "PLQfrh3ze_2nLQBiXKAZ8_86Kyx9CUKz6M";


let player = null;


// ==========================================
// PLAYER DOM ELEMENTS
// ==========================================

const playButton =
    document.getElementById("play-button");

const previousButton =
    document.getElementById("previous-button");

const nextButton =
    document.getElementById("next-button");

const playIcon =
    document.getElementById("play-icon");

const songTitle =
    document.getElementById("song-title");

const artistName =
    document.getElementById("artist-name");

const albumCover =
    document.getElementById("album-cover");

const currentTime =
    document.getElementById("current-time");

const duration =
    document.getElementById("duration");

const progressBar =
    document.getElementById("progress-bar");

const progressContainer =
    document.getElementById("progress-container");    


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(seconds) {

    if (!seconds || isNaN(seconds)) {

        return "0:00";

    }


    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);


    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;

}
// ==========================================
// UPDATE SONG INFORMATION
// ==========================================

function updateSongInfo() {

    if (!player) return;


    const videoData =
        player.getVideoData();


    if (!videoData) return;


    // Song title
    if (videoData.title) {

        songTitle.textContent =
            videoData.title;

    }


    // Artist / channel
    if (videoData.author) {

        artistName.textContent =
            videoData.author;

    }


    // YouTube thumbnail
    if (videoData.video_id) {

        albumCover.src =
            `https://img.youtube.com/vi/${videoData.video_id}/hqdefault.jpg`;

    }

}

// ==========================================
// PROGRESS TRACKING
// ==========================================

let progressInterval = null;


function startProgressTracking() {

    if (progressInterval) {

        clearInterval(progressInterval);

    }


    progressInterval =
        setInterval(updateProgress, 500);

}


function updateProgress() {

    if (!player) return;


    const current =
        player.getCurrentTime();

    const total =
        player.getDuration();


    if (!total || isNaN(total)) {

        return;

    }


    // Update time text
    currentTime.textContent =
        formatTime(current);

    duration.textContent =
        formatTime(total);


    // Calculate progress percentage
    const percentage =
        (current / total) * 100;


    progressBar.style.width =
        `${percentage}%`;

}
// ==========================================
// SEEK SONG
// ==========================================

progressContainer.addEventListener(
    "click",
    (event) => {

        if (!player) return;


        const total =
            player.getDuration();


        if (!total || isNaN(total)) {

            return;

        }


        const rect =
            progressContainer.getBoundingClientRect();


        const clickPosition =
            event.clientX - rect.left;


        const percentage =
            clickPosition / rect.width;


        const newTime =
            total * percentage;


        player.seekTo(
            newTime,
            true
        );

    }
);
// ==========================================
// YOUTUBE API READY
// ==========================================

function onYouTubeIframeAPIReady() {

    console.log("YouTube API loaded");


    player = new YT.Player("youtube-player", {

        width: "200",

        height: "200",

        playerVars: {

            autoplay: 0,

            controls: 0,

            disablekb: 1,

            fs: 0,

            modestbranding: 1,

            playsinline: 1,

            rel: 0,

            listType: "playlist",

            list: PLAYLIST_ID,

            origin: window.location.origin

        },

        events: {

            onReady: onPlayerReady,

            onStateChange: onPlayerStateChange

        }

    });

}


// ==========================================
// PLAYER READY
// ==========================================

function onPlayerReady(event) {

    console.log("BARSAAT player ready");

    console.log(
        "Playlist loaded:",
        PLAYLIST_ID
    );


    // Get current song information
    updateSongInfo();


    // Start progress updates
    startProgressTracking();

}


// ==========================================
// PLAYER STATE
// ==========================================

function onPlayerStateChange(event) {

    console.log(
        "Player state:",
        event.data
    );


    // ======================================
    // PLAYING
    // ======================================

    if (
        event.data ===
        YT.PlayerState.PLAYING
    ) {

        playIcon.textContent = "❚❚";


        // Update song information
        updateSongInfo();


        // Start progress
        startProgressTracking();

    }


    // ======================================
    // PAUSED
    // ======================================

    else if (
        event.data ===
        YT.PlayerState.PAUSED
    ) {

        playIcon.textContent = "▶";

    }


    // ======================================
    // ENDED
    // ======================================

    else if (
        event.data ===
        YT.PlayerState.ENDED
    ) {

        playIcon.textContent = "▶";

    }

}

// ==========================================
// PLAY / PAUSE
// ==========================================

playButton.addEventListener("click", () => {

    if (!player) {

        console.log("Player is not ready");

        return;

    }


    const state =
        player.getPlayerState();


    if (
        state ===
        YT.PlayerState.PLAYING
    ) {

        player.pauseVideo();

    }

    else {

        player.playVideo();

    }

});


// ==========================================
// PREVIOUS SONG
// ==========================================

previousButton.addEventListener("click", () => {

    if (!player) {

        console.log("Player is not ready");

        return;

    }


    player.previousVideo();

});


// ==========================================
// NEXT SONG
// ==========================================

nextButton.addEventListener("click", () => {

    if (!player) {

        console.log("Player is not ready");

        return;

    }


    player.nextVideo();

});