<?php
/**
 * @package   Static Pages
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2011-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
namespace cs\modules\Static_pages;
use
	h,
	cs\Index,
	cs\Language,
	cs\Page,
	cs\Route;
$Index = Index::instance();
$L     = Language::instance();
$id    = (int)Route::instance()->route[1];
$title = Pages::instance()->get($id)['title'];
Page::instance()->title($L->deletion_of_page($title));
$Index->buttons            = false;
$Index->cancel_button_back = true;
$Index->action             = 'admin/Static_pages';
$Index->content(
	h::{'h2.cs-text-center'}(
		$L->sure_to_delete_page($title)
	).
	h::{'button[is=cs-button][type=submit]'}($L->yes).
	h::{'input[type=hidden][name=id]'}(
		[
			'value' => $id
		]
	).
	h::{'input[type=hidden][name=mode][value=delete_page]'}()
);
