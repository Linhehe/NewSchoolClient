var param = function (obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for (name in obj) {
        value = obj[name];

        if (value instanceof Array) {
            for (i = 0; i < value.length; ++i) {
                subValue = value[i];
                fullSubName = name + '[' + i + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
            }
        }
        else if (value instanceof Object) {
            for (subName in value) {
                subValue = value[subName];
                fullSubName = name + '[' + subName + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
            }
        }
        else if (value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
};

angular.module('starter.controllers', ['ionic','chart.js','ngCookies'])

    //登录页面控制器
        .controller('LoginCtrl',function($scope,$state,$http,$ionicPopup,$ionicLoading,$timeout,$cookies,jpushService){
            var stualia = 'stualia';
            var teaalia = 'teaalia';
            $scope.display = 'none';
            $scope.check = function(){
                if($scope.display == 'none'){
                    $scope.display = ' '
                }else( $scope.display = 'none')
            };
            console.log('$cookies.user = '+$cookies.user);
            console.log('$cookies.teacher = '+$cookies.teacher);
            $scope.register = function(){
                $state.go('registerPhone');
            };

            $scope.user = {phone: '13726224169', password: '123', usertype: '学生'};

            $scope.choose = function(value){
                if(value == '教师'){
                    $scope.user = {phone: '18676007857', password: '123', usertype: '教师'};
                } else{
                    $scope.user = {phone: '13726224169', password: '123', usertype: '学生'};
                }
            };

            // 登陆按钮
            $scope.login = function(){
                //
                if($scope.user.phone != '' && $scope.user.password != ''){
                        $ionicLoading.show({
                            templateUrl: 'templates/loadingPage.html'
                        });
                        $http.get('http://120.24.208.184:3000/login', {params:{usertype: $scope.user.usertype, registerPhone: $scope.user.phone, password: $scope.user.password, username: $scope.user.phone}})
                            .success(function (data) {
                                if(data == 'error'){
                                    $ionicPopup.alert({
                                        title: '警告',
                                        template: '请输入正确的手机号和密码!'
                                    });
                                }
                                else if(data == 'haveLogin'){
                                    $ionicPopup.alert({
                                        title: '警告',
                                        template: '该账号已处于登陆状态'
                                    });
                                }
                                else{
                                    if($scope.user.usertype == '学生'){
                                        $cookies.user = $scope.user.phone;
                                        var stuAlias = data.ProfessionId+"_"+data.Clazz;
                                        jpushService.setTagsWithAlias(['StudentsTags'],stuAlias);
                                        $state.go('index_tab.check');
                                    }else{
                                        $cookies.teacher = $scope.user.phone;
                                        $cookies.CollegeName = "全校";
                                        jpushService.setTags(['TeachersTags']);
                                        $state.go('teacher_tabs.teacher_terrace');
                                    }
                                }
                            }).error(function () {
                                $timeout(function () {
                                    $ionicPopup.alert({
                                        title: '抱歉~',
                                        template: '网络不给力...'
                                    });
                                    $ionicLoading.hide();
                                }, 30000);
                            }).then(function () {
                                $ionicLoading.hide();
                            });
                    }
                else{
                    if($scope.user.phone == '' && $scope.user.password != '' ){
                        $ionicPopup.alert({
                            title: '警告',
                            template: '手机号不能为空!'
                        });
                    }
                    if($scope.user.password == '' && $scope.user.phone != '' ){
                        $ionicPopup.alert({
                            title: '警告',
                            template: '密码不能为空!'
                        });
                    }

                    if($scope.user.phone == '' && $scope.user.password == '' ){
                        $ionicPopup.alert({
                            title: '警告',
                            template: '手机号和密码不能为空!'
                        });
                    }
                    if( $scope.user.phone == '' && $scope.user.password == ''){
                        $ionicPopup.alert({
                            title: '警告',
                            template: '请输入相应的信息!'
                        });
                    }
                }
            }

        })
    //注册页面控制器
    .controller('RegisterCtrl',function($scope,$state,$ionicPopup,$ionicLoading,$http,$cookies,$timeout){
                // 上一步按钮
                $scope.lastFoot = function () {
                    $state.go('registerPhone');
                }
                //************
                $scope.user = {registerPhone: '13726224169', ID_card: '445221199608181250', password: '123', code: ''};
                // 确定按钮(注册)
                $scope.register = function(){
                    if($scope.user.check_password == $scope.user.password){
                        //
                        $http({
                            url: 'http://120.24.208.184:3000/sessions',
                            method: "POST",
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            data: param({ID_card: $scope.user.ID_card, password: $scope.user.password, registerPhone: $cookies.phone})
                        }).success(function(data){
                            //
                            //
                            if(data == 'phone'){
                                //
                                $ionicPopup.alert({
                                    title: '警告',
                                    template: '该身份证号码已被注册，请直接登录'
                                })
                            }
                            if(data == 'idcard'){
                                //
                                $ionicPopup.alert({
                                    title: '警告',
                                    template: '请输入正确的身份证号码'
                                })
                            }
                            if(data == 'success'){
                                //
                                $ionicPopup.alert({
                                    title: '恭喜',
                                    template: '注册成功'
                                });
                                $state.go('login');
                            }
                        }).error(function(){
                            $timeout(function () {
                                $ionicPopup.alert({
                                    title: '抱歉~',
                                    template: '网络不给力...'
                                });
                                $ionicLoading.hide();
                            }, 30000);
                        })
                    } else{
                        //
                        $ionicPopup.alert({
                            title: '警告',
                            template: '前后两次输入的密码不同'
                        });
                    }
                }

            })

    //
    .controller('RegisterPhoneCtrl', function($scope,$state,$http,$ionicLoading,$ionicPopup,$cookies,$timeout){
        //
        $scope.back = function(){
            $state.go('login');
        }
        $scope.user = {registerPhone: '13726224169', code: ''};
        // 获取验证码
        $scope.getCode = function () {
            $ionicLoading.show({
                templateUrl: 'templates/loadingPage.html'
            });
            $http.get('http://120.24.208.184:3000/code', {params:{phone: $scope.user.registerPhone}})
                .success(function(data){
                    //
                    if(data == 'success'){
                        $ionicPopup.alert({
                            title: '注意',
                            template: '验证码已发送到您的手机，请注意查收!'
                        });
                    }
                    if(data == 'error'){
                        $ionicPopup.alert({
                            title: '抱歉',
                            template: '验证码发送失败，请重新获取!'
                        });
                    }
                }).error(function(data){
                    //
                    $timeout(function () {
                        $ionicPopup.alert({
                            title: '抱歉~',
                            template: '网络不给力...'
                        });
                        $ionicLoading.hide();
                    }, 30000);
                }).then(function(){
                    //
                    $ionicLoading.hide();
                });
        };
        // 下一步按钮
        $scope.nextFoot = function () {
            //
            if($scope.user.registerPhone == '' && $scope.user.code != ''){
                $ionicPopup.alert({
                    title: '警告',
                    template: '请输入手机号码'
                });
            }
            if($scope.user.code == '' && $scope.user.registerPhone != ''){
                $ionicPopup.alert({
                    title: '警告',
                    template: '请输入验证码'
                });
            }
            if($scope.user.registerPhone == '' && $scope.user.code == ''){
                $ionicPopup.alert({
                    title: '警告',
                    template: '请输入手机号码和验证码'
                });
            }
            if($scope.user.registerPhone != '' && $scope.user.code != ''){
                // 验证验证码
                $ionicLoading.show({
                    templateUrl: 'templates/loadingPage.html'
                });
                //
                $http({
                    url: 'http://120.24.208.184:3000/codecheck',
                    method: "POST",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: param({phone: $scope.user.registerPhone, codes: $scope.user.code})
                }).success(function(data){
                    //
                    if(data == 'success'){
                        //
                        $cookies.phone = $scope.user.registerPhone;
                        $state.go('register');
                        //
                    }else{
                        //
                        $ionicPopup.alert({
                            title: '警告',
                            template: '请输入正确的验证码或者重新获取验证码'
                        })
                    }
                }).error(function(){
                    $timeout(function(){
                        $ionicPopup.alert({
                            title: '抱歉~',
                            template: '网络不给力...'
                        });
                        $ionicLoading.hide();
                    });
                }).then(function(){
                    $ionicLoading.hide();
                });
            }
        };
        // 取消按钮
        $scope.back = function () {
            $state.go('login');
        };
    })

    //信的控制器
    .controller('LetterCtrl', function ($scope,$state,$http,$ionicLoading,$ionicPopup,$cookies,$timeout) {
        $ionicLoading.show({
            templateUrl: 'templates/loadingPage.html'
        });
        $http.get('http://120.24.208.184:3000/letter', {params:{user: $cookies.user}})
            .success(function(data){
                //
                //alert(data.content);
                $scope.letter = data;
            }).error(function(){
                //
                $timeout(function(){
                    $ionicPopup.alert({
                        title: '抱歉~',
                        template: '网络不给力...'
                    });
                    $ionicLoading.hide();
                }, 30000);
            }).then(function(){
                //
                $ionicLoading.hide();
            });

        $scope.back = function(){
            $state.go ('index_tab.check');
        };
    })
    //消息通知页面控制器
    .controller('AnnounCtrl',function($scope,$state,$ionicPopup,$http,$cookies,$ionicLoading,$timeout){
        //
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            //
            $ionicLoading.show({
                templateUrl: 'templates/loadingPage.html'
            });
            $http.get('http://120.24.208.184:3000/messageGet', {params:{user: $cookies.user}})
                .success(function(data){
                    //
                    $scope.message = data;
                    //
                }).error(function () {
                    //
                    $timeout(function(){
                        $ionicPopup.alert({
                            title: '抱歉~',
                            template: '网络不给力...'
                        });
                        $ionicLoading.hide();
                    }, 30000);
                }).then(function(){
                    $ionicLoading.hide();
                });
        });
        //
        $scope.doRefresh = function(){
            $ionicLoading.show({
                templateUrl: 'templates/loadingPage.html'
            });
            $http.get('http://120.24.208.184:3000/messageGet', {params:{user: $cookies.user}})
                .success(function(data){
                    //
                    $scope.message = data;
                    //
                }).error(function () {
                    //
                    $timeout(function(){
                        $ionicPopup.alert({
                            title: '抱歉~',
                            template: '网络不给力...'
                        });
                        $ionicLoading.hide();
                    }, 30000);
                }).then(function () {
                    //
                    $ionicLoading.hide();
                    //$ionicPopup.alert({
                    //    title: '提示',
                    //    template: '刷新成功'
                    //});
                });
            $scope.$broadcast('scroll.refreshComplete');
        };
        //通过posts来定义字典数组，并设置upvotes的值
        $scope.posts = [{upvotes:0}];
        //定义增加点击增加的方法，传递的参数为post
        $scope.addUpvotes = function(post) {
            //实现数值增加
            post.upvotes += 1;
        };
        //定义一个获取时间的方法
        $scope.date = new Date();

        $scope.myGoBack = function () {
            $state.go('index_tab.announ');
        };
    })
    .controller('CheckCtrl',function($scope,$state){
        //缴费查询按钮事件
        $scope.query = function (){
            $state.go('query');
        }
        //选择宿舍按钮事件
        $scope.dorm = function (){
            $state.go('dormitory');
        }
        //致新生的一封信按钮事件
        $scope.inform = function (){
            $state.go('letter');
        }
    })

    //这是新生报到查询缴费页面
    .controller('QueryCtrl', function($scope,$state,$ionicPopup,$ionicLoading,$http,$cookies) {
        $scope.user = {select:'445221199608181250'};
        //
        $scope.query = function() {
            if ($scope.user.select != '') {
                $ionicLoading.show({
                    templateUrl: 'templates/loadingPage.html'
                });
                $http.get('http://120.24.208.184:3000/check', {
                    params: {
                        select: $scope.user.select,
                        user: $cookies.user
                    }
                })
                    .success(function (data) {
                        if(data == 'true') {
                            $cookies.IDcard = $scope.user.select;
                            //$state.go('results');
                            //
                            $http({
                                url: 'http://120.24.208.184:3000/checkPay',
                                method: "POST",
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                data: param({IdCode: $scope.user.select})
                            }).success(function(data){
                                // 学费金额
                                $scope.HaveToPay = data.FeePayable;
                                // 还需交的钱
                                $scope.NeedToPay = data.UnpaidFees;
                                //if(data == 0){
                                //    $ionicPopup.alert({
                                //        title: '恭喜',
                                //        template: '您已缴费，请尽快选择宿舍入住'
                                //    })
                                //} else{
                                //    $ionicPopup.alert({
                                //        title: '警告',
                                //        template: '您还未缴费!!'
                                //    })
                                //}
                            }).error(function(){
                                //
                            }).then();
                        }
                        else{
                            $ionicPopup.alert({
                                title: '警告',
                                template: '请输入正确的身份证号码'
                            });
                        }
                    }).error(function () {
                        $timeout(function () {
                            $ionicPopup.alert({
                                title: '抱歉~',
                                template: '网络不给力...'
                            });
                            $ionicLoading.hide();
                        }, 30000);
                    }).then(function () {
                        $ionicLoading.hide();
                    });
            }else{
                $ionicPopup.alert({
                    title: '警告',
                    template: '请输入身份证号码'
                });
            }
        };
        //
        $scope.back = function (){
            $state.go('index_tab.check');
        };
    })

    //查询缴费结果页面
    .controller('ResultsCtrl',function($scope,$state,$http,$cookies){
        //
        $http.get('http://120.24.208.184:3000/checkone',{
            params:{
                selects: $cookies.IDcard
            }
        })
            .success(function(data){
                //
                $scope.student = data;
                //
                if(data.isPay == true){
                    $scope.isPay = "已缴费"
                }
                else{
                    $scope.color='#e42012';
                    $scope.isPay = "未缴费";
                }
            });
        //
        $scope.gotab=function(){
            $state.go('query');
        };
    })
    //选择宿舍页面
    .controller('DormitoryCtrl', function($scope,$state,$ionicPopup,$http,$ionicLoading,$window,$cookies,$timeout) {
        //
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            //
            $http({
                url: 'http://120.24.208.184:3000/DormCheckPay',
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: param({user: $cookies.user})
            }).success(function(data){
                //
                if(data == 0){
                    $http.get('http://120.24.208.184:3000/ProfessionIdGet', {params:{registerPhone: $cookies.user}})
                        .success(function(data){
                            //
                            $cookies.userInformation = data;
                            //
                            $http.get('http://120.24.208.184:3000/dorm', {params: {ProfessionId: data}})
                                .success(function(data2){
                                    //
                                    //$ionicPopup.alert({
                                    //    template: data
                                    //});
                                    $scope.users = data2;
                                });
                            //
                        }).error(function(){
                            //
                        }).then();
                    //
                    $http.get('http://120.24.208.184:3000/isChoose', {params:{user: $cookies.user}})
                        .success(function(data){
                            //
                            if(data){
                                //
                                $ionicPopup.alert({
                                    //
                                    template: '你已经选择了宿舍，不能再选了'
                                });
                                $scope.bgcolor = "#cccccc";
                                //$scope.choosed = data;
                            }else{
                                $scope.canChose = true;
                            }
                        }).error().then();
                    //
                    $scope.getval = function(value){
                        //
                        $ionicLoading.show({
                            templateUrl: 'templates/loadingPage.html'
                        });
                        $http.get('http://120.24.208.184:3000/isChoose', {params:{user: $cookies.user}})
                            .success(function(data){
                                //
                                if(data){
                                    //
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        //
                                        template: '你已经选择了宿舍，不能再选了'
                                    });
                                }else{
                                    //
                                    $http.get('http://120.24.208.184:3000/room', {params:{_id: value}})
                                        .success(function(data){
                                            //
                                            $ionicLoading.hide();
                                            //
                                            if(data.OrderDorm != 0){
                                                $ionicPopup.confirm({
                                                    title:'警告',
                                                    template:'确定入住?（一旦确定不可更改）'+data.OrderDorm,
                                                    cancelText:'取消',
                                                    okText:'确定'
                                                }).then(function(res){
                                                    if(res == true){
                                                        $ionicLoading.show({
                                                            templateUrl: 'templates/loadingPage.html'
                                                        });
                                                        $http.get('http://120.24.208.184:3000/update', {params:{_id: value, phone: $cookies.user}})
                                                            .success(function(data){
                                                                //
                                                                $ionicLoading.hide();
                                                                //
                                                                $scope.choosed = data;
                                                                //
                                                                $ionicPopup.alert({
                                                                    title: '恭喜',
                                                                    template: '您已经成功入住'+data.DormNumber
                                                                }).then(function(){
                                                                    $window.location.reload();
                                                                })
                                                            }).then(function(){
                                                                //
                                                            });
                                                    }else{
                                                        //
                                                    }
                                                });
                                            }else{
                                                //
                                                $ionicPopup.alert({
                                                    title: '抱歉',
                                                    template: '该宿舍已住满'
                                                })
                                            }
                                        }).error().then(function(){
                                            //
                                        });
                                }
                            }).error().then();
                        //

                    }
                } else{
                    $ionicPopup.alert({
                        title: '警告',
                        template: '您还未缴费, 还不能选择宿舍'
                    })
                }
            }).error(function(){
                //
                $timeout(function () {
                    $ionicPopup.alert({
                        title: '抱歉~',
                        template: '网络不给力...'
                    });
                    $ionicLoading.hide();
                }, 30000);
            }).then(function(){
                $ionicLoading.hide();
            });
        });

        $scope.back = function (){
            $state.go('index_tab.check');
        }

        $scope.doRefresh = function(){
            $ionicLoading.show({
                templateUrl: 'templates/loadingPage.html'
            });
            $http.get('http://120.24.208.184:3000/dorm', {params: {ProfessionId: $cookies.userInformation}})
                .success(function(data){
                    //
                    $scope.users = data;
                    //
                }).error(function(){
                    //
                    $timeout(function () {
                        $ionicPopup.alert({
                            title: '抱歉~',
                            template: '网络不给力...'
                        });
                        $ionicLoading.hide();
                    }, 30000);
                }).then(function(){
                    //$ionicPopup.alert({
                    //    title: 'Succeed',
                    //    template: '刷新成功'
                    //});
                    $ionicLoading.hide();
                });
            $scope.$broadcast('scroll.refreshComplete');
        }

    })
    //个人信息页面控制器

    //*****************
    .controller('InformationCtrl', function($scope,$ionicPopup,$http,$state,$cookies,$ionicLoading,$timeout) {
        //
        var user = $cookies.user;
        //
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            //
            $ionicLoading.show({
                templateUrl: 'templates/loadingPage.html'
            });
            //
            $http.get('http://120.24.208.184:3000/stuone',{
                params:{
                    registerPhone: $cookies.user
                }
            })
                .success(function(data){
                    $scope.student = data;
                    //
                    $http.get('http://120.24.208.184:3000/stuoneArea', {params:{AreaId: data.AreaId}})
                        .success(function(data2){
                            //
                            $scope.student.AreaId = data2.AreaName;
                        });
                    //
                    $http.get('http://120.24.208.184:3000/stuoneSex', {params:{user: $cookies.user}})
                        .success(function(data3){
                            //
                            if(data3 == 0){
                                $scope.student.Sex = '女';
                            } else{
                                $scope.student.Sex = '男';
                            }
                        }).error(function(){
                            //
                        }).then();
                    //
                    $http.get('http://120.24.208.184:3000/studentIsReport', {params:{user: $cookies.user}})
                        .success(function(data4){
                            //
                            if(data4 == 0){
                                $scope.recolor='#e42012';
                                $scope.student.IsRegister = '未报道';
                            } else{
                                $scope.student.IsRegister = '已报道';
                            }
                        }).error(function(){
                            //
                        }).then();
                    //
                }).error(function(){
                    $timeout(function () {
                        $ionicPopup.alert({
                            title: '抱歉~',
                            template: '网络不给力...'
                        });
                        $ionicLoading.hide();
                    }, 30000);
                }).then(function(){
                    $ionicLoading.hide();
                });
        });
        //

        $scope.cancellation = function() {
            $ionicPopup.confirm({
                title:'警告',
                template:'确定注销当前账号吗？',
                cancelText:'取消',
                okTexet:'确定'
            }).then(function(res){
                if(res == true){
                    delete $cookies["user"];
                    delete $cookies["phone"];
                    delete $cookies["IDcard"];
                    delete $cookies["userInformation"];
                    $state.go('login');
                }else{

                }
            });
        }

    })
    //*****************



//创建我的班级页面的控制器
    //创建我的班级页面的控制器
    .controller('myclassCtrl', function($scope,$http,$state,$cookies,$ionicPopup) {


        $scope.classmessage = {
            text:'欢迎各位新同学的加入！'
        };
        //通过posts来定义字典数组，并设置upvotes的值
        $scope.posts = [{upvotes:0}];
        //定义增加点击增加的方法，传递的参数为post
        $scope.addUpvotes = function(post) {
            //实现数值增加
            post.upvotes += 1;
        };
        //定义一个获取时间的方法
        $scope.date = new Date();

        $scope.myGoBack = function () {
           $state.go('index_tab.announ');
        };
    })
    //消息详情控制器
    .controller('MessageCtrl',function($scope,$state,$ionicPopup){
        $scope.back = function(){
            $state.go('index_tab.announ');
        }
        $scope.reply = function(){
            $scope.data ={}
            var replyPopup = $ionicPopup.show({
                template:'<input type="text" maxlength="15" ng-model="data.replytext">',
                title:'请输入您要回复的话',
                subTitle:"最多输入15个字",
                scope:$scope,
                buttons:[
                    {text:'取消'},
                    {
                        text:'<b>发送</b>',
                        type:'button-positive',
                        onTap:function(e){
                            if(!$scope.data.replytext){
                            }else{
                                return $scope.data.replytext;
                            }
                        }
                    }
                ]
            })
            replyPopup.then(function(res){
                console.log('Tapped!',res);
            });
        }
    })


    //教师平台九宫格
    .controller('TeacherTerraceCtrl',function($scope,$state){
        //班级查看按钮事件
        $scope.class = function (){
            $state.go('plat-college');
        }
        //信息发送按钮事件
        $scope.information_sent = function (){
            $state.go('plat_information');
        }
        //数据统计按钮事件
        $scope.Data_statistics = function (){
            $state.go('statistics_tab.report');
        }
    })

// 教师-教师平台
    .controller('TeacherPlatformCtrl', function ($scope,Plats,$stateParams) {
        //
        $scope.plats = Plats.all();
        $scope.remove = function(plat) {
            Plats.remove(plat);
        }
        $scope.plat = Plats.get($stateParams.chatId);
    })


    //教师－教师平台－学院
    .controller('PlatCollegeCtrl', function ($scope,$stateParams,$state,$http,$timeout,$ionicLoading) {

        $ionicLoading.show({
            templateUrl: 'templates/loadingPage.html'
        });
        $http.get('http://120.24.208.184:3000/colleges')
            .success(function(data){
                $scope.colleges = data;
            }).error(function(){
                $timeout(function () {
                    $ionicPopup.alert({
                        title: '抱歉~',
                        template: '网络不给力...'
                    });
                    $ionicLoading.hide();
                }, 30000);
            }).then(function(){
                $ionicLoading.hide();
            });
        $scope.back = function(){
            $state.go('teacher_tabs.teacher_terrace');
        }
    })


    // 教师-教师平台-专业查看
    .controller('PlatprofessionCtrl', function ($scope,$stateParams,$state,$http,$ionicLoading,$timeout,$ionicPopup) {
        //将上一个页面传递的ID值传递到aa中
        $scope.aa = $stateParams.collegeId;
        //将上一个页面点击识别的ID传递到后台寻找数据
        $ionicLoading.show({
            templateUrl: 'templates/loadingPage.html'
        });
        $http.get('http://120.24.208.184:3000/professions', {
            params:{CollegeId: $stateParams.collegeId}})
            .success(function(data){
                $scope.professions = data;
            }).error(function(){
                $timeout(function () {
                    $ionicPopup.alert({
                        title: '抱歉~',
                        template: '网络不给力...'
                    });
                    $ionicLoading.hide();
                }, 30000);
            }).then(function(){
                $ionicLoading.hide();
            });
        $scope.back = function(){
            $state.go('teacher_tabs.teacher_terrace');
        }
    })
    // 教师-教师平台-班级查看
    .controller('PlatclassCtrl', function ($scope,$stateParams,$state,$http,$ionicPopup,$ionicLoading,$timeout) {
        $scope.bb = $stateParams.professionId;
        //创建一个空数组
        $scope.array = [];
        $ionicLoading.show({
            templateUrl: 'templates/loadingPage.html'
        });
        $http.get('http://120.24.208.184:3000/classes',{
            params:{
                ProfessionId: $stateParams.professionId
            }
        })
            .success(function(data){
                for(var i=1; i<=data[0].Classes; i++){
                    $scope.array.push(i);
                }
                $scope.classes = $scope.array;
                $scope.ProfessionName = data[0].ProfessionName;
                $scope.ProfessionId = data[0].ProfessionId;
            }).error(function(){
                $timeout(function () {
                    $ionicPopup.alert({
                        title: '抱歉~',
                        template: '网络不给力...'
                    });
                    $ionicLoading.hide();
                }, 30000);
            }).then(function(){
                $ionicLoading.hide();
            });
    })
    // 教师-教师平台-班级查看-班级成员
    .controller('PlatClassStusCtrl', function ($http,$scope,$stateParams,$ionicPopup,$ionicLoading,$timeout) {

        $scope.cc = $stateParams.classId;

        $scope.Clazz = $stateParams.classId.split(",")[0];
        $scope.ProfessionId = $stateParams.classId.split(",")[1];

        $ionicLoading.show({
            templateUrl: 'templates/loadingPage.html'
        });
        $http.get('http://120.24.208.184:3000/students', {
            params:{
                Clazz:$scope.Clazz,
                ProfessionId:$scope.ProfessionId
            }
        })
            .success(function(data){
                $scope.students = data;
            }).error(function(){
                $timeout(function () {
                    $ionicPopup.alert({
                        title: '抱歉~',
                        template: '网络不给力...'
                    });
                    $ionicLoading.hide();
                }, 30000);
            }).then(function(){
                $ionicLoading.hide();
            });

    })
    //教师-教师平台-班级查看-班级成员-成员详情页面
    .controller('ClassMemberCtrl',function($scope,$stateParams,$http,$ionicLoading,$timeout,$ionicPopup){

        $ionicLoading.show({
            templateUrl: 'templates/loadingPage.html'
        });
        $http.get('http://120.24.208.184:3000/student', {
            params:{StudentID: $stateParams.StudentID}})
            .success(function(data){
                $scope.student = data;
                //
                $http.get('http://120.24.208.184:3000/studentDorm', {params:{DormId: data.DormId}})
                    .success(function(data2){
                        //
                        $scope.DormNumber = data2
                    }).error(function(){
                        //
                    }).then();
                //
                $http.get('http://120.24.208.184:3000/studentArea', {params:{AreaId: data.AreaId}})
                    .success(function(data2){
                        //
                        $scope.AreaName = data2;
                    }).error(function(){
                        //
                    }).then();
            }).error(function(){
                $timeout(function () {
                    $ionicPopup.alert({
                        title: '抱歉~',
                        template: '网络不给力...'
                    });
                    $ionicLoading.hide();
                }, 30000);
            }).then(function(){
                $ionicLoading.hide();
            });
    })
    // 教师-教师平台-信息发送
    .controller('PlatInformationCtrl', function ($scope,$state,$ionicPopup,$filter,$http,$ionicLoading,$timeout) {
        //
        $scope.college_display = 'none';
        $scope.profession_display = 'none';
        $scope.banji_display = 'none';

        $scope.college_check = function(){
            if($scope.college_display == 'none'){
                $scope.college_display = ' '
            }else( $scope.college_display = 'none')
        }
        $scope.profession_check = function(){
            if($scope.profession_display == 'none'){
                $scope.profession_display = ' '
            }else( $scope.profession_display = 'none')
        }
        $scope.banji_check = function(){
            if($scope.banji_display == 'none'){
                $scope.banji_display = ' '
            }else( $scope.banji_display = 'none')
        }
        //$scope.array = [];
        $scope.school = {college: '', profession: '', banji: ''};
        //
        $scope.professionChoose = function(value){
            //
            $ionicLoading.show({
                templateUrl: 'templates/loadingPage.html'
            });
            $http.get('http://120.24.208.184:3000/checkProfessionId', {params: {ProfessionName: value}})
                .success(function(data){
                    //
                    $scope.ProfessionChoose = data;
                    //alert('ProfessionIdCheck = '+data);
                }).error(function(){
                    //
                    $timeout(function () {
                        $ionicPopup.alert({
                            title: '抱歉~',
                            template: '网络不给力...'
                        });
                        $ionicLoading.hide();
                    }, 30000);
                }).then(function(){
                    $ionicLoading.hide();
                });
            //
            $http.get('http://120.24.208.184:3000/getClassNumber', {params:{ProfessionName: value}})
                .success(function(data){
                    //
                    var array1 = [];
                    for(var i=1; i<= data; i++){
                        array1.push(i);
                    }
                    $scope.array = array1;
                }).error(function(){
                    //
                    $timeout(function () {
                        $ionicPopup.alert({
                            title: '抱歉~',
                            template: '网络不给力...'
                        });
                        $ionicLoading.hide();
                    }, 30000);
                }).then(function(){
                    $ionicLoading.hide();
                });
        }
        //
        $scope.banjiChooose = function(value){
            //alert(value);
            $scope.ClassChoose = value;
        }
        //
        $scope.message = {title: '', content: '', banji: '计算机学院'};
        //
        $scope.colleges = {
            "计算机学院": [],
            "经管学院": [],
            "外国语学院": [],
            "人文学院": [],
            "建工学院": [],
            "机电学院": [],
            "艺术设计学院": [],
            "财金学院": [],
            "体育系": []
        };
        //
        $scope.change = function(value){
            //$ionicPopup.alert({
            //    template: value
            //});
            $http.get('http://120.24.208.184:3000/getProfession', {params:{CollegeName: value}})
                .success(function(data){
                    //
                    //$scope.computer = data;
                    $scope.colleges = {
                        "计算机学院": data,
                        "经管学院": data,
                        "外国语学院": data,
                        "人文学院": data,
                        "建工学院": data,
                        "机电学院": data,
                        "艺术设计学院": data,
                        "财金学院": data,
                        "体育系": data
                    };
                    //$ionicPopup.alert({
                    //    template: data
                    //});
                });
        };
        //
        $scope.send = function(){
            //
            $ionicLoading.show({
                templateUrl: 'templates/loadingPage.html'
            });
            $scope.nowtime = new Date();
            $scope.nowtime = $filter('date')($scope.nowtime, "yyyy/MM/dd HH:mm");
            //
            if($scope.ClassChoose == undefined){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: '抱歉',
                    template: '请选择接收班级'
                });
            } else{
                if($scope.message.title != '' && $scope.message.content != ''){
                    console.log($scope.nowtime);
                    $http({
                        url: 'http://120.24.208.184:3000/messageSend',
                        method: "POST",
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        data: param({classname: $scope.message.banji, title: $scope.message.title, content: $scope.message.content, time: $scope.nowtime, ProfessionId: $scope.ProfessionChoose, Clazz: $scope.ClassChoose})
                    }).success(function (data) {
                        //
                        if(data == 'succeed'){
                            $ionicPopup.alert({
                                title:'Sucssed',
                                template: '发送成功'
                            })
                        }
                    }).error(function () {
                        //
                        $timeout(function(){
                            $ionicPopup.alert({
                                title: '抱歉~',
                                template: '网络不给力...'
                            });
                            $ionicLoading.hide();
                        }, 30000);
                    }).then(function(){
                        $ionicLoading.hide();
                    });
                }else{
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: '警告',
                        template: '请输入标题和信息'
                    })
                }
            }
        }
        $scope.cancel = function(){
            //
            $scope.message = {title: '', content: ''};
        }
        //$scope.cancel = function(){
        //    $state.go('teacher_terrace');
        //}
        //$scope.oksend = function(){
        //    $ionicPopup.alert({
        //        title: '提示',
        //        template: '发送成功！'
        //    });
        //}
        $scope.back = function(){
            $state.go('teacher_tabs.teacher_terrace');
        }


    })
    // 教师-教师平台-数据统计
    .controller('PlatStatisticsCtrl', function ($scope) {
        //

    })


    // 教师-教师平台-数据统计-报道统计
    .controller('StaReportCtrl', function ($scope,$state,$window,$http,$cookies,$timeout,$ionicLoading,$ionicPopup) {
        //
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            //
            $scope.back = function(){
                $state.go('teacher_tabs.teacher_terrace');
            };

            $scope.check = function(){
                $state.go('checkStatistics');
            };
            //
            if($cookies.CollegeName == '全校'){
                //
                $scope.title = $cookies.CollegeName;
                // 全校 未报道
                $http.get('http://120.24.208.184:3000/statistics', {params: {CollegeName: '全校', IsPay: 0}})
                    .success(function(data){
                        //
                        $scope.noreport = data;
                        // 全校 已报道
                        $http.get('http://120.24.208.184:3000/statistics', {params: {CollegeName: '全校', IsPay: 1}})
                            .success(function(data){
                                //
                                $scope.reported = data;
                            }).error(function(){
                                //
                                $timeout(function(){
                                    $ionicPopup.alert({
                                        title: '抱歉~',
                                        template: '网络不给力...'
                                    });
                                    $ionicLoading.hide();
                                },30000);
                            }).then(function(){
                                //
                                $ionicLoading.hide();
                                $scope.reported_bfb = $scope.reported/($scope.reported+$scope.noreport)*100;
                                $scope.noreport_bfb = $scope.noreport/($scope.reported+$scope.noreport)*100;
                                //*************************
                                $scope.data = [$scope.reported/($scope.reported+$scope.noreport), $scope.noreport/($scope.reported+$scope.noreport)];
                                $scope.colours = ['#507bee','#ec4f79'];
                                $scope.labels = ["已报道", "未报道"];
                            });
                    }).error(function(){
                        //
                        $timeout(function(){
                            $ionicPopup.alert({
                                title: '抱歉~',
                                template: '网络不给力...'
                            });
                            $ionicLoading.hide();
                        },30000);
                    }).then(function(){
                        //
                        $ionicLoading.hide();
                    });
            } else{
                if($cookies.ProfessionName == '全院'){
                    //
                    $scope.title = $cookies.CollegeName;
                    //
                } else{
                    //
                    $scope.title = $cookies.ProfessionName;
                }
                //$ionicLoading.show({
                //    templateUrl: 'templates/loadingPage.html'
                //});
                //查询已报道人数
                $http.get('http://120.24.208.184:3000/checkIsReport', {params:{CollegeName: $cookies.CollegeName, ProfessionName: $cookies.ProfessionName, IsPay: 1}})
                    .success(function(data){
                        //
                        $scope.reported = data;
                        // 查询未报道人数
                        $http.get('http://120.24.208.184:3000/checkIsReport', {params:{CollegeName: $cookies.CollegeName, ProfessionName: $cookies.ProfessionName, IsPay: 0}})
                            .success(function(data){
                                //
                                $scope.noreport = data;
                                //
                            }).error(function(){
                                $timeout(function(){
                                    $ionicPopup.alert({
                                        title: '抱歉~',
                                        template: '网络不给力...'
                                    });
                                    $ionicLoading.hide();
                                },30000);
                            }).then(function(){
                                $ionicLoading.hide();
                                $scope.reported_bfb = $scope.reported/($scope.reported+$scope.noreport)*100;
                                $scope.noreport_bfb = $scope.noreport/($scope.reported+$scope.noreport)*100;
                                //*************************
                                $scope.data = [$scope.reported/($scope.reported+$scope.noreport), $scope.noreport/($scope.reported+$scope.noreport)];
                                $scope.colours = ['#507bee','#ec4f79'];
                                $scope.labels = ["已报道", "未报道"];
                            });
                        //
                    }).error(function(){
                        $timeout(function(){
                            $ionicPopup.alert({
                                title: '抱歉~',
                                template: '网络不给力...'
                            });
                            $ionicLoading.hide();
                        },30000);
                    }).then(function(){
                        $ionicLoading.hide();
                    });
            }
            //$scope.title = $cookies.ProfessionName;
            ////
            //
            ////alert($cookies.ProfessionId);
            //
            //// 已注册
            //$http.get('http://10.0.1.5:3000/countIsReports', {params:{ProfessionId: $cookies.ProfessionId}})
            //    .success(function(data){
            //        //
            //        $scope.reported = data;
            //        //
            //        $http.get('http://10.0.1.5:3000/countNoReports', {params:{ProfessionId: $cookies.ProfessionId}})
            //            .success(function(data){
            //                //
            //                $scope.noreport = data;
            //                //
            //            }).error(function(){
            //                //
            //            }).then(function(){
            //                $scope.reported_bfb = $scope.reported/($scope.reported+$scope.noreport)*100;
            //
            //                $scope.noreport_bfb = $scope.noreport/($scope.reported+$scope.noreport)*100;
            //
            //                //*************************
            //                $scope.data = [$scope.reported/($scope.reported+$scope.noreport), $scope.noreport/($scope.reported+$scope.noreport)];
            //                $scope.colours = ['#507bee','#ec4f79'];
            //                $scope.labels = ["已报道", "未报道"];
            //            });
            //    }).error().then(function(){});

            $scope.data = [$scope.reported/($scope.reported+$scope.noreport), $scope.noreport/($scope.reported+$scope.noreport)];
            $scope.colours = ['#507bee','#ec4f79'];
            $scope.labels = ["已报道", "未报道"];

        });

    })
    // 教师-教师平台-数据统计-缴费统计
    .controller('StaPayCtrl', function ($scope,$state,$http,$cookies,$timeout,$ionicLoading) {
        //
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $scope.back = function(){
                $state.go('teacher_tabs.teacher_terrace');
            };

            $scope.check = function(){
                $state.go('checkStatistics');
            };

            if($cookies.CollegeName == '全校'){
                //
                $scope.title = $cookies.CollegeName;
                // 全校 未缴费
                $http.get('http://120.24.208.184:3000/checkIsPay', {params: {CollegeName: '全校', IsPay: 0}})
                    .success(function(data){
                        //
                        $scope.noreport = data;
                        $http.get('http://120.24.208.184:3000/checkIsPay', {params: {CollegeName: '全校', IsPay: 1}})
                            .success(function(data){
                                //
                                $scope.reported = data;
                            }).error(function(){
                                //
                                $timeout(function(){
                                    $ionicPopup.alert({
                                        title: '抱歉~',
                                        template: '网络不给力...'
                                    });
                                    $ionicLoading.hide();
                                },30000);
                            }).then(function(){
                                //
                                $ionicLoading.hide();
                                $scope.reported_bfb = $scope.reported/($scope.reported+$scope.noreport)*100;
                                $scope.noreport_bfb = $scope.noreport/($scope.reported+$scope.noreport)*100;
                                //*************************
                                $scope.data = [$scope.reported/($scope.reported+$scope.noreport), $scope.noreport/($scope.reported+$scope.noreport)];
                                $scope.colours = ['#507bee','#ec4f79'];
                                $scope.labels = ["已缴费", "未缴费"];
                            });
                    }).error(function(){
                        //
                        $timeout(function(){
                            $ionicPopup.alert({
                                title: '抱歉~',
                                template: '网络不给力...'
                            });
                            $ionicLoading.hide();
                        },30000);
                    }).then(function(){
                        //
                        $ionicLoading.hide();
                    });
            } else{
                if($cookies.ProfessionName == '全院'){
                    //
                    $scope.title = $cookies.CollegeName;
                    //
                } else{
                    //
                    $scope.title = $cookies.ProfessionName;
                }
                $ionicLoading.show({
                    templateUrl: 'templates/loadingPage.html'
                });
                //查询已缴费人数
                $http.get('http://120.24.208.184:3000/checkIsPay', {params:{CollegeName: $cookies.CollegeName, ProfessionName: $cookies.ProfessionName, IsPay: 1}})
                    .success(function(data){
                        //
                        $scope.reported = data;
                        // 查询未缴费人数
                        $http.get('http://120.24.208.184:3000/checkIsPay', {params:{CollegeName: $cookies.CollegeName, ProfessionName: $cookies.ProfessionName, IsPay: 0}})
                            .success(function(data){
                                //
                                $scope.noreport = data;
                                //
                            }).error(function(){
                                $timeout(function(){
                                    $ionicPopup.alert({
                                        title: '抱歉~',
                                        template: '网络不给力...'
                                    });
                                    $ionicLoading.hide();
                                },30000);
                            }).then(function(){
                                $ionicLoading.hide();
                                $scope.reported_bfb = $scope.reported/($scope.reported+$scope.noreport)*100;

                                $scope.noreport_bfb = $scope.noreport/($scope.reported+$scope.noreport)*100;

                                //*************************
                                $scope.data = [$scope.reported/($scope.reported+$scope.noreport), $scope.noreport/($scope.reported+$scope.noreport)];
                                $scope.colours = ['#507bee','#ec4f79'];
                                $scope.labels = ["已缴费", "未缴费"];
                            });
                        //
                    }).error(function(){
                        $timeout(function(){
                            $ionicPopup.alert({
                                title: '抱歉~',
                                template: '网络不给力...'
                            });
                            $ionicLoading.hide();
                        },30000);
                    }).then(function(){
                        $ionicLoading.hide();
                    });
            }

            //*************************
            $scope.data = [$scope.reported/($scope.reported+$scope.noreport), $scope.noreport/($scope.reported+$scope.noreport)];
            $scope.colours = ['#507bee','#ec4f79'];
            $scope.labels = ["已缴费", "未缴费"];
            //*************************
        });
    })

    // 教师-信息中心
    .controller('InforCenterCtrl', function ($scope,Infors,$ionicPopup,$state) {

        $scope.back = function(){
            $state.go('teacher_terrace');
        }
        $scope.infors = Infors.all();
        $scope.remove = function(infor) {
            Infors.remove(infor);
        }
        $scope.doRefresh = function(){
            $ionicPopup.alert({
                title: 'Succeed',
                template: '刷新成功'
            });
            $scope.$broadcast('scroll.refreshComplete');
        }
    })
    // 教师-信息中心-详细内容
    .controller('InforContentCtrl', function ($scope,Infors,$stateParams,$state) {
        $scope.infor = Infors.get($stateParams.chatId);
        $scope.back = function(){
            $state.go('teacher_tabs.inforcenter');
        }
    })

    // 教师-个人中心
    .controller('PersonCenterCtrl', function ($scope,$state,$http,$ionicPopup,$cookies,$ionicLoading,$timeout) {

        //
        $scope.profession = '';
        $scope.class = '';

        //
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            //
            $ionicLoading.show({
                templateUrl: 'templates/loadingPage.html'
            });
            $http.get('http://120.24.208.184:3000/teaone',{
                params:{
                    TeacherPhone:$cookies.teacher
                }
            })
                .success(function(data){
                    $scope.teacher = data;
                    $http.get('http://120.24.208.184:3000/profession', {params:{ProfessionId: data.ProfessionId}})
                        .success(function(pro){
                            //
                            $scope.profession = pro;
                        });
                }).error(function(){
                    //
                    $timeout(function(){
                        $ionicPopup.alert({
                            title: '抱歉~',
                            template: '网络不给力...'
                        });
                        $ionicLoading.hide();
                    }, 30000);
                }).then(function(){
                    $ionicLoading.hide();
                });
        });

        $scope.cancellation = function() {
            $ionicPopup.confirm({
                title:'警告',
                template:'确定注销当前账号吗？',
                cancelText:'取消',
                okTexet:'确定'
            }).then(function(res){
                if(res == true){
                    delete $cookies["teacher"];
                    delete $cookies["CollegeName"];
                    delete $cookies["ProfessionName"];
                    delete $cookies["ProfessionId"];
                    $state.go('login');
                }else{

                }
            });
        }
        //
        //$http.get('http://120.24.208.184:3000/teacherInfors', {params:{appuser: appuser}})
        //    .success(function(date){
        //        //
        //        $scope.teacher = {name: date.name, phone: date.mobilePhone, qq: date.QQ, email: date.email, address: date.address, abstract: date.abstract};
        //    }).error(function(){
        //        //
        //    }).then(function(){
        //        //
        //    });
        //$scope.teacher = {name: '揭钰峰', phone: '13726224126', qq: '132456789', email: '123456789@qq.com', address: '移动应用开发中心', abstract: '11游戏软件版班主任,移动应用开发中心主任,高级系统分析师'};
        //
        $scope.changepassword = function(){
            $state.go('changepassword');
        }
        $scope.edit = function(){
            //
            $state.go('teacher-information-edit');
        }
    })
    // 教师-个人中心-资料编辑
    .controller('TeacherInformationEditCtrl', function ($scope,$state,$http,$timeout,$ionicLoading,$ionicPopup) {
        $scope.teacher = {phone:'',QQ:'',email:'',address:'',abstract:''};
        $scope.finish = function(){
            $ionicLoading.show({
                templateUrl: 'templates/loadingPage.html'
            });
            $http.get('http://120.24.208.184:3000/teacherInfors', {
                params:{
                    job: appuser,
                    phone:$scope.teacher.phone,
                    QQ:$scope.teacher.QQ,
                    email:$scope.teacher.email,
                    address:$scope.teacher.address,
                    abstract:$scope.teacher.abstract
                }
            })
                .success(function(data){
                    $scope.teacher = data;
                }).error(function(){
                    $timeout(function () {
                        $ionicPopup.alert({
                            title: '抱歉~',
                            template: '网络不给力...'
                        });
                        $ionicLoading.hide();
                    }, 30000);
                }).then(function(){
                    $ionicLoading.hide();
                });
            $state.go('teacher_tabs.personcenter');
        };
        $scope.back = function () {
            $state.go('teacher_tabs.personcenter');
        }

    })

    //教师平台－个人中心－修改密码
    .controller('ChangePasswordCtrl',function($scope,$state,$ionicPopup,$http,$cookies,$ionicLoading,$timeout) {

        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            //
            $scope.teacher = {lodpassword: '', newpassword: '', entnewpassword: ''};

            $scope.cancel = function () {
                $state.go('teacher_tabs.personcenter');
            }
            $scope.submit = function () {
                if ($scope.teacher.lodpassword != '' && $scope.teacher.newpassword != '' && $scope.teacher.entnewpassword != '') {

                    $ionicLoading.show({
                        templateUrl: 'templates/loadingPage.html'
                    });
                    $http.get('http://120.24.208.184:3000/ChangePassword',{
                        params:{
                            oldPassword: $scope.teacher.lodpassword,
                            newPassword: $scope.teacher.entnewpassword,
                            user: $cookies.teacher
                        }
                    })
                        .success(function(data){
                            if(data == 'false'){
                                $ionicPopup.alert({
                                    title: '警告',
                                    template: '请输入正确的旧密码!'
                                });
                            }
                            if(data == 'true'){
                                $scope.teacher = data;
                                $ionicPopup.alert({
                                    title: '提示',
                                    template: '修改成功'
                                }).then(function (res) {
                                    if (res == true) {
                                        $state.go('teacher_tabs.personcenter');
                                    } else {

                                    }
                                });
                            }
                        }).error(function(){
                            $timeout(function () {
                                $ionicPopup.alert({
                                    title: '抱歉~',
                                    template: '网络不给力...'
                                });
                                $ionicLoading.hide();
                            }, 30000);
                        }).then(function(){
                            $ionicLoading.hide();
                        });

                }
                else {
                    if ($scope.teacher.lodpassword == '' && $scope.teacher.newpassword == '' && $scope.teacher.entnewpassword == '') {
                        $ionicPopup.alert({
                            title: '警告',
                            template: '请输入相关信息!'
                        });
                    }
                    if ($scope.teacher.lodpassword != '' && $scope.teacher.newpassword == '' && $scope.teacher.entnewpassword == '') {
                        $ionicPopup.alert({
                            title: '警告',
                            template: '请输入新密码!'
                        });
                    }
                    if ($scope.teacher.lodpassword == '' && $scope.teacher.newpassword != '' && $scope.teacher.entnewpassword == '') {
                        $ionicPopup.alert({
                            title: '警告',
                            template: '请输入旧密码!'
                        });
                    }
                    if ($scope.teacher.lodpassword != '' && $scope.teacher.newpassword != '' && $scope.teacher.entnewpassword == '') {
                        $ionicPopup.alert({
                            title: '警告',
                            template: '请确认新密码!'
                        });
                    }
                    if ($scope.teacher.lodpassword == '' && $scope.teacher.newpassword == '' && $scope.teacher.entnewpassword != '') {
                        $ionicPopup.alert({
                            title: '警告',
                            template: '请先输入旧密码和新密码!'
                        });
                    }
                    if ($scope.teacher.lodpassword == '' && $scope.teacher.newpassword != '' && $scope.teacher.entnewpassword != '') {
                        $ionicPopup.alert({
                            title: '警告',
                            template: '请输入旧密码!'
                        });
                    }
                    if ($scope.teacher.lodpassword != '' && $scope.teacher.newpassword == '' && $scope.teacher.entnewpassword != '') {
                        $ionicPopup.alert({
                            title: '警告',
                            template: '请输入新密码!'
                        });
                    }
                }
            }
        });

    })

    // 查询数据数据统计
    .controller('CheckStatisticsCtrl', function ($scope,$http,$state,$ionicPopup,$timeout,$window,$cookies,$ionicLoading) {
        //
        $scope.college_display = 'none';
        $scope.profession_display = 'none';
        $scope.datacheck = function(){
            if($scope.college_display == 'none'){
                $scope.college_display = ' '
            }else( $scope.college_display = 'none')
        }
        $scope.prodatacheck = function(){
            if($scope.profession_display == 'none'){
                $scope.profession_display = ' '
            }else( $scope.profession_display = 'none')
        }
        $scope.school = {};
        $scope.check = function(){
            mycollege = $scope.school.college;
            $state.go('statistics_tab.report');
        };
        $scope.colleges = {
            "全校": [],
            "计算机学院": [],
            "经管学院": [],
            "外国语学院": [],
            "人文学院": [],
            "建工学院": [],
            "机电学院": [],
            "艺术设计学院": [],
            "财金学院": [],
            "体育系": []
        };

        $scope.collegeChoose = function(value){
            $cookies.CollegeName = value;
            $ionicLoading.show({
                templateUrl: 'templates/loadingPage.html'
            });
            $http.get('http://120.24.208.184:3000/statistics', {params:{CollegeName: value}})
                .success(function(data){
                    data.unshift('全院');
                    $scope.colleges = {
                        "计算机学院": data,
                        "经管学院": data,
                        "外国语学院": data,
                        "人文学院": data,
                        "建工学院": data,
                        "机电学院": data,
                        "艺术设计学院": data,
                        "财金学院": data,
                        "体育系": data
                    };
                }).error(function(){
                    $timeout(function () {
                        $ionicPopup.alert({
                            title: '抱歉~',
                            template: '网络不给力...'
                        });
                        $ionicLoading.hide();
                    }, 30000);
                }).then(function(){
                    $ionicLoading.hide();
                });
        };

        $scope.professionChoose = function(value){
            $cookies.ProfessionName = value;
            //$ionicLoading.show();
            $http.get('http://120.24.208.184:3000/countReport', {params: {ProfessionName: value}})
                .success(function(data){
                    //
                    $cookies.ProfessionId = data;
                }).error(function(){
                    //
                    $timeout(function () {
                        $ionicPopup.alert({
                            title: '抱歉~',
                            template: '网络不给力...'
                        });
                        $ionicLoading.hide();
                    }, 30000);
                }).then(function(){
                    $ionicLoading.hide();
                });
        }
    })





    // 通知公告-学院简介
    .controller('CollegeProfileCtrl', function ($scope,$state,$ionicHistory) {
            //
        $scope.back = function (){
            $state.go('index_tab.announ');
        }
        $scope.profile = {
            title: '计算机工程技术学院',
            content: '学院目前开设有软件技术、计算机网络技术、计算机信息管理、游戏软件、移动互联应用技术、交互媒体设计6个社会热门和人才需求紧缺专业，其中国家示范校重点建设专业1个、省示范性专业1个、省重点建设专业2个。学院与微软、苹果、思科、华为、金蝶、金山软件等100多家知名企业建立了产学合作关系。校企共建有教育部-思科校企合作岗前实训基地、微软创新技术体验中心、苹果技术校园体验中心、甲骨文（Oracle）教育中心等高水平的“教学企业”。'
        };
    })
    // 通知公告-专业简介
    .controller('ProfessionalProfileCtrl', function ($scope,$state) {
        //
        $scope.back = function (){
            $state.go('index_tab.announ');
        }
        $scope.profile = {
            title: '游戏软件专业',
            content: '&nbsp;&nbsp;一、培养方案<br/>（1）培养目标本专业面向移动互联网及文化行业，培养具备移动智能终端（智能手机、平板终端等）上的游戏软件开发能力，掌握跨平台移动终端（Android、iOS、wp）游戏软件开发的专业知识和实用技能，能参与移动智能终端游戏软件的策划与分析，游戏软件的编程实现、测试、运营与推广的高素质高技能型专门人才。<br/>（2）主干课程C++面向对象程序设计、Java/Object c、Android/iOS游戏开发、Android/iOS游戏项目实训、基于cocos2d-x 引擎的跨平台游戏开发,游戏服务端开发等。<br/>（3）就业岗位面向企事业单位和移动通讯公司、移动互联网开发公司从事手机游戏开发、策划、 推广运营等工作, 主要岗位有Android应用开发工程师、iOS应用开发工程师、Android游戏工程师、iOS游戏工程师、cocos2d-x的游戏开发工程师、手机游戏测试工程师等。”'
        };
    })
    // 通知公告-学院公告
    .controller('CollegeBulletinCtrl', function ($scope,Infors,$ionicPopup,$state) {
        //
        $scope.back = function (){
            $state.go('index_tab.announ');
        }
        $scope.infors = Infors.all();
        $scope.doRefresh = function(){
            $ionicPopup.alert({
                title: 'Succeed',
                template: '刷新成功'
            });
            $scope.$broadcast('scroll.refreshComplete');
        }
    })
    // 通知公告-学院公告-公告内容
    .controller('CollegeInforContentCtrl', function ($scope,Infors,$stateParams) {
        $scope.infor = Infors.get($stateParams.chatId);
    })

