// Generated by LiveScript 1.4.0
/**
 * @package    CleverStyle CMS
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright  Copyright (c) 2015, Nazar Mokrynskyi
 * @license    MIT License, see license.txt
 */
(function(){
  var L, active_switch;
  L = cs.Language;
  active_switch = function(uninstalled, disabled, enabled){
    switch (this.active) {
    case -1:
      return uninstalled;
    case 0:
      return disabled;
    case 1:
      return enabled;
    }
  };
  Polymer({
    'is': 'cs-system-admin-modules-list',
    behaviors: [cs.Polymer.behaviors.Language, cs.Polymer.behaviors.admin.System.components],
    properties: {
      default_module: String
    },
    ready: function(){
      this.reload();
    },
    reload: function(){
      var this$ = this;
      $.when($.getJSON('api/System/admin/modules'), $.getJSON('api/System/admin/modules/default')).then(function(arg$, arg1$){
        var modules, default_module;
        modules = arg$[0];
        default_module = arg1$[0];
        this$.default_module = default_module;
        modules.forEach(function(module){
          var active_switch_local, enabled, installed;
          active_switch_local = active_switch.bind(module);
          module['class'] = active_switch_local('cs-block-error cs-text-error', 'cs-block-warning cs-text-warning', 'cs-block-success cs-text-success');
          module.icon = active_switch_local('times', 'minus', module.name === default_module ? 'home' : 'check');
          module.icon_text = active_switch_local(L.uninstalled, L.disabled, module.name === default_module
            ? L.default_module
            : L.enabled);
          module.name_localized = L[module.name] || module.name.replace('_', ' ');
          enabled = module.active == 1;
          installed = module.active != -1;
          module.can_disable = enabled && module.name !== 'System';
          module.administration = module.has_admin_section && installed;
          module.db_settings = !cs.simple_admin_mode && installed && module.meta && module.meta.db;
          module.storage_settings = !cs.simple_admin_mode && installed && module.meta && module.meta.storage;
          module.can_be_set_as_default = enabled && module.name !== default_module && module.has_user_section;
          (function(){
            var i$, ref$, len$, prop, ref1$, tag;
            for (i$ = 0, len$ = (ref$ = ['api', 'license', 'readme']).length; i$ < len$; ++i$) {
              prop = ref$[i$];
              if ((ref1$ = module[prop]) != null && ref1$.type) {
                tag = module[prop].type === 'txt' ? 'pre' : 'div';
                module[prop].content = "<" + tag + ">" + module[prop].content + "</" + tag + ">";
              }
            }
          })();
          if (module.meta) {
            module.info = (function(){
              return L.module_info(this['package'], this.version, this.description, this.author, this.website || L.none, this.license, this.db_support
                ? this.db_support.join(', ')
                : L.none, this.storage_support
                ? this.storage_support.join(', ')
                : L.none, this.provide
                ? [].concat(this.provide).join(', ')
                : L.none, this.require
                ? [].concat(this.require).join(', ')
                : L.none, this.conflict
                ? [].concat(this.conflict).join(', ')
                : L.none, this.optional
                ? [].concat(this.optional).join(', ')
                : L.none, this.multilingual && this.multilingual.indexOf('interface') !== -1
                ? L.yes
                : L.no, this.multilingual && this.multilingual.indexOf('content') !== -1
                ? L.yes
                : L.no, this.languages
                ? this.languages.join(', ')
                : L.none);
            }.call(module.meta));
          }
        });
        this$.set('modules', modules);
      });
    }
    /**
     * Provides next events:
     *  admin/System/components/modules/default/before
     *  {name : module_name}
     *
     *  admin/System/components/modules/default/after
     *  {name : module_name}
     */,
    _set_as_default: function(e){
      var module, this$ = this;
      module = e.model.module.name;
      cs.Event.fire('admin/System/components/modules/default/before', {
        name: module
      }).then(function(){
        $.ajax({
          url: 'api/System/admin/modules/default',
          type: 'put',
          data: {
            module: module
          },
          success: function(){
            this$.reload();
            cs.ui.notify(L.changes_saved, 'success', 5);
            cs.Event.fire('admin/System/components/modules/default/after', {
              name: module
            });
          }
        });
      });
    }
    /**
     * Provides next events:
     *  admin/System/components/modules/enable/before
     *  {name : module_name}
     *
     *  admin/System/components/modules/enable/after
     *  {name : module_name}
     */,
    _enable: function(e){
      this._enable_component(e.model.module.name, 'module', e.model.module.meta);
    }
    /**
     * Provides next events:
     *  admin/System/components/modules/disable/before
     *  {name : module_name}
     *
     *  admin/System/components/modules/disable/after
     *  {name : module_name}
     */,
    _disable: function(e){
      this._disable_component(e.model.module.name, 'module');
    }
    /**
     * Provides next events:
     *  admin/System/components/modules/install/before
     *  {name : module_name}
     *
     *  admin/System/components/modules/install/after
     *  {name : module_name}
     */,
    _install: function(e){
      var module, meta, this$ = this;
      module = e.model.module.name;
      meta = e.model.module.meta;
      $.when($.getJSON("api/System/admin/modules/" + module + "/dependencies"), $.getJSON('api/System/admin/databases'), $.getJSON('api/System/admin/storages')).then(function(arg$, arg1$, arg2$){
        var dependencies, databases, storages, message, message_more, form, modal;
        dependencies = arg$[0];
        databases = arg1$[0];
        storages = arg2$[0];
        message = '';
        message_more = '';
        if (Object.keys(dependencies).length) {
          message = this$._compose_dependencies_message(module, dependencies);
          if (cs.simple_admin_mode) {
            cs.ui.notify(message, 'error', 5);
            return;
          }
        }
        if (meta && meta.optional) {
          message_more += '<p class="cs-text-success cs-block-success">' + L.for_complete_feature_set(meta.optional.join(', ')) + '</p>';
        }
        form = meta ? this$._databases_storages_form(meta, databases, storages) : '';
        modal = cs.ui.confirm("<h3>" + L.installation_of_module(module) + "</h3>\n" + message + "\n" + message_more + "\n" + form, function(){
          cs.Event.fire('admin/System/components/modules/install/before', {
            name: module
          }).then(function(){
            $.ajax({
              url: "api/System/admin/modules/" + module,
              data: $(modal.querySelector('form')).serialize(),
              type: 'install',
              success: function(){
                cs.ui.notify(L.changes_saved, 'success', 5);
                cs.Event.fire('admin/System/components/modules/install/after', {
                  name: module
                }).then(function(){
                  location.reload();
                });
              }
            });
          });
        });
        modal.ok.innerHTML = L[!message ? 'install' : 'force_install_not_recommended'];
        modal.ok.primary = !message;
        modal.cancel.primary = !modal.ok.primary;
      });
    },
    _databases_storages_form: function(meta, databases, storages){
      var content, i$, ref$, len$, db_name, db_options, db, storage_name, storage_options, storage;
      content = '';
      if (meta.db && databases.length) {
        if (cs.simple_admin_mode) {
          for (i$ = 0, len$ = (ref$ = meta.db).length; i$ < len$; ++i$) {
            db_name = ref$[i$];
            content += "<input type=\"hidden\" name=\"db[" + db_name + "]\" value=\"0\">";
          }
        } else {
          content += "<tr>\n	<th tooltip=\"" + cs.prepare_attr_value(L.appointment_of_db_info) + "\">\n		" + L.appointment_of_db + "\n		<cs-tooltip/>\n	</th>\n	<th tooltip=\"" + cs.prepare_attr_value(L.system_db_info) + "\">\n		" + L.system_db + "\n		<cs-tooltip/>\n	</th>\n</tr>";
          db_options = '';
          for (i$ = 0, len$ = databases.length; i$ < len$; ++i$) {
            db = databases[i$];
            if (!meta.db_support || meta.db_support.indexOf(db.type) !== -1) {
              db_options += this._db_option(db);
            }
          }
          for (i$ = 0, len$ = (ref$ = meta.db).length; i$ < len$; ++i$) {
            db_name = ref$[i$];
            content += "<tr>\n	<td>" + db_name + "</td>\n	<td>\n		<select is=\"cs-select\" name=\"db[" + db_name + "]\">" + db_options + "</select>\n	</td>\n</tr>";
          }
        }
      }
      if (meta.storage && storages.length) {
        if (cs.simple_admin_mode) {
          for (i$ = 0, len$ = (ref$ = meta.storage).length; i$ < len$; ++i$) {
            storage_name = ref$[i$];
            content += "<input type=\"hidden\" name=\"storage[" + storage_name + "]\" value=\"0\">";
          }
        } else {
          content += "<tr>\n	<th tooltip=\"" + cs.prepare_attr_value(L.appointment_of_storage_info) + "\">\n		" + L.appointment_of_storage + "\n		<cs-tooltip/>\n	</th>\n	<th tooltip=\"" + cs.prepare_attr_value(L.system_storage_info) + "\">\n		" + L.system_storage + "\n		<cs-tooltip/>\n	</th>\n</tr>";
          storage_options = '';
          for (i$ = 0, len$ = storages.length; i$ < len$; ++i$) {
            storage = storages[i$];
            if (!meta.storage_support || meta.storage_support.indexOf(storage.type) !== -1) {
              storage_options += this._storage_option(storage);
            }
          }
          for (i$ = 0, len$ = (ref$ = meta.storage).length; i$ < len$; ++i$) {
            storage_name = ref$[i$];
            content += "<tr>\n	<td>" + storage_name + "</td>\n	<td>\n		<select is=\"cs-select\" name=\"storage[" + storage_name + "]\">" + storage_options + "</select>\n	</td>\n</tr>";
          }
        }
      }
      if (cs.simple_admin_mode) {
        return "<form>" + content + "</form>";
      } else {
        return "<form>\n	<table class=\"cs-table\">\n		" + content + "\n	</table>\n</form>";
      }
    },
    _db_option: function(db){
      var name, checked;
      name = db.index
        ? db.host + "/" + db.name + " (" + db.type + ")"
        : L.core_db + (" (" + db.type + ")");
      checked = db.index ? '' : 'checked';
      return "<option value=\"" + db.index + "\" " + checked + ">" + name + "</option>";
    },
    _storage_option: function(storage){
      var name, checked;
      name = storage.index
        ? storage.host + " (" + storage.connection + ")"
        : L.core_storage + (" (" + storage.connection + ")");
      checked = storage.index ? '' : 'checked';
      return "<option value=\"" + storage.index + "\" " + checked + ">" + name + "</option>";
    }
    /**
     * Provides next events:
     *  admin/System/components/modules/uninstall/before
     *  {name : module_name}
     *
     *  admin/System/components/modules/uninstall/after
     *  {name : module_name}
     */,
    _uninstall: function(e){
      var module, modal, this$ = this;
      module = e.model.module.name;
      modal = cs.ui.confirm(L.uninstallation_of_module(module), function(){
        cs.Event.fire('admin/System/components/modules/uninstall/before', {
          name: module
        }).then(function(){
          $.ajax({
            url: "api/System/admin/modules/" + module,
            type: 'uninstall',
            success: function(){
              this$.reload();
              cs.ui.notify(L.changes_saved, 'success', 5);
              cs.Event.fire('admin/System/components/modules/uninstall/after', {
                name: module
              });
            }
          });
        });
      });
      modal.ok.innerHTML = L.uninstall;
      modal.ok.primary = false;
      modal.cancel.primary = true;
    },
    _remove_completely: function(e){
      this._remove_completely_component(e.model.module.name, 'modules');
    }
    /**
     * Provides next events:
     *  admin/System/components/modules/update/before
     *  {name : module_name}
     *
     *  admin/System/components/modules/update/after
     *  {name : module_name}
     */,
    _upload: function(){
      var this$ = this;
      this._upload_package(this.$.file).then(function(meta){
        var i$, ref$, len$, module;
        if (meta.category !== 'modules' || !meta['package'] || !meta.version) {
          cs.ui.notify(L.this_is_not_module_installer_file, 'error', 5);
          return;
        }
        for (i$ = 0, len$ = (ref$ = this$.modules).length; i$ < len$; ++i$) {
          module = ref$[i$];
          if (module.name === meta['package']) {
            this$._update_component(module.meta, meta);
            return;
          }
        }
        $.ajax({
          url: 'api/System/admin/modules',
          type: 'extract',
          success: function(){
            cs.ui.notify(L.changes_saved, 'success', 5);
            location.reload();
          }
        });
      });
    }
    /**
     * Provides next events:
     *  admin/System/components/modules/update_system/before
     *
     *  admin/System/components/modules/update_system/after
     */,
    _upload_system: function(){
      var this$ = this;
      this._upload_package(this.$.file_system).then(function(meta){
        if (meta.category !== 'modules' || meta['package'] !== 'System' || !meta.version) {
          cs.ui.notify(L.this_is_not_system_installer_file, 'error', 5);
          return;
        }
        this$._update_component(module.meta, meta);
      });
    },
    _db_settings: function(e){
      var module, meta, this$ = this;
      module = e.model.module.name;
      meta = e.model.module.meta;
      $.when($.getJSON('api/System/admin/databases'), $.getJSON("api/System/admin/modules/" + module + "/db")).then(function(arg$, arg1$){
        var databases, databases_mapping, form, modal, index, db_name;
        databases = arg$[0];
        databases_mapping = arg1$[0];
        form = meta ? this$._databases_storages_form(meta, databases, []) : '';
        modal = cs.ui.confirm("<h3>" + L.db_settings_for_module(module) + "</h3>\n<p class=\"cs-block-error cs-text-error\">" + L.changing_settings_warning + "</p>\n" + form, function(){
          $.ajax({
            url: "api/System/admin/modules/" + module + "/db",
            data: $(modal.querySelector('form')).serialize(),
            type: 'put',
            success: function(){
              cs.ui.notify(L.changes_saved, 'success', 5);
            }
          });
        });
        for (index in databases_mapping) {
          db_name = databases_mapping[index];
          modal.querySelector("[name=db[" + db_name + "]]").selected = index;
        }
      });
    },
    _storage_settings: function(e){
      var module, meta, this$ = this;
      module = e.model.module.name;
      meta = e.model.module.meta;
      $.when($.getJSON('api/System/admin/storages'), $.getJSON("api/System/admin/modules/" + module + "/storage")).then(function(arg$, arg1$){
        var storages, storages_mapping, form, modal, index, storage_name;
        storages = arg$[0];
        storages_mapping = arg1$[0];
        form = meta ? this$._databases_storages_form(meta, [], storages) : '';
        modal = cs.ui.confirm("<h3>" + L.storage_settings_for_module(module) + "</h3>\n<p class=\"cs-block-error cs-text-error\">" + L.changing_settings_warning + "</p>\n" + form, function(){
          $.ajax({
            url: "api/System/admin/modules/" + module + "/storage",
            data: $(modal.querySelector('form')).serialize(),
            type: 'put',
            success: function(){
              cs.ui.notify(L.changes_saved, 'success', 5);
            }
          });
        });
        for (index in storages_mapping) {
          storage_name = storages_mapping[index];
          modal.querySelector("[name=storage[" + storage_name + "]]").selected = index;
        }
      });
    },
    _update_modules_list: function(){
      var this$ = this;
      $.ajax({
        url: 'api/System/admin/modules',
        type: 'update_list',
        success: function(){
          cs.ui.notify(L.changes_saved, 'success', 5);
          this$.reload();
        }
      });
    }
  });
}).call(this);
