$(function() {
    //头图轮播
    $('.js-top-slider').bxSlider({
        auto: true,
        touchEnabled: false,
        controls: false
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
        auto: true,
        touchEnabled: false,
        autoHover: true
    });

    initBorderColor();
    initDieaseByBody();
    initTopSearchStyle();
    FD.initTabs('.js-tab-wrap', 'mouseenter');
});

// 边框动画
function initBorderColor () {
    $('.area-cont').on('mouseenter', function () {
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

// 按图索病
function initDieaseByBody () {
    var wrap = $('.js-search-dis');

    if (!wrap.length) {
        return;
    }
    
    var btns = wrap.find('dt a');
    var boxs = wrap.find('dd');
    var items = wrap.find('.js-item');
    var first = items.first();
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

        btns.removeClass('on');
        $(this).addClass('on');

        boxs.addClass('hide');
        boxs.eq(i).removeClass('hide');

        if (i === 0) {
            first.removeClass('hide');
            bodyItems.addClass('hide');
        } else {
            first.addClass('hide');
            bodyItems.addClass('hide').eq(cur).removeClass('hide');
        }
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

// 顶部搜索框
function initTopSearchStyle () {
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