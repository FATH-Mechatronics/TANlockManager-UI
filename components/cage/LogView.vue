<template>
  <div>
    <v-card style="margin: 1em 0;">
      <v-card-title class="headline">
        Cabinet Events
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="logs"
          :search="search"
          :sort-desc="true"
          sort-by="log.time"
          dense
        >
          <template v-slot:item.log.time="{ item }">
            {{ new Date(item.log.time).toLocaleString() }}
          </template>
          <template v-slot:item.photos.length="{ item }">
            <div v-if="item.photos.length > 0">
              <v-icon @click.stop="openPhotos(item)" small class="mr-2">
                mdi-image
              </v-icon>
              {{ item.photos.length }}
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogShow" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          {{ new Date(dialogItem.log.time).toLocaleString() }}&nbsp;
          <b>{{ dialogItem.log.lock }}</b>
          &nbsp;{{ dialogItem.log.event }}
        </v-card-title>

        <v-card-text>
          <v-carousel>
            <v-carousel-item v-for="(item,i) in dialogItem.photos" :key="i" :src="item">
              <AuthImage :src="item" style="height:100%" tile />
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-btn @click.stop="dialogShow = false;" color="warning">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import AuthImage from '../Customs/AuthImage.vue'

import CabinetLogEntry from '../../model/CabinetLogEntry'
import ExtendedLoggerType from '../../model/ExtendedLoggerType'

  @Component({
    components: {
      AuthImage
    },
    async mounted () {
      return this.$axios
        .get(`/data/cabinet/${this.cabinet.id}/log`)
        .then((res) => {
          this.logs = res.data
        })
    },
    beforeMount () {
      this.$socketio.on('cabinetLog', (msg: CabinetLogEntry) => {
        console.log(msg)
        if (msg.type === ExtendedLoggerType.TYPENEWIMAGE) {
          // UPDATE IMAGE
          const log = this.logs.filter(
            (l: { log: CabinetLogEntry; photos: string[] }) =>
              l.log.lock_id == msg.lock_id &&
              l.log.time < msg.time &&
              (l.log.end == null || l.log.end > msg.time)
          )
          console.log(log)
          if (log.length == 1) {
            log[0].photos.push(msg.value)
          } else {
            console.log('Cannot Find That One ;D')
          }
        } else {
          console.log('My New Log Is Comeing')
          this.logs
            .filter(t => t.log.end == null && t.log.lock_id == msg.lock_id)
            .forEach((e) => {
              e.log.end = msg.time
            })
          this.logs.push({ log: msg, photos: [] })
          this.$forceUpdate()
        }
      })
    }
  })
class LogView extends Vue {
    @Prop({
      default: () => {
        return { id: -1, name: 'foo' }
      }
    })
    cabinet: any;

    logs: CabinetLogEntry[] = [];
    search: string = '';

    get headers () {
      return [
        { text: 'Lock', value: 'log.lock_name' },
        { text: 'Timestamp', value: 'log.time' },
        { text: 'Type', value: 'log.type' },
        { text: 'Event', value: 'log.event' },
        { text: 'Images', value: 'photos.length' },
        { text: 'Message', value: 'log.value' }
      ]
    }

    /* lockLink(item) {
      return "/locks/" + item.ip;
    } */
    dialogShow: boolean = false;
    dialogItem: any = { log: {} };

    openPhotos (item) {
      this.dialogShow = true
      this.dialogItem = item
    }
  }

export default LogView
</script>
