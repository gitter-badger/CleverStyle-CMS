<?php
/**
 * @package   OAuth2
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2011-2013, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
namespace cs\modules\OAuth2;

use
	cs\Config,
	cs\Event,
	cs\ExitException,
	cs\User;

Event::instance()
	->on(
		'System/Session/del_all',
		function ($data) {
			OAuth2::instance()->del_access(0, $data['id']);
		}
	)
	->on(
		'System/User/construct/before',
		function () {
			/**
			 * Works only for API requests
			 */
			if (!api_path()) {
				return;
			}
			if (isset($_SERVER['HTTP_AUTHORIZATION']) && preg_match('/Bearer ([0-9a-z]{32})/i', $_SERVER['HTTP_AUTHORIZATION'], $access_token)) {
				$access_token = $access_token[1];
			} else {
				unset($access_token);
				if (isset($_SERVER['HTTP_ACCESS_TOKEN'])) {
					$access_token = $_SERVER['HTTP_ACCESS_TOKEN'];
				} elseif (isset($_REQUEST['access_token'])) {
					$access_token = $_REQUEST['access_token'];
				}
			}
			if (!isset($access_token)) {
				return;
			}
			$OAuth2     = OAuth2::instance();
			$token_data = $OAuth2->get_token($access_token);
			if (!$token_data) {
				$e = new ExitException(
					[
						'access_denied',
						'access_token expired'
					],
					403
				);
				$e->setJson();
				throw $e;
			}
			$client = $OAuth2->get_client($token_data['client_id']);
			if (!$client) {
				$e = new ExitException(
					[
						'access_denied',
						'Invalid client id'
					],
					400
				);
				$e->setJson();
				throw $e;
			} elseif (!$client['active']) {
				$e = new ExitException(
					[
						'access_denied',
						'Inactive client id'
					],
					403
				);
				$e->setJson();
				throw $e;
			}
			if ($token_data['type'] == 'token') {
				// TODO: add some mark if this is client-side only token, so that it can be accounted by components
				// Also ADMIN access should be blocked for client-side only tokens
			}
			/**
			 * @var \cs\_SERVER $_SERVER
			 */
			$_SERVER->user_agent = "OAuth2-$client[name]-$client[id]";
			$_POST['session']    = $token_data['session'];
			$_REQUEST['session'] = $token_data['session'];
			_setcookie('session', $token_data['session']);
			if (!Config::instance()->module('OAuth2')->guest_tokens) {
				Event::instance()->on(
					'System/User/construct/after',
					function () {
						if (!User::instance()->user()) {
							$e = new ExitException(
								[
									'access_denied',
									'Guest tokens disabled'
								],
								403
							);
							$e->setJson();
							throw $e;
						}
					}
				);
			}
		}
	);
