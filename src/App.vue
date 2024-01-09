<template>
  <div id="app" class="w-100 h-100">
    <!-- Modal -->
    <Modal>
      <h5 slot="modal-title">注意事項</h5>
      <div slot="modal-content">
        <p><i class="fal fa-stars mr-1"></i>目前地圖僅提供簡單查詢功能</p>
        <p>
          <i class="fal fa-stars mr-1"></i>廁所數量請以
          <span class="font-weight-bold">實際地點為主</span>
        </p>
        <p><i class="fal fa-stars mr-1"></i>為了方便查詢，請開啟存取位置權限</p>
        <p>
          <i class="fal fa-stars mr-1"></i>想了解更多程式碼請參考
          <a href="https://github.com/wujoe0415/UrgentComfort.git" target="_blank"
            >廁所地圖 GitHub
          </a>
        </p>
      </div>
      <div slot="modal-content-img">
        <img
          class="d-block"
          src="@/assets/images/smartphone_map_app_woman.png"
          width="150"
          alt=""
        />
      </div>
    </Modal>

    <!-- Loading -->
    <Loading v-if="isLoading">
      <p class="text-white m-0 h3">資料讀取中 ...</p>
    </Loading>
    <!--    導覽列     -->
    <div class="board position-absolute bg-white" :class="{ active: isActive }" v-else>
      <button
        class="board-btn position-absolute btn text-white d-flex justify-content-center"
        @click="isActive = !isActive"
      >
        <i class="far fa-angle-left"></i>
      </button>
      <!--    導覽列 header     -->
      <div class="board-header bg-toilet-primary">
        <div class="board-header__info d-flex justify-content-around align-items-center pt-2 pb-2">
          <div class="header-header__date text-white">
            <p>{{ today.date }}</p>
            <p class="h3">{{ today.weekDay }}</p>
          </div>

          <div class="board-header__avatar">
            <img
              src="@/assets/images/toilet_emergency.png"
              width="130"
              alt="public toilet"
            />
          </div>
        </div>
        <div class="board-header__search pb-3 px-3">
          <div class="d-flex justify-content-between mb-2">
            <select
              class="board-header__select form-control"
              v-model="selectedCity"
              @change="changePosition('選擇城市')"
            >
              <option :value="city.CityName" v-for="city in county" :key="city.CityName">
                {{ city.CityName }}
              </option>
            </select>
            <select
              class="board-header__select form-control"
              v-model="selectedDistrict"
              @change="changePosition('選擇行政區')"
            >
              <option
                :value="district.AreaName"
                v-for="district in filteredDistricts"
                :key="district.AreaName"
                >{{ district.AreaName }}</option
              >
            </select>
          </div>

          <div class="position-relative mb-2">
            <input
              type="text"
              class="form-control mx-auto"
              placeholder="搜索區域, 地點, 地址"
              @focus="isFocus = true"
              @blur="focusOut"
              @input="searchWord = $event.target.value"
            />
            <ul class="list-group position-absolute w-100 list-unstyled bg-white" v-show="isFocus">
              <li class="list-group-item p-0">
                <div class="search-list p-2 mt-2" @click="relocate">
                  <p class="mb-0"><i class="fal fa-location fa-lg mr-1"></i>重新定位您的位置</p>
                </div>
              </li>
              <li
                class="list-group-item p-0"
                v-for="item in searchToilets"
                :key="item.properties.id"
              >
                <div class="search-list p-2" @click="changePosition('選擇地點', item)">
                  <p class="search-list-name mb-0 h5">{{ item.properties.name }}</p>
                  <p class="search-list-address text-secondary mb-0">
                    {{ item.properties.address }}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div class="d-flex justify-content-between text-white">
            <span class="mr-2">僅顯示</span>
            <div class="custom-control custom-checkbox custom-control-inline mr-0">
              <input
                type="checkbox"
                class="custom-control-input"
                id="men_stock"
                value="toilet_men"
                v-model="stock"
              />
              <label class="custom-control-label" for="men_stock">男生</label>
            </div>

            <div class="custom-control custom-checkbox custom-control-inline mr-0">
              <input
                type="checkbox"
                class="custom-control-input"
                id="women_stock"
                value="toilet_women"
                v-model="stock"
              />
              <label class="custom-control-label" for="women_stock">女生</label>
            </div>
          </div>
        </div>
      </div>

      <div class="board-body" v-if="filteredToilets.length">
        <div
          class="board-body__item p-2 border-bottom"
          v-for="item in filteredToilets"
          :key="item.name"
          @click="changePosition('選擇廁所', item)"
        >
          <h2 class="toilet-title h4">{{ item.name }}</h2>
          <p class="text-secondary">{{ item.address }}</p>
          <p class="text-secondary">{{ item.type2 }}</p>
          <div class="d-flex justify-content-around mb-2">
            <div
              class="toilet-num toilet-num__man text-white
              d-flex justify-content-around align-items-center mr-1"
              :class="'bg-toilet-primary'"
            >
              <img
                class="d-inline-block position-relative"
                :src="getAvatar(item.type)"
                width="70"
                alt="toilet-avatar"
                style="top: 2px;"
              />
              {{ 1 }}
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column align-items-center" v-else>
        <img
          class="d-inline-block pt-2 mt-5 mb-3"
          src="@/assets/images/no_toilet.png"
          width="120"
          alt="dog-avatar"
        />
        <p class="h5">抱歉，這區域乎沒有廁所 ...</p>
        <p class="h5">試試搜尋別的地方吧</p>
      </div>
    </div>
    <div id="toilet-map" class="w-100 h-100" :class="{ active: isActive }"></div>
  </div>
</template>

<script>
/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */

import L from 'leaflet';
import 'leaflet.markercluster';
import { format, getDay } from 'date-fns';

export default {
  data() {
    return {
      // 讀取畫面
      isLoading: true,
      // 是否啟用左方導覽版
      isActive: true,
      // 搜尋欄位是否 focus
      isFocus: false,
      // 人物圖片
      avatar: {
        man: require('@/assets/images/face_smile_man4.png'),
        woman: require('@/assets/images/face_smile_woman4.png'),
        friendly: require('@/assets/images/friendly.png'),
        family: require('@/assets/images/businessman_baby.png'),
        accessible: require('@/assets/images/disable.png'),
      },
      // 藥局原始資料
      toilets: [],
      // 台灣縣市名稱原始資料
      county: [],
      /**
       * 選擇的城市名稱與行政區，預設為臺北市中正區
       */
      selectedCity: '臺北市',
      selectedDistrict: '中正區',
      /**
       * date: 日期 YYYY/MM/DD
       * weekDayNum: 星期幾 數字
       * weekDay: 星期幾 文字
       */
      today: {
        date: '',
        weekDayNum: null,
        weekDay: '',
      },
      // 搜尋關鍵字
      searchWord: '',
      // 口罩存量選擇
      stock: [],
    };
  },
  components: {
    Loading: () => import('@/components/Loading'),
    Modal: () => import('@/components/Modal.vue'),
  },
  computed: {
    filteredDistricts() {
      const vm = this;
      let districts = [];
      vm.county.forEach((item) => {
        if (vm.selectedCity === item.CityName) {
          districts = item.AreaList;
        }
      });

      return districts;
    },
    filteredToilets() {
      const vm = this;
      let toilets = [];
      if (vm.stock.length === 0) {
        toilets = vm.toilets.filter(
          (i) => i.country === vm.selectedCity
          && i.city === vm.selectedDistrict,
        );
      } else if (vm.stock.length === 1) {
        toilets = vm.toilets.filter(
          (i) => i.country === vm.selectedCity
          && i.city === vm.selectedDistrict
          && i[vm.stock[0]] > 0,
        );
      } else {
        toilets = vm.toilets.filter(
          (i) => i.country === vm.selectedCity
          && i.city === vm.selectedDistrict
          && i[vm.stock[0]] > 0
          && i[vm.stock[1]] > 0,
        );
      }

      return toilets;
    },
    searchToilets() {
      const vm = this;
      return vm.searchWord === ''
        ? []
        : vm.toilets
          .filter(
            (item) => item.name.includes(vm.searchWord)
                || item.address.includes(vm.searchWord)
                || item.city.includes(vm.searchWord),
          )
          .splice(0, 10);
    },
  },
  methods: {
    getAvatar(type) {
      const vm = this;
      let avatar;
      if (type === '男廁') {
        avatar = vm.avatar.man;
      } else if (type === '女廁') {
        avatar = vm.avatar.woman;
      } else if (type === '無障礙廁所') {
        avatar = vm.avatar.accessible;
      } else if (type === '性別友善廁所') {
        avatar = vm.avatar.friendly;
      } else if (type === '親子廁所') {
        avatar = vm.avatar.family;
      }
      return avatar;
    },
    /**
     * 取得當天的日期
     */
    getToday() {
      const vm = this;
      const date = format(new Date(), 'yyyy-MM-dd');
      vm.today.date = date;

      // 得到當天星期的數字判斷中文日期
      const weekDayNum = getDay(new Date());
      vm.today.weekDayNum = weekDayNum;

      switch (weekDayNum) {
        case 1:
          vm.today.weekDay = '星期一';
          break;
        case 2:
          vm.today.weekDay = '星期二';
          break;
        case 3:
          vm.today.weekDay = '星期三';
          break;
        case 4:
          vm.today.weekDay = '星期四';
          break;
        case 5:
          vm.today.weekDay = '星期五';
          break;
        case 6:
          vm.today.weekDay = '星期六';
          break;
        default:
          vm.today.weekDay = '星期天';
          break;
      }
    },

    /**
     * 取得台灣縣市鎮名稱資料
     */
    getCounty() {
      /**
       * * 等之後開 API 再來用
       */
      // const vm = this;

      // vm.axios.get(`${process.env.VUE_APP_APIPATH}`).then((res) => {
      //   vm.county = res.data;
      // });

      // * 偷懶先用這招
      this.county = require('../public/taiwanCounty.json');
    },

    // 取得藥局圖標與判斷顏色
    getIcon(grade) {
      /**
       * 成人口罩與兒童口罩總數判斷座標顏色
       *
       * sum >= 500 --> Green
       * 200 <= sum < 500 --> Gold
       * 0 < sum < 200 --> Red
       * sum == 0 --> Black
       */
      let iconColor;
      if (grade === '特優級') {
        iconColor = 'gold';
      } else if (grade === '優等級') {
        iconColor = 'green';
      } else {
        iconColor = 'grey';
      }
      // 創建藥局位置圖標
      return new L.Icon({
        iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    },
    // 取得藥局 Popup 資訊
    getToiletPopup(toilet) {
      return `
            <h1 class="h5 font-weight-bold">${toilet.name}</h1>
            <p class="text-secondary mt-0 mb-2"><i class="fas fa-map-marker-alt pr-2" style="padding-left: 2.5px;"></i>${
  toilet.address
}</p>
            <p class="text-secondary mt-0 mb-2"><i class="fal fa-phone-rotary pr-2" style="padding-left: 1.5px;"></i>${
  toilet.type2
}</p>
              <div class="d-flex justify-content-around mb-2">
              <div class="toilet-num toilet-num__man text-white d-flex justify-content-center align-items-center mr-1 ${
  'bg-toilet-primary'}">
                男廁: ${2}
              </div>
              <div class="toilet-num toilet-num__woman text-white d-flex justify-content-center align-items-center ml-1 ${
  'bg-toilet-secondary'}">
                女廁: ${3}
              </div>
            </div>`;
    },

    /**
     * 改變地圖位置至選擇的藥局的地點
     */
    changePosition(type, selectedToilet) {
      const vm = this;
      let toiletPlace;
      /**
       * ! 當選擇的城市改變時，會默認將 filteredDistricts 行政區陣列資料的第一筆資料賦值到 selectedDistrict，否則，行政區的選項第一個會是空白。
       * * 點擊左方藥局欄時，跳出 Popup 視窗。
       */
      if (type === '選擇城市') {
        vm.selectedDistrict = vm.filteredDistricts[0].AreaName;
        [toiletPlace] = vm.filteredToilets;
      } else if (type === '選擇行政區') {
        [toiletPlace] = vm.filteredToilets;
      } else {
        toiletPlace = selectedToilet;

        // iPad 大小以下會收起左方導覽列
        if (window.document.body.clientWidth <= 768) {
          vm.isActive = false;
        }
        const marker = L.marker(
          [toiletPlace.latitude, toiletPlace.longitude],
          vm.getIcon(toiletPlace.grade),
        ).bindPopup(vm.getToiletPopup(toiletPlace), {
          maxWidth: 999,
        });

        // 跳出 Popup 後，移除
        marker.addTo(window.map).openPopup();
        marker.on('popupclose', () => {
          window.map.removeLayer(marker);
        });
      }

      // 如果選擇的行政區沒有藥局，則不移動
      if (vm.filteredToilets.length === 0) return;

      window.map.setView(
        [toiletPlace.latitude, toiletPlace.longitude],
        16,
      );
    },

    /**
     * 如果使用者拒絕提供地理位置，則默認顯示為第一筆藥局位置
     */
    firstLocate() {
      window.navigator.geolocation.watchPosition(() => this.relocate());
    },
    relocate() {
      window.navigator.geolocation.getCurrentPosition((position) => {
        window.map.setView([position.coords.latitude, position.coords.longitude], 16);
      });
    },
    /**
     * 點擊搜尋欄出現下拉選單，再點擊選擇的藥局時，由於 blur 會比 click 還早觸發
     * 所以加 setTimeout 來延遲
     */
    focusOut() {
      const vm = this;
      setTimeout(() => {
        vm.isFocus = false;
      }, 150);
    },
  },
  created() {
    const vm = this;
    vm.getToday();
    vm.getCounty();
  },
  // updated() {
  //   const vm = this;
  //   setTimeout(() => {
  //     vm.isLoading = false;
  //   }, 2000);
  // },
  async mounted() {
    const vm = this;

    // 取得藥局資料
    await vm.axios
      .get('https://raw.githubusercontent.com/wujoe0415/UrgentComfort/master/src/data/combined_output.json')
      .then((res) => {
        vm.toilets = res.data;
      });

    const map = L.map('toilet-map', {
      center: [25.058709, 121.558489],
      zoom: 7,
      minZoom: 7,
      maxBounds: L.latLngBounds(L.latLng(28, 115), L.latLng(20, 127)),
      zoomControl: false,
    });

    vm.relocate();
    // 將 map 設置成全域變數
    window.map = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markers = new L.MarkerClusterGroup().addTo(map);

    // 匯入至地圖中
    for (let i = 0; i < vm.toilets.length; i += 1) {
      // 取得 藥局位置 icon
      const icon = vm.getIcon(vm.toilets[i].grade);
      // vm.setAvatar(toiletman, toiletwoman);
      markers.addLayer(
        L.marker(
          [vm.toilets[i].latitude, vm.toilets[i].longitude],
          {
            icon,
          },
        )
          .bindPopup(vm.getToiletPopup(vm.toilets[i]), {
            maxWidth: 999,
          })
          .openPopup(),
      );
    }

    vm.isLoading = false;
  },
};
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100vh;
  // 避免放大縮小破版
  overflow: hidden;
  font-family: Microsoft JhengHei;
}

$toilet-primary: #73c0d8;
$toilet-secondary: #ffa573;
$toilet-none: #a5a5a5;

.bg-toilet-primary {
  background: $toilet-primary;
}

.bg-toilet-secondary {
  background: $toilet-secondary;
}

.bg-toilet-none {
  background: $toilet-none;
}

#toilet-map {
  transition: all 1s;
  &.active {
    transform: translateX(300px);
    transition: all 0.5s;
  }
}

.board {
  width: 300px;
  height: 100vh;
  box-shadow: 1px 1px 7px 0px rgba(0, 0, 0, 0.5);
  transition: all 1s;
  left: 0;
  top: 0;
  z-index: 999;
  transform: translateX(-300px);
  &.active {
    transform: translateX(-0%);
    transition: all 0.5s;
  }

  &-header {
    // height: 100px;

    &__restriction {
      span {
        color: yellow;
      }
    }

    &__search {
      input {
        // border-radius: 20px;
        // width: 270px;
        height: 30px;
        &::placeholder {
          color: rgba(128, 128, 128, 0.6);
          font-size: 14px;
        }
      }

      .list-group {
        // border-radius: 0 0 20px 20px;
        z-index: 10;
        .list-group-item {
          top: -5px;
          // border-top: 0;
          // border-color: 1px solid #ced4da;
          // border: 0px 1px 1px 1px solid #ced4da !important;
          border-width: 0px 1px 1px 1px;
          border-style: solid;
          border-color: #ced4da;
          // border-bottom: 0;
          &:first-child {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
          }
          .search-list {
            cursor: pointer;

            &:hover {
              background: rgba(115, 192, 216, 0.3);
            }

            &-address {
              font-size: 12px;
            }
          }
        }
      }
    }

    &__select {
      width: 100px;
      height: 35px;
    }
  }

  &-body {
    // 這樣才會出現下拉卷軸
    height: 100%;
    overflow: auto;

    &__item {
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }
}
::-webkit-scrollbar {
  display: none;
}

// 隱藏地圖控制鈕
.leaflet-control-container {
  display: none;
}

.toilet-num {
  width: 120px;
  min-height: 36px;
  border-radius: 16px;
}

.board-btn {
  width: 17px;
  height: 50px;
  background: $toilet-primary;
  border-radius: 0px 5px 5px 0px;
  box-shadow: 2px 3px 6px #00000029;
  right: -26px;
  top: 281px;
}

input[type="text"]:focus {
  box-shadow: none;
  border: 1px solid #ced4da;
}
</style>
