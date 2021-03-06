###*
 * @package   CleverStyle Widgets
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
###
Polymer.cs.behaviors.label =
	properties	:
		active	:
			notify				: true
			observer			: '_active_changed'
			reflectToAttribute	: true
			type				: Boolean
		focus	:
			reflectToAttribute	: true
			type				: Boolean
		value	:
			notify		: true
			observer	: '_value_changed'
			type		: String
	# TODO: Should be `ready` according to Polymer docs, but not working as expected (see https://github.com/Polymer/polymer/issues/2366)
	attached : ->
		# Micro optimization
		requestAnimationFrame =>
			do =>
				next_node	= @nextSibling
				if next_node && next_node.nodeType == Node.TEXT_NODE && next_node.nextSibling?.getAttribute?('is') == @is
					next_node.parentNode.removeChild(next_node)
			@local_input		= @querySelector('input')
			@local_input.label	= @
			@active				= @local_input.checked
			inputs				= @_get_inputs()
			if @value != undefined
				@_value_changed(@value)
			for input in inputs
				do (input = input) =>
					$this	= @
					input.addEventListener('change', =>
						@value					= input.value
						@active					= `$this.local_input.value == input.value`
						@local_input.checked	= `$this.local_input.value == input.value`
						return
					)
					if input.checked
						@value	= input.value
					return
			@local_input.addEventListener('focus', =>
				@focus = true
			)
			@local_input.addEventListener('blur', =>
				@focus = false
			)
			return
		return
	_get_inputs : ->
		if @local_input.name
			@parentNode.querySelectorAll('input[name="' + @local_input.name + '"]')
		else
			@_inputs_around()
	_inputs_around : ->
		inputs	= []
		inputs.push(@local_input)
		label	= @
		while label = label.previousElementSibling
			if label.tagName != 'LABEL'
				break
			input	= label.querySelector('input')
			if !input
				break
			inputs.push(input)
		label	= @
		while label = label.nextElementSibling
			if label.tagName != 'LABEL'
				break
			input	= label.querySelector('input')
			if !input
				break
			inputs.push(input)
		inputs
	_active_changed : ->
		# If checked state is already correct - skip, just micro optimization
		if @local_input.checked == @active
			return
		if @local_input.type == 'radio'
			# Simulate regular click for simplicity
			if @active
				@click()
		else
			# For checkbox just set checked property is enough
			@local_input.checked = @active
		return
	_value_changed : (value) ->
		if @local_input
			for input in @_get_inputs()
				state				= `input.value == value`
				input.checked		= state
				input.label?.active	= state
		return
