// Generated by CoffeeScript 1.4.0

/**
 * @package   Shop
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
*/


(function() {

  cs.shop.cart = (function() {
    var add_item, clean, del_item, get_item, get_items, items, items_storage, set_item;
    items_storage = {
      get: function() {
        var data;
        if (data = cs.getcookie('shop_cart_items')) {
          return JSON.parse(data);
        } else {
          return {};
        }
      },
      set: function(items) {
        return cs.setcookie('shop_cart_items', JSON.stringify(items), new Date / 1000 + 86400);
      }
    };
    get_items = function() {
      return items_storage.get();
    };
    get_item = function(id) {
      return items[id] || 0;
    };
    add_item = function(id) {
      if (items[id]) {
        ++items[id];
      } else {
        items[id] = 1;
      }
      items_storage.set(items);
      return items[id];
    };
    set_item = function(id, units) {
      items[id] = units;
      return items_storage.set(items);
    };
    del_item = function(id) {
      delete items[id];
      return items_storage.set(items);
    };
    clean = function() {
      var items;
      cs.setcookie('shop_cart_items', '');
      return items = {};
    };
    items = get_items();
    return {
      get_all: get_items,
      get: get_item,
      add: add_item,
      set: set_item,
      del: del_item,
      clean: clean
    };
  })();

}).call(this);