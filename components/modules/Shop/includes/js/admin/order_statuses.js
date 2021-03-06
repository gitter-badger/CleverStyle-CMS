// Generated by CoffeeScript 1.9.3

/**
 * @package   Shop
 * @order-status  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */

(function() {
  $(function() {
    var L, make_modal;
    L = cs.Language;
    make_modal = function(types, title, action) {
      var index, modal, type;
      types = (function() {
        var results;
        results = [];
        for (index in types) {
          type = types[index];
          results.push("<option value=\"" + index + "\">" + type + "</option>");
        }
        return results;
      })();
      types = types.join('');
      modal = $(cs.ui.simple_modal("<form is=\"cs-form\">\n	<h3 class=\"cs-text-center\">" + title + "</h3>\n	<label>" + L.shop_title + "</label>\n	<input is=\"cs-input-text\" name=\"title\" required>\n	<label>" + L.shop_color + "</label>\n	<input is=\"cs-input-text\" name=\"color\"><br>\n	<input is=\"cs-input-text\" type=\"color\">\n	<label>" + L.shop_order_status_type + "</label>\n	<select is=\"cs-select\" name=\"type\" required>" + types + "</select>\n	<label>" + L.shop_send_update_status_email + "</label>\n	<div>\n		<label is=\"cs-label-button\"><input type=\"radio\" name=\"send_update_status_email\" value=\"1\" checked> " + L.yes + "</label>\n		<label is=\"cs-label-button\"><input type=\"radio\" name=\"send_update_status_email\" value=\"0\"> " + L.no + "</label>\n	</div>\n	<label>" + L.shop_comment_used_in_email + "</label>\n	<textarea is=\"cs-textarea\" autosize name=\"comment\"></textarea>\n	<br>\n	<button is=\"cs-button\" primary type=\"submit\">" + action + "</button>\n</form>"));
      modal.find('[type=color]').change(function() {
        return modal.find('[name=color]').val($(this).val());
      });
      modal.find('[name=color]').change(function() {
        return modal.find('[type=color]').val($(this).val());
      });
      return modal;
    };
    return $('html').on('mousedown', '.cs-shop-order-status-add', function() {
      return $.getJSON('api/Shop/admin/order_statuses/types', function(types) {
        var modal;
        modal = make_modal(types, L.shop_order_status_addition, L.shop_add);
        return modal.find('form').submit(function() {
          $.ajax({
            url: 'api/Shop/admin/order_statuses',
            type: 'post',
            data: $(this).serialize(),
            success: function() {
              alert(L.shop_added_successfully);
              return location.reload();
            }
          });
          return false;
        });
      });
    }).on('mousedown', '.cs-shop-order-status-edit', function() {
      var id;
      id = $(this).data('id');
      return $.when($.getJSON('api/Shop/admin/order_statuses/types'), $.getJSON("api/Shop/admin/order_statuses/" + id)).done(function(types, type) {
        var modal;
        modal = make_modal(types[0], L.shop_order_status_edition, L.shop_edit);
        modal.find('form').submit(function() {
          $.ajax({
            url: "api/Shop/admin/order_statuses/" + id,
            type: 'put',
            data: $(this).serialize(),
            success: function() {
              alert(L.shop_edited_successfully);
              return location.reload();
            }
          });
          return false;
        });
        type = type[0];
        modal.find('[name=title]').val(type.title);
        modal.find('[name=color]').val(type.color);
        modal.find('[type=color]').val(type.color);
        modal.find('[name=type]').val(type.type);
        modal.find("[name=send_update_status_email][value=" + type.send_update_status_email + "]").prop('checked', true);
        return modal.find('[name=comment]').val(type.comment);
      });
    }).on('mousedown', '.cs-shop-order-status-delete', function() {
      var id;
      id = $(this).data('id');
      if (confirm(L.shop_sure_want_to_delete)) {
        return $.ajax({
          url: "api/Shop/admin/order_statuses/" + id,
          type: 'delete',
          success: function() {
            alert(L.shop_deleted_successfully);
            return location.reload();
          }
        });
      }
    });
  });

}).call(this);
