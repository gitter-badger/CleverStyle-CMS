###*
 * @package   CleverStyle Widgets
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
###
Polymer(
	'is'		: 'cs-textarea'
	'extends'	: 'textarea'
	behaviors	: [
		Polymer.cs.behaviors.size
		Polymer.cs.behaviors.this
		Polymer.cs.behaviors.tooltip
		Polymer.cs.behaviors.value
	]
	properties	:
		autosize	:
			observer			: '_autosize_changed'
			reflectToAttribute	: true
			type				: Boolean
		initialized	: Boolean
	attached : ->
		@initialized = true
		@_do_autosizing()
	_autosize_changed : ->
		@_do_autosizing()
	_do_autosizing : ->
		if !@initialized
			return
		# Apply autosizing only if autosize plugin available: https://github.com/jackmoore/autosize
		if autosize
			if @autosize
				autosize(@)
				autosize.update(@)
			else
				autosize.destroy(@)
)
