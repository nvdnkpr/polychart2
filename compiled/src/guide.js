(function() {
  var Axis, Guide, Legend, XAxis, YAxis, poly, sf,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  poly = this.poly || {};

  sf = poly["const"].scaleFns;

  Guide = (function() {

    function Guide() {}

    Guide.prototype.getWidth = function() {};

    Guide.prototype.getHeight = function() {};

    return Guide;

  })();

  Axis = (function(_super) {

    __extends(Axis, _super);

    function Axis() {
      this._modify = __bind(this._modify, this);
      this._add = __bind(this._add, this);
      this.render = __bind(this.render, this);
      this.make = __bind(this.make, this);      this.line = null;
      this.title = null;
      this.ticks = {};
      this.pts = {};
    }

    Axis.prototype.make = function(params) {
      var domain, guideSpec, type;
      domain = params.domain, type = params.type, guideSpec = params.guideSpec, this.titletext = params.titletext;
      return this.ticks = poly.tick.make(domain, guideSpec, type);
    };

    Axis.prototype.render = function(dim, renderer) {
      var added, axisDim, deleted, kept, newpts, t, _i, _j, _k, _len, _len2, _len3, _ref;
      axisDim = {
        top: dim.paddingTop + dim.guideTop,
        left: dim.paddingLeft + dim.guideLeft,
        bottom: dim.paddingTop + dim.guideTop + dim.chartHeight,
        width: dim.chartWidth,
        height: dim.chartHeight
      };
      if (this.line == null) this.line = this._renderline(renderer, axisDim);
      if (this.title != null) {
        this.title = renderer.animate(this.title, this._makeTitle(axisDim, this.titletext));
      } else {
        this.title = renderer.add(this._makeTitle(axisDim, this.titletext));
      }
      _ref = poly.compare(_.keys(this.pts), _.keys(this.ticks)), deleted = _ref.deleted, kept = _ref.kept, added = _ref.added;
      newpts = {};
      for (_i = 0, _len = kept.length; _i < _len; _i++) {
        t = kept[_i];
        newpts[t] = this._modify(renderer, this.pts[t], this.ticks[t], axisDim);
      }
      for (_j = 0, _len2 = added.length; _j < _len2; _j++) {
        t = added[_j];
        newpts[t] = this._add(renderer, this.ticks[t], axisDim);
      }
      for (_k = 0, _len3 = deleted.length; _k < _len3; _k++) {
        t = deleted[_k];
        this._delete(renderer, this.pts[t]);
      }
      this.pts = newpts;
      return this.rendered = true;
    };

    Axis.prototype._add = function(renderer, tick, axisDim) {
      var obj;
      obj = {};
      obj.tick = renderer.add(this._makeTick(axisDim, tick));
      obj.text = renderer.add(this._makeLabel(axisDim, tick));
      return obj;
    };

    Axis.prototype._delete = function(renderer, pt) {
      renderer.remove(pt.tick);
      return renderer.remove(pt.text);
    };

    Axis.prototype._modify = function(renderer, pt, tick, axisDim) {
      var obj;
      obj = [];
      obj.tick = renderer.animate(pt.tick, this._makeTick(axisDim, tick));
      obj.text = renderer.animate(pt.text, this._makeLabel(axisDim, tick));
      return obj;
    };

    Axis.prototype._renderline = function() {
      throw new poly.NotImplemented();
    };

    Axis.prototype._makeTitle = function() {
      throw new poly.NotImplemented();
    };

    Axis.prototype._makeTick = function() {
      throw new poly.NotImplemented();
    };

    Axis.prototype._makeLabel = function() {
      throw new poly.NotImplemented();
    };

    return Axis;

  })(Guide);

  XAxis = (function(_super) {

    __extends(XAxis, _super);

    function XAxis() {
      XAxis.__super__.constructor.apply(this, arguments);
    }

    XAxis.prototype._renderline = function(renderer, axisDim) {
      var x1, x2, y;
      y = sf.identity(axisDim.bottom);
      x1 = sf.identity(axisDim.left);
      x2 = sf.identity(axisDim.left + axisDim.width);
      return renderer.add({
        type: 'line',
        y: [y, y],
        x: [x1, x2]
      });
    };

    XAxis.prototype._makeTitle = function(axisDim, text) {
      return {
        type: 'text',
        x: sf.identity(axisDim.left + axisDim.width / 2),
        y: sf.identity(axisDim.bottom + 27),
        text: text,
        'text-anchor': 'middle'
      };
    };

    XAxis.prototype._makeTick = function(axisDim, tick) {
      return {
        type: 'line',
        x: [tick.location, tick.location],
        y: [sf.identity(axisDim.bottom), sf.identity(axisDim.bottom + 5)]
      };
    };

    XAxis.prototype._makeLabel = function(axisDim, tick) {
      return {
        type: 'text',
        x: tick.location,
        y: sf.identity(axisDim.bottom + 15),
        text: tick.value,
        'text-anchor': 'middle'
      };
    };

    return XAxis;

  })(Axis);

  YAxis = (function(_super) {

    __extends(YAxis, _super);

    function YAxis() {
      YAxis.__super__.constructor.apply(this, arguments);
    }

    YAxis.prototype._renderline = function(renderer, axisDim) {
      var x, y1, y2;
      x = sf.identity(axisDim.left);
      y1 = sf.identity(axisDim.top);
      y2 = sf.identity(axisDim.top + axisDim.height);
      return renderer.add({
        type: 'line',
        x: [x, x],
        y: [y1, y2]
      });
    };

    YAxis.prototype._makeTitle = function(axisDim, text) {
      return {
        type: 'text',
        x: sf.identity(axisDim.left - 22),
        y: sf.identity(axisDim.top + axisDim.height / 2),
        text: text,
        transform: 'r270',
        'text-anchor': 'middle'
      };
    };

    YAxis.prototype._makeTick = function(axisDim, tick) {
      return {
        type: 'line',
        x: [sf.identity(axisDim.left), sf.identity(axisDim.left - 5)],
        y: [tick.location, tick.location]
      };
    };

    YAxis.prototype._makeLabel = function(axisDim, tick) {
      return {
        type: 'text',
        x: sf.identity(axisDim.left - 7),
        y: tick.location,
        text: tick.value,
        'text-anchor': 'end'
      };
    };

    return YAxis;

  })(Axis);

  Legend = (function(_super) {

    __extends(Legend, _super);

    Legend.prototype.TITLEHEIGHT = 15;

    Legend.prototype.TICKHEIGHT = 12;

    Legend.prototype.SPACING = 10;

    function Legend(aes) {
      this.aes = aes;
      this._makeTick = __bind(this._makeTick, this);
      this.make = __bind(this.make, this);
      this.rendered = false;
      this.title = null;
      this.ticks = {};
      this.pts = {};
    }

    Legend.prototype.make = function(params) {
      var domain, guideSpec, type;
      domain = params.domain, type = params.type, guideSpec = params.guideSpec, this.mapping = params.mapping, this.titletext = params.titletext;
      return this.ticks = poly.tick.make(domain, guideSpec, type);
    };

    Legend.prototype.render = function(dim, renderer, offset) {
      var added, deleted, kept, legendDim, newpts, t, _i, _j, _k, _len, _len2, _len3, _ref;
      legendDim = {
        top: dim.paddingTop + dim.guideTop + offset,
        right: dim.paddingLeft + dim.guideLeft + dim.chartWidth,
        width: dim.guideRight,
        height: dim.chartHeight
      };
      if (this.title != null) {
        this.title = renderer.animate(this.title, this._makeTitle(legendDim, this.titletext));
      } else {
        this.title = renderer.add(this._makeTitle(legendDim, this.titletext));
      }
      _ref = poly.compare(_.keys(this.pts), _.keys(this.ticks)), deleted = _ref.deleted, kept = _ref.kept, added = _ref.added;
      newpts = {};
      for (_i = 0, _len = deleted.length; _i < _len; _i++) {
        t = deleted[_i];
        this._delete(renderer, this.pts[t]);
      }
      for (_j = 0, _len2 = kept.length; _j < _len2; _j++) {
        t = kept[_j];
        newpts[t] = this._modify(renderer, this.pts[t], this.ticks[t], legendDim);
      }
      for (_k = 0, _len3 = added.length; _k < _len3; _k++) {
        t = added[_k];
        newpts[t] = this._add(renderer, this.ticks[t], legendDim);
      }
      this.pts = newpts;
      return this.TITLEHEIGHT + this.TICKHEIGHT * (added.length + kept.length) + this.SPACING;
    };

    Legend.prototype.remove = function(renderer) {
      var i, pt, _ref;
      _ref = this.pts;
      for (i in _ref) {
        pt = _ref[i];
        this._delete(renderer, pt);
      }
      renderer.remove(this.title);
      this.title = null;
      return this.pts = {};
    };

    Legend.prototype._add = function(renderer, tick, legendDim) {
      var obj;
      obj = {};
      obj.tick = renderer.add(this._makeTick(legendDim, tick));
      obj.text = renderer.add(this._makeLabel(legendDim, tick));
      return obj;
    };

    Legend.prototype._delete = function(renderer, pt) {
      renderer.remove(pt.tick);
      return renderer.remove(pt.text);
    };

    Legend.prototype._modify = function(renderer, pt, tick, legendDim) {
      var obj;
      obj = [];
      obj.tick = renderer.animate(pt.tick, this._makeTick(legendDim, tick));
      obj.text = renderer.animate(pt.text, this._makeLabel(legendDim, tick));
      return obj;
    };

    Legend.prototype._makeLabel = function(legendDim, tick) {
      return {
        type: 'text',
        x: sf.identity(legendDim.right + 15),
        y: sf.identity(legendDim.top + (15 + tick.index * 12) + 1),
        text: tick.value,
        'text-anchor': 'start'
      };
    };

    Legend.prototype._makeTick = function(legendDim, tick) {
      var aes, obj, value, _ref;
      obj = {
        type: 'circle',
        x: sf.identity(legendDim.right + 7),
        y: sf.identity(legendDim.top + (15 + tick.index * 12)),
        size: sf.identity(5),
        color: sf.identity('steelblue')
      };
      _ref = this.mapping;
      for (aes in _ref) {
        value = _ref[aes];
        if (__indexOf.call(this.aes, aes) >= 0) {
          obj[aes] = tick.location;
        } else if ((value.type != null) && value.type === 'const') {
          obj[aes] = sf.identity(value.value);
        } else if (!_.isObject(value)) {
          obj[aes] = value;
        } else {
          obj[aes] = poly["const"].defaults[aes];
        }
      }
      return obj;
    };

    Legend.prototype._makeTitle = function(legendDim, text) {
      return {
        type: 'text',
        x: sf.identity(legendDim.right + 5),
        y: sf.identity(legendDim.top),
        text: text,
        'text-anchor': 'start'
      };
    };

    return Legend;

  })(Guide);

  poly.guide = {};

  poly.guide.axis = function(type) {
    if (type === 'x') return new XAxis();
    return new YAxis();
  };

  poly.guide.legend = function(aes) {
    return new Legend(aes);
  };

  this.poly = poly;

}).call(this);