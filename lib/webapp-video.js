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
/*!
 * move
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */(function(exports){var current=window.getComputedStyle||window.currentStyle,map={top:"px",bottom:"px",left:"px",right:"px",width:"px",height:"px","font-size":"px",margin:"px","margin-top":"px","margin-bottom":"px","margin-left":"px","margin-right":"px",padding:"px","padding-top":"px","padding-bottom":"px","padding-left":"px","padding-right":"px"};exports.move=function(selector){return new Move(move.select(selector))},exports.move.version="0.0.3",move.defaults={duration:500},move.ease={"in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",linear:"cubic-bezier(0.250, 0.250, 0.750, 0.750)","ease-in-quad":"cubic-bezier(0.550, 0.085, 0.680, 0.530)","ease-in-cubic":"cubic-bezier(0.550, 0.055, 0.675, 0.190)","ease-in-quart":"cubic-bezier(0.895, 0.030, 0.685, 0.220)","ease-in-quint":"cubic-bezier(0.755, 0.050, 0.855, 0.060)","ease-in-sine":"cubic-bezier(0.470, 0.000, 0.745, 0.715)","ease-in-expo":"cubic-bezier(0.950, 0.050, 0.795, 0.035)","ease-in-circ":"cubic-bezier(0.600, 0.040, 0.980, 0.335)","ease-in-back":"cubic-bezier(0.600, -0.280, 0.735, 0.045)","ease-out-quad":"cubic-bezier(0.250, 0.460, 0.450, 0.940)","ease-out-cubic":"cubic-bezier(0.215, 0.610, 0.355, 1.000)","ease-out-quart":"cubic-bezier(0.165, 0.840, 0.440, 1.000)","ease-out-quint":"cubic-bezier(0.230, 1.000, 0.320, 1.000)","ease-out-sine":"cubic-bezier(0.390, 0.575, 0.565, 1.000)","ease-out-expo":"cubic-bezier(0.190, 1.000, 0.220, 1.000)","ease-out-circ":"cubic-bezier(0.075, 0.820, 0.165, 1.000)","ease-out-back":"cubic-bezier(0.175, 0.885, 0.320, 1.275)","ease-out-quad":"cubic-bezier(0.455, 0.030, 0.515, 0.955)","ease-out-cubic":"cubic-bezier(0.645, 0.045, 0.355, 1.000)","ease-in-out-quart":"cubic-bezier(0.770, 0.000, 0.175, 1.000)","ease-in-out-quint":"cubic-bezier(0.860, 0.000, 0.070, 1.000)","ease-in-out-sine":"cubic-bezier(0.445, 0.050, 0.550, 0.950)","ease-in-out-expo":"cubic-bezier(1.000, 0.000, 0.000, 1.000)","ease-in-out-circ":"cubic-bezier(0.785, 0.135, 0.150, 0.860)","ease-in-out-back":"cubic-bezier(0.680, -0.550, 0.265, 1.550)"},move.select=function(selector){if("string"!=typeof selector)return selector;return document.getElementById(selector)||document.querySelectorAll(selector)[0]};function EventEmitter(){this.callbacks={}}EventEmitter.prototype.on=function(event,fn){(this.callbacks[event]=this.callbacks[event]||[]).push(fn);return this},EventEmitter.prototype.emit=function(event){var args=Array.prototype.slice.call(arguments,1),callbacks=this.callbacks[event],len;if(callbacks){len=callbacks.length;for(var i=0;i<len;++i)callbacks[i].apply(this,args)}return this},exports.Move=function Move(el){if(!(this instanceof Move))return new Move(el);EventEmitter.call(this),this.el=el,this._props={},this._rotate=0,this._transitionProps=[],this._transforms=[],this.duration(move.defaults.duration)},Move.prototype=new EventEmitter,Move.prototype.constructor=Move,Move.prototype.transform=function(transform){this._transforms.push(transform);return this},Move.prototype.skew=function(x,y){y=y||0;return this.transform("skew("+x+"deg, "+y+"deg)")},Move.prototype.skewX=function(n){return this.transform("skewX("+n+"deg)")},Move.prototype.skewY=function(n){return this.transform("skewY("+n+"deg)")},Move.prototype.translate=Move.prototype.to=function(x,y){y=y||0;return this.transform("translate("+x+"px, "+y+"px)")},Move.prototype.translateX=Move.prototype.x=function(n){return this.transform("translateX("+n+"px)")},Move.prototype.translateY=Move.prototype.y=function(n){return this.transform("translateY("+n+"px)")},Move.prototype.scale=function(x,y){y=null==y?x:y;return this.transform("scale("+x+", "+y+")")},Move.prototype.scaleX=function(n){return this.transform("scaleX("+n+")")},Move.prototype.scaleY=function(n){return this.transform("scaleY("+n+")")},Move.prototype.rotate=function(n){return this.transform("rotate("+n+"deg)")},Move.prototype.ease=function(fn){fn=move.ease[fn]||fn||"ease";return this.setVendorProperty("transition-timing-function",fn)},Move.prototype.animate=function(name,props){for(var i in props)props.hasOwnProperty(i)&&this.setVendorProperty("animation-"+i,props[i]);return this.setVendorProperty("animation-name",name)},Move.prototype.duration=function(n){n=this._duration="string"==typeof n?parseFloat(n)*1e3:n;return this.setVendorProperty("transition-duration",n+"ms")},Move.prototype.delay=function(n){n="string"==typeof n?parseFloat(n)*1e3:n;return this.setVendorProperty("transition-delay",n+"ms")},Move.prototype.setProperty=function(prop,val){this._props[prop]=val;return this},Move.prototype.setVendorProperty=function(prop,val){this.setProperty("-webkit-"+prop,val),this.setProperty("-moz-"+prop,val),this.setProperty("-ms-"+prop,val),this.setProperty("-o-"+prop,val);return this},Move.prototype.set=function(prop,val){this.transition(prop),"number"==typeof val&&map[prop]&&(val+=map[prop]),this._props[prop]=val;return this},Move.prototype.add=function(prop,val){if(!!current){var self=this;return this.on("start",function(){var curr=parseInt(self.current(prop),10);self.set(prop,curr+val+"px")})}},Move.prototype.sub=function(prop,val){if(!!current){var self=this;return this.on("start",function(){var curr=parseInt(self.current(prop),10);self.set(prop,curr-val+"px")})}},Move.prototype.current=function(prop){return current(this.el).getPropertyValue(prop)},Move.prototype.transition=function(prop){if(!this._transitionProps.indexOf(prop))return this;this._transitionProps.push(prop);return this},Move.prototype.applyProperties=function(){var props=this._props,el=this.el;for(var prop in props)props.hasOwnProperty(prop)&&el.style.setProperty(prop,props[prop],"");return this},Move.prototype.move=Move.prototype.select=function(selector){this.el=move.select(selector);return this},Move.prototype.then=function(fn){if(fn instanceof Move)this.on("end",function(){fn.end()});else if("function"==typeof fn)this.on("end",fn);else{var clone=new Move(this.el);clone._transforms=this._transforms.slice(0),this.then(clone),clone.parent=this;return clone}return this},Move.prototype.pop=function(){return this.parent},Move.prototype.end=function(fn){var self=this;this.emit("start"),this._transforms.length&&this.setVendorProperty("transform",this._transforms.join(" ")),this.setVendorProperty("transition-properties",this._transitionProps.join(", ")),this.applyProperties(),fn&&this.then(fn),setTimeout(function(){self.emit("end")},this._duration);return this}})(this);



  function WACropper (el, options) {
    this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
    
    this.options = {

      maskWidth : this.winSize(1),
      maskHeight : this.winSize(0),
      maskDiv : '<input type="file" name="file" accept="video/mp4,video/x-m4v,video/*" capture="camera" class="wa--input" id="WAinput" /><div id="WAmask" class="wa--pper js--wapper"><a class="btn btn-success post">OK</a><a class="btn  btn-danger cancle">CANCLE</a><video id="myVideo" controls>Your browser does not support the <code>video</code> element.</video></div>'
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

    var WAMask = document.getElementById('WAmask');

    WAinput.onchange = function (e) {
      // if(event.target.files.length == 1 && event.target.files[0].type.indexOf("image/") == 0) {
        var d = new Date();
        // console.log('Selected a new image. @' + d.getTime());
        var file = WAinput.files[0];
        var vid = document.getElementById('myVideo');
        vid.src = WAinput.value;
        vid.play();

      // });

      console.log(file);
      WAMask.style.display = 'block';


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