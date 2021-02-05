<script>
  import '/src/cmx/cmx';
  // import { d3ext } from '/src/cmx/edit_scripts/d3ext';
  import {
    launch,
    loadWebFonts,
    publishEvent
  } from '/src/cmx/edit_scripts/main';

  publishEvent('cmx:loaded');
  // underscore.string = underscore.str = underscoreString;
  // d3ext();
  loadWebFonts(launch);
</script>

<scene id="scene1">
  <label t="translate(0,346)">
    <tspan x="0" y="0em">Two afternoon</tspan>
  </label>
  <drawing t="translate(0,31)">
    <line stroke="green">
      <point x="0" y="0" />
      <point x="250" y="20" />
    </line>
  </drawing>
  <actor
    t="translate(71,19) rotate(-2)"
    pose="-11,9|-5,117|-11,99|-11,89|-11,79|-11,59|-16,34|-21,9|-6,34|-1,9|-18,79|-18,59|-6,79|-1,59">
    <bubble t="translate(9,11)" pose="0,0|-20,10|-81,49|19,66|-21,145|-73,109">
      <tspan x="0" y="-3em">I had an idea today</tspan>
      <tspan x="0" y="0em">anyone without</tspan>
      <tspan x="0" y="1em">much talent</tspan>
      <tspan x="0" y="2em">could publish</tspan>
      <tspan x="0" y="3em">comix strips...</tspan>
      <tspan x="8" y="76px">easily!</tspan>
    </bubble>
  </actor>
  <actor
    t="translate(159,15)"
    pose="28,1|30,109|28,91|28,81|28,71|28,51|18,31|18,1|33,26|38,1|23,71|18,51|38,71|38,51">
    <bubble t="translate(-2,-9)" pose="0,0|-14,24|-36,69|27,28|8,72|-35,93">
      <tspan x="0" y="0em">you mean</tspan>
      <tspan x="0" y="1em">as easily as</tspan>
      <tspan x="0" y="2em">blogging!?</tspan>
    </bubble>
  </actor>
</scene>

<style>
</style>
