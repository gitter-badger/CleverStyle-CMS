<?php
/**
 * @package        Content
 * @category       modules
 * @author         Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright      Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license        MIT License, see license.txt
 */

namespace cs\modules\Content;

use
	cs\Event,
	cs\User;

Event::instance()->on(
	'admin/System/components/modules/uninstall/before',
	function ($data) {
		if ($data['name'] != 'Content' || !User::instance()->admin()) {
			return;
		}
		time_limit_pause();
		$Content   = Content::instance();
		$all_items = $Content->get_all();
		if (!empty($all_items)) {
			foreach ($all_items as $item) {
				$Content->del($item);
			}
			unset($item);
		}
		unset($all_items);
		time_limit_pause(false);
	}
);
