function EventQueue(delayTime) {
  this._delayTime = delayTime || 20;
  this._queue = [];
  this._canRun = true;
}


EventQueue.prototype = {
  add: function (fn, params) {
    this._queue.push({
      fn: fn,
      params: params
    });
    return this;

  },

  start: function () {
    this._canRun = true
    if (this._delayTime <= 0) {
      this.run(true);
    } else {
      var self = this;
      setTimeout(function () {
        self.run(true);
      }, self._delayTime);
    }
  },

  run: function (start = false) {
    if(!this._canRun)return;
    var item = this._queue.shift();
    if (item) {
      this._canRun = false
      let self = this;
        item.fn(item.params, function () {
          if(start){
            self._canRun = true;
            self.run(true);
            return self;
          }
          self.run()
        })
      }
    return self
  },

  stop: function (){
    this._queue.unshift(null)
    return this;
  },

  next:function(){
      this.run();
      return this;
  }

};
