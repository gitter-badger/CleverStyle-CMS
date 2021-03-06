###*
 * @package   Shop
 * @shipping-type  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
###
$ ->
	L = cs.Language
	make_modal = (title, action) ->
		$(cs.ui.simple_modal("""<form is="cs-form">
			<h3 class="cs-text-center">#{title}</h3>
			<label>#{L.shop_title}</label>
			<input is="cs-input-text" name="title" required>
			<label>#{L.shop_price}</label>
			<input is="cs-input-text" name="price" type="number" min="0" value="0" required>
			<label>#{L.shop_phone_needed}</label>
			<div>
				<label is="cs-label-button"><input type="radio" name="phone_needed" value="1" checked> #{L.yes}</label>
				<label is="cs-label-button"><input type="radio" name="phone_needed" value="0"> #{L.no}</label>
			</div>
			<label>#{L.shop_address_needed}</label>
			<div>
				<label is="cs-label-button"><input type="radio" name="address_needed" value="1" checked> #{L.yes}</label>
				<label is="cs-label-button"><input type="radio" name="address_needed" value="0"> #{L.no}</label>
			</div>
			<label>#{L.shop_description}</label>
			<textarea is="cs-textarea" autosize name="description"></textarea>
			<br>
			<button is="cs-button" primary type="submit">#{action}</button>
		</form>"""))
	$('html')
		.on('mousedown', '.cs-shop-shipping-type-add', ->
			$modal = make_modal(L.shop_shipping_type_addition, L.shop_add)
			$modal.find('form').submit ->
				$.ajax(
					url     : 'api/Shop/admin/shipping_types'
					type    : 'post'
					data    : $(@).serialize()
					success : ->
						alert(L.shop_added_successfully)
						location.reload()
				)
				return false
		)
		.on('mousedown', '.cs-shop-shipping-type-edit', ->
			id = $(@).data('id')
			$.getJSON("api/Shop/admin/shipping_types/#{id}", (shipping_type) ->
				$modal = make_modal(L.shop_shipping_type_edition, L.shop_edit)
				$modal.find('form').submit ->
					$.ajax(
						url     : "api/Shop/admin/shipping_types/#{id}"
						type    : 'put'
						data    : $(@).serialize()
						success : ->
							alert(L.shop_edited_successfully)
							location.reload()
					)
					return false
				$modal.find('[name=title]').val(shipping_type.title)
				$modal.find('[name=price]').val(shipping_type.price)
				$modal.find("[name=phone_needed][value=#{shipping_type.phone_needed}]").prop('checked', true)
				$modal.find("[name=address_needed][value=#{shipping_type.address_needed}]").prop('checked', true)
				$modal.find('[name=description]').val(shipping_type.description)
			)
		)
		.on('mousedown', '.cs-shop-shipping-type-delete', ->
			id = $(@).data('id')
			if confirm(L.shop_sure_want_to_delete)
				$.ajax(
					url     : "api/Shop/admin/shipping_types/#{id}"
					type    : 'delete'
					success : ->
						alert(L.shop_deleted_successfully)
						location.reload()
				)
		)
