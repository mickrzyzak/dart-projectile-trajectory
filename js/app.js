window.onload = (event) => {
  /* Vue App */
  var app = new Vue({
    el: '#app',
    data: {
      dartX: 100,
      dartY: 400,
      dartRange: 300,
      dartTwist: 150,
      dartTrajectory: [],
      cursorX: 400,
      cursorY: 100,
      targetX: 0,
      targetY: 0,
      followCursor: false
    },
    computed: {
      dartR: function() {
        return -Math.atan2(this.dartX - this.cursorX, this.dartY - this.cursorY) * (180 / Math.PI);
      }
    },
    created: function() {
        this.targetPosition();
    },
    watch: {
      dartR: function() {
        this.targetPosition();
      },
      dartRange: function() {
        this.targetPosition();
      },
      dartTwist: function() {
        this.targetPosition();
      }
    },
    methods: {
      distance: function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
      },
      targetPosition: function() {
        let distance = this.distance(this.dartX, this.dartY, this.cursorX, this.cursorY);
        let a = this.cursorX - this.dartX;
        let b = this.cursorY - this.dartY;
        let c = (distance <= this.dartRange) ? 1 : (this.dartRange * 100 / distance) / 100;
        this.targetX = parseFloat(this.dartX) + a * c;
        this.targetY = parseFloat(this.dartY) + b * c;
        this.trajectory(a * c, b * c);
      },
      trajectory: function(a, b) {
        let points = [];
        let iterations = this.distance(this.dartX, this.dartY, this.targetX, this.targetY) / 20;
        let x = a / iterations;
        let y = b / iterations;
        for(i = 1; i < iterations; i++) {
          let pointX = parseFloat(this.dartX) + x * i;
          let pointY = parseFloat(this.dartY) + y * i;
          let iPercent = i * 100 / iterations / 100;
          let twister = this.twisterFunc(iPercent);
          pointX += twister * this.dartTwist * Math.cos(this.dartR * Math.PI / 180);
          pointY += twister * this.dartTwist * Math.sin(this.dartR * Math.PI / 180);
          points.push({
            x: pointX,
            y: pointY
          });
        }
        this.dartTrajectory = points;
      },
      twisterFunc: function(x) {
        return -Math.pow(x, 2) + x;
      },
      cursorPosition: function(event) {
        this.cursorX = event.layerX;
        this.cursorY = event.layerY;
      },
      followCursorFunc: function(event) {
        if(this.followCursor) {
          this.cursorX = event.layerX;
          this.cursorY = event.layerY;
        }
      },
      dartPosition: function(event) {
        event.preventDefault();
        this.dartX = event.layerX;
        this.dartY = event.layerY;
      },
      dartTwistChange: function(event) {
        let vector = (event.deltaY >= 0) ? 10 : -10;
        this.dartTwist += vector;
      }
    }
  });
};
