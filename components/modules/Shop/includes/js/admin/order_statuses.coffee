###*
 * @package   Shop
 * @order-status  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
###
$ ->
	L = cs.Language
	make_modal = (types, title, action) ->
		types	=
			for index, type of types
				"""<option value="#{index}">#{type}</option>"""
		types	= types.join('')
		modal	= $(cs.ui.simple_modal("""<form is="cs-form">
			<h3 class="cs-text-center">#{title}</h3>
			<label>#{L.shop_title}</label>
			<input is="cs-input-text" name="title" required>
			<label>#{L.shop_color}</label>
			<input is="cs-input-text" name="color"><br>
			<input is="cs-input-text" type="color">
			<label>#{L.shop_order_status_type}</label>
			<select is="cs-select" name="type" required>#{types}</select>
			<label>#{L.shop_send_update_status_email}</label>
			<div>
				<label is="cs-label-button"><input type="radio" name="send_update_status_email" value="1" checked> #{L.yes}</label>
				<label is="cs-label-button"><input type="radio" name="send_update_status_email" value="0"> #{L.no}</label>
			</div>
			<label>#{L.shop_comment_used_in_email}</label>
			<textarea is="cs-textarea" autosize name="comment"></textarea>
			<br>
			<button is="cs-button" primary type="submit">#{action}</button>
		</form>"""))
		modal.find('[type=color]').change ->
			modal.find('[name=color]').val(
				$(@).val()
			)
		modal.find('[name=color]').change ->
			modal.find('[type=color]').val(
				$(@).val()
			)
		modal
	$('html')
		.on('mousedown', '.cs-shop-order-status-add', ->
			$.getJSON('api/Shop/admin/order_statuses/types', (types) ->
				modal = make_modal(types, L.shop_order_status_addition, L.shop_add)
				modal.find('form').submit ->
					$.ajax(
						url     : 'api/Shop/admin/order_statuses'
						type    : 'post'
						data    : $(@).serialize()
						success : ->
							alert(L.shop_added_successfully)
							location.reload()
					)
					return false
			)
		)
		.on('mousedown', '.cs-shop-order-status-edit', ->
			id = $(@).data('id')
			$.when(
				$.getJSON('api/Shop/admin/order_statuses/types')
				$.getJSON("api/Shop/admin/order_statuses/#{id}")
			).done (types, type) ->
				modal = make_modal(types[0], L.shop_order_status_edition, L.shop_edit)
				modal.find('form').submit ->
					$.ajax(
						url     : "api/Shop/admin/order_statuses/#{id}"
						type    : 'put'
						data    : $(@).serialize()
						success : ->
							alert(L.shop_edited_successfully)
							location.reload()
					)
					return false
				type	= type[0]
				modal.find('[name=title]').val(type.title)
				modal.find('[name=color]').val(type.color)
				modal.find('[type=color]').val(type.color)
				modal.find('[name=type]').val(type.type)
				modal.find("[name=send_update_status_email][value=#{type.send_update_status_email}]").prop('checked', true)
				modal.find('[name=comment]').val(type.comment)
		)
		.on('mousedown', '.cs-shop-order-status-delete', ->
			id = $(@).data('id')
			if confirm(L.shop_sure_want_to_delete)
				$.ajax(
					url     : "api/Shop/admin/order_statuses/#{id}"
					type    : 'delete'
					success : ->
						alert(L.shop_deleted_successfully)
						location.reload()
				)
		)
