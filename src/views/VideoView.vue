<template>
  <b-container>

    <b-row v-if="playing_video" class="player" align-v="start">

        <b-col md="8" sm="12" xs="12" ref="mainPlayer" v-resize="onPlayerResize">
            <strong>{{playing_video.title}}</strong>
            <youtube :video-id="playing_video.vid"
                     :player-width="playerWidth"
                     :player-height="playerHeight">
            </youtube>
        </b-col>

        <b-col md="3" offset-md="1" sm="12" xs="12">
          <b-media v-for="video in videos" :key="video.vid">
            <p class="mb-0">{{video.title}}</p>
            <a @click.prevent="go(video)" href="">
              <b-img-lazy thumbnail fluid
                        :src="'https://img.youtube.com/vi/'+video.vid+'/maxresdefault.jpg'" alt="placeholder"/>
            </a>
          </b-media>
        </b-col>

    </b-row>
  </b-container>
</template>

<script>
  import backend from '@/api/backend_axios'
  import resize from 'vue-resize-directive'

  export default {
    name: "playlist",
    props: ['concept'],
    directives: {
        resize,
    },
    data() {
      return {
        videos: [],
        playing_video: null,
        playerWidth: 640,
        playerHeight: 400,
      }
    },
    created() {
      this.fetchVideos(this.concept);
    },
    methods: {
      async fetchVideos(concept) {
        if (concept != null)
        {
          let { data } = await backend.getVideos(concept)
          this.videos = data
          this.playing_video = this.videos[0]
        }
      },
      onPlayerResize() {
        let player = this.$refs.mainPlayer
          this.playerWidth = player.clientWidth
        // console.log(player.clientHeight)
        // this.playerHeight = player.clientHeight
      },
      go(video)
      {
        this.playing_video = video;
      }
    }
  }
</script>

<style scoped>
  .player {
    padding-top: 20px
  }
  p {
    font-family: roboto, sans-serif;
  }
</style>