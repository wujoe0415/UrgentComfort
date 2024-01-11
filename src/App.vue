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
    <!-- 新增資料 -->
    <div v-if="isAddingToilet"
    class="position-fixed top-50 start-50 translate-middle w-50 p-3"
    style="width: 400px;">
      <div class="position-absolute top-0 end-0 p-2" style="margin-bottom: 5px;">
        <button type="button"
        @click="hideToiletForm"
        class="btn-close"
        style="font-size: 15px; width: 15%;"
        aria-label="Close"></button>
      </div>
      <form @submit.prevent="addNewToilet">
        <div class="form-group" style="margin-bottom: 5px; margin-top: 50px;">
          <label for="toiletName"
          style="font-size: 20px !important; margin-right: 5px;">名稱</label>
          <input v-model="newToilet.name" type="text"
          style="font-size: 12px; width: 20%"
          id="toiletName" required>
        </div>

        <div class="form-group" style="margin-bottom: 5px;">
          <label for="toiletAddress"
          style="font-size: 20px !important; margin-right: 5px;">地址</label>
          <input v-model="newToilet.address"
          type="text"
          style="font-size: 12px; width: 20%"
          id="toiletAddress" required>
        </div>

        <div class="form-group" style="margin-bottom: 5px;">
          <label for="toiletType2"
          style="font-size: 20px !important; margin-right: 5px;">類別</label>
          <select v-model="newToilet.type2"
          style="font-size: 12px; width: 20%;"
          id="toiletType2" required>
            <option value="醫院">醫院</option>
            <option value="超市">超市</option>
            <option value="公園">公園</option>
            <option value="餐廳">餐廳</option>
            <option value="市場">市場</option>
            <option value="高鐵">高鐵</option>
            <option value="加油站">一般級</option>
            <option value="鐵路局">鐵路局</option>
            <option value="百貨公司">百貨公司</option>
            <option value="捷運車站">捷運車站</option>
            <option value="娛樂場所">娛樂場所</option>
            <option value="森林遊樂區">森林遊樂區</option>
            <option value="各級社教機關">各級社教機關</option>
            <option value="觀光地區及風景區">觀光地區及風景區</option>
            <option value="民眾團體活動場所">民眾團體活動場所</option>
            <option value="文化育樂活動場所">文化育樂活動場所</option>
            <option value="公路車站服務區及休息站">公路車站服務區及休息站</option>
            <option value="寺廟教堂等宗教活動場所">寺廟教堂等宗教活動場所</option>
            <option value="公家機關設置供民眾使用者">公家機關設置供民眾使用者</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 5px;">
          <label for="toiletGrade"
          style="font-size: 20px !important; margin-right: 5px;">評級</label>
          <select v-model="newToilet.grade"
          style="font-size: 12px; width: 20%"
          id="toiletGrade" required>
            <option value="特優級">特優級</option>
            <option value="優等級">優等級</option>
            <option value="一般級">一般級</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 5px;">
          <label for="toiletCountry"
          style="font-size: 20px !important; margin-right: 5px;">縣市</label>
          <input v-model="newToilet.country"
          type="text"
          style="font-size: 12px; width: 20%"
          id="toiletCountry" required>
        </div>

        <div class="form-group" style="margin-bottom: 5px;">
          <label for="toiletCity"
          style="font-size: 20px !important; margin-right: 5px;">鄉鎮</label>
          <input v-model="newToilet.city"
          type="text"
          style="font-size: 12px; width: 20%"
          id="toiletCity" required>
        </div>

        <div class="form-group" style="margin-bottom: 5px;">
          <label for="toiletVillage"
          style="font-size: 20px !important; margin-right: 5px;">村里</label>
          <input v-model="newToilet.village"
          type="text"
          style="font-size: 12px; width: 20%"
          id="toiletVillage" required>
        </div>

        <div class="form-group" style="margin-bottom: 5px;">
          <label for="toiletLatitude"
          style="font-size: 20px !important; margin-right: 5px;">緯度</label>
          <input v-model="newToilet.latitude"
          type="text"
          style="font-size: 12px; width: 20%"
          id="toiletLatitude" required>
        </div>

        <div class="form-group" style="margin-bottom: 5px;">
          <label for="toiletLongitude"
          style="font-size: 20px !important; margin-right: 5px;">經度</label>
          <input v-model="newToilet.longitude"
          type="text"
          style="font-size: 12px; width: 20%"
          id="toiletLongitude" required>
        </div>

        <div class="form-group" style="margin-bottom: 5px;">
          <label for="toiletType"
          style="font-size: 20px !important; margin-right: 5px; margin-bottom: 40px;">性別</label>
          <select v-model="newToilet.type"
          style="font-size: 12px; width: 20%"
          id="toiletType" required>
            <option value="男廁">男廁</option>
            <option value="女廁">女廁</option>
            <option value="親子廁所">親子廁所</option>
            <option value="性別友善廁所">性別友善廁所</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary"
        style="margin-right: 5px; font-size: 15px; width: 15%;">新增廁所</button>
        <button type="button" @click="hideToiletForm"
        class="btn btn-secondary"
        style="font-size: 15px; width: 15%;">取消</button>
      </form>
    </div>
    <!--    導覽列     -->
    <!-- sidebar -->
    <div class="board position-absolute bg-white" :class="{ active: isActive }" v-else>
      <!--close or open sidebar-->
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
        <!--下拉式-->
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
                :key="item.name"
              >
                <div class="search-list p-2" @click="changePosition('選擇地點', item)">
                  <p class="search-list-name mb-0 h5">{{ item.name }}</p>
                  <p class="search-list-address text-secondary mb-0">
                    {{ item.address }}
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
                value="men"
                v-model="stock"
              />
              <label class="custom-control-label" for="men_stock">男廁</label>
            </div>

            <div class="custom-control custom-checkbox custom-control-inline mr-0">
              <input
                type="checkbox"
                class="custom-control-input"
                id="women_stock"
                value="women"
                v-model="stock"
              />
              <label class="custom-control-label" for="women_stock">女廁</label>
            </div>
          </div>
        </div>
      </div>
      <!-- toilets under -->
      <div class="board-body" v-if="filteredToilets.length">
        <!--toilets under the search bar-->
        <div
          class="board-body__item p-2 border-bottom"
          v-for="item in filteredToilets"
          :key="item.name"
          @click="changePosition('選擇廁所', item)"
        >
          <h2 class="toilet-title h4">{{ item.name }}</h2>
          <p class="text-secondary">{{ item.address }}</p>
          <p class="text-secondary">{{ item.type2 }}</p>
          <button @click.stop="deleteToilet(item.name)" class="delete-button">刪除</button>
          <div class="d-flex justify-content-around mb-2">
            <div
              class="toilet-num toilet-num__man text-white
              d-flex justify-content-around align-items-center mr-1"
              :class="'bg-toilet-primary'"
            >
              <img
                class="d-inline-block position-relative"
                :src="getAvatar(item.type)"
                width="65"
                alt="toilet-avatar"
                style="top: 2px;"
              />
              {{ item.type }}
            </div>
          </div>
        </div>
      </div>
      <!-- no toilets -->
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
    <button v-if="!isAddingToilet" @click="showToiletForm"
    class="btn btn-primary btn-add-toilet">
      新增廁所
    </button>
    <div id="toilet-map" class="w-100 h-100" :class="{ active: isActive }"></div>
  </div>
</template>

<style lang="scss">
  .btn-add-toilet {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
    font-size: 16px; /* Adjust the font size */
    padding: 8px 12px; /* Adjust the padding */
    border-radius: 8px; /* Adjust the border radius */
  }
</style>

<script>
/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */

import L from 'leaflet';
import 'leaflet.markercluster';
import { format, getDay } from 'date-fns';
import axios from 'axios';

export default {
  data() {
    return {
      // 讀取畫面
      isLoading: false,
      // 是否啟用左方導覽版
      isActive: true,
      // 搜尋欄位是否 focus
      isFocus: false,
      isAddingToilet: false,
      // 人物圖片
      avatar: {
        man: require('@/assets/images/face_smile_man4.png'),
        woman: require('@/assets/images/face_smile_woman4.png'),
        friendly: require('@/assets/images/friendly.png'),
        family: require('@/assets/images/businessman_baby.png'),
        accessible: require('@/assets/images/disable.png'),
      },
      // 廁所原始資料
      toilets: [],
      // 台灣縣市名稱原始資料
      county: [],
      /*
       * 選擇的城市名稱與行政區，預設為臺北市中正區
       */
      selectedCity: '臺北市',
      selectedDistrict: '中正區',
      /*
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
      newToilet: {
        name: '',
        address: '',
        type2: '',
        grade: '',
        country: '',
        city: '',
        village: '',
        latitude: '',
        longitude: '',
        type: '',
      },
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
          && ((vm.stock[0] === 'men' && (i.type === '男廁' || i.type === '混合廁所'))
            || (vm.stock[0] === 'women' && (i.type === '女廁' || i.type === '混合廁所'))),
        );
      } else {
        toilets = vm.toilets.filter(
          (i) => i.country === vm.selectedCity
          && i.city === vm.selectedDistrict
          && (i.type === '男廁' || i.type === '女廁' || i.type === '混合廁所'),
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
    // 刪除廁所
    deleteToilet(toiletId) {
      const toiletName = toiletId;
      if (!toiletId) {
        alert('刪除失敗: 未提供廁所ID');
        return;
      }
      if (!window.confirm(`確定要刪除 ID 為 ${toiletId} 的廁所嗎？`)) {
        return;
      }
      axios.delete(`http://localhost:3001/api/taiwan_toilets/${encodeURIComponent(toiletName)}`)
        .then(() => {
        // If the deletion is successful, update the local state
          this.toilets = this.toilets.filter((toilet) => toilet.id !== toiletId);
          alert('公廁刪除成功！');
        })
        .catch((error) => {
          console.error('刪除失敗', error);
          alert('刪除公廁失敗！');
        });
    },

    // 新增廁所
    showToiletForm() {
      this.isAddingToilet = true;
    },
    hideToiletForm() {
      this.isAddingToilet = false;
    },
    addNewToilet() {
      const { newToilet } = this;
      this.toilets.push(newToilet);
      console.log('Updated Toilets Array:', this.toilets);
      this.newToilet = {
        name: '',
        address: '',
        type2: '',
        grade: '',
        country: '',
        city: '',
        village: '',
        latitude: '',
        longitude: '',
        type: '',
      };
      this.hideToiletForm();
      this.axios.post('http://localhost:3001/api/taiwan_toilets', newToilet)
        .then((response) => {
          console.log('Toilet added successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error adding toilet:', error);
        });
      const icon = this.getIcon(newToilet.grade);
      const marker = L.marker([newToilet.latitude, newToilet.longitude], { icon })
        .bindPopup(this.getToiletPopup(newToilet), { maxWidth: 999 })
        .openPopup();
      window.map.markers.addLayer(marker);
    },
    getAvatar(type) {
      const vm = this;
      let avatar;
      if (type === '男廁') {
        avatar = vm.avatar.man;
      } else if (type === '女廁') {
        avatar = vm.avatar.woman;
      } else if (type === '無障礙廁所') {
        avatar = vm.avatar.accessible;
      } else if (type === '親子廁所') {
        avatar = vm.avatar.family;
      } else {
        avatar = vm.avatar.friendly;
      }

      return avatar;
    },
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
    getCounty() {
      this.county = require('../public/taiwanCounty.json');
    },

    // 取得圖標與判斷顏色
    getIcon(grade) {
      let iconColor;
      if (grade === '特優級') {
        iconColor = 'gold';
      } else if (grade === '優等級') {
        iconColor = 'green';
      } else {
        iconColor = 'grey';
      }
      return new L.Icon({
        iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    },
    // 取得 Popup 資訊
    getToiletPopup(toilet) {
      return `
            <h1 class="h5 font-weight-bold">${toilet.name}</h1>
            <p class="text-secondary mt-0 mb-2"><i class="fas fa-map-marker-alt pr-2" style="padding-left: 2.5px;"></i>${
  toilet.address
}</p>
            <p class="text-secondary mt-0 mb-2"><i class="fal fa-building pr-2" style="padding-left: 1.5px;"></i>${
  toilet.type2
}</p>`;
    },
    changePosition(type, selectedToilet) {
      const vm = this;
      let toiletPlace;

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

      if (vm.filteredToilets.length === 0) return;

      window.map.setView(
        [toiletPlace.latitude, toiletPlace.longitude],
        16,
      );
    },

    /**
     * 如果使用者拒絕提供地理位置，則默認顯示為第一筆廁所位置
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
     * 點擊搜尋欄出現下拉選單，再點擊選擇的廁所時，由於 blur 會比 click 還早觸發
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
  async mounted() {
    const vm = this;
    await vm.axios
      .get('http://localhost:3001/api/taiwan_toilets')
      .then((res) => {
        vm.toilets = res.data;
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
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
      // 取得 廁所位置 icon
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
    window.map.markers = new L.MarkerClusterGroup().addTo(window.map);
    for (let i = 0; i < vm.toilets.length; i += 1) {
      const icon = vm.getIcon(vm.toilets[i].grade);
      window.map.markers.addLayer(
        L.marker(
          [vm.toilets[i].latitude, vm.toilets[i].longitude],
          { icon },
        )
          .bindPopup(vm.getToiletPopup(vm.toilets[i]), { maxWidth: 999 })
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
