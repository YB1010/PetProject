// pages/register/register.js

/* 由于采用了授权登录，注册页面目前被废弃 */
// 获取数据库的引用 (默认数据库)
const db = wx.cloud.database()
const _ = db.command
const admin = db.collection('userinfo')
// 获取输入用户名和密码
let name = null;
let password = null; 

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 输入用户名
  inputusrname(event){
    name = event.detail
    console.log(name)
  },

  // 输入密码
  inputpassword(event) {
    password = event.detail
    console.log(password)
  },  

  // 点击注册
  register(){
    // 获取页面初始数据？
    let that = this

    // 查询是否已注册
    admin.where({
      username: _.eq(name)
    })
      .get({
        success: (res) => {
          if(res.data.length === 0){
            console.log(res.data)
            that.saveuserinfo() 
          }
          else{
            // https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html
            wx.showToast({
              title: '账号已注册！',
              icon:'none',
              duration: 2500
            })
          }
        }
      }) 
  },

  // 注册用户
  saveuserinfo() {
    //let that = this
    //添加数据
    admin.add({ 
      // // data 字段表示需新增的 JSON 数据
      // data: {
      //   // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
      //   description: "learn cloud database",
      //   due: new Date("2018-09-01"),
      //   tags: [
      //     "cloud",
      //     "database"
      //   ],
      //   // 为待办事项添加一个地理位置（113°E，23°N）
      //   location: new db.Geo.Point(113, 23),
      //   done: false
      // },
      data: {
        username: name,
        password: password
      },
      success: (res) => {
        console.log('注册成功！')
        wx.showToast({
          title: '注册成功！',
          icon: 'success',
          duration: 3000,
          // 延迟执行跳转
          success(data) {
            setTimeout(function () {
              wx.navigateTo({
                url: '../main/main'
              })
            }, 3000) //延迟时间
          }
        })
      }
    })      
  },
})