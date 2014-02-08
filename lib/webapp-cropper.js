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

/*
 * Mega pixel image rendering library for iOS6 Safari
 *
 * Fixes iOS6 Safari's image file rendering issue for large size image (over mega-pixel),
 * which causes unexpected subsampling when drawing it in canvas.
 * By using this library, you can safely render the image with proper stretching.
 * https://github.com/stomita/ios-imagefile-megapixel
 * Copyright (c) 2012 Shinichi Tomita <shinichi.tomita@gmail.com>
 * Released under the MIT license
 */
(function(){function detectSubsampling(img){var iw=img.naturalWidth,ih=img.naturalHeight;if(iw*ih>1024*1024){var canvas=document.createElement('canvas');canvas.width=canvas.height=1;var ctx=canvas.getContext('2d');ctx.drawImage(img,-iw+1,0);return ctx.getImageData(0,0,1,1).data[3]===0}else{return false}}function detectVerticalSquash(img,iw,ih){var canvas=document.createElement('canvas');canvas.width=1;canvas.height=ih;var ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);var data=ctx.getImageData(0,0,1,ih).data;var sy=0;var ey=ih;var py=ih;while(py>sy){var alpha=data[(py-1)*4+3];if(alpha===0){ey=py}else{sy=py}py=(ey+sy)>>1}var ratio=(py/ih);return(ratio===0)?1:ratio}function renderImageToDataURL(img,options,doSquash){var canvas=document.createElement('canvas');renderImageToCanvas(img,canvas,options,doSquash);return canvas.toDataURL("image/jpeg",options.quality||0.8)}function renderImageToCanvas(img,canvas,options,doSquash){var iw=img.naturalWidth,ih=img.naturalHeight;var width=options.width,height=options.height;var ctx=canvas.getContext('2d');ctx.save();transformCoordinate(canvas,width,height,options.orientation);var subsampled=detectSubsampling(img);if(subsampled){iw/=2;ih/=2}var d=1024;var tmpCanvas=document.createElement('canvas');tmpCanvas.width=tmpCanvas.height=d;var tmpCtx=tmpCanvas.getContext('2d');var vertSquashRatio=doSquash?detectVerticalSquash(img,iw,ih):1;var dw=Math.ceil(d*width/iw);var dh=Math.ceil(d*height/ih/vertSquashRatio);var sy=0;var dy=0;while(sy<ih){var sx=0;var dx=0;while(sx<iw){tmpCtx.clearRect(0,0,d,d);tmpCtx.drawImage(img,-sx,-sy);ctx.drawImage(tmpCanvas,0,0,d,d,dx,dy,dw,dh);sx+=d;dx+=dw}sy+=d;dy+=dh}ctx.restore();tmpCanvas=tmpCtx=null}function transformCoordinate(canvas,width,height,orientation){switch(orientation){case 5:case 6:case 7:case 8:canvas.width=height;canvas.height=width;break;default:canvas.width=width;canvas.height=height}var ctx=canvas.getContext('2d');switch(orientation){case 2:ctx.translate(width,0);ctx.scale(-1,1);break;case 3:ctx.translate(width,height);ctx.rotate(Math.PI);break;case 4:ctx.translate(0,height);ctx.scale(1,-1);break;case 5:ctx.rotate(0.5*Math.PI);ctx.scale(1,-1);break;case 6:ctx.rotate(0.5*Math.PI);ctx.translate(0,-height);break;case 7:ctx.rotate(0.5*Math.PI);ctx.translate(width,-height);ctx.scale(-1,1);break;case 8:ctx.rotate(-0.5*Math.PI);ctx.translate(-width,0);break;default:break}}function MegaPixImage(srcImage){if(srcImage instanceof Blob){var img=new Image();var URL=window.URL&&window.URL.createObjectURL?window.URL:window.webkitURL&&window.webkitURL.createObjectURL?window.webkitURL:null;if(!URL){throw Error("No createObjectURL function found to create blob url")}img.src=URL.createObjectURL(srcImage);this.blob=srcImage;srcImage=img}if(!srcImage.naturalWidth&&!srcImage.naturalHeight){var _this=this;srcImage.onload=function(){var listeners=_this.imageLoadListeners;if(listeners){_this.imageLoadListeners=null;for(var i=0,len=listeners.length;i<len;i++){listeners[i]()}}};this.imageLoadListeners=[]}this.srcImage=srcImage}MegaPixImage.prototype.render=function(target,options){if(this.imageLoadListeners){var _this=this;this.imageLoadListeners.push(function(){_this.render(target,options)});return}options=options||{};var imgWidth=this.srcImage.naturalWidth,imgHeight=this.srcImage.naturalHeight,width=options.width,height=options.height,maxWidth=options.maxWidth,maxHeight=options.maxHeight,doSquash=!this.blob||this.blob.type==='image/jpeg';if(width&&!height){height=(imgHeight*width/imgWidth)<<0}else if(height&&!width){width=(imgWidth*height/imgHeight)<<0}else{width=imgWidth;height=imgHeight}if(maxWidth&&width>maxWidth){width=maxWidth;height=(imgHeight*width/imgWidth)<<0}if(maxHeight&&height>maxHeight){height=maxHeight;width=(imgWidth*height/imgHeight)<<0}var opt={width:width,height:height};for(var k in options)opt[k]=options[k];var tagName=target.tagName.toLowerCase();if(tagName==='img'){target.src=renderImageToDataURL(this.srcImage,opt,doSquash)}else if(tagName==='canvas'){renderImageToCanvas(this.srcImage,target,opt,doSquash)}if(typeof this.onrender==='function'){this.onrender(target)}};if(typeof define==='function'&&define.amd){define([],function(){return MegaPixImage})}else{this.MegaPixImage=MegaPixImage}})();



  function WACropper (el, options) {
    this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
    
    this.options = {

      maskWidth : this.winSize(1),
      maskHeight : this.winSize(0),
      maskDiv : '<input type="file" name="file" accept="image/*" capture="camera" class="wa--input" id="WAinput" /><div id="WAmask" class="wa--pper js--wapper"><a class="btn btn-success post">OK</a><a class="btn  btn-danger cancle">CANCLE</a><div id="WAPoint" class="point"></div></div>'
    };

    // draw wa element
    var para = document.createElement("div");
    para.id = "wacropper";
    para.innerHTML =  this.options.maskDiv ;
    document.body.appendChild(para);

    // set up camera input
    // console.log(this.wrapper.offsetWidth + ',' + this.wrapper.offsetHeight + ',' + this.wrapper.offsetLeft + ',' + this.wrapper.offsetTop);
    var WAinput = document.getElementById('WAinput');
    WAinput.style.left = this.wrapper.offsetLeft + 'px';
    WAinput.style.top = this.wrapper.offsetTop + 'px';
    WAinput.style.height = this.wrapper.offsetHeight + 'px';
    WAinput.style.width = this.wrapper.offsetWidth + 'px';


    // create canvas

    var canvas = document.createElement('canvas');
    var WAPper = document.getElementById("WAmask");
    console.log(this.options);

    canvas.id = "WABaseLayer";
    canvas.width = this.options.maskWidth;
    canvas.height = this.options.maskHeight;
    canvas.style.zIndex = 50;
    canvas.style.position = "absolute";
    canvas.style.border = "0px solid";
    canvas.style.top = "3em";
    canvas.style.display = "none";
    WAPper.appendChild(canvas);
    
    var canvas2 = document.createElement('canvas');
    // canvas2 = canvas;
    canvas2.id = "WAShowLayer";
    canvas2.width = this.options.maskWidth;
    canvas2.height = this.options.maskHeight;
    canvas2.style.zIndex = 50;
    canvas2.style.position = "absolute";
    canvas2.style.border = "0px solid";
    canvas2.style.top = "3em";
    canvas2.style.display = "none";
    WAPper.appendChild(canvas2);


    // Create data image elm
    var savedData = new Image();


    // Set up canvas
    var WAMask = document.getElementById('WAmask');
    var WACanvas = document.getElementById("WABaseLayer");
    var ctx  = WACanvas.getContext("2d");
    var WAShow = document.getElementById("WAShowLayer");
    var cshow  = WAShow.getContext("2d");
    // console.log(WAMask);

    // set up point with hammer.
    var WAPoint = document.getElementById('WAPoint');
    console.log(WAPoint);
    var hammertime = Hammer(WAPoint, {
      transform_always_block: true,
      transform_min_scale: 1,
      drag_block_horizontal: true,
      drag_block_vertical: true,
      drag_min_distance: 0
    });
    var posX=0, posY=0,last_posX,last_posY,
        scale=1, last_scale,
        rotation= 1, last_rotation;
    var touchEd = false;
    hammertime.on("touch drag transform", function(ev) {
      switch(ev.type) {
        case 'touch':
          last_scale = scale;
          last_rotation = rotation;
          // $("#backcanvas").hide();
          touchEd = true;
          break;
        case 'drag':
          posX = ev.gesture.deltaX ;
          posY = ev.gesture.deltaY ;
          // console.log('drag');
          break;
        case 'transform':
          rotation = last_rotation + ev.gesture.rotation;
          scale = Math.max(0.45, Math.min(last_scale * ev.gesture.scale, 2.4));
          break;
      }
       // transform!
      var transform =
        "translate3d("+posX+"px,"+posY+"px, 0) " +
        "scale3d("+scale+","+scale+", 0) " +
        // "scale("+scale+","+scale+") " +
        "rotate("+rotation+"deg) ";
      console.log("translate3d("+posX+"px,"+posY+"px, 0) " +"scale3d("+scale+","+scale+", 0) " + "rotate("+rotation+"deg) ");
      // console.log(savedData.src);
      WACanvas.style.transform = transform;
      WACanvas.style.oTransform = transform;
      WACanvas.style.msTransform = transform;
      WACanvas.style.mozTransform = transform;
      WACanvas.style.webkitTransform = transform;

      // var x = Number(WACanvas.width); //canvas.width / 2;
      // var y = Number(WACanvas.height);//canvas.height / 2;
      // var width = Number(WACanvas.width);//image.width;
      // var height = Number(WACanvas.height); //image.height;
      // ctx.clearRect (0,0,width,height);
      // ctx.save();
      // ctx.translate(posX,posY);
      // var angleInRadians = rotation * Math.PI / 180;
      // ctx.rotate(angleInRadians);
      // ctx.scale(scale, scale);
      // // ctx.drawImage(savedData, -width / 2, -height / 2, width, height);
      // try{
      //   // ctx.drawImage(savedData, -width / 2, -height / 2, width, height);
      // } catch(err) { alert(err);}
      // ctx.restore();
      // // takeNewCanvas();
    });

    // show image you croped
    var WApost = document.getElementsByClassName('post')[0];
    console.log(WApost);
    var Showtime = Hammer(WApost, {
      transform_always_block: true,
      transform_min_scale: 1,
      drag_block_horizontal: true,
      drag_block_vertical: true,
      drag_min_distance: 0
    });
    Showtime.on("touch", function(ev) {
      console.log(WACanvas.style.transform);
      console.log("translate3d("+posX+"px,"+posY+"px, 0) " +"scale3d("+scale+","+scale+", 0) " + "rotate("+rotation+"deg) ");
    });
    // get input image data
    WAinput.onchange = function (e) {
      // if(event.target.files.length == 1 && event.target.files[0].type.indexOf("image/") == 0) {
        var d = new Date();
        // console.log('Selected a new image. @' + d.getTime());
        var file = WAinput.files[0];
        ctx.clearRect (0,0,9999,9999);

        var mpImg = new MegaPixImage(file);
        EXIF.getData(file, function() {
          
          var picX = EXIF.getTag(this,"PixelXDimension");
          var picY = EXIF.getTag(this,"PixelYDimension");
          // alert("picX:" + picX + ",picY:" + picY);
          if (picX>picY){
            mpImg.render(WACanvas, { maxWidth: WAMask.offsetWidth, maxHeight: WAMask.offsetHeight, orientation: 6 });
          }else{
            mpImg.render(WACanvas, { maxWidth: WAMask.offsetWidth, maxHeight: WAMask.offsetHeight, orientation: 0 });
          }
          console.log(EXIF.pretty(this));
          var dataURL = WACanvas.toDataURL();
          savedData.src = dataURL;
          dataURL = null;
        });
      // });

      console.log(file);
      WAMask.style.display = 'block';
      WACanvas.style.display = 'block';

      // input image data from input to canvas
    };

    
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