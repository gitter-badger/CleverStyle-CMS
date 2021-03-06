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
	cs\Config,
	cs\ExitException,
	cs\Index,
	cs\Language,
	cs\Page\Meta,
	cs\Page,
	cs\Route,
	cs\User;
$Config     = Config::instance();
$Index      = Index::instance();
$L          = Language::instance();
$Pages      = Pages::instance();
$Categories = Categories::instance();
if (home_page()) {
	$page = $Pages->get($Pages->get_structure()['pages']['index']);
} else {
	$Route = Route::instance();
	if (!isset($Route->route[0])) {
		throw new ExitException(404);
	}
	$page = $Pages->get($Route->route[0]);
}
$Page = Page::instance();
$User = User::instance();
if (isset($_POST['save'])) {
	if (!$User->get_permission('admin/Pages', 'edit_page')) {
		throw new ExitException(403);
	}
	$Index->save(
		$Pages->set($page['id'], $page['category'], $_POST['title'], $page['path'], $_POST['content'], $page['interface'])
	);
	$page = $Pages->get($page['id']);
}
if ($page['interface']) {
	if (!home_page()) {
		$Page->Title[1] = $page['title'];
	}
	$Page->Description = description($page['content']);
	$Meta              = Meta::instance();
	$Meta->article();
	if (preg_match_all('/<img[^>]*src=[\'"]([^\'"]+)[\'"]/i', $page['content'], $images)) {
		$Meta->image($images[1]);
	}
	unset($images);
	$canonical_url = $Config->base_url();
	if (home_page()) {
		$Page->canonical_url($canonical_url);
	} else {
		$category      = $page['category'];
		$canonical_url = [];
		while ($category) {
			$category        = $Categories->get($category);
			$canonical_url[] = $category['path'];
			$category        = $category['parent'];
		}
		unset($category);
		$canonical_url[] = $page['path'];
		$canonical_url   = $Config->base_url().'/'.implode('/', $canonical_url);
		$Page->canonical_url($canonical_url);
	}
	$is_admin = $User->admin();
	if (isset($_GET['edit'])) {
		if (!$is_admin) {
			throw new ExitException(404);
		}
		$Index->form    = true;
		$Index->buttons = false;
		$Index->action  = $canonical_url;
		$Index->content(
			h::{'h2.cs-text-center'}(
				$L->editing_of_page($page['title'])
			).
			h::{'table.cs-table.cs-static-pages-page-form[right-left] tr| td'}(
				[
					$L->page_title,
					h::{'h1.cs-static-pages-page-title[contenteditable=true]'}(
						$page['title']
					)
				],
				[
					$L->page_content,
					(functionality('inline_editor')
						? h::{'div.cs-static-pages-page-content.INLINE_EDITOR'}(
							$page['content']
						)
						: h::{'textarea.cs-static-pages-page-content.EDITOR[is=cs-textarea][autosize]name=content][required]'}(
							$page['content']
						)
					)
				]
			).
			h::{'p.cs-text-center'}(
				h::{'button.cs-static-pages-page-save[is=cs-button][type=submit][name=save]'}(
					$L->save
				).
				h::{'button[is=cs-button]'}(
					$L->cancel,
					[
						'onclick' => 'history.go(-1);'
					]
				)
			)
		);
	} else {
		$Page->content(
			h::p(
				$is_admin ?
					h::{'a[is=cs-link-button][icon=pencil]'}(
						[
							'href'    => "$canonical_url?edit",
							'tooltip' => $L->edit
						]
					).
					h::{'a[is=cs-link-button][icon=trash]'}(
						[
							'href'    => "admin/Pages/delete_page/$page[id]",
							'tooltip' => $L->delete
						]
					) : false
			).
			h::section($page['content'])
		);
	}
} else {
	interface_off();
	$Page->Content = $page['content'];
}
