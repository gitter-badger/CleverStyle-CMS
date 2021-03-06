/**
 * @package   CleverStyle CMS
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
L	= cs.Language
Polymer(
	'is'		: 'cs-system-change-password'
	behaviors	: [cs.Polymer.behaviors.Language]
	attached : !->
		@$.current_password.focus()
	_change_password : (e) !->
		e.preventDefault()
		cs.change_password(@$.current_password.value, @$.new_password.value)
)
