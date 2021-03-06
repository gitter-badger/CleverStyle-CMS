###*
 * @package    CleverStyle CMS
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright  Copyright (c) 2015, Nazar Mokrynskyi
 * @license    MIT License, see license.txt
###
L	= cs.Language
Polymer(
	'is'	: 'cs-system-admin-permissions-form'
	behaviors		: [cs.Polymer.behaviors.Language]
	properties		:
		permission_id	: Number
		group			: ''
		label			: ''
	save	: ->
		$.ajax(
			url		: 'api/System/admin/permissions' + (if @permission_id then '/' + @permission_id else '')
			type	: if @permission_id then 'put' else 'post'
			data	:
				id		: @permission_id
				group	: @group
				label	: @label
			success	: ->
				cs.ui.notify(L.changes_saved, 'success', 5)
		)
)
