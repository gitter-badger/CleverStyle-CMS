###*
 * @package    CleverStyle CMS
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright  Copyright (c) 2015, Nazar Mokrynskyi
 * @license    MIT License, see license.txt
###
L				= cs.Language
STATUS_ACTIVE	= 1
STATUS_INACTIVE	= 0
GUEST_ID		= 1
ROOT_ID			= 2
Polymer(
	'is'					: 'cs-system-admin-users-list'
	behaviors				: [cs.Polymer.behaviors.Language]
	properties				:
		search_column		: ''
		search_mode			: 'LIKE'
		search_text			:
			observer	: 'search_textChanged'
			type		: String
			value		: ''
		search_page			:
			observer	: 'search'
			type		: Number
			value		: 1
		search_pages		:
			computed	: '_search_pages(users_count, search_limit)'
			type		: Number
		search_limit		: 20
		search_columns		: []
		search_modes		: []
		all_columns			: []
		columns				: [
			'id'
			'login'
			'username'
			'email'
		]
		users				: []
		users_count			: 0
		show_pagination		:
			computed	: '_show_pagination(users_count, search_limit)'
			type		: Boolean
		searching			: false
		searching_loader	: false
		_initialized		: true
	observers				: [
		'search_again(search_column, search_mode, search_limit, _initialized)'
	]
	ready : ->
		$.ajax(
			url		: 'api/System/admin/users'
			type	: 'search_options'
			success	: (search_options) =>
				search_columns	= []
				for column in search_options.columns
					search_columns.push(
						name		: column
						selected	: @columns.indexOf(column) != -1
					)
				@search_columns	= search_columns
				@all_columns	= search_options.columns
				@search_modes	= search_options.modes
		)
	search : ->
		if @searching || @_initialized == undefined
			return
		@searching			= true
		searching_timeout	= setTimeout (=>
			@searching_loader	= true
		), 200
		$.ajax(
			url			: 'api/System/admin/users'
			type		: 'search'
			data		:
				column	: @search_column
				mode	: @search_mode
				text	: @search_text
				page	: @search_page
				limit	: @search_limit
			complete	: (jqXHR, textStatus) =>
				clearTimeout(searching_timeout)
				@searching			= false
				@searching_loader	= false
				if !textStatus
					@set('users', [])
					@users_count	= 0
			success		: (data) =>
				@users_count	= data.count
				if !data.count
					@set('users', [])
					return
				data.users.forEach (user) =>
					user.class		=
						switch parseInt(user.status)
							when STATUS_ACTIVE then 'cs-block-success cs-text-success'
							when STATUS_INACTIVE then 'cs-block-warning cs-text-warning'
							else ''
					user.is_guest	= `user.id == GUEST_ID`
					user.is_root	= `user.id == ROOT_ID`
					user.columns	=
						for column in @columns
							do (value = user[column]) ->
								if value instanceof Array
									value.join(', ')
								else
									value
					do ->
						type			=
							if user.is_root || user.is_admin
								'a'
							else if user.is_user
								'u'
							else if user.is_bot
								'b'
							else
								'g'
						user.type		= L[type]
						user.type_info	= L[type + '_info']
				@set('users', data.users)
		)
	toggle_search_column : (e) ->
		index			= e.model.index
		column			= @search_columns[index]
		@set(['search_columns', index, 'selected'], !column.selected)
		@set('columns', column.name for column in @search_columns when column.selected)
		@search_again()
	search_again : ->
		if @search_page > 1
			# Will execute search implicitly
			@search_page	= 1
		else
			@search()
	search_textChanged : ->
		if @_initialized == undefined
			return
		clearTimeout(@search_text_timeout)
		@search_text_timeout	= setTimeout(@search_again.bind(@), 300)
	_show_pagination : (users_count, search_limit) ->
		parseInt(users_count) > parseInt(search_limit)
	_search_pages : (users_count, search_limit) ->
		Math.ceil(users_count / search_limit)
	add_user : ->
		$(cs.ui.simple_modal("""
			<h3>#{L.adding_a_user}</h3>
			<cs-system-admin-users-add-user-form/>
		""")).on('hide.uk.modal', @search.bind(@))
	add_bot : ->
		$(cs.ui.simple_modal("""
			<h3>#{L.adding_a_bot}</h3>
			<cs-system-admin-users-add-bot-form/>
		""")).on('hide.uk.modal', @search.bind(@))
	edit_user : (e) ->
		$sender	= $(e.currentTarget)
		index	= $sender.closest('[data-user-index]').data('user-index')
		user	= @users[index]
		if user.is_bot
			title		= L.editing_of_bot_information(
				user.username || user.login
			)
			$(cs.ui.simple_modal("""
				<h2>#{title}</h2>
				<cs-system-admin-users-edit-bot-form user_id="#{user.id}"/>
			""")).on('hide.uk.modal', @search.bind(@))
		else
			title		= L.editing_of_user_information(
				user.username || user.login
			)
			$(cs.ui.simple_modal("""
				<h2>#{title}</h2>
				<cs-system-admin-users-edit-user-form user_id="#{user.id}"/>
			""")).on('hide.uk.modal', @search.bind(@))
	edit_permissions : (e) ->
		$sender		= $(e.currentTarget)
		index		= $sender.closest('[data-user-index]').data('user-index')
		user		= @users[index]
		title_key	= if user.is_bot then 'permissions_for_bot' else 'permissions_for_user'
		title		= L[title_key](
			user.username || user.login
		)
		cs.ui.simple_modal("""
			<h2>#{title}</h2>
			<cs-system-admin-permissions-for user="#{user.id}" for="user"/>
		""")
)
