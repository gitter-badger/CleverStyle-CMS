<?php
/**
 * @package		Blogs
 * @category	modules
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright	Copyright (c) 2011-2015, Nazar Mokrynskyi
 * @license		MIT License, see license.txt
 */

namespace	cs\modules\Blogs;
use			h,
			cs\Index,
			cs\Language,
			cs\Page;
$Index			= Index::instance();
$L				= Language::instance();
$Index->buttons	= false;
Page::instance()->title($L->browse_sections);
$Index->content(
	h::{'table.cs-table[list]'}(
		h::{'tr th'}(
			[
				$L->blogs_sections,
				[
					'style'	=> 'width: 80%'
				]
			],
			$L->action
		).
		h::{'tr| td'}(
			get_sections_rows()
		)
	).
	h::{'p.cs-text-left a[is=cs-link-button]'}(
		$L->add_section,
		[
			'href'	=> 'admin/Blogs/add_section'
		]
	)
);
