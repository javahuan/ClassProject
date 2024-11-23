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
    timer: null,
  },
  onLoad: function (options) {
    this.setMapHeight();
   this.getMyLocation();
   // this.startAutoLocation();
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
    var monitorTimer = null;
    monitorTimer=setInterval(function () {
      that.getMyLocation();
      that.onSendTap();
    },5000);
    this.setData({timer:monitorTimer});
  },
  onMapLocationTap(e){
    this.getMyLocation();
  },
  onSendTap(e){
    console.log(e);
    let that=this;
    var nowTime =(new Date()).format("yyyy-MM-dd h:m:s");
    var deviceId='2022141460180';
    var gpsTime=nowTime;
    var recvTime=nowTime;
    var longitude=this.data.longitude;
    var latitude=this.data.latitude;
    var altitude=this.data.altitude;
    var speed=this.data.speed;
    var energy=this.data.energy;
    var address=this.data.address;
    var direction=this.data.direction;
    var creator='java';
    var creatorId='2022141460180';
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
        var data={"action":"update_record","sql":sqlInsertRealtime,"db_name":"yjykfsjj2024"};
        that.insertRealtime(url,data);
        var data={"action":"update_record","sql":sqlInsertHistory,"db_name":"yjykfsjj2024"};
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
  }





})