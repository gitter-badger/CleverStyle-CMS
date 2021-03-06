<?php
/**
 * @package   Shop
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
namespace cs\modules\Shop;
use
	cs\Config,
	cs\ExitException,
	cs\Page,
	cs\Route;

if (!isset(
	$_POST['price'],
	$_POST['phone_needed'],
	$_POST['address_needed'],
	$_POST['title'],
	$_POST['description']
)
) {
	throw new ExitException(400);
}
$id = Shipping_types::instance()->add(
	$_POST['price'],
	$_POST['phone_needed'],
	$_POST['address_needed'],
	$_POST['title'],
	$_POST['description']
);
if (!$id) {
	throw new ExitException(500);
}
status_code(201);
$Config = Config::instance();
Page::instance()->json(
	$Config->core_url().'/'.Route::instance()->relative_address."/$id"
);
