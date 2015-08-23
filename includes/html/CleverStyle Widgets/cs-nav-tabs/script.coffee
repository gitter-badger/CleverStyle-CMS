###*
 * @package   CleverStyle Widgets
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
###
Polymer(
	'is'		: 'cs-nav-tabs'
	'extends'	: 'nav'
	properties	:
		selected	:
			observer	: 'active_changed'
			type		: Number
	ready : ->
		@addEventListener('tap', @click.bind(@))
		@addEventListener('click', @click.bind(@))
		do =>
			for element in @children
				if element.active
					return
			@selected = 0
			return
	click : (e) ->
		target = do =>
			for path, index in e.path
				if path == @
					# `-3` because `-1` is Shadow Root and `-2` is `<content>` element
					return e.path[index - 3]
		for element, index in @children
			if element.tagName == 'TEMPLATE'
				continue
			if element == target
				@selected = index
				element.setAttribute('active', '')
			else
				element.removeAttribute('active')
		return
	active_changed : ->
		for element, index in @children
			if element.tagName == 'TEMPLATE'
				continue
			element.active = index == @selected
			if index == @selected
				element.setAttribute('active', '')
			else
				element.removeAttribute('active')
		if @nextElementSibling?.is == 'cs-section-switcher'
			@nextElementSibling.selected = @selected
		return
)