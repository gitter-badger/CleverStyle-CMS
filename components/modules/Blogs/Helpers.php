<?php
/**
 * @package   Blogs
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
namespace cs\modules\Blogs;
use
	cs\Config,
	cs\Index,
	cs\Language,
	cs\User,
	h;

class Helpers {
	/**
	 * Return HTML with posts list
	 *
	 * @param int[]  $posts
	 * @param int    $posts_count
	 * @param int    $page
	 * @param string $base_url
	 *
	 * @return string
	 */
	static function show_posts_list ($posts, $posts_count, $page, $base_url) {
		$module_data = Config::instance()->module('Blogs');
		$Index       = Index::instance();
		$L           = Language::instance();
		$User        = User::instance();
		$Index->content(
			h::{'cs-blogs-head-actions'}(
				[
					'admin'          => $User->admin() && $User->get_permission('admin/Blogs', 'index'),
					'can_write_post' => $User->admin() || !$module_data->new_posts_only_from_admins
				]
			)
		);
		if (!$posts) {
			$Index->content(
				h::{'p.cs-text-center'}($L->no_posts_yet)
			);
			return;
		}
		$Index->content(
			h::{'section[is=cs-blogs-posts]'}(
				h::{'script[type=application/ld+json]'}(
					json_encode(
						Posts::instance()->get_as_json_ld($posts),
						JSON_UNESCAPED_UNICODE
					)
				),
				[
					'comments_enabled' => $module_data->enable_comments && functionality('comments')
				]
			).
			h::{'.cs-block-margin.cs-text-center.cs-margin nav[is=cs-nav-pagination]'}(
				pages(
					$page,
					ceil($posts_count / $module_data->posts_per_page),
					function ($page) use ($base_url) {
						return $base_url.($page > 1 ? "/$page" : '');
					},
					true
				)
			)
		);
	}
}
