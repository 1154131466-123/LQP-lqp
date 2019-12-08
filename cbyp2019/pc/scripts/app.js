$(function () {
	FD.initTabs(null, 'mouseenter');
	medicineSlider();
	topSlider();
	
	//头图区轮播
	function topSlider() {
		$('.js-top-slider').bxSlider({
			auto: true,
			touchEnabled: false
		})
	}

	//排行榜轮播切换
	function medicineSlider() {
		var $slider = $('#slider-medicine-ranking').bxSlider({
			pagerType: 'short',
			auto: true,
			touchEnabled: false
		});

		$('#medicine-ranking-siwtch li').click(function () {
				var $this = $(this);
				$slider.goToSlide($this.index());
		});
	}
});


