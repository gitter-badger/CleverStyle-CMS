<?php
/**
 * @package		Comments
 * @category	modules
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright	Copyright (c) 2011-2015, Nazar Mokrynskyi
 * @license		MIT License, see license.txt
 */
namespace	cs;
Event::instance()->on(
	'System/Index/construct',
	function () {
		$Config = Config::instance();
		if (!isset($Config->components['modules']['Disqus'])) {
			return;
		}
		switch ($Config->components['modules']['Disqus']['active']) {
			case 1:
				require __DIR__.'/events/enabled.php';
		}
	}
);
