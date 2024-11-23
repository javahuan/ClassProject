var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
const util = require('../../../utils/util.js');
// 生成 QQMapWX 实例
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: 'RAMBZ-UKXW6-FZOSO-M6ENO-RCTTE-THFBQ'
});

Page({
  data: {
    longitude:104,
    latitude:30,
    scale:15,
    direction:0,
    speed:0,
    address:'',
    accuracy:0,
    altitude:0,
    energy:0,
    markers:{},
    showControlPanel:true,
    //以上是地图用的
    //marker的信息 开始
    markerDeviceId:'未知',
    markerName:'',
    markerLongitude:0,
    markerLatitude:0,
    markerSpeed:0,
    markerGpsTime:'',
    showDialog: false,
    mapId:'map',
    //marker的信息 结束
    timer: null,
    monitorTimer:null,
  },
  onLoad: function (options) {
    this.setMapHeight();
    this.getMyLocation();
    //this.startAutoLocation();
    this.startAutoMonitor();
  },
  setMapHeight(){
    var that = this;
    wx.getSystemInfo({        //地图全屏显示-https://www.likecs.com/show-203386963.html
      success: function(res) {
        that.setData({
          height: res.windowHeight    //wxml的map的style="width: 100%; height: {{height}}px;"，就可以用这个
        })
      },
    })
  },
  getMyLocation(){
    let that = this
    wx.getLocation({
      type: 'wgs84',    //gcj02
      success(res) {
        console.log(res);
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
        that.getAddress(res.longitude,res.latitude);
      },
      fail(res){
        console.log(res);
      }
    })
  },
  startAutoLocation(){
    let that=this;
    this.data.timer = null;
    var t=setInterval(function () {
      that.getMyLocation();
      that.onSendTap();
    },5000);
    this.setData({timer:t});
  },
  onMapLocationTap(e){
    this.getMyLocation();
  },
  //这个monitor里面实际上没有这个触发器
  onSendTap(e){
    console.log(e);
    let that=this;
    var nowTime =(new Date()).format("yyyy-MM-dd h:m:s");
    var deviceId='GPS00000001';
    var gpsTime=nowTime;
    var recvTime=nowTime;
    var longitude=this.data.longitude;
    var latitude=this.data.latitude;
    var altitude=this.data.altitude;
    var speed=this.data.speed;
    var energy=this.data.energy;
    var address=this.data.address;
    var direction=this.data.direction;
    var creator='管理员';
    var creatorId='20080000000000002';
    var createTime=nowTime;
    //构造SQL语句
    var sqlDeleteRealtime="delete from gps_realtime where device_id='"+deviceId+"'";
    var sqlInsertRealtime="insert into gps_realtime(device_id,device_type,gps_time,recv_time,longitude,latitude,altitude,location,direction,speed,energy,data_source,coordinate_type,creator,creator_id,create_time)";
    sqlInsertRealtime=sqlInsertRealtime+" values('"+deviceId+"','mobile','"+gpsTime+"','"+recvTime+"','"+longitude+"','"+latitude+"','"+altitude+"','"+address+"','"+direction+"','"+speed+"','"+energy+"','xcx','baidu','"+creator+"','"+creatorId+"','"+createTime+"')";
    var sqlInsertHistory="insert into gps_history(device_id,device_type,gps_time,recv_time,longitude,latitude,altitude,location,direction,speed,energy,data_source,coordinate_type,creator,creator_id,create_time)";
    sqlInsertHistory=sqlInsertHistory+" values('"+deviceId+"','mobile','"+gpsTime+"','"+recvTime+"','"+longitude+"','"+latitude+"','"+altitude+"','"+address+"','"+direction+"','"+speed+"','"+energy+"','xcx','baidu','"+creator+"','"+creatorId+"','"+createTime+"')";
    var url="https://www.ylxteach.net/teach-demo/device_file_servlet_action";
    console.log(sqlDeleteRealtime);
    console.log(sqlInsertRealtime);
    console.log(sqlInsertHistory);
    wx.request({
      url: url,
      data:{"action":"update_record","sql":sqlDeleteRealtime,"db_name":"yjykfsjj2024"},
      header: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest",},
      success:function(res){
        var data={"action":"update_record","sql":sqlInsertRealtime};
        that.insertRealtime(url,data);
        var data={"action":"update_record","sql":sqlInsertHistory};
        that.insertHistory(url,data);
      },
      faile:function(res){
        wx.showToast({
          title: '执行操作发生错误：'+res,
          icon:'none',
        })
      },
    })
  },
  insertRealtime(url,data){
    let that=this;
    wx.request({
      url: url,
      data:data,
      header: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest",},
      success:function(res){
        wx.showToast({
          title: '成功完成添加实时数据到远程服务器！',
          icon:'none',
        })
      },
      fail:function(res){
        wx.showToast({
          title: '执行操作发生错误：'+res,
          icon:'none',
        })
      },
    })
  },
  insertHistory(url,data){
    let that=this;
    wx.request({
      url: url,
      data:data,
      header: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest",},
      success:function(res){
        wx.showToast({
          title: '成功完成添加历史数据到远程服务器！',
          icon:'none',
        })
      },
      fail:function(res){
        wx.showToast({
          title: '执行操作发生错误：'+res,
          icon:'none',
        })
      },
    })
  },
  getAddress(longitude,latitude) {
    let that=this;
    console.log("[getAddress]经度："+longitude+"，纬度："+latitude);
    // reverseGeocoder 为 QQMapWX 解析 经纬度的方法
    qqmapsdk.reverseGeocoder({
      location: {latitude,longitude},
      success(res) {
        console.log('success', res);
        that.setData({
          address:res.result.address,
        });
      },
      fail(res){
        console.log('faile',res);
      }
    });
  },
  getDeviceStatus(){
    //console.log("==================================");
    let that = this;
    var url = "https://www.ylxteach.net/teach-demo/device_file_servlet_action";
    var sql = "select * from gps_realtime order by gps_time";
    var data = { "action": "query_record", "sql": sql,"db_name":"demo" };
    wx.request({
      url: url,
      data: data,
      header: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest", },
      success(res) {
        console.log("[getDeviceStatus]访问远程服务器成功。" + JSON.stringify(res));
        that.showMarkers(res.data);
      },
      fail(res) {
        console.log("[getDeviceStatus]访问远程服务器失败。");
      },
    })
  },
  onQueryTap(e){
    this.getDeviceStatus();
  },
  showMarkers(data){
    let list = data.aaData;
    let markers = [];
    for (var i = 0; i < list.length; i++) {
      var record = list[i];
      var point = {"id":i,"deviceId":record.device_id,"speed":record.speed,"gpsTime":record.gps_time,"longitude": record.longitude, "latitude": record.latitude };
      var marker = this.createMarker(point);
      markers.push(marker);
    }
    this.setData({
      markers: markers,
    });
  },
  createMarker(point) {
    let latitude = point.latitude;
    let longitude = point.longitude;
    let marker = {
      //iconPath: "../../assets/module/img/gps/marker_a.png",   //32*47
      iconPath: "../../../images/gps/maintain_man_32px_normal.png",   //32*32
      id: point.id || 0,
      deviceId:point.deviceId,
      speed:point.speed,
      gpsTime:point.gpsTime,
      name: point.name || point.deviceId,
      latitude: latitude,
      longitude: longitude,
      width: 32,
      height: 32,
      label: {
        content: point.name,
        color: '#22ac38',
        fontSize: 14,
        bgColor: "#fff",
        borderRadius: 30,
        borderColor: "#22ac38",
        borderWidth: 1,
        padding: 3
      },
      callout: {
        content: point.name,
        fontSize: 0,
      }
    };
    return marker;
  },
  markertap(e){
    console.log(e);
    var open=!this.data.showDialog;
    var id = e.detail.markerId;
    console.log(id);
    console.log(this.data.markers[id]);
    var m=this.data.markers[id];
    var name = this.data.markers[id].name;
    this.setData({
      markerDeviceId: m.deviceId,
      markerSpeed:m.speed,
      markerGpsTime:m.gpsTime,
      markerName: name,
      markerLongitude:m.longitude,
      markerLatitude:m.latitude,
      showDialog: open,
    })
  },
  toggleDialog: function () {
    this.setData({
      showDialog: false,
    })
  },
  startAutoMonitor(){
    let that=this;
    this.data.monitorTimer = null;
    var t=setInterval(function () {
      that.getDeviceStatus();
    },10000);//10s
    this.setData({monitorTimer:t});
  },
})
