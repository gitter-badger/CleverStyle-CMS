<?php
/**
 * @package		Plupload
 * @category	modules
 * @author		Moxiecode Systems AB
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com> (integration with CleverStyle CMS)
 * @copyright	Moxiecode Systems AB
 * @license		GNU GPL v2, see license.txt
 */
namespace	cs;
Event::instance()
	->on(
		'System/Config/init/after',
		function () {
			$Config = Config::instance();
			if (!isset($Config->components['modules']['Plupload'])) {
				return;
			}
			switch ($Config->components['modules']['Plupload']['active']) {
				case 1:
					require __DIR__.'/events/enabled.php';
			}
		}
	)
	->on(
		'System/Index/construct',
		function () {
			$Config = Config::instance();
			if (!isset($Config->components['modules']['Plupload'])) {
				return;
			}
			switch ($Config->components['modules']['Plupload']['active']) {
				case -1:
					require __DIR__.'/events/uninstalled.php';
				break;
				case 0:
				case 1:
					require __DIR__.'/events/installed.php';
			}
		}
	);
