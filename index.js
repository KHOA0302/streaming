

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
const random = $('.btn-random')
const repeatOne = $('.btn-repeat_one')
const repeatAll = $('.btn-repeat_all')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeatingOne: false,
    isRepeatingAll: true,
    isRandom: false,
    songs: [
        {
            id: 0,
            name: '愛にできることはまだあるかい',
            singer: 'RADWIMPS',
            path: './asset/songs/song1.mp3',
            image: './asset/img/bg1.jpg',
        },
        {
            id: 1,
            name: '四月は君の嘘',
            singer: 'Orange - 7!!',
            path: './asset/songs/song3.mp3',
            image: './asset/img/bg3.jpg',
        },
        {
            id: 2,
            name: '蒼のワルツ',
            singer: 'Eve',
            path: './asset/songs/song2.mp3',
            image: './asset/img/bg2.webp',
        },
        {
            id: 3,
            name: 'スパークル',
            singer: 'RADWIMPS',
            path: './asset/songs/song4.mp3',
            image: './asset/img/bg4.jpg',
        },
        {
            id: 4,
            name: 'ハレハレヤ',
            singer: '羽生まゐご',
            path: './asset/songs/song5.mp3',
            image: './asset/img/bg5.jpg',
        },
    ],
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song-${index} song">
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
        
        const autoNext = ()=> {
            if(_this.currentIndex < _this.songs.length - 1) {
                _this.currentIndex++
                _this.loadCurrentSong()
                audio.play()
            } else if(_this.currentIndex == _this.songs.length - 1) {
                _this.currentIndex = 0
                _this.loadCurrentSong()
                audio.play()
            } 
        }
        
        audio.ontimeupdate = () => {
            if(audio.duration) {
                const progressPercent = audio.currentTime * 100 / audio.duration
                progress.value = progressPercent
                this.loadCurrentTime()
            } if(audio.currentTime == audio.duration) {
                if(_this.isRepeatingOne) {
                    _this.currentIndex = _this.currentIndex  
                    _this.loadCurrentSong()
                    audio.play()
                } else if(_this.isRandom) {
                    let randomIndex = Math.floor((Math.random() * (this.songs.length - 1)))
                    if(this.currentIndex == randomIndex) {
                        _this.currentIndex = randomIndex + 2
                        _this.loadCurrentSong()
                        audio.play()
                    } else {
                        _this.currentIndex = randomIndex
                        _this.loadCurrentSong()
                        audio.play()
                    }
                } else {
                    autoNext()
                }
            }
        }
        
        progress.oninput = (e) => {
            audio.currentTime = e.target.value * audio.duration / 100
        }
        
        // xu ly volume

        let stampVolume
          
        volumeBar.oninput = () => {
            audio.volume = volumeBar.value
        }

        volumeOn.onclick = e => {
            stampVolume = volumeBar.value
            volumeBar.value = 0
            audio.volume = 0
            volumeOff.classList.add('active')
            volumeOn.classList.remove('active')
        }

        volumeOff.onclick = e => {
            audio.volume = stampVolume
            volumeBar.value = stampVolume
            volumeOn.classList.add('active')
            volumeOff.classList.remove('active')
        }

        // xu ly chuyen bai hat 

        nextSong.onclick = e => {
            _this.nextSong()
            progress.value = 0
            _this.loadCurrentSong()       
            audio.play()
        }
        prevSong.onclick = e => {
            _this.prevSong()
            progress.value = 0
            _this.loadCurrentSong()       
            audio.play()
        }

        if(this.isRepeatingAll) {
            repeatAll.classList.add('active')
        }

        repeatAll.onclick = e => {
            _this.isRepeatingOne = true
            _this.isRandom = false
            _this.isRepeatingAll = false
            repeatAll.classList.remove('active')
            random.classList.remove('active')
            repeatOne.classList.add('active')
        }

        repeatOne.onclick = e => {
            _this.isRepeatingOne = false
            _this.isRandom = true
            _this.isRepeatingAll = false
            repeatAll.classList.remove('active')
            repeatOne.classList.remove('active')
            random.classList.add('active')
        }

        random.onclick = e => {
            _this.isRepeatingOne = false
            _this.isRandom = false
            _this.isRepeatingAll = true
            repeatOne.classList.remove('active')
            random.classList.remove('active')
            repeatAll.classList.add('active')
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.background = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        document.querySelectorAll('.song').forEach(song => {
            song.classList.remove('active')
        })
        document.querySelector(`.song-${this.currentIndex}`).classList.add('active')
    },
    loadCurrentTime: function() {
        songTimeDuration.innerHTML = (audio.duration / 60).toFixed(2)
        songCurrentTime.innerHTML =  (audio.currentTime / 60).toFixed(2)
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
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0
        }
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
    },
    clickSongToPlay: function() {
        const _this = this
        const songs = $$('.playlist div.song')
        songs.forEach(song => {
            song.onclick = e => {
                progress.value = 0
                _this.currentIndex = e.target.id
                _this.loadCurrentSong()
                audio.play()
            }

            song.querySelector('div.option').onclick = e => {
                console.log('Option On!!')
            }
        })
    },
    start: function() {
        this.render()

        this.defineProperties()

        this.loadCurrentSong()

        this.handleEvent()

        this.loadVolume()

        this.render()

        this.clickSongToPlay()
    },
}

app.start()

