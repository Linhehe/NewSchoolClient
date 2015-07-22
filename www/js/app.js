// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directive', 'ionic.service.core', 'ionic.service.deploy'])

.run(function($ionicPlatform,jpushService,$state,$cookies,$ionicPopup,$ionicDeploy) {

        // Check for updates
        $ionicDeploy.check().then(function(response) {
                // response will be true/false
                if (response) {
                    // Download the updates
                    $ionicDeploy.download().then(function() {
                        // Extract the updates
                        $ionicDeploy.extract().then(function() {
                            // Load the updated version
                            $ionicDeploy.load();
                        }, function(error) {
                            // Error extracting
                        }, function(progress) {
                            // Do something with the zip extraction progress
                            $scope.extraction_progress = progress;
                        });
                    }, function(error) {
                        // Error downloading the updates
                    }, function(progress) {
                        // Do something with the download progress
                        $scope.download_progress = progress;
                    });
                }
            },
            function(error) {
                // Error checking for updates
            });

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
      //推送初始化
      var setTagsWithAliasCallback=function(event){
          //window.alert('result code:'+event.resultCode+' tags:'+event.tags+' alias:'+event.alias);
      }
      var openNotificationInAndroidCallback=function(data){
          var json=data;
          if(typeof data === 'string'){
              json=JSON.parse(data);
          }
          var id=json.extras['cn.jpush.android.EXTRA'].id;
          if($cookies.user){
              $state.go('index_tab.announ');
          }else{
              $ionicPopup.alert({
                  template:'请先登录账号！'
              })
              $state.go('login');
          }
          //if($cookies.teacher){
          //    $state.go('teacher_tabs.personcenter');
          //}else{
          //    $state.go('login');
          //}

      }
      var onOpenNotification = function(event){
          var alertContent;
          if(device.platform == "Android"){
              alertContent=window.plugins.jPushPlugin.openNotification.alert;
          }else{
              window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
              alertContent   = event.aps.alert;
              if($cookies.user){
                  $state.go('index_tab.announ');
              }else{
                  $ionicPopup.alert({
                      template:'请先登录账号！'
                  })
                  $state.go('login');
              }
          }
          //alert("open Notificaiton:"+alertContent);
      }
      // push notification callback
      var notificationCallback = function(data) {

          var notification = angular.fromJson(data);
          //app 是否处于正在运行状态
          var isActive = notification.notification;

          // here add your code


          //ios
          if (ionic.Platform.isIOS()) {
              window.alert(notification);

          } else {
              //非 ios(android)
          }
      };
      var receiveMessage = function (data) {
          window.alert('_receiveMessageIniOSCallback: ' + data);
          //do something
      };
      var config={
          stac:onOpenNotification,
          oniac:openNotificationInAndroidCallback
      };
      jpushService.init(config,onOpenNotification);

  });

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicAppProvider) {

        // Identify app
        $ionicAppProvider.identify({
            // The App ID for the server
            app_id: '3f36068f',
            // The API key all services will use for this app
            api_key: 'bd7d8d53c711cfaafb0d27a126262b53548067ab4efd3231'
        });

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
      //登录页面
      .state('login',{
          //cache: false,
        url:'/login',
        templateUrl:'templates/login.html',
        controller:'LoginCtrl'
      })
      //注册页面
      .state('register',{
        url:'/register',
        templateUrl:'templates/register.html',
        controller:'RegisterCtrl'
      })
      //注册页面--手机验证
      .state('registerPhone',{
          url:'/registerPhone',
          templateUrl:'templates/register_Phone.html',
          controller:'RegisterPhoneCtrl'
      })
      //首页TAB
      .state('index_tab',{
        url:"/index_tab",
        abstract:true,
        templateUrl:"templates/index-tab.html"
      })

      //通知公告
      .state('index_tab.announ',{
          url:'/announ',
          views:{
              'index_tab-announ':{
                  templateUrl:'templates/index-tab-announcements.html',
                  controller:'AnnounCtrl'
              }
          }
      })
      // 注册一个班级消息的页面
      .state('myclass', {
          url: '/myclass',
          templateUrl: 'templates/tab-myclass.html',
          controller: 'myclassCtrl'
      })
      .state('message',{
          url:'/message',
          templateUrl:'templates/class_message.html',
          controller:'MessageCtrl'

      })
      //致新生的一封信
      .state('letter', {
          url: 'letter',
          templateUrl: 'templates/letter.html',
          controller: 'LetterCtrl'
      })

      //学习九宫格页面
      .state('index_tab.check', {
          url: '/check',
          views: {
              'index_tab-check': {
                  templateUrl: 'templates/index_tab-check.html',
                  controller: 'CheckCtrl'
              }
          }
      })
      //个人信息页面
      .state('index_tab.information', {
          url: '/information',
          views: {
              'tab-information': {
                  templateUrl: 'templates/tab-information.html',
                  controller: 'InformationCtrl'
              }
          }
      })
    //查询页面
    .state('query', {
      url: '/query',
      templateUrl: 'templates/tab-query.html',
      controller: 'QueryCtrl'
    })
    //查询结果页面
      .state('results',{
        url:'/results',
        templateUrl:'templates/query-results.html',
        controller:'ResultsCtrl'
      })

    //宿舍选择页面
    .state('dormitory', {
        url: '/dormitory',
        templateUrl: 'templates/tab-dormitory.html',
        controller: 'DormitoryCtrl'
      })





      // 教师角色
      .state('teacher_tabs',{
          url: "/teacher_tabs",
          abstract: true,
          templateUrl: "templates/teacher_tabs.html"
      })
      //教师平台九宫格
      .state('teacher_tabs.teacher_terrace',{
          url:'/teacher_terrace',
          views:{
              'teacher_terrace':{
                  templateUrl:'templates/Teacher_terrace.html',
                  controller:'TeacherTerraceCtrl'
              }
          }
      })
      //教师-消息通知
      .state('teacher_tabs.inforcenter',{
          url:'/inforcenter',
          views:{
              'teacher_inforcenter':{
                  templateUrl:'templates/teacher_tab-inforCenter.html',
                  controller: 'InforCenterCtrl'
              }
          }
      })
      //教师-消息通知-消息详情
      .state('infor-contents', {
          url: '/inforCenter/:chatId',
          templateUrl: 'templates/infor-contents.html',
          controller: 'InforContentCtrl'
      })
      //教师平台个人中心
      .state('teacher_tabs.personcenter',{
        url:'/presoncenter',
          views:{
              'teacher_preson':{
                  templateUrl:'templates/teacher_tab-personCenter.html',
                  controller:'PersonCenterCtrl'
              }
          }
        })
      .state('changepassword',{
          url:'/changepassword',
          templateUrl:'templates/changepassword.html',
          controller:'ChangePasswordCtrl'
      })
      // 个人中心-编辑
      .state('teacher-information-edit', {
          url: '/personCenter/teacher-information-edit',
          templateUrl: 'templates/teacher-information-edit.html',
          controller: 'TeacherInformationEditCtrl'
      })
      //教师平台－学院
      .state('plat-college',{
          url:'/teacher_terrace/plat-college',
          templateUrl: 'templates/plat-college.html',
          controller: 'PlatCollegeCtrl'
      })
      // 教师平台-专业查看
      .state('plat_profession', {
          url: '/teacher_terrace/plat-college/:collegeId',
          templateUrl: 'templates/plat-profession.html',
          controller: 'PlatprofessionCtrl'
      })
      // 教师平台-班级查看
      .state('plat_class', {
          url: '/teacher_terrace/plat-college/:collegeId/:professionId',
          templateUrl: 'templates/plat-class.html',
          controller: 'PlatclassCtrl'
      })

      // 教师平台-班级查看-班级成员
      .state('plat-class-stus', {
          url: '/teacher_terrace/plat-college/:collegeId/:professionId/:classId',
          templateUrl: 'templates/plat-class-stus.html',
          controller: 'PlatClassStusCtrl'
      })

      //教师平台-班级查看-班级成员-详细内容
      .state('teacher_classmember',{
          url:'/teacher_terrace/plat-college/:collegeId/:professionId/:classId/:StudentID',
          templateUrl:'templates/teacher_classmember.html',
          controller:'ClassMemberCtrl'
      })

      // 教师平台-信息发送
      .state('plat_information', {
          url: '/information',
          templateUrl: 'templates/plat-information.html',
          controller: 'PlatInformationCtrl'
      })

      // 教师平台-数据统计(tab)
      .state('statistics_tab', {
          url: "/statistics_tab",
          abstract: true,
          templateUrl: "templates/statistics_tabs.html"
      })

      // 教师平台-数据统计(tab)-报道统计
      .state('statistics_tab.report', {
          url: '/report',
          views: {
              'tab-report': {
                  templateUrl: 'templates/statistics-report.html',
                  controller: 'StaReportCtrl'
              }
          }
      })

      // 教师平台-数据统计(tab)-缴费统计
      .state('statistics_tab.pay', {
          url: '/pay',
          views: {
              'tab-pay': {
                  templateUrl: 'templates/statistics-pay.html',
                  controller: 'StaPayCtrl'
              }
          }
      })

      //查询数据
      .state('checkStatistics', {
          url: '/checkStatistics',
          templateUrl: 'templates/query-data.html',
          controller: 'CheckStatisticsCtrl'
      })

      //
      // 通知公告
      //
      .state('college_tab', {
          url: "/college_tab",
          abstract: true,
          templateUrl: "templates/college_tabs.html"
      })
      // 学院简介
      .state('college_tab.collegeProfile', {
          url: "/collegeProfile",
          views: {
              'tab-collegeProfile': {
                  templateUrl: 'templates/college_tab-collegeProfile.html',
                  controller: 'CollegeProfileCtrl'
              }
          }
      })
      // 专业简介
      .state('college_tab.professionalProfile', {
          url: "/professionalProfile",
          views: {
              'tab-professionalProfile': {
                  templateUrl: 'templates/college_tab-professionalProfile.html',
                  controller: 'ProfessionalProfileCtrl'
              }
          }
      })
      // 学院公告
      .state('college_tab.collegeBulletin', {
          url: "/collegeBulletin",
          views: {
              'tab-collegeBulletin': {
                  templateUrl: 'templates/college_tab-collegeBulletin.html',
                  controller: 'CollegeBulletinCtrl'
              }
          }
      })
      // 学院公告-详细内容
      .state('college_tab.infor-contents', {
          url: '/collegeBulletin/:chatId',
          views: {
              'tab-collegeBulletin': {
                  templateUrl: 'templates/college_tab-collegeBulletin-content.html',
                  controller: 'CollegeInforContentCtrl'
              }
          }
      })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');

        $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
        $ionicConfigProvider.navBar.alignTitle("center"); //Places them at the bottom for all OS
        $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
        $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
        $ionicConfigProvider.tabs.position('bottom');
});
