<template>
  <b-container>

    <b-row v-if="playing_video" align-v="start">

        <b-col md="8" sm="12" xs="12" ref="mainPlayer" v-resize="onPlayerResize">
            <youtube :video-id="playing_video.vid"
                     :player-width="playerWidth"
                     :player-height="playerHeight">
            </youtube>
            <!--<p class="mb-0">{{playing_video.title}}</p>-->
        </b-col>

        <b-col md="3" offset-md="1" sm="12" xs="12" class="list">
          <b-row class="link" v-for="(video, index) in videos" :key="video.vid" no-gutters align-v="center" @click.prevent="go(video)">
            <b-col cols="1">
              <p class="index">{{index + 1}}</p>
            </b-col>
            <b-col>
              <b-img fluid
                        :src="'https://img.youtube.com/vi/'+video.vid+'/maxresdefault.jpg'" alt="placeholder"/>
            </b-col>
            <b-col style="padding-left: 5px">
              <p class="mb-0 title">{{video.title}}</p>
            </b-col>
          </b-row>
        </b-col>

    </b-row>
  </b-container>
</template>

<script>
  import backend from '@/api/backend_axios'
  import resize from 'vue-resize-directive'

  export default {
    name: "video-view",
    //props: ['concept'],
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
    // beforeRouteUpdate (to, from, next) {
    //   console.log(to)
    //   this.fetchVideos(to.params.concept);
    //   next()
    // },
    created() {
      this.fetchVideos(this.$route.params.concept);
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
      },
      go(video)
      {
        this.playing_video = video;
      }
    }
  }
</script>

<style scoped>
  .link {
    cursor: pointer;
    padding-bottom: 7px;
  }
  p {
    font-family: roboto, sans-serif;
    /*font-size: medium;*/
  }
  .title {
    font-size: small
  }
  b-row {
    padding: 80px
  }

  .list {
    padding: 10px;
    height:400px;
    overflow-y: auto;
  }

  .list::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0, 0.1);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  .list::-webkit-scrollbar
  {
    width: 8px;
    background-color: #F5F5F5;
  }

  .list::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
  }

  .index {
    font-size: 10px;
    color: gray;
  }
</style>