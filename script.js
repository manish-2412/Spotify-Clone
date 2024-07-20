let songs = [
    {
        title: 'This Feeling',
        artist: 'The Chainsmokers',
        src: '/Users/manish/Desktop/nice/Projects/Spotify Clone/music1.mp3',
        cover: 'cover1.png'
    },
    {
        title: 'Drag Me Down',
        artist: 'One Direction',
        src: '/Users/manish/Desktop/nice/Projects/Spotify Clone/music2.mp3',
        cover: 'cover2.png'
    },
    {
        title: 'Tattoos Together',
        artist: 'Lauv',
        src: '/Users/manish/Desktop/nice/Projects/Spotify Clone/music3.mp3',
        cover: 'cover3.png'
    },
    {
        title: 'Moth To A Flame',
        artist: 'The Weekend',
        src: '/Users/manish/Desktop/nice/Projects/Spotify Clone/music4.mp3',
        cover: 'cover4.png'
    },
    {
        title: 'Not Like Us',
        artist: 'Kendrik Lamar',
        src: '/Users/manish/Desktop/nice/Projects/Spotify Clone/music5.mp3',
        cover: 'cover5.png'
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isLoop = false;

let audioPlayer = new Audio();
audioPlayer.src = songs[currentTrackIndex].src;

let playBtn = document.getElementById('play-btn');
let prevBtn = document.getElementById('prev-btn');
let nextBtn = document.getElementById('next-btn');
let shuffleBtn = document.getElementById('shuffle-btn');
let loopBtn = document.getElementById('loop-btn');
let progressBar = document.getElementById('progress-bar');
let volumeControl = document.getElementById('volume');
let trackTitle = document.getElementById('track-title');
let trackArtist = document.getElementById('track-artist');
let albumCover = document.getElementById('album-cover');
let playlist = document.getElementById('playlist');

audioPlayer.addEventListener('timeupdate', updateProgressBar);
audioPlayer.addEventListener('ended', function() {
    if (isLoop) {
        playTrack();
    } else if (isShuffle) {
        shufflePlay();
    } else {
        nextTrack();
    }
});

function togglePlayPause() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function playTrack() {
    audioPlayer.play();
    isPlaying = true;
    playBtn.textContent = 'Pause';
    updatePlaylist();
}

function pauseTrack() {
    audioPlayer.pause();
    isPlaying = false;
    playBtn.textContent = 'Play';
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + songs.length) % songs.length;
    loadTrack(currentTrackIndex);
    playTrack();
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % songs.length;
    loadTrack(currentTrackIndex);
    playTrack();
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.style.backgroundColor = isShuffle ? '#0e8d4f' : '#1db954';
}

function toggleLoop() {
    isLoop = !isLoop;
    loopBtn.style.backgroundColor = isLoop ? '#0e8d4f' : '#1db954';
}

function loadTrack(index) {
    audioPlayer.src = songs[index].src;
    trackTitle.textContent = songs[index].title;
    trackArtist.textContent = songs[index].artist;
    albumCover.src = songs[index].cover;
}

function updateProgressBar() {
    let currentTime = audioPlayer.currentTime;
    let duration = audioPlayer.duration;
    progressBar.value = (currentTime / duration) * 100;
    document.getElementById('current-time').textContent = formatTime(currentTime);
    document.getElementById('duration').textContent = formatTime(duration);
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secondsPart = Math.floor(seconds % 60);
    return `${minutes}:${secondsPart < 10 ? '0' : ''}${secondsPart}`;
}

function shufflePlay() {
    // Generate a random index different from the current track index
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentTrackIndex);

    currentTrackIndex = randomIndex;
    loadTrack(currentTrackIndex);
    playTrack();
}

progressBar.addEventListener('input', function() {
    let duration = audioPlayer.duration;
    let value = progressBar.value;
    audioPlayer.currentTime = (value / 100) * duration;
});

volumeControl.addEventListener('input', function() {
    audioPlayer.volume = volumeControl.value;
    localStorage.setItem('volume', volumeControl.value);
});

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case ' ':
            event.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowRight':
            nextTrack();
            break;
        case 'ArrowLeft':
            prevTrack();
            break;
        case 's':
            toggleShuffle();
            break;
        case 'l':
            toggleLoop();
            break;
    }
});

function updatePlaylist() {
    playlist.innerHTML = '';
    songs.forEach((song, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = `${song.title} - ${song.artist}`;
        listItem.classList.add('playlist-item');
        if (index === currentTrackIndex) {
            listItem.classList.add('active');
        }
        listItem.addEventListener('click', () => {
            loadTrack(index);
            playTrack();
        });
        playlist.appendChild(listItem);
    });
}

window.addEventListener('load', () => {
    let savedVolume = localStorage.getItem('volume');
    if (savedVolume) {
        volumeControl.value = savedVolume;
        audioPlayer.volume = savedVolume;
    }
    updatePlaylist();
});
