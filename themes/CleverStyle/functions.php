<?php
/**
 * @package    CleverStyle CMS
 * @subpackage CleverStyle theme
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright  Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license    MIT License, see license.txt
 */
namespace cs\themes\CleverStyle;
use
	cs\Config,
	cs\DB,
	cs\Event,
	cs\Language,
	cs\Page,
	cs\User,
	h;
/**
 * Returns array with `a` items
 *
 * @return string[]
 */
function get_main_menu () {
	$Config          = Config::instance();
	$L               = Language::instance();
	$User            = User::instance();
	$main_menu_items = [];
	/**
	 * Administration item if allowed
	 */
	if ($User->admin() || ($Config->can_be_admin() && $Config->core['ip_admin_list_only'])) {
		$main_menu_items[] = h::a(
			$L->administration,
			[
				'href' => 'admin'
			]
		);
	}
	/**
	 * Home item
	 */
	$main_menu_items[] = h::a(
		$L->home,
		[
			'href' => '/'
		]
	);
	/**
	 * All other active modules if permissions allow to visit
	 */
	foreach ($Config->components['modules'] as $module => $module_data) {
		if (
			$module != Config::SYSTEM_MODULE &&
			$module_data['active'] == 1 &&
			$module != $Config->core['default_module'] &&
			!@file_get_json(MODULES."/$module/meta.json")['hide_in_menu'] &&
			$User->get_permission($module, 'index') &&
			(
				file_exists(MODULES."/$module/index.php") ||
				file_exists(MODULES."/$module/index.html") ||
				file_exists(MODULES."/$module/index.json")
			)
		) {
			$main_menu_items[] = h::a(
				$L->$module,
				[
					'href' => path($L->$module)
				]
			);
		}
	}
	return $main_menu_items;
}

/**
 * Getting footer information
 *
 * @return string
 */
function get_footer () {
	$db = class_exists('cs\\DB', false) ? DB::instance() : null;
	/**
	 * Some useful details about page execution process, will be called directly before output
	 */
	Event::instance()->on(
		'System/Page/display/after',
		function () {
			$Page       = Page::instance();
			$Page->Html = str_replace(
				[
					'<!--generate time-->',
					'<!--peak memory usage-->'
				],
				[
					format_time(round(microtime(true) - MICROTIME, 5)),
					format_filesize(memory_get_usage(), 5).h::sup(format_filesize(memory_get_peak_usage(), 5))
				],
				$Page->Html
			);
		}
	);
	return h::div(
		Language::instance()->page_footer_info(
			'<!--generate time-->',
			$db ? $db->queries() : 0,
			format_time(round($db ? $db->time() : 0, 5)),
			'<!--peak memory usage-->'
		),
		'© Powered by <a target="_blank" href="http://cleverstyle.org/cms" title="CleverStyle CMS">CleverStyle CMS</a>'
	);
}
