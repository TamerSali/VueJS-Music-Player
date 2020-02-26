new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Ma Lo",
          artist: "Tiwa Savage",
          cover: "https://i.pinimg.com/originals/ff/d1/15/ffd11511e4351c5fdd22ca0faad79d25.jpg",
          source: "https://topnaija.ng/wp-content/uploads/2019/02/Tiwa-Savage-Ma-Lo-Ft.-Wizkid-Spellz.mp3",
          url: "https://www.youtube.com/watch?v=U4fqMMKo9ns",
          favorited: false
        },
        {
          name: "Macarena",
          artist: "Tyga",
          cover: "https://images.genius.com/bf240156bf229b0d64755f527126e748.646x646x1.jpg",
          source: "http://red3mp3.su/stream/60999829/tyga-ayy-macarena.mp3",
          url: "https://www.youtube.com/watch?v=obUHDyWFMi8",
          favorited: false
        },
        {
          name: "Let Your Body Come Home ",
          artist: "Low Deep T",
          cover: "https://is2-ssl.mzstatic.com/image/thumb/Music113/v4/73/42/f2/7342f216-5ffe-2912-528c-4d58b29e4a9e/cover.jpg/268x0w.jpg",
          source: "http://red3mp3.su/stream/56604068/low-deep-t-let-your-body-come-home.mp3",
          url: "https://www.youtube.com/watch?v=gEmSwBrz9BY",
          favorited: true
        },
        {
          name: "Old Town Road",
          artist: "Billy Ray Cyrus, Lil Nas X",
          cover: "https://the360mag.com/wp-content/uploads/2019/05/unnamed-2-e1558116357829.jpg",
          source: "http://red3mp3.su/stream/53047442/billy-ray-cyrus-lil-nas-x-old-town-road-2350.mp3",
          url: "https://www.youtube.com/watch?v=r7qovpFAGrQ",
          favorited: false
        },
        {
          name: "Кажи ми вече всичко",
          artist: "Billy Hlapeto, VenZy",
          cover: "https://s.mxmcdn.net/images-storage/albums/8/9/1/0/7/0/32070198_350_350.jpg",
          source: "http://red3mp3.su/stream/34093769/billy-hlapeto-venzy-kazhi-mi-veche-vsichko.mp3",
          url: "https://www.youtube.com/watch?v=o7Nv5lCSDHM",
          favorited: false
        }
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if (this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function () {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function () {
      vm.generateTime();
    };
    this.audio.onended = function () {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }

});
