<?php
/**
 * @package		Comments
 * @category	modules
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright	Copyright (c) Nazar Mokrynskyi, 2011—2013
 * @license		MIT License, see license.txt
 */
namespace	cs;
Trigger::instance()->register(
	'System/Index/construct',
	function () {
		switch (Config::instance()->components['modules']['Comments']['active']) {
			case 1:
				require __DIR__.'/trigger/enabled.php';
			default:
				if (!ADMIN) {
					return;
				}
				require __DIR__.'/trigger/installed.php';
		}
	}
);