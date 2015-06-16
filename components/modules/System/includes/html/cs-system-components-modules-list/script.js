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
  (function(L) {
    return Polymer({
      translations: {
        module_name: L.module_name,
        state: L.state,
        api_exists: L.api_exists,
        information_about_module: L.information_about_module,
        license: L.license,
        click_to_view_details: L.click_to_view_details,
        action: L.action,
        make_default_module: L.make_default_module,
        databases: L.databases,
        storages: L.storages,
        module_admin_page: L.module_admin_page,
        enable: L.enable,
        disable: L.disable,
        install: L.install,
        uninstall: L.uninstall
      },
      modules: [],
      ready: function() {
        var modules;
        modules = JSON.parse(this.querySelector('script').innerHTML);
        modules.forEach(function(module) {
          module["class"] = (function() {
            switch (module.active) {
              case -1:
                return 'uk-alert-danger';
              case 0:
                return 'uk-alert-warning';
              case 1:
                return 'uk-alert-success';
            }
          })();
          module.icon = (function() {
            switch (module.active) {
              case -1:
                return 'uk-icon-times';
              case 0:
                return 'uk-icon-minus';
              case 1:
                if (module.is_default) {
                  return 'uk-icon-home';
                } else {
                  return 'uk-icon-check';
                }
            }
          })();
          module.icon_text = (function() {
            switch (module.active) {
              case -1:
                return L.uninstalled;
              case 0:
                return L.disabled;
              case 1:
                if (module.is_default) {
                  return L.default_module;
                } else {
                  return L.enabled;
                }
            }
          })();
          module.name_localized = L[module.name] || module.name.replace('_', ' ');
          return (function(meta) {
            if (!meta) {
              return;
            }
            return $(function() {
              return module.info = L.module_info(meta["package"], meta.version, meta.description, meta.author, meta.website || L.none, meta.license, meta.db_support ? meta.db_support.join(', ') : L.none, meta.storage_support ? meta.storage_support.join(', ') : L.none, meta.provide ? [].concat(meta.provide).join(', ') : L.none, meta.require ? [].concat(meta.require).join(', ') : L.none, meta.conflict ? [].concat(meta.conflict).join(', ') : L.none, meta.optional ? [].concat(meta.optional).join(', ') : L.none, meta.multilingual && meta.multilingual.indexOf('interface') !== -1 ? L.yes : L.no, meta.multilingual && meta.multilingual.indexOf('content') !== -1 ? L.yes : L.no, meta.languages ? meta.languages.join(', ') : L.none);
            });
          })(module.meta);
        });
        return this.modules = modules;
      },
      domReady: function() {
        return $(this.shadowRoot).cs().tooltips_inside();
      },
      generic_modal: function(event, detail, sender) {
        var $sender, index, key, module, tag;
        $sender = $(sender);
        index = $sender.closest('[data-module-index]').data('module-index');
        module = this.modules[index];
        key = $sender.data('modal-type');
        tag = module[key].type === 'txt' ? 'pre' : 'div';
        return $("<div class=\"uk-modal-dialog uk-modal-dialog-large\">\n	<div class=\"uk-overflow-container\">\n		<" + tag + ">" + module[key].content + "</" + tag + ">\n	</div>\n</div>").appendTo('body').cs().modal('show').on('hide.uk.modal', function() {
          return $(this).remove();
        });
      }
    });
  })(cs.Language);

}).call(this);
