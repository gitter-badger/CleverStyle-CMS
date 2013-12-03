###*
 * @package		Blogs
 * @category	modules
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright	Copyright (c) Nazar Mokrynskyi, 2011—2013
 * @license		MIT License, see license.txt
###
$ ->
	title	= $('.cs-blogs-new-post-title')
	content	= $('.cs-blogs-new-post-content')
	$('.cs-blogs-post-preview').mousedown ->
		data =
			id			: $(this).data('id')
			title		: title.val() || title.text()
			sections	: $('.cs-blogs-new-post-sections').val()
			content		: content.val() || content.html()
			tags		: $('.cs-blogs-new-post-tags').val()
		$.ajax
			url		: 'api/Blogs/posts/preview'
			cache	: false
			data	: data
			type	: 'post'
			success	: (result) ->
				preview	= $('.cs-blogs-post-preview-content');
				preview.html(result);
				$('html, body')
					.stop().
					animate(
						scrollTop	: preview.offset().top
						500
					)
	$('.cs-blogs-post-form')
		.parents('form')
		.submit ->
			form	= $(this)
			if !title.is('input')
				form.append(
					$('<input name="title" class="uk-hidden" />').val(title.text())
				)
			if !content.is('textarea')
				form.append(
					$('<textarea name="content" class="uk-hidden" />').val(content.html())
				)