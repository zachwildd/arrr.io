function Shape(points, x, y, color, stroke) {
  this.x = x || 0;
  this.y = y || 0;
  this.points = points.map(el => ({ x: el[0], y: el[1] }));
  this.color = color || 'rgba(0,0,0,0)';
  this.stroke = stroke || 'black';
  this.getNormals();
  this.getMedians();
}

Shape.prototype.draw = function (ctx) {
  const p = this.points;

  ctx.save();
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.stroke;
  ctx.lineWidth = 3;
  ctx.translate(this.x, this.y);
  p.forEach((point, i) => {
    if (i === 0) {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    } else if (i === (p.length - 1)) {
      ctx.lineTo(point.x, point.y);
      ctx.lineTo(p[0].x, p[0].y);
      ctx.stroke();
      ctx.fill();
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.closePath();
  ctx.restore();
};

Shape.prototype.drawNormals = function (ctx) {
  const m = this.medians;
  const n = this.normals;
  const size = 15;
  let med;

  ctx.save();

  ctx.lineWidth = 5;
  ctx.strokeStyle = '#003300';
  ctx.fillStyle = 'green';

  ctx.translate(this.x, this.y);

  m.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  });

  ctx.fillStyle = 'red';
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#003300';

  n.forEach((point, i) => {
    ctx.beginPath();
    med = m[i % m.length];
    ctx.moveTo(med.x, med.y);
    ctx.lineTo(med.x + point.x * size, med.y + point.y * size);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  });

  ctx.restore();
};

Shape.prototype.getNormals = function () {
  const p = this.points;
  const n = p.length;
  let crt; let nxt; let l; let x1; let
    y1;

  this.normals = [];
  for (let i = 0; i < n; i++) {
    crt = p[i];
    nxt = p[i + 1] || p[0];
    x1 = (nxt.y - crt.y);
    y1 = -(nxt.x - crt.x);
    l = Math.sqrt(x1 * x1 + y1 * y1);
    this.normals[i] = { x: x1 / l, y: y1 / l };
    this.normals[n + i] = { x: -x1 / l, y: -y1 / l };
  }
};

Shape.prototype.getMedians = function () {
  const p = this.points;
  let crt; let
    nxt;

  this.medians = [];

  for (let i = 0; i < p.length; i++) {
    crt = p[i];
    nxt = p[i + 1] || p[0];
    this.medians.push({ x: (crt.x + nxt.x) / 2, y: (crt.y + nxt.y) / 2 });
  }
};

Shape.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;
};

Shape.prototype.checkCollision = function (shape) {
  const me = this;
  let p1; let
    p2;

  return me.normals.concat(shape.normals).every(v => {
    p1 = me.project(v);
    p2 = shape.project(v);
    return (((p1.min <= p2.max) && (p1.max >= p2.min)) ||
        (p2.min >= p1.max) && (p2.max >= p1.min));
  });
};

Shape.prototype.project = function (vector) {
  const me = this;
  const p = this.points;
  let min = Infinity; let max = -Infinity;
  let x; let y; let
    proj;

  p.forEach(p => {
    x = me.x + p.x;
    y = me.y + p.y;
    proj = (x * vector.x + y * vector.y);
    min = proj < min ? proj : min;
    max = proj > max ? proj : max;
  });

  return { min, max };
};

module.exports = Shape;
