var app = getApp()

Page({
    data: {
        map_width: 0,
        map_height: 0
    }
    //show current position
    ,
    onLoad: function (options) {
            console.log(options.schedule_id);
            var that = this;
            // 获取定位，并把位置标示出来
            that.setData({
                //中心位置
                longitude: 104.00019534554679,
                latitude: 30.55674337645168,
                markers: [{
                    id: 0,
                    // iconPath:,缺省就会用默认的
                    //marker位置30.55674337645168, 104.00019534554679
                    longitude: 104.00019534554679,
                    latitude: 30.55674337645168,
                    width: 30,
                    height: 30
                }]
            })
            //set the width and height
            // 动态设置map的宽和高
            wx.getSystemInfo({
                success: function (res) {
                    console.log(res.windowWidth);
                    that.setData({
                        map_width: res.windowWidth,
                        map_height: res.windowHeight,
                        controls: [{
                            id: 1,
                            iconPath: 'map/imgs/biaoxing.png',
                            position: {
                                left: res.windowWidth / 2 - 8,
                                top: res.windowWidth / 2 - 16,
                                width: 30,
                                height: 30
                            },
                            clickable: true
                        }]
                    })
                }
            })
        }
        //获取中间点的经纬度，并mark出来
        ,
    getLngLat: function () {
        var that = this;
        this.mapCtx = wx.createMapContext("map4select");
        this.mapCtx.getCenterLocation({
            success: function (res) {
                that.setData({
                    map_width: res.windowWidth,
                    map_height: res.windowHeight,
                    longitude: 104.006277,
                    latitude: 30.562702,
                    markers: [{
                        id: 0,
                        iconPath: "imgs/biaoxingfill.png",
                        longitude: 103.99990566697949,
                        latitude: 30.556891198427074,
                        width: 30,
                        height: 30
                    }]
                })
            }
        })
    },
    regionchange(e) {
        // 地图发生变化的时候，获取中间点，也就是用户选择的位置
        if (e.type == 'end') {
            this.getLngLat()
        }
    },
    markertap(e) {
        console.log(e)
    }
})