<?php
/**
 * @package		Disqus
 * @category	modules
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright	Copyright (c) Nazar Mokrynskyi, 2011—2013
 * @license		MIT License, see license.txt
 */
namespace	cs;
use			h;
if (isset($_POST['shortname'])) {
	Config::instance()->module('Disqus')->shortname	= $_POST['shortname'];
	Index::instance()->save(true);
}