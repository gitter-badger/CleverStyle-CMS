<?php
/**
 * @package    CleverStyle CMS
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright  Copyright (c) 2015, Nazar Mokrynskyi
 * @license    MIT License, see license.txt
 */
namespace cs\modules\System\api;
use
	cs\modules\System\api\Controller\admin,
	cs\modules\System\api\Controller\general,
	cs\modules\System\api\Controller\profile,
	cs\modules\System\api\Controller\profiles,
	cs\modules\System\api\Controller\user_;
class Controller {
	use
		admin,
		admin\blocks,
		admin\cache,
		admin\databases,
		admin\groups,
		admin\languages,
		admin\modules,
		admin\permissions,
		admin\plugins,
		admin\storages,
		admin\themes,
		admin\upload,
		admin\users,
		general,
		profile,
		profiles,
		user_;
}
