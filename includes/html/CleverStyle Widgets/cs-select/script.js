// Generated by CoffeeScript 1.9.3

/**
 * @package   CleverStyle Widgets
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */

(function() {
  Polymer({
    'is': 'cs-select',
    'extends': 'select',
    behaviors: [Polymer.cs.behaviors.size, Polymer.cs.behaviors.tight, Polymer.cs.behaviors["this"], Polymer.cs.behaviors.tooltip, Polymer.cs.behaviors.value],
    ready: function() {
      var scroll_once;
      scroll_once = (function(_this) {
        return function() {
          _this._scroll_to_selected();
          return document.removeEventListener('WebComponentsReady', scroll_once);
        };
      })(this);
      document.addEventListener('WebComponentsReady', scroll_once);
    },
    _scroll_to_selected: function() {
      var option, option_height, select_height;
      option = this.querySelector('option');
      if (!option) {
        return;
      }
      option_height = option.getBoundingClientRect().height;
      if (this.size > 1 && this.selectedOptions[0]) {
        this.scrollTop = option_height * (this.selectedIndex - Math.floor(this.size / 2)) + this._number_of_optgroups();
      }
      select_height = this.getBoundingClientRect().height;
      if (select_height >= option_height * (this.querySelectorAll('option').length + this.querySelectorAll('optgroup').length)) {
        this.style.overflowY = 'auto';
      }
    },
    _number_of_optgroups: function() {
      var count, optgroup;
      optgroup = this.selectedOptions[0].parentNode;
      count = 0;
      if (optgroup.tagName === 'OPTGROUP') {
        while (optgroup) {
          ++count;
          optgroup = optgroup.previousElementSibling;
        }
      }
      return count;
    }
  });

}).call(this);
