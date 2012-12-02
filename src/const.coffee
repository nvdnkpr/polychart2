poly = @poly || {}

###
CONSTANTS
---------
These are constants that are referred to throughout the coebase
###
poly.const =
  aes : ['x', 'y', 'color', 'size', 'opacity', 'shape', 'id']
  scaleFns :
    novalue : () -> {v: null, f: 'novalue', t: 'scalefn'}
    upper: (v) -> {v: v, f: 'upper', t: 'scalefn'}
    lower: (v) -> {v: v, f: 'lower', t: 'scalefn'}
    middle: (v) -> {v: v, f: 'middle', t: 'scalefn'}
    jitter: (v) -> {v: v, f: 'jitter', t: 'scalefn'}
    identity: (v) -> {v: v, f: 'identity', t: 'scalefn'}
  epsilon : Math.pow(10, -7)
  defaults :
    'x': {v: null, f: 'novalue', t: 'scalefn'}
    'y': {v: null, f: 'novalue', t: 'scalefn'}
    'color': 'steelblue'
    'size': 2
    'opacity': 0.7

@poly = poly