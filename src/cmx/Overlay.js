/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
export default class Overlay {
  constructor(root, width, height, marginX, marginY, extensionX, extensionY) {
    this.width = width;
    this.height = height;
    this.marginX = marginX;
    this.marginY = marginY;
    if (extensionX == null) {
      extensionX = 400;
    }
    this.extensionX = extensionX;
    if (extensionY == null) {
      extensionY = 400;
    }
    this.extensionY = extensionY;
    const fullWidth = this.width + 2 * this.marginX;
    const fullHeight = this.height + 2 * this.marginY;

    this._delta_svg = d3
      .select(root)
      .append('svg')
      .attr('class', 'cmx-overlay')
      .style('left', -this.extensionX)
      .style('top', -this.extensionY);
    this._delta_svg
      .attr('width', fullWidth + 2 * this.extensionX)
      .attr('height', fullHeight + 2 * this.extensionY); // svg canvas
    this._delta_defs = this._delta_svg.append('svg:defs');
    this._delta_el = this._delta_svg
      .append('g')
      .attr(
        'transform',
        'translate(' +
          (this.marginX + this.extensionX) +
          ', ' +
          (this.marginY + this.extensionY) +
          ')'
      ) // implement margin
      .append('g')
      .attr('transform', 'translate(0, ' + this.height + ') scale(1, -1)'); // flip y
    this._delta_gizmos = this._delta_el.append('g').attr('class', 'cmx-gizmos');

    this.renderArrowDefs();
  }

  renderArrowDefs() {
    this._delta_defs
      .append('svg:marker')
      .attr('id', 'cmx-end-marker-arrow')
      .attr('class', 'cmx-marker-arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 5)
      .attr('cmx-markerUnits', 'strokeWidth')
      .attr('cmx-markerWidth', 3)
      .attr('cmx-markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z');

    return this._delta_defs
      .append('svg:marker')
      .attr('id', 'cmx-start-marker-arrow')
      .attr('class', 'cmx-marker-arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 5)
      .attr('cmx-markerUnits', 'strokeWidth')
      .attr('cmx-markerWidth', 3)
      .attr('cmx-markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M 10 0 L 0 5 L 10 10 z');
  }
}
