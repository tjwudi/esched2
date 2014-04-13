// Generated by CoffeeScript 1.6.3
/*
  Elevator Simulator
  Author: John Wu (Tongji University)
*/(function(){var e;e=angular.module("evtsim",[]);e.constant("constant",{stycnt:20,styids:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],evtcnt:4,evtids:[0,1,2,3,4],timeunit:1e3});e.factory("RequestQueue",["constant",function(e){var t;return t=function(){function t(){var t,n,r;this._data=[!1];for(t=n=1,r=e.stycnt;1<=r?n<=r:n>=r;t=1<=r?++n:--n)this._data.push(!1)}t.prototype.isEmpty=function(){var e,t,n,r;r=this._data;for(t=0,n=r.length;t<n;t++){e=r[t];if(e)return!1}return!0};t.prototype.addRequest=function(t,n,r){console.log("添加中"+t+" "+n+" "+r);if(!(r===1&&n>t||r===-1&&n<t)&&1<=t&&t<=e.stycnt&&1<=n&&n<=e.stycnt){this._data[t]=!0;return!0}return!1};t.prototype.resolveRequest=function(e){return this._data[e]=!1};t.prototype.getNearestRequest=function(e,t){var n;return t===1?this._getNearestRequestFromBottomToTop(e):t===-1?this._getNearestRequestFromTopToButtom(e):(n=this._getNearestRequestFromBottomToTop(e))!=null?n:this._getNearestRequestFromTopToButtom(e)};t.prototype._getNearestRequestFromBottomToTop=function(t){var n,r,i;for(n=r=t,i=e.stycnt;t<=i?r<=i:r>=i;n=t<=i?++r:--r)if(this._data[n])return n;return-1};t.prototype._getNearestRequestFromTopToButtom=function(e){var t,n;for(t=n=e;e<=1?n<=1:n>=1;t=e<=1?++n:--n)if(this._data[t])return t;return-1};return t}()}]);e.factory("Elevator",["RequestQueue","constant","$rootScope",function(e,t,n){var r;return r=function(){function r(t){this.id=t;this.cursty=1;this.status=0;this.requestQueue=new e;this._fakeThreadWorking=!1;this._fakeThreadFn=this._step.bind(this)}r.prototype.addRequest=function(e,t){var n;n=this.requestQueue.addRequest(e,this.cursty,this.status);console.log("【电梯"+this.id+"】：addRequest: 添加请求到"+e+"楼, 目前电梯状态"+this.status);if(n){this.onStatusMayChange();return!0}return!1};r.prototype.onStatusMayChange=function(){if(this.requestQueue.isEmpty()&&this.status!==0){this.status=0;console.log("【电梯"+this.id+"】：状态改到0")}else if(this.requestQueue.getNearestRequest(this.cursty,this.status)>=this.cursty&&this.status!==1){this.status=1;console.log("【电梯"+this.id+"】：状态改到1")}else if(this.requestQueue.getNearestRequest(this.cursty,this.status)<=this.cursty&&this.status!==-1){this.status=-1;console.log("【电梯"+this.id+"】：状态改到-1")}n.$apply();if(!this._fakeThreadWorking&&!this.requestQueue.isEmpty()){setTimeout(this._fakeThreadFn,t.timeunit);return this._fakeThreadWorking=!0}};r.prototype._step=function(){var e;e=this.requestQueue.getNearestRequest(this.cursty,this.status);if(e===this.cursty){this.requestQueue.resolveRequest(this.cursty);console.log("【电梯"+this.id+"】：到达一次目的地，这里是"+this.cursty);this._fakeThreadWorking=!1;return this.onStatusMayChange()}e>this.cursty?this._moveUp():this._moveDown();return setTimeout(this._fakeThreadFn,t.timeunit)};r.prototype._moveUp=function(){this.cursty++;n.$apply();return console.log("【电梯"+this.id+"】：到"+this.cursty)};r.prototype._moveDown=function(){this.cursty--;n.$apply();return console.log("【电梯"+this.id+"】到"+this.cursty)};return r}()}]);e.factory("elevators",["Elevator","constant",function(e,t){var n,r,i,s;r=[];for(n=i=0,s=t.evtcnt;0<=s?i<=s:i>=s;n=0<=s?++i:--i)r.push(new e(n));return r}]);e.service("RequestDispatcher",["elevators","constant",function(e,t){return this.dispatch=function(n,r){var i,s,o;for(s=0,o=e.length;s<o;s++){i=e[s];if(Math.abs(r-e.status)===2)continue;if(i.addRequest(n))return}return setTimeout(t.timeunit/2,this.dispatch)}}]);e.directive("evtCtrl",["constant",function(e){return{replace:!0,transclude:!0,scope:{evtid:"@"},template:'<section class="ctrl-evt">               <div class="form-common">                 <button>开门</button>                 <button>关门</button>                 <button>警报</button>               </div>               <div class="form-num">                 <button ng-repeat="styid in $parent.constant.styids" data-evtid="{{evtid}}" data-styid="{{styid}}" btn-inner>{{styid}}</button>               </div>             </section>'}}]);e.directive("styCtrl",[function(){return{replace:!0,transclude:!0,scope:{styid:"@"},template:'<section class="ctrl-sty">      <h5>{{styid}}</h5>      <div class="form-arrow">        <button data-styid="{{styid}}" data-dir="1" btn-outer>↑</button>        <button data-styid="{{styid}}" data-dir="-1" btn-outer>↓</button>      </div>    </section>'}}]);e.directive("btnInner",["elevators",function(e){return{link:function(t,n,r){return n.bind("click",function(t){var r,i;i=n[0].dataset.styid;r=n[0].dataset.evtid;if(!e[r].addRequest(i))return alert("注册任务失败！")})}}}]);e.directive("btnOuter",["RequestDispatcher",function(e){return{link:function(t,n,r){return n.bind("click",function(t){var r,i;i=n[0].dataset.styid;r=n[0].dataset.dir;return e.dispatch(i,r)})}}}]);e.run(["$rootScope","constant","elevators",function(e,t,n){e.constant=t;return e.elevators=n}])}).call(this);