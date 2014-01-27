/**
 * webapp cropper
 *
 * Mobile webapp image copper Plug-in, can crop, zoom in/out and rotate images from album or camera.
 *
 * Copyright (c) 2014 Vitrum Zhu <vitrum.cn@gmail.com>
 * Released under the MIT license
 */

(function(window, document, Math) {

  /**
   * WACropper
   * use this to create instances
   * @param   {HTMLElement}   element
   * @param   {Object}        options
   * @returns {WACropper.Instance}
   * @constructor
   */

  function WACropper (el, options) {
    this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
    
    this.options = {

      maskWidth : this.winSize(1),
      maskHeight : this.winSize(0),
      maskDiv : '<div class="wapper"></div>'
    };

    var para = document.createElement("div");
    para.id = "wacropper";

    para.innerHTML = this.options.maskDiv;
    document.body.appendChild(para);


    console.log(document.getElementById('wacropper'));

  }



  // default settings
  WACropper.prototype = {
        version: '0.1.0',

        _init: function () {
                // this._initEvents();

        // INSERT POINT: _init

        },
        winSize: function(nums){   //windowssize(obj),obj:1/0\ 0高 1宽
          if(!nums) nums=0; //缺省为0 高度
       
            if (window.innerWidth)  winWidth = window.innerWidth; 
            else if ((document.body) && (document.body.clientWidth)) 
            winWidth = document.body.clientWidth; 
       
            if (window.innerHeight)  winHeight = window.innerHeight; 
            else if ((document.body) && (document.body.clientHeight)) 
            winHeight = document.body.clientHeight; 
       
            //通过深入Document内部对body进行检测，获取窗口大小 
            if(document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){ 
                winHeight = document.documentElement.clientHeight; 
                winWidth = document.documentElement.clientWidth; 
            }
        if(nums==1)     return winWidth;
        else{
            if(nums==0) return winHeight;
            else alert("参数只能是1或者0,(1是高度/0是宽度)");
            }
        }
  }


  /*
    Create a file input cover the target button.
    Get image data from input. 
    Popup a new layer,
    Insert image to a new canvas.
    Monitor touch action at this layer, when crop and other action get selection box's zoom an rotation date.
    Cut image to new canvas when click finish.
    Push croped image as return. 



  */

if ( typeof module != 'undefined' && module.exports ) {
        module.exports = WACropper;
} else {
        window.WACropper = WACropper;
}


})(window, document, Math);