###*
 * @package   CleverStyle Widgets
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
###
Polymer(
	'is'			: 'cs-label-button'
	'extends'		: 'label'
	behaviors		: [
		Polymer.cs.behaviors.label
		Polymer.cs.behaviors.this
		Polymer.cs.behaviors.tooltip
	]
	hostAttributes	:
		role	: 'button'
	properties		:
		first	:
			reflectToAttribute	: true
			type				: Boolean
		last	:
			reflectToAttribute	: true
			type				: Boolean
	ready		: ->
		if @previousElementSibling?.is != @is
			@first = true
		if @nextElementSibling?.getAttribute('is') != @is
			@last = true
)
