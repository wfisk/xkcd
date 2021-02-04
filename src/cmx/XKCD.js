/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
export default XKCD {

    // taken from: http://dan.iel.fm/xkcd
    // XKCD-style line interpolation. Roughly based on:
    //    jakevdp.github.com/blog/2012/10/07/xkcd-style-plots-in-matplotlib
    render(points, xlim, ylim, magnitude) {

      // smooth some data with a given window size
      const smooth = function(d, w) {
        const result = [];
        let i = 0;
        const l = d.length;

        while (i < l) {
          const mn = Math.max(0, i - (5 * w));
          const mx = Math.min(d.length - 1, i + (5 * w));
          let s = 0.0;
          result[i] = 0.0;
          let j = mn;

          while (j < mx) {
            const wd = Math.exp((-0.5 * (i - j) * (i - j)) / w / w);
            result[i] += wd * d[j];
            s += wd;
            ++j;
          }
          result[i] /= s;
          ++i;
        }
        return result;
      };

      // scale the data
      const f = [xlim[1] - xlim[0], ylim[1] - ylim[0]];
      const z = [xlim[0], ylim[0]];
      const scaled = points.map(p => [(p[0] - z[0]) / f[0], (p[1] - z[1]) / f[1]]);

      // compute the distance along the path using a map-reduce
      const dists = scaled.map(function(d, i) {
        if (i === 0) { return 0.0; }
        const dx = d[0] - scaled[i - 1][0];
        const dy = d[1] - scaled[i - 1][1];
        return Math.sqrt((dx * dx) + (dy * dy));
      });

      const sum = (curr, d) => d + curr;
      const dist = dists.reduce(sum, 0.0);

      // choose the number of interpolation points based on this distance
      const N = Math.round(200 * dist);

      // re-sample the line
      const resampled = [];
      dists.map(function(d, i) {
        if (i === 0) { return; }
        const n = Math.max(3, Math.round((d / dist) * N));
        const spline = d3.interpolate(scaled[i - 1][1], scaled[i][1]);
        const delta = (scaled[i][0] - scaled[i - 1][0]) / (n - 1);
        let j = 0;
        let x = scaled[i - 1][0];

        return (() => {
          const result1 = [];
          while (j < n) {
            resampled.push([x, spline(j / (n - 1))]);
            ++j;
            result1.push(x += delta);
          }
          return result1;
        })();
      });

      // compute the gradients
      let gradients = resampled.map(function(a, i, d) {
        if (i === 0) { return [d[1][0] - d[0][0], d[1][1] - d[0][1]]; }
        if (i === (resampled.length - 1)) { return [d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1]]; }
        return [0.5 * (d[i + 1][0] - d[i - 1][0]),
         0.5 * (d[i + 1][1] - d[i - 1][1])];});

      // normalize the gradient vectors to be unit vectors
      gradients = gradients.map(function(d) {
        const len = Math.sqrt((d[0] * d[0]) + (d[1] * d[1]));
        return [d[0] / len, d[1] / len];});

      // generate some perturbations
      const perturbations = smooth(resampled.map(d3.random.normal()), 3);

      // add in the perturbations and re-scale the re-sampled curve
      const perturbed = resampled.map(function(d, i) {
        const p = perturbations[i];
        const g = gradients[i];
        return [((d[0] + (magnitude * g[1] * p)) * f[0]) + z[0],
         ((d[1] - (magnitude * g[0] * p)) * f[1]) + z[1]];});

      // two decimal places "should be enough for everyone"
      const r = num => Math.round(num*100)/100;
      const result = perturbed.map(d => [r(d[0]), r(d[1])]);

      return result.join("L");
    }
  }