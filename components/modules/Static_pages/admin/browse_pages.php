<?php
/**
 * @package		Static Pages
 * @category	modules
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright	Copyright (c) 2011-2015, Nazar Mokrynskyi
 * @license		MIT License, see license.txt
 */
namespace	cs\modules\Static_pages;
use
	h,
	cs\Index,
	cs\Language,
	cs\Route;
$Index			= Index::instance();
$L				= Language::instance();
$rc				= Route::instance()->route;
$Index->buttons	= false;
$Index->content(
	h::{'table.cs-table[list]'}(
		h::{'tr th'}(
			[
				$L->page_title,
				[
					'style'	=> 'width: 80%'
				]
			],
			$L->action
		).
		h::{'tr| td'}(
			get_pages_rows()
		)
	).
	h::{'p.cs-text-left a[is=cs-link-button]'}(
		[
			$L->add_page,
			[
				'href'	=> 'admin/Static_pages/add_page/'.array_slice($rc, -1)[0]
			]
		]
	)
);
