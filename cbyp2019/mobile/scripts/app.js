FD.ready(function () {
    FD.mobileLetvPlayer();
    deleteHorizonSpace();
    FD.initTabs();
    showMoreMedi();
    switcher();
    slider2();
    initDropdownMenu();

    //删除inline-block之间的间距
    function deleteHorizonSpace() {
        var deal = function ($wrap) {
            var str = '';

            [].forEach.call($wrap.children, function ($child) {
                str += $child.outerHTML;
            });

            $wrap.innerHTML = str;
        };

        var $wraps = document.querySelectorAll('.js-delete-horizon-space');

        $wraps.forEach(function ($wrap) {
            deal($wrap);
        });
    }

    //其他用药弹窗
    function showMoreMedi() {
        var $handle = document.getElementById('show-more');
        var $mask = document.getElementById('mask');
        var $wrap = document.getElementById('more-medic');
        var $hide = document.getElementById('hide-more');

        var hide = function () {
            $mask.classList.add('hide');
            $wrap.classList.remove('show');
            FD.pageUnLock();
        };

        $handle && $handle.addEventListener('click', function () {
            if ($wrap.classList.contains('show')) {
                hide();
            } else {
                $mask.classList.remove('hide');
                $wrap.classList.add('show');
                FD.pageLock();
            }
        });

        $mask && $mask.addEventListener('click', hide);
        $hide && $hide.addEventListener('click', hide);
    }

    //多级切换
    function switcher() {
        var winWidth = window.innerWidth;
        var $tabs = document.querySelectorAll('.js-outter-tabs li');
        var $items = document.querySelectorAll('.js-outter-item');

        var buildSlider = function ($item) {
            var $currTabWrap = $item.querySelector('.js-sub-slider-tabs');
            var $currTabs = $currTabWrap.querySelectorAll('li');

            var setCurrTabs = function (index) {
                $currTabs.forEach(function ($tab) {
                    $tab.classList.remove('on');
                });

                var $thisTab = $currTabs[index];
                $thisTab.classList.add('on');
                setPos($thisTab.offsetLeft - winWidth + winWidth / 2 + $thisTab.clientWidth / 2);
            };

            var setPos = function (pos) {
                $currTabWrap.scrollLeft = pos;
            };

            var slider = new FD.Slider({
                ele: $item.querySelector('.js-sub-slider'),
                showNav: false,
                showAction: true,
                onAfter: function (thisSli) {
                    setCurrTabs(thisSli.current);
                }
            });

            $currTabs.forEach(function ($tab, i) {
                $tab.setAttribute('data-index', i);
            });

            FD.dom.on('click', $currTabs, function () {
                var index = parseInt(this.getAttribute('data-index'));
                setCurrTabs(index);
                slider.goto(index);
            });

            $item.setAttribute('data-is-build', true);
        };

        var setOuterTabs = function (index) {
            $tabs.forEach(function ($tab) {
                $tab.classList.remove('on');
            });

            $tabs[index].classList.add('on');
        };

        var setOuterItems = function (index) {
            $items.forEach(function ($item) {
                $item.classList.add('hide');
            });

            var $thisItem = $items[index];
            $thisItem.classList.remove('hide');

            if (!$thisItem.getAttribute('data-is-build')) {
                buildSlider($thisItem);
            }
        };

        $tabs.forEach(function ($tab, i) {
            $tab.setAttribute('data-index', i);
        });

        FD.dom.on('click', '.js-outter-tabs li', function () {
            var index = parseInt(this.getAttribute('data-index'));
            setOuterTabs(index);
            setOuterItems(index);
        });

        buildSlider($items[0]);
    }

    //轮播2
    function slider2() {
        new FD.Slider({
            ele: document.querySelector('.js-slider-2')
        });
    }

    //初始化头部下拉菜单
    function initDropdownMenu(){
        var $trigger = document.getElementById('more-chanels');
        var $menu = document.getElementById("dropdown-menu");

        var drawer = new FD.Drawer({
            content: $menu || '',
            direction: "toTop",
            offset: [0, "45px"],
            zIndex: 99,
            showMask: true,
        });

        var toggle = function () {
            $trigger.classList.toggle("icon-up-white");

            if($trigger.classList.contains("icon-up-white")){
                $trigger.innerHTML = "收起";
                FD.pageLock();
            }else{
                $trigger.innerHTML = "更多";
                FD.pageUnLock();
            }
        };
        
        $trigger.onclick = function(){
            drawer.toggle();
            toggle();
        };

        $trigger.onfocus = function () { this.blur(); };
    }
});