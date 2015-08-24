// Generated by CoffeeScript 1.9.3

/**
 * @package   CleverStyle Widgets
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */

(function() {
  var tooltip_element;

  tooltip_element = null;

  Polymer.cs.behaviors.tooltip = {
    properties: {
      tooltip: {
        observer: '_tooltip_changed',
        type: String
      }
    },
    _tooltip_changed: function() {
      if (this.tooltip) {
        this._tooltip_for_element(this);
      }
    },
    _tooltip_for_element: function(element) {
      var hide, show;
      if (this._tooltip_binding_added) {
        return;
      }
      this._tooltip_binding_added = true;
      this._initialize_tooltip();
      show = tooltip_element._show.bind(tooltip_element, element);
      hide = tooltip_element._hide.bind(tooltip_element, element);
      element.addEventListener('mouseenter', show);
      element.addEventListener('pointerenter', show);
      element.addEventListener('mouseleave', hide);
      element.addEventListener('pointerleave', hide);
    },
    _initialize_tooltip: function() {
      if (!tooltip_element) {
        tooltip_element = document.createElement('cs-tooltip');
        document.body.parentNode.appendChild(tooltip_element);
      }
    }
  };

}).call(this);