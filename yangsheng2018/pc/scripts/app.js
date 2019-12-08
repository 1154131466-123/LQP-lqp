$(function () {
    //头图轮播
    $('.js-top-slider').bxSlider({
        touchEnabled: false,
        auto: true
    });

    //专家访谈轮播
    $('.js-expert-slider').bxSlider({
        touchEnabled: false,
        pagerType: 'short'
    });

    $('.js-pan-center').each(function () {
        var $this = $(this);

        $this.css({
            marginTop: -$this.height() / 2 + 'px',
            marginLeft: -$this.width() / 2 + 'px'
        });
    });

    $('.js-doctor-slider').bxSlider({
        controls: true,
        pager: false,
        auto: false,
        touchEnabled: false,
        autoHover: true
    });

    // 二十四节气页面轮播
    $('#diet-slider').bxSlider({
        controls: true,
        touchEnabled: false,
        pager: false
    });

    initBorderColor();
    initTopSearchStyle();
    initSeason();
    initClock();
    initSideMenuFixed();
    initDieaseByBody();
    FD.initTabs('.js-tab-wrap', 'mouseenter');
});

// 边框动画
function initBorderColor() {
    $('.border-animate').on('mouseenter', function () {
        var $that = $(this);

        setTimeout(function () {
            $that.addClass('leave');
            $that.addClass('enter');
        }, 1000);
    }).on('mouseleave', function () {
        var $that = $(this);

        $that.removeClass('enter');

        setTimeout(function () {
            $that.removeClass('leave');
            $that.removeClass('enter');
        }, 1000);
    });
}

// 顶部搜索框
function initTopSearchStyle() {
    var wrap = $('#channel-search');

    if (!wrap.length) {
        return;
    }

    var btn = wrap.find('input[type=button]');

    wrap.find('input.keyword')
        .on('focus', function () {
            wrap.addClass('focus');
        })
        .on('blur', function () {
            wrap.removeClass('focus');
        });
}

function initSeason() {
    var wrap = $('#season');
    var tabs = wrap.find('.js-tabs a');
    var items = wrap.find('.js-tab-item');
    var cur = season(new Date());
    var curTab = null;
    var dots = [0, 6, 12, 18];

    var setActive = function (i) {
        tabs.each(function (index) {
            if (index <= i) {
                $(this).addClass('at');

                if ((index + 1) % 4 === 0) {
                    $(this).addClass('atr');
                }

                if ((index + 1) % 4 === 1) {
                    $(this).addClass('atl');
                }
                
                if (i % 4 === 0 && index === i) {
                    $(this).addClass('none');
                } else {
                    $(this).removeClass('none');
                }

            } else {
                $(this).removeClass('at');
            }
        });
    };

    tabs.each(function (i) {
        if (cur.index === i) {
            $(this).addClass('on');
            curTab = $(this);
            setActive(i);
            items.eq(i).removeClass('hide');
        }

        for (var j = 0, len = dots.length; j < len; j++) {
            if (dots[j] === i) {
                $(this).addClass('dot');
            }
        }

        (function (tab, i) {
            tab.on('mouseenter', function () {
                setActive(i);

                if (!tab.is(curTab)) {
                    curTab.removeClass('on');
                }
            });
        })($(this), i);
    });
}

// 二十四节气
function season (date) {
    var arr = new Array(
        "小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
        "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
        "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
        "寒露", "霜降", "立冬", "小雪", "大雪", "冬至");
    var DifferenceInMonth = new Array(
        1272060, 1275495, 1281180, 1289445, 1299225, 1310355,
        1321560, 1333035, 1342770, 1350855, 1356420, 1359045,
        1358580, 1355055, 1348695, 1340040, 1329630, 1318455,
        1306935, 1297380, 1286865, 1277730, 1274550, 1271556);

    var DifferenceInYear = 31556926;
    var BeginTime = new Date(1901 / 1 / 1);

    BeginTime.setTime(947120460000);

    for (; date.getFullYear() < BeginTime.getFullYear();) {
        BeginTime.setTime(BeginTime.getTime() - DifferenceInYear * 1000);
    }

    for (; date.getFullYear() > BeginTime.getFullYear();) {
        BeginTime.setTime(BeginTime.getTime() + DifferenceInYear * 1000);
    }

    for (var M = 0; date.getMonth() > BeginTime.getMonth(); M++) {
        BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
    }

    if (date.getDate() > BeginTime.getDate()) {
        BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
        M++;
    }

    if (date.getDate() > BeginTime.getDate()) {
        BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
        M == 23 ? M = 0 : M++;
    }

    return {name: arr[M], index: M};
}

// 养生钟
function initClock () {
    var wrap = $('#clock');

    if (!wrap) {
        return;
    }

    var items = wrap.find('a');
    var pointer = wrap.find('.pointer');
    var timer = null;
    var index = 0;
    var hover = false;

    items.on('mouseenter', function () {
        var deg = this.getAttribute('data-deg');

        pointer.css({transform: 'rotate('+ deg +'deg)'});
        items.eq(index).removeClass('on');
        hover = true;
    }).on('mouseleave', function () {
        hover = false;
        clearTimeout(timer);

        timer = setTimeout(function () {
            if (!hover) {
                var deg = items.eq(index).attr('data-deg');

                items.eq(index).addClass('on');
                pointer.css({transform: 'rotate('+ deg +'deg)'});
            }
        }, 2000);
    });

    var check = function () {
        var now = new Date();
        var hour = now.getHours();
        var deg = 0;

        if (hour > 22) {
            index = 11;
        } else if (hour > 20) {
            index = 10;
        } else if (hour > 18) {
            index = 9;
        } else if (hour > 16) {
            index = 8;
        } else if (hour > 14) {
            index = 7;
        } else if (hour > 12) {
            index = 6;
        } else if (hour > 10) {
            index = 5;
        } else if (hour > 8) {
            index = 4;
        } else if (hour > 6) {
            index = 3;
        } else if (hour > 4) {
            index = 2;
        } else if (hour > 2) {
            index = 1;
        } else {
            index = 0;
        }

        deg = items.eq(index).attr('data-deg');
        items.eq(index).addClass('on');
        pointer.css({transform: 'rotate('+ deg +'deg)'});
    };

    setTimeout(function () {
        check();
        setTimeout(arguments.callee, 1000 * 60);
    }, 1000);
}

//	导航固定
function initSideMenuFixed () {
    var result;
    var bottomResult;
    var middleResult;
    var items = $('.js-scroll');

    if (!items.length) {
        return;
    }

    var fn = FD.throttle(function () {
        items.each(function () {
            result = $(this).offset().top - $(document).scrollTop();
            bottomResult = $(this).height() - $(this).find('.area-nav').height();
			middleResult = $(this).height() - $(this).find('.area-nav').height() - $(this).find('.docs-nav').height();

            if (result <= 0) {
                $(this).find('.area-nav').addClass('area-nav-fixed');
                $(this).find('.area-nav').removeClass('area-nav-bottom');
                
                $(this).find('.js-area-nav').addClass('area-nav-fixed');
                $(this).find('.js-area-nav').removeClass('area-nav-middle');
                
                $(this).find('.docs-nav').addClass('docs-nav-fixed');
                $(this).find('.docs-nav').removeClass('docs-nav-bottom');
                
                if (Math.abs(result) > middleResult) {
                	$(this).find('.js-area-nav').removeClass('area-nav-fixed');
                	$(this).find('.js-area-nav').addClass('area-nav-middle');
                	
                	$(this).find('.docs-nav').removeClass('docs-nav-fixed');
                    $(this).find('.docs-nav').addClass('docs-nav-bottom');
                }

                if (Math.abs(result) > bottomResult) {
                    $(this).find('.area-nav').removeClass('area-nav-fixed');
                    $(this).find('.area-nav').addClass('area-nav-bottom');
                }
                
            } else {
                $(this).find('.area-nav').removeClass('area-nav-fixed');
                
                $(this).find('.docs-nav').removeClass('docs-nav-fixed');
            }
        });
    }, window.addEventListener ? 0 : 10);
    
    $(window).scroll(fn);
}

// 疾病自诊
function initDieaseByBody () {
    var wraps = $('.js-search-dis');

    if (!wraps.length) {
        return;
    }

    FD.initTabs('.js-search-wrap', 'click');

    wraps.each(function () {
        init($(this));
    });

    function init (wrap) {
        var btns = wrap.find('dt a');
        var items = wrap.find('.js-item');
        var parts = wrap.find('dd a');
        var cur = 0;
        var arr = [];
        var info = [];
    
        var pager = function (i) {
            var ul = items.eq(i).find('ul');
            var fragment = document.createDocumentFragment();
            var page = info[i].page;
            var size = 8;
            var total = Math.ceil(info[i].count / size);
            var lis = [];
            var start = 0;
    
            if (page > total) {
                page = 1;
                info[i].page = page;
            }
    
            start = (page - 1) * size;
            lis = arr[i].slice(start, start + size);
            ul.hide();
            ul.html('');
    
            for (var j = 0, len = lis.length; j < len; j++) {
                ul.get(0).appendChild(lis[j]);
            }
    
            ul.fadeIn();
            info[i].page = info[i].page + 1;
        };
    
        for (var i = 0, len = items.length; i < len; i++) {
            var lis = items.eq(i).find('li');
            var more = items.eq(i).find('.js-more');
    
            if (!arr[i]) {
                arr[i] = [];
                info[i] = {page: 1, count: lis.length};
            }
    
            for (j = 0; j < lis.length; j++) {
                arr[i].push(lis[j]);
            }
    
            more.length && more.data('i', i);
        }
    
        for (var i = 0, len = items.length; i < len; i++) {
            pager(i);
        }
    
        var bodyItems = items.not(':first');
    
        btns.on('click', function () {
            var i = $(this).index();
            var parent = $(this).parents('.js-search-dis');

            btns.removeClass('active');
            $(this).addClass('active');
            
            parent.find('dd i').addClass('hide');
            parent.find('dd i').eq(i).removeClass('hide');
            
            parent.find('.js-item').addClass('hide');
            parent.find('.js-item').eq(i).removeClass('hide');
        });
    
        parts.on('mouseenter', function () {
            parts.removeClass('on');
            cur = $(this).index();
            $(this).addClass('on');
            bodyItems.addClass('hide').eq(cur).removeClass('hide');
        });
    
        wrap.on('click', '.js-more', function () {
            var i = parseInt($(this).data('i'));
            pager(i);
        });
    }
}

//安全期计算器
function shengliqi() {
    var $lastYear = $('#lastyear');
    var $lastMonth = $('#lastmonth');
    var $lastDay = $('#lastday');
    var $start1 = $('#start1');
    var $start2 = $('#start2');
    var $reset = $('#reset');
    var $mindays = $('#mindays');
    var $maxdays = $('#maxdays');
    var $res = $('#res');

    var currDate = new Date();
    var currYear = currDate.getFullYear();
    var currMonth = currDate.getMonth() + 1;
    var currDay = currDate.getDate();
    var mindays = 28;
    var maxdays = 28;
    initForm();

    $lastYear.on('change', function() {
        currYear = $lastYear.val();
        currYear = parseInt(currYear);
        setLastDayNum(currYear, currMonth);
    });

    $lastMonth.on('change', function() {
        currMonth = $lastMonth.val();
        currMonth = parseInt(currMonth);
        setLastDayNum(currYear, currMonth);
    });

    $start1.click(function() {
        deal();
    });

    $start2.click(function() {
        deal();
    });

    $reset.click(function() {
        currDate = new Date();
        currYear = currDate.getFullYear();
        currMonth = currDate.getMonth() + 1;
        currDay = currDate.getDate();
        mindays = 28;
        maxdays = 28;
        initForm();
    });
    
    function initForm() {
        $lastYear.html('<option value="'+ (currYear - 1) +'">'+ (currYear - 1) +'</option><option selected="selected" value="'+ currYear +'">'+ currYear +'</option>');

        var monthOptionStr = '';

        for (var i = 1; i < 13; i++) {
            if (i === currMonth) {
                monthOptionStr += '<option selected="selected" value="'+ i +'">'+ i +'</option>';
            } else {
                monthOptionStr += '<option value="'+ i +'">'+ i +'</option>';
            }
        }

        $lastMonth.html(monthOptionStr);
        setLastDayNum(currYear, currMonth);

        var str2 = '';

        for (var j = 1; j < 40; j++) {
            if (j == 28) {
                str2 += '<option selected="selected" value="'+ j +'">'+ j +'</option>';
            } else {
                str2 += '<option value="'+ j +'">'+ j +'</option>';
            }
        }

        $mindays.html(str2);
        $maxdays.html(str2);
    }

    function setLastDayNum(year, month) {
        var dayOptionStr = '';
        var isHaveCurrDay;

        for (var i = 1; i < getDayPerMonth(year, month) + 1; i++) {
            if (i === currDay) {
                dayOptionStr += '<option selected="selected" value="'+ i +'">'+ i +'</option>';
                isHaveCurrDay = true;
            } else {
                dayOptionStr += '<option value="'+ i +'">'+ i +'</option>';
            }
        }

        if (!isHaveCurrDay) {
            currDay = 1;
        }

        $lastDay.html(dayOptionStr);
    }

    function getDayPerMonth(year, month) {
        var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) monthDays[1] = 29;
        
        return monthDays[month - 1];	
    }

    function deal() {
        currDay = parseInt($lastDay.val());
        mindays = parseInt($mindays.val());
        maxdays = parseInt($maxdays.val());

        if (currDate.getTime() - new Date(currYear + '/' + currMonth + '/' + currDay).getTime() < 0) {
            alert("请输入正确的上次月经时间（不能大于当前时间）！")
            return;
        }
    
        if (mindays < 24) {
            alert("您输入的最短月经周期与标准月经周期相差太大，程序无法测试，请仔细核对。\n\n如输入确无问题请咨询医生！")
            return;
        }
    
        if (mindays > maxdays) {
            alert("输入错误，请仔细核对您的输入周期！");
            return;
        }
        
        var str = '';
        str += '<p class="tl">计算结果</p><div class="text-center">';
        str += renderCalendar(1);
        str += renderCalendar(2);
        str += '</div><p class="small-tip">本测试仅供参考，若发现可能存在健康问题，请向专业医生咨询！</p>';
        $res.html(str);
    }

    function renderCalendar(CalendarIndex) {
        str = '';		
        var thisYear = currYear;
        var thisMonth = currMonth + CalendarIndex - 1 ;
    
        if (thisMonth > 12) {
            thisYear = currYear + 1;
            thisMonth = thisMonth % 12;
        }
    
        str += '<div class="calendar-cont">';
        str += '<p class="cont-head">'+ thisYear +'年'+ thisMonth +'月</p>';
        str += '<ul class="cont-sub"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul>';
        str += '<ul>'
    
        var thisDate = new Date(thisYear + '/' + thisMonth + '/1');
        firstWeekDay = thisDate.getDay();//1号的星期，0为星期日

        for (var i = 0; i < firstWeekDay; i++) {
            str += '<li></li>';
        }
        
        var currMonthDaysNum = getDayPerMonth(thisYear, thisMonth);

        for (var j = 1; j < currMonthDaysNum + 1; j++) {
            var newDate = new Date(thisYear + '/' + thisMonth + '/' + j);
            var msPerDay = 24 * 60 * 60 * 1000;
            var mensesCyc = mindays;
            var msDiff = newDate.getTime() - new Date(currYear + '/' + currMonth + '/' + currDay).getTime();
            var dayDiff = Math.floor(msDiff / msPerDay);
            var dayRemainder =	(dayDiff % mensesCyc + mensesCyc) % mensesCyc;

            var tooltips = '';
            var colorClass = '';
    
            if (dayRemainder >= 0 && dayRemainder <= 4) {
                colorClass = 'c-yellow';
                tooltips = '这是月经期，要注意经期卫生，当然也要“节欲”，避免性事哦！'
            }

            if (dayRemainder >= 5 && dayRemainder <= (mensesCyc - 20)) {
                colorClass = 'c-green';
                tooltips = '这是安全期，性事一般不会受孕，您放心吧！';
            }

            if (dayRemainder >= (mensesCyc - 19) && dayRemainder <= (mensesCyc - 10)) {
                colorClass = 'c-red';
                tooltips = '这是危险期，亦称排卵期，性事受孕可能性大，千万要注意哦！'
            }

            if (dayRemainder >= (mensesCyc - 9) && dayRemainder <= (mensesCyc - 1)) {
                colorClass = 'c-green';
                tooltips = '这是安全期，性事一般不会受孕，您放心吧！';
            }

            str += '<li class="'+ colorClass +'" title="'+ tooltips +'">'+ j +'</li>';
        }

        str += '</ul>';
        str += '</div>';
        return str;
    }
}

//腰臀比例计算工具
function ytb() {
    var $waist = $('#waist');
    var $hip = $('#hip');
    var $start = $('#start');
    var $res = $('#res');

    $start.click(function() {
        var sex = parseFloat($('[name="sex"]:checked').val());
        var waist = parseFloat($waist.val());
        var hip = parseFloat($hip.val());

        if (!waist) {
            alert('请填写正确的腰围数字');
            return;
        }

        if (!hip) {
            alert('请填写正确的臀围数字');
            return;
        }


        var border;
        var info = '';
        var str = '';
        var res = waist / hip;

        if (sex === 1) {
            border = 1;
        } else {
            border = 0.8;
        }

        if (res <= border) {
            info = '正常';
        } else {
            info = '高';
        }

        str += '<p class="bold">计算结果：</p>';
        str += '<p>您的腰臀围比值为：'+ res.toFixed(2) +'，'+ info +'。</p>';
        str += '<p class="small-tip">本测试仅供参考，若发现可能存在健康问题，请向专业医生咨询！</p>';

        $res.html(str);
    });
}

//食品热量计算
function kaluli() {
    var $age = $('#age');
    var $weight = $('#weight');
    var $start = $('#start');
    var $res = $('#res');

    $start.click(function() {
        var age = parseFloat($age.val());
        var weight = parseFloat($weight.val());

        if (!age) {
            alert('请填写正确的年龄数字');
            return;
        }

        if (!weight) {
            alert('请填写正确的体重数字');
            return;
        }

        if (age < 18) {
            alert('您的年龄小于18岁，不符合测试年龄！');
            return;
        }

        if (age > 60) {
            alert('超过测试年龄（60岁）！');
            return;
        }

        var str = '';
        var k = 0;

        if (age <= 30) {
            k = (weight * 0.062 + 2.036) * 240;
        } else {
            k = (weight * 0.034 + 3.538) * 240;
        }

        str += '<p class="bold">计算结果：</p>';
        str += '<p>您每天需要的热量应为 '+ k.toFixed(2) +' 卡路里。如果要减肥的话：每日基本热量消耗减少500（推荐)，就是每天的摄入热量。</p>';
        str += '<p class="small-tip">本测试仅供参考，若发现可能存在健康问题，请向专业医生咨询！</p>';

        $res.html(str);
    });
}

//身体质量指数(BMI)测试
function bmi() {
    var $weight = $('#weight');
    var $stature = $('#stature');
    var $start = $('#start');
    var $res = $('#res');

    $start.click(function() {
        var sex = parseFloat($('[name="sex"]:checked').val());
        var weight = parseFloat($weight.val());
        var stature = parseFloat($stature.val());

        if (!weight) {
            alert('请填写正确的体重数字');
            return;
        }

        if (!stature) {
            alert('请填写正确的身高数字');
            return;
        }

        var tip = '';
        var str = '';
        var temp = stature / 100;
        temp = temp * temp;
        var res = weight / temp;

        if (sex === 1) {
            if (res < 20) {
                tip = '您属于偏瘦身材，别洋洋得意，光瘦也不一定就美哦，试着塑造下曲线吧！';
            } else if (res < 25) {
                tip = '您属于标准体重，摄取均衡饮食与维持规律运动能帮助您维持柔美的曲线！';
            } else if (res < 30) {
                tip = '您应该要试着减重了！注意饮食习惯与养成规律运动的习惯，再加上纤体护理产品辅助，便能达到紧实曲线的目标。';
            } else {
                tip = '您应该找专家咨询一系列减重计划了，因为此时的您减重是第一任务！';
            }	
        } else {
            if (res < 19) {
                tip = '您属于偏瘦身材，别洋洋得意，光瘦也不一定就美哦，试着塑造下曲线吧！';
            } else if (res < 24) {
                tip = '您属于标准体重，摄取均衡饮食与维持规律运动能帮助您维持柔美的曲线！';
            } else if (res < 29) {
                tip = '您应该要试着减重了！注意饮食习惯与养成规律运动的习惯，再加上纤体护理产品辅助，便能达到紧实曲线的目标。';
            } else {
                tip = '您应该找专家咨询一系列减重计划了，因为此时的您减重是第一任务！';
            }
        }

        str += '<p class="bold">计算结果：</p>';
        str += '<p>您的身体质量指数(BMI)为 '+ res.toFixed(2) +'，'+ tip +'</p>';
        str += '<p class="small-tip">本测试仅供参考，若发现可能存在健康问题，请向专业医生咨询！</p>';

        $res.html(str);
    });
}

//标准体重计算工具
function standarWeight() {
    var $weight = $('#weight');
    var $stature = $('#stature');
    var $start = $('#start');
    var $res = $('#res');

    $start.click(function() {
        var sex = parseFloat($('[name="sex"]:checked').val());
        var weight = parseFloat($weight.val());
        var stature = parseFloat($stature.val());

        if (!weight) {
            alert('请填写正确的体重数字');
            return;
        }

        if (!stature) {
            alert('请填写正确的身高数字');
            return;
        }
        
        var res;
        var tip = '';
        var str = '';

        if (sex === 1) {
            res = (stature - 80) * 0.7;
        } else {
            res = (stature - 70) * 0.6;
        }

        var min = res * 0.9;
        var max = res * 1.1;

        if (weight > res) {
            tip = '您需要减少体重 '+ (weight - res).toFixed(2) +' 公斤';
        }

        if (weight < res) {
            tip = '您需要增加体重 '+ (res - weight).toFixed(2) +' 公斤';
        }

        str += '<p class="bold">计算结果：</p>';
        str += '<p>您的标准体重：'+ res.toFixed(2) +' 公斤</p>';
        str += '<p>合理体重范围：'+ min.toFixed(2) +' ~ '+ max.toFixed(2) +' 公斤</p>';
        str += '<p>'+ tip +'</p>';
        str += '<p class="small-tip">本测试仅供参考，若发现可能存在健康问题，请向专业医生咨询！</p>';

        $res.html(str);
    });
}

//基础代谢率（BMR）计算工具
function bmr() {
    var $age = $('#age');
    var $weight = $('#weight');
    var $level = $('#level');
    var $start = $('#start');
    var $res = $('#res');

    $start.click(function() {
        var sex = parseFloat($('[name="sex"]:checked').val());
        var age = parseFloat($age.val());
        var level = parseFloat($level.val());
        var weight = parseFloat($weight.val());
        var r1, r2, low1, high1, low2, high2;
        var str = '';

        if (!weight) {
            alert('请填写正确的体重数字');
            return;
        }
        
        if (sex === 1) {
            if (age === 0) {
                r1 = (60.9 * weight) - 54;
            } else if (age === 1) {
                r1 = (22.7 * weight) - 495;
            } else if (age === 2) {
                r1 = (17.5 * weight) + 651;
            } else if (age === 3) {
                r1 = (15.3 * weight) + 679;
            } else if (age === 4) {
                r1 = (11.6 * weight) + 879;
            } else if (age === 5) {
                r1 = (13.5 * weight) + 487;
            }
        } else {
            if (age === 0) {
                r1 = (61 * weight) - 51;
            } else if (age == 1) {
                r1 = (22.5 * weight) + 499;
            } else if (age === 2) {
                r1 = (12.2 * weight) + 746;
            } else if (age === 3) {
                r1 = (14.7 * weight) + 496;
            } else if (age === 4) {
                r1 = (8.7 * weight) + 829;
            } else if (age === 5) {
                r1 = (10.5 * weight) + 596;
            }
        }

        if (sex === 1) {
            if (level === 1) {
                r2 = r1 * 1.55;
                low1 = r1 * 1.55 + 500;
                high1 = r1 * 1.55 + 1000;
                low2 = r1 * 1.55 - 1000;
                high2 = r1 * 1.55 - 500;
            }

            if (level === 2) {
                r2 = r1 * 1.78;
                low1 = r1 * 1.78 + 500;
                high1 = r1 * 1.78 + 1000;
                low2 = r1 * 1.78 - 1000;
                high2 = r1 * 1.78 - 500;
            }

            if (level === 3) {
                r2 = r1 * 2.10;
                low1 = r1 * 2.10 + 500;
                high1 = r1 * 2.10 + 1000;
                low2 = r1 * 2.10 - 1000;
                high2 = r1 * 2.10 - 500;
            }
        } else {
            if (level === 1) {
                r2 = r1 * 1.56;
                low1 = r1 * 1.56 + 500;
                high1 = r1 * 1.56 + 1000;
                low2 = r1 * 1.56 - 1000;
                high2 = r1 * 1.56 - 500;
            }

            if (level === 2) {
                r2 = r1 * 1.64;
                low1 = r1 * 1.64 + 500;
                high1 = r1 * 1.64 + 1000;
                low2 = r1 * 1.64 - 1000;
                high2 = r1 * 1.64 - 500;
            }

            if (level === 3) {
                r2 = r1 * 1.82;
                low1 = r1 * 1.82 + 500;
                high1 = r1 * 1.82 + 1000;
                low2 = r1 * 1.82 - 1000;
                high2 = r1 * 1.82 - 500;
            }
        }

        str += '<p class="bold">计算结果：</p>';
        str += '<p>您的基础代谢率为：'+ r1.toFixed(2) +' 大卡 </p>';
        str += '<p>每天需要热量：'+ r2.toFixed(2) +' 大卡</p>';
        str += '<p>如需要增重，每天需要热量：'+ low1.toFixed(2) + ' - '+ high1.toFixed(2) +' 大卡</p>';
        str += '<p>如需要减肥，每天需要热量：'+ low2.toFixed(2) + ' - '+ high2.toFixed(2) +' 大卡</p>';
        str += '<p class="small-tip">本测试仅供参考，若发现可能存在健康问题，请向专业医生咨询！</p>';

        $res.html(str);
    });
}