<?php
/**
 * @package    CleverStyle CMS
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright  Copyright (c) 2015, Nazar Mokrynskyi
 * @license    MIT License, see license.txt
 */
namespace cs\modules\System\api\Controller\admin;
use
	cs\Cache as System_cache,
	cs\Config,
	cs\Event,
	cs\ExitException,
	cs\Language,
	cs\Page,
	cs\Session,
	cs\modules\System\Packages_manipulation;
trait plugins {
	/**
	 * @param int[]    $route_ids
	 * @param string[] $route_path
	 *
	 * @throws ExitException
	 */
	static function admin_plugins_get ($route_ids, $route_path) {
		if (isset($route_path[3])) {
			switch ($route_path[3]) {
				/**
				 * Get dependent packages for plugin
				 */
				case 'dependent_packages':
					static::get_dependent_packages_for_plugin($route_path[2]);
					break;
				/**
				 * Get dependencies for plugin
				 */
				case 'dependencies':
					static::get_dependencies_for_plugin($route_path[2]);
					break;
				/**
				 * Get dependencies for plugin during update
				 */
				case 'update_dependencies':
					static::get_update_dependencies_for_plugin($route_path[2]);
					break;
				default:
					throw new ExitException(400);
			}
			return;
		}
		/**
		 * Get array of plugins in extended form
		 */
		static::get_plugins_list();
	}
	/**
	 * @param string $plugin
	 *
	 * @throws ExitException
	 */
	protected static function get_dependent_packages_for_plugin ($plugin) {
		if (!in_array($plugin, Config::instance()->components['plugins'])) {
			throw new ExitException(404);
		}
		$meta_file = PLUGINS."/$plugin/meta.json";
		Page::instance()->json(
			file_exists($meta_file) ? Packages_manipulation::get_dependent_packages(file_get_json($meta_file)) : []
		);
	}
	/**
	 * @param string $plugin
	 *
	 * @throws ExitException
	 */
	protected static function get_dependencies_for_plugin ($plugin) {
		$plugins = get_files_list(PLUGINS, false, 'd');
		if (!in_array($plugin, $plugins, true)) {
			throw new ExitException(404);
		}
		$meta_file = PLUGINS."/$plugin/meta.json";
		Page::instance()->json(
			file_exists($meta_file) ? Packages_manipulation::get_dependencies(file_get_json($meta_file)) : []
		);
	}
	/**
	 * @param string $plugin
	 *
	 * @throws ExitException
	 */
	protected static function get_update_dependencies_for_plugin ($plugin) {
		$plugins = get_files_list(PLUGINS, false, 'd');
		if (!in_array($plugin, $plugins, true)) {
			throw new ExitException(404);
		}
		$tmp_location = TEMP.'/System/admin/'.Session::instance()->get_id().'.phar';
		if (!file_exists($tmp_location) || !file_exists(PLUGINS."/$plugin/meta.json")) {
			throw new ExitException(400);
		}
		$tmp_dir = "phar://$tmp_location";
		if (!file_exists("$tmp_dir/meta.json")) {
			throw new ExitException(400);
		}
		$existing_meta = file_get_json(PLUGINS."/$plugin/meta.json");
		$new_meta      = file_get_json("$tmp_dir/meta.json");
		if (
			$existing_meta['package'] !== $new_meta['package'] ||
			$existing_meta['category'] !== $new_meta['category']
		) {
			throw new ExitException(Language::instance()->this_is_not_plugin_installer_file, 400);
		}
		Page::instance()->json(
			Packages_manipulation::get_dependencies($new_meta)
		);
	}
	protected static function get_plugins_list () {
		$Config       = Config::instance();
		$plugins      = get_files_list(PLUGINS, false, 'd');
		$plugins_list = [];
		foreach ($plugins as $plugin_name) {
			$plugin = [
				'active' => (int)in_array($plugin_name, $Config->components['plugins']),
				'name'   => $plugin_name
			];
			/**
			 * Check if readme available
			 */
			static::check_plugin_feature_availability($plugin, 'readme');
			/**
			 * Check if license available
			 */
			static::check_plugin_feature_availability($plugin, 'license');
			if (file_exists(PLUGINS."/$plugin_name/meta.json")) {
				$plugin['meta'] = file_get_json(PLUGINS."/$plugin_name/meta.json");
			}
			$plugins_list[] = $plugin;
		}
		unset($plugin_name, $plugin);
		Page::instance()->json($plugins_list);
	}
	/**
	 * @param array  $plugin
	 * @param string $feature
	 */
	protected static function check_plugin_feature_availability (&$plugin, $feature) {
		/**
		 * Check if feature available
		 */
		$file = file_exists_with_extension(PLUGINS."/$plugin[name]/$feature", ['txt', 'html']);
		if ($file) {
			$plugin[$feature] = [
				'type'    => substr($file, -3) == 'txt' ? 'txt' : 'html',
				'content' => file_get_contents($file)
			];
		}
	}
	/**
	 * Disable plugin
	 *
	 * Provides next events:
	 *  admin/System/components/plugins/enable/before
	 *  ['name' => plugin_name]
	 *
	 *  admin/System/components/plugins/enable/after
	 *  ['name' => plugin_name]
	 *
	 * @param int[]    $route_ids
	 * @param string[] $route_path
	 *
	 * @throws ExitException
	 */
	static function admin_plugins_enable ($route_ids, $route_path) {
		if (!isset($route_path[2])) {
			throw new ExitException(400);
		}
		$Config  = Config::instance();
		$plugin  = $route_path[2];
		$plugins = get_files_list(PLUGINS, false, 'd');
		if (!in_array($plugin, $plugins, true) || in_array($plugin, $Config->components['plugins'])) {
			throw new ExitException(400);
		}
		if (!Event::instance()->fire(
			'admin/System/components/plugins/enable/before',
			[
				'name' => $plugin
			]
		)
		) {
			throw new ExitException(500);
		}
		$Config->components['plugins'][] = $plugin;
		if (!$Config->save()) {
			throw new ExitException(500);
		}
		Event::instance()->fire(
			'admin/System/components/plugins/enable/before',
			[
				'name' => $plugin
			]
		);
		static::admin_plugins_cleanup();
	}
	protected static function admin_plugins_cleanup () {
		clean_pcache();
		unset(System_cache::instance()->functionality);
		clean_classes_cache();
	}
	/**
	 * Disable plugin
	 *
	 * Provides next events:
	 *  admin/System/components/plugins/disable/before
	 *  ['name' => plugin_name]
	 *
	 *  admin/System/components/plugins/disable/after
	 *  ['name' => plugin_name]
	 *
	 * @param int[]    $route_ids
	 * @param string[] $route_path
	 *
	 * @throws ExitException
	 */
	static function admin_plugins_disable ($route_ids, $route_path) {
		if (!isset($route_path[2])) {
			throw new ExitException(400);
		}
		$Config       = Config::instance();
		$plugin       = $route_path[2];
		$plugin_index = array_search($plugin, $Config->components['plugins'], true);
		if ($plugin_index === false) {
			throw new ExitException(400);
		}
		if (!Event::instance()->fire(
			'admin/System/components/plugins/disable/before',
			[
				'name' => $plugin
			]
		)
		) {
			throw new ExitException(500);
		}
		unset($Config->components['plugins'][$plugin_index]);
		if (!$Config->save()) {
			throw new ExitException(500);
		}
		Event::instance()->fire(
			'admin/System/components/plugins/disable/after',
			[
				'name' => $plugin
			]
		);
		static::admin_plugins_cleanup();
	}
	/**
	 * Extract uploaded plugin
	 *
	 * @throws ExitException
	 */
	static function admin_plugins_extract () {
		$L            = Language::instance();
		$tmp_location = TEMP.'/System/admin/'.Session::instance()->get_id().'.phar';
		$tmp_dir      = "phar://$tmp_location";
		if (
			!file_exists($tmp_location) ||
			!file_exists("$tmp_dir/meta.json")
		) {
			throw new ExitException(400);
		}
		$new_meta = file_get_json("$tmp_dir/meta.json");
		if ($new_meta['category'] !== 'plugins') {
			throw new ExitException($L->this_is_not_plugin_installer_file, 400);
		}
		$plugin_dir = PLUGINS."/$new_meta[package]";
		if (
			!mkdir($plugin_dir, 0770) ||
			!Packages_manipulation::install_extract($plugin_dir, $tmp_location)
		) {
			throw new ExitException($L->plugin_files_unpacking_error, 500);
		}
	}
	/**
	 * Update plugin
	 *
	 * Provides next events:
	 *  admin/System/components/plugins/update/before
	 *  ['name' => plugin_name]
	 *
	 *  admin/System/components/plugins/update/after
	 *  ['name' => plugin_name]
	 *
	 * @param int[]    $route_ids
	 * @param string[] $route_path
	 *
	 * @throws ExitException
	 */
	static function admin_plugins_update ($route_ids, $route_path) {
		if (!isset($route_path[2])) {
			throw new ExitException(400);
		}
		$Config  = Config::instance();
		$L       = Language::instance();
		$plugin  = $route_path[2];
		$plugins = get_files_list(PLUGINS, false, 'd');
		if (!in_array($plugin, $plugins, true)) {
			throw new ExitException(404);
		}
		$tmp_location = TEMP.'/System/admin/'.Session::instance()->get_id().'.phar';
		$tmp_dir      = "phar://$tmp_location";
		$plugin_dir   = PLUGINS."/$plugin";
		if (
			!file_exists($tmp_location) ||
			!file_exists("$plugin_dir/meta.json") ||
			!file_exists("$tmp_dir/meta.json")
		) {
			throw new ExitException(400);
		}
		$existing_meta = file_get_json("$plugin_dir/meta.json");
		$new_meta      = file_get_json("$tmp_dir/meta.json");
		$active        = in_array($plugin, $Config->components['plugins']);
		// If plugin is currently enabled - disable it temporary
		if ($active) {
			static::admin_plugins_disable($route_ids, $route_path);
		}
		if (
			$new_meta['package'] !== $plugin ||
			$new_meta['category'] !== 'plugins'
		) {
			throw new ExitException($L->this_is_not_plugin_installer_file, 400);
		}
		if (!Event::instance()->fire(
			'admin/System/components/plugins/update/before',
			[
				'name' => $plugin
			]
		)
		) {
			throw new ExitException(500);
		}
		if (!is_writable($plugin_dir)) {
			throw new ExitException($L->cant_unpack_plugin_no_write_permissions, 500);
		}
		if (!Packages_manipulation::update_extract(PLUGINS."/$plugin", $tmp_location)) {
			throw new ExitException($L->plugin_files_unpacking_error, 500);
		}
		// Run PHP update scripts if any
		Packages_manipulation::update_php_sql(PLUGINS."/$plugin", $existing_meta['version']);
		Event::instance()->fire(
			'admin/System/components/plugins/update/after',
			[
				'name' => $plugin
			]
		);
		// If plugin was enabled before update - enable it back
		if ($active) {
			static::admin_plugins_enable($route_ids, $route_path);
		}
	}
	/**
	 * Delete plugin completely
	 *
	 * @param int[]    $route_ids
	 * @param string[] $route_path
	 *
	 * @throws ExitException
	 */
	static function admin_plugins_delete ($route_ids, $route_path) {
		if (!isset($route_path[2])) {
			throw new ExitException(400);
		}
		$plugin  = $route_path[2];
		$plugins = get_files_list(PLUGINS, false, 'd');
		$Config  = Config::instance();
		if (
			!in_array($plugin, $plugins, true) ||
			in_array($plugin, $Config->components['plugins'])
		) {
			throw new ExitException(400);
		}
		if (!rmdir_recursive(PLUGINS."/$plugin")) {
			throw new ExitException(500);
		}
	}
}
