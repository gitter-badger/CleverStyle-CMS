<?php
global	$DB_HOST,
		$DB_TYPE,
		$DB_NAME,
		$DB_USER,
		$DB_PASSWORD,
		$DB_PREFIX,
		$DB_CODEPAGE,

		$STORAGE_TYPE,
		$STORAGE_URL,
		$STORAGE_HOST,
		$STORAGE_USER,
		$STORAGE_PASSWORD,

		$LANGUAGE,

		$CACHE_ENGINE,
		$CACHE_SIZE,

		$BING_TRANSLATOR,

		$KEY,
		$IV;

define('DOMAIN', 'cscms.org');

$DB_HOST			= 'localhost';
$DB_TYPE			= 'MySQL';
$DB_NAME			= 'CleverStyle';
$DB_USER			= 'CleverStyle';
$DB_PASSWORD		= '1111';
$DB_PREFIX			= 'prefix_';
$DB_CODEPAGE		= 'utf8';

$STORAGE_TYPE		= 'Local';
$STORAGE_URL		= '';
$STORAGE_HOST		= 'localhost';
$STORAGE_USER		= '';
$STORAGE_PASSWORD	= '';

$LANGUAGE			= 'Русский';

$CACHE_ENGINE		= 'FileSystem';
$CACHE_SIZE			= 5;				//Cache size in MB, 0 means without limitation

$BING_TRANSLATOR	= [					//Auth parameter for Bing translator API
	'client_id'		=> '',
	'client_secret'	=> ''
];

$KEY				= 'f40fbea2ee5a24ce581fb53510883dfcf40fbea2ee5a24ce581fb535';
$IV					= 'f40fbea2ee5a24ce581fb53510883dfcf40fbea2ee5a24ce581fb535';
date_default_timezone_set('UTC');
#define('DEBUG', true);
define('FIXED_LANGUAGE', false);		//If true - language can't be changed, it can be useful if there are several domains,
										//every of which must work with fixed language (en.domain.com, ru.domain.com, de.domain.com)