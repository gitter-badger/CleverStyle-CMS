// Generated by CoffeeScript 1.9.3

/**
 * @package    CleverStyle CMS
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright  Copyright (c) 2015, Nazar Mokrynskyi
 * @license    MIT License, see license.txt
 */

(function() {
  var L;

  L = cs.Language;

  Polymer({
    'is': 'cs-system-admin-permissions-for',
    behaviors: [cs.Polymer.behaviors.Language],
    properties: {
      'for': {
        type: String,
        value: ''
      },
      group: '',
      user: ''
    },
    all_permissions: {},
    permissions: {},
    ready: function() {
      return $.when($.getJSON('api/System/admin/blocks'), $.getJSON('api/System/admin/permissions'), $.getJSON("api/System/admin/" + this["for"] + "s/" + this[this["for"]] + "/permissions")).done((function(_this) {
        return function(blocks, all_permissions, permissions) {
          var block_index_to_title, group, id, label, labels;
          block_index_to_title = {};
          blocks[0].forEach(function(block) {
            return block_index_to_title[block.index] = block.title;
          });
          _this.all_permissions = (function() {
            var ref, results;
            ref = all_permissions[0];
            results = [];
            for (group in ref) {
              labels = ref[group];
              results.push({
                group: group,
                labels: (function() {
                  var results1;
                  results1 = [];
                  for (label in labels) {
                    id = labels[label];
                    results1.push({
                      name: label,
                      id: id,
                      description: group === 'Block' ? block_index_to_title[label] : ''
                    });
                  }
                  return results1;
                })()
              });
            }
            return results;
          })();
          return _this.permissions = permissions[0];
        };
      })(this));
    },
    save: function() {
      return $.ajax({
        url: "api/System/admin/" + this["for"] + "s/" + this[this["for"]] + "/permissions",
        data: $(this.$.form).serialize(),
        type: 'put',
        success: function() {
          return cs.ui.notify(L.changes_saved, 'success', 5);
        }
      });
    },
    invert: function(e) {
      return $(e.currentTarget).closest('div').find(':radio:not(:checked)[value!=-1]').parent().click();
    },
    allow_all: function(e) {
      return $(e.currentTarget).closest('div').find(':radio[value=1]').parent().click();
    },
    deny_all: function(e) {
      return $(e.currentTarget).closest('div').find(':radio[value=0]').parent().click();
    },
    permission_state: function(id, expected) {
      var permission;
      permission = this.permissions[id];
      return permission == expected || (expected == '-1' && permission === void 0);
    }
  });

}).call(this);
