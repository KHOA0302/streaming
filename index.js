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
const volumeOff = $('.volume-off')
const songCurrentTime = $('.currentTime')
const songTimeDuration = $('.timeDuration')
const nextSong = $('.btn-next i')
const prevSong = $('.btn-prev i')

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
            name: '四月は君の嘘',
            singer: 'Orange - 7!!',
            path: './asset/songs/song3.mp3',
            image: './asset/img/bg3.jpg',
        },
        {
            name: '蒼のワルツ',
            singer: 'Eve',
            path: './asset/songs/song2.mp3',
            image: './asset/img/bg2.webp',
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
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song">
                    <div class="thumb" id=${index} 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body"  id=${index} >
                        <h3 class="title"  id=${index} >${song.name}</h3>
                        <p class="author"  id=${index} >${song.singer}</p>
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

        volumeOn.onclick = e => {
            volumeBar.value = 0
            audio.volume = 0
            volumeOff.classList.add('active')
            volumeOn.classList.remove('active')
        }

        volumeOff.onclick = e => {
            volumeBar.value = 0.3
            audio.volume = 0.3
            volumeOn.classList.add('active')
            volumeOff.classList.remove('active')
        }

        // xu ly chuyen bai hat 

        nextSong.onclick = e => {
            _this.changeSong()
            _this.loadCurrentSong()       
            audio.play()
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
    loadVolume: function() {
        volumeOn.classList.add('active')
        volumeBar.onchange = e => {
            if(e.target.value === '0') {
                volumeOff.classList.add('active')
                volumeOn.classList.remove('active')
            } else {
                volumeOn.classList.add('active')
                volumeOff.classList.remove('active')
            }
        }
    },
    changeSong: function() {
        this.currentIndex++
    },
    clickSongToPlay: function() {
        const _this = this
        const songs = $$('.playlist div.song')
        songs.forEach(song => {
            song.onclick = e => {
                console.log(e.target)
                _this.currentIndex = e.target.id
                _this.loadCurrentSong()
                audio.play()
            }
        })
    },
    start: function() {
        this.defineProperties()

        this.handleEvent()

        this.loadCurrentSong()

        this.loadCurrentTime()

        this.loadVolume()

        this.render()

        this.clickSongToPlay()
    },
}

app.start()

