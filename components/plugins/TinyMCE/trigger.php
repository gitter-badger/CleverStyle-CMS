<?php
global $Core;
$clean_pcache = function ($data = null) {
	$plugin = basename(__DIR__);
	if (
		($data['name'] == $plugin || $data === null) &&
		_file_exists(PCACHE.DS.'plugin.'.$plugin.'.js')
	) {
		_unlink(PCACHE.DS.'plugin.'.$plugin.'.js');
	}
};
$Core->register_trigger('admin/System/components/plugins/disable',			$clean_pcache);
$Core->register_trigger('admin/System/general/optimization/clean_pcache',	$clean_pcache);