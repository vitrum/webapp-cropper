Hammer.plugins.fakeMultitouch();

var element = document.getElementById('test_el');
var hammertime = Hammer(element).on("touch", function(event) {
  // console.log(WACropper);

});

var myCropper = new WACropper(element, {
  mouseWheel: true,
  scrollbars: true,
  skin: 'base'
});