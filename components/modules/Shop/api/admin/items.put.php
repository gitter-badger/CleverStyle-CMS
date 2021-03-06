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
	cs\ExitException,
	cs\Route;

$Route = Route::instance();
if (!isset(
	$Route->ids[0],
	$_POST['category'],
	$_POST['price'],
	$_POST['in_stock'],
	$_POST['soon'],
	$_POST['listed'],
	$_POST['attributes'],
	$_POST['images'],
	$_POST['tags']
)
) {
	throw new ExitException(400);
}
$result = Items::instance()->set(
	$Route->ids[0],
	$_POST['category'],
	$_POST['price'],
	$_POST['in_stock'],
	$_POST['soon'],
	$_POST['listed'],
	$_POST['attributes'],
	_json_decode($_POST['images']) ?: [],
	@$_POST['videos'] ?: [],
	_trim(explode(',', $_POST['tags']))
);
if (!$result) {
	throw new ExitException(500);
}
