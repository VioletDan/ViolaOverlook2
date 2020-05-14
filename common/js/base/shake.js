function Shake() {

    var $lev = 0, $now = 0, $lastTime, $lastX, $lastY, $lastZ, $pause;
    var $dirXLast = 0, $dirYLast = 0, $dirZLast = 0;
    var $stop = false;
    var $start = false;
    var $this;
    var opts = {};
    var shake = {};

    shake.on = function (_this,options) {
      console.log('shake on');
      $this = _this;
      console.log($this);
      let defaults = { hold: 100, max: 10, pauseDelay: 500, type: 0 };
      Object.assign(opts, defaults, options);
      console.log(opts);
      this.init();
      $stop = false;
      if (!$start) shake_handler();
    }//end public

    function shake_handler(){
      $start = true;
      wx.onAccelerometerChange(accelerometer_handler);
    }//end private

    function accelerometer_handler(res){
      if (!$stop){
        var curTime = new Date().getTime();
        var diffTime = curTime - $lastTime;
        $lastTime = curTime;
        // 获取含重力的加速度
        var disX = res.x * 100 - $lastX;
        var disY = res.y * 100 - $lastY;
        var disZ = res.z * 100 - $lastZ;
        var dirX = disX > 0 ? 1 : -1;
        var dirY = disY > 0 ? 1 : -1;
        var dirZ = disZ > 0 ? 1 : -1;
        var speedX = Math.abs(disX) / diffTime * 10000;
        var speedY = Math.abs(disY) / diffTime * 10000;
        var speedZ = Math.abs(disZ) / diffTime * 10000;
        if (opts.onShake) opts.onShake(speedX, speedY, speedZ);
        if ((dirX != $dirXLast && speedX >= opts.hold) || (dirY != $dirYLast && speedY >= opts.hold) || (dirZ != $dirZLast && speedZ >= opts.hold)) {
          $lev++;
          $now++;
          if (opts.onCount) opts.onCount($now);
          if ($now == 1 && opts.onStart) opts.onStart();
          else if ((!opts.type && $lev == opts.max) || (opts.type && $now == opts.max)) {
            if (opts.onComplete) opts.onComplete();
            shake.off();
          }//end if
          clearTimeout($pause);
          $pause = setTimeout(function () {
            if (opts.onPause) opts.onPause();
          }, opts.pauseDelay);
        }//end if
        else {
          $lev--;
          $lev = $lev < 0 ? 0 : $lev;
        }//end else 
        if (opts.onLevel) opts.onLevel($lev);
        $lastX = res.x * 100;
        $lastY = res.y * 100;
        $lastZ = res.z * 100;
        $dirXLast = dirX;
        $dirYLast = dirY;
        $dirZLast = dirZ;
      }//end if 
    }//edn func

    shake.off = function () {
      console.log('shake off');
      $stop=true;
    }//end public

    shake.init = function () {
        $lev = 0;
        $now = 0;
        $lastTime = null;
        $lastX = null;
        $lastY = null;
        $lastZ = null;
        $stop = null;
        $lastTime = new Date().getTime();
    }//end public

    return shake;

}//edn class

module.exports = Shake();