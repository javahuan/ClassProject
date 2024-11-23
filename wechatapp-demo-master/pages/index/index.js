//index.js
//获取应用实例
// var app = getApp();
Page({
  data: {
    indexmenu:[],
    imgUrls: []
  },
  onLoad:function(){
    //生命周期函数--监听页面加载
    this.fetchData();
    // var that = this
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
  },
  fetchData:function(){
    this.setData({
      indexmenu:[
        {
          'icon':'./../../images/icon_01.png',
          'text':'众创空间',
          'url':'space',
          'urlfloder': 'space'
        },
        {
          'icon':'./../../images/icon_03.png',
          'text':'服务集市',
          'url':'service',
          'urlfloder':'service'
        },
        {
          'icon':'./../../images/icon_05.png',
          'text':'会议室预定',
          'url':'conference',
          'urlfloder':'conference'
        },
        {
          'icon':'./../../images/icon_07.png',
          'text':'云资源申请',
          'url':'resource',
          'urlfloder':'resource'
        },
        {
          'icon':'./../../images/icon_09.png',
          'text':'园区问问',
          'url':'question',
          'urlfloder':'question'
        },
        {
          'icon':'./../../images/icon_11.png',
          'text':'物业服务',
          'url':'property',
          'urlfloder':'property'
        },
        {
          'icon':'./../../images/icon_13.png',
          'text':'入驻申请',
          'url':'apply',
          'urlfloder':'apply'
        },
        {
            'icon':'./../../images/icon_23.png',
            'text':'微信CRUD',
            'url':'file_list',
            'urlfloder':'device/file'
          },
          {
            'icon':'./../../images/icon_25.png',
            'text':'全局地图',
            'url':'map',
            'urlfloder':'map'
          }, 
          {
            'icon':'./../../images/icon_27.png',
            'text':'木鱼',
            'url':'dong_dong',
            'urlfloder':'dong_dong'
          },
          {
            'icon':'./../../images/icon_29.png',
            'text':'图片上传',
            'url':'uploadpic',
            'urlfloder':'uploadpic'
          },
          {
            'icon':'./../../images/icon_11.png',
            'text':'地图定位',
            'url':'map_menu',
            'urlfloder':'gps/monitor'
          },
      ],
      imgUrls: [
        '../../images/banner_02.jpg',
        //这两网址已经失效了
        '../../images/banner_02.jpg',
        '../../images/banner_02.jpg',
        // 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        // 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
      ]
    })
  },
  //这个函数其实没用到
  changeRoute:function(url,urlfloder){
    console.log(url);
    wx.navigateTo({
      url: `../${urlfloder}/${url}`,
    })
    console.log(url);
  },
  onReady:function(){
    //生命周期函数--监听页面初次渲染完成
    // console.log('onReady');
  },
  onShow :function(){
    //生命周期函数--监听页面显示
    // console.log('onShow');
  },
  onHide :function(){
    //生命周期函数--监听页面隐藏
    // console.log('onHide');
  },
  onUnload :function(){
    //生命周期函数--监听页面卸载
    // console.log('onUnload');
  },
  onPullDownRefresh:function(){
    //页面相关事件处理函数--监听用户下拉动作
    // console.log('onPullDownRefresh');
  },
  onReachBottom:function(){
    //页面上拉触底事件的处理函数
    // console.log('onReachBottom');
  }
})
