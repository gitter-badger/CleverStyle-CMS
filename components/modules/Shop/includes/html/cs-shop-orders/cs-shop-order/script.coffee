###*
 * @package   Shop
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
###
L	= cs.Language
Polymer(
	'is'				: 'cs-shop-order'
	behaviors			: [cs.Polymer.behaviors.Language]
	properties			:
		order_id			: Number
		date				: Number
		date_formatted		: String
		shipping_cost		: Number
		for_payment			: Number
		payment_method		: String
		paid				: Boolean
	ready				: ->
		@show_pay_now				= !@paid && @payment_method != 'shop:cash'
		@order_number				= sprintf('' + L.shop_order_number, @order_id)
		@order_status				= @querySelector('#order_status').textContent
		@shipping_type				= @querySelector('#shipping_type').textContent
		@shipping_cost_formatted	= sprintf(cs.shop.settings.price_formatting, @shipping_cost)
		total_price					= 0
		discount					= 0
		$(@).find('cs-shop-order-item').each ->
			total_price	+= @units * @unit_price
			discount	+= (@units * @unit_price) - @price
		@total_price_formatted	= sprintf(cs.shop.settings.price_formatting, total_price)
		@discount_formatted		= if discount then sprintf(cs.shop.settings.price_formatting, discount) else ''
		@for_payment_formatted	= sprintf(cs.shop.settings.price_formatting, @for_payment)
		@phone					= @querySelector('#phone')?.textContent || ''
		@$.phone.textContent	= @phone
		@address				= $.trim(@querySelector('#address')?.textContent || '').replace(/\n/g, '<br>')
		@$.address.textContent	= @address
		@comment				= $.trim(@querySelector('#comment')?.textContent || '').replace(/\n/g, '<br>')
		@$.comment.textContent	= @comment
	pay					: ->
		location.href	= 'Shop/pay/' + @order_id
);
