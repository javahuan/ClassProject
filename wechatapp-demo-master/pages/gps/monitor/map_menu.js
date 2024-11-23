Page({
  data: {
  },
  onLoad: function (options) {

  },
  onMapLocationTap(e){
    wx.navigateTo({
      url: 'map_location',
    })
  },
  onMapMonitorTap(e){
    wx.navigateTo({
      url: 'map_monitor',
    })
  },
  onMapTestTap(e){
    wx.navigateTo({
      url: 'map_test',
    })
  },
})