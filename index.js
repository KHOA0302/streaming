const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const volumeBar = $('.volume-bar')
const volumeOn = $('.volume-on')
const songCurrentTime = $('.currentTime')
const songTimeDuration = $('.timeDuration')

const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: [
        {
            name: '愛にできることはまだあるかい',
            singer: 'RADWIMPS',
            path: './asset/songs/song1.mp3',
            image: './asset/img/bg1.jpg',
        },
        {
            name: '蒼のワルツ',
            singer: 'Eve',
            path: './asset/songs/song2.mp3',
            image: './asset/img/bg2.webp',
        },
        {
            name: '四月は君の嘘',
            singer: 'Orange - 7!!',
            path: './asset/songs/song3.mp3',
            image: './asset/img/bg3.jpg',
        },
        {
            name: 'スパークル',
            singer: 'RADWIMPS',
            path: './asset/songs/song4.mp3',
            image: './asset/img/bg4.jpg',
        },
        {
            name: 'ハレハレヤ',
            singer: '羽生まゐご',
            path: './asset/songs/song5.mp3',
            image: './asset/img/bg5.jpg',
        },
        {
            name: 'ハレハレヤ',
            singer: '羽生まゐご',
            path: './asset/songs/song5.mp3',
            image: './asset/img/bg5.jpg',
        },
        {
            name: 'ハレハレヤ',
            singer: '羽生まゐご',
            path: './asset/songs/song5.mp3',
            image: './asset/img/bg5.jpg',
        },
    ],
    render: function() {
        const htmls = this.songs.map((song) => {
            return `
                <div class="song">
                    <div class="thumb" 
                        style="background-image: url('https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const _this = this
        // xu ly thu phong CD kho scroll
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth
       
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xu ly tang giam am luong
        volumeBar.oninput = () => {
            audio.volume = volumeBar.value
        }

        //xu ly onclick de play
        
        playBtn.onclick = () => {
            if(_this.isPlaying) {               
                audio.pause()               
            } else {         
                audio.play()             
            }
        }

        audio.onplay = () => {
            audio.volume = volumeBar.value
            _this.isPlaying = true
            player.classList.add('playing')
        }

        audio.onpause = () => {
            _this.isPlaying = false
            player.classList.remove('playing')
        }

        audio.ontimeupdate = () => {
            if(audio.duration) {
                const progressPercent = audio.currentTime * 100 / audio.duration
                progress.value = progressPercent
            }
        }

        progress.oninput = (e) => {
            audio.currentTime = e.target.value * audio.duration / 100
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.background = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadCurrentTime: function() {
        audio.ontimeupdate = () => {
            if(audio.duration) {
                songTimeDuration.innerHTML = (audio.duration / 60).toFixed(2)
                songCurrentTime.innerHTML =  (audio.currentTime / 60).toFixed(2)
            }
        }
    },
    start: function() {
        this.defineProperties()

        this.handleEvent()

        this.loadCurrentSong()

        this.loadCurrentTime()

        this.render()
    },
}

app.start()

