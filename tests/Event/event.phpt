--TEST--
Events functionality
--FILE--
<?php
namespace cs;
include __DIR__.'/../custom_loader.php';
$Event = Event::instance();
$Event->on('event/empty_return', function () {
	return;
});
if (!$Event->fire('event/empty_return')) {
	die('Return without value should be considered as true');
}

$Event->on('event/false_return', function () {
	return false;
});
if ($Event->fire('event/false_return')) {
	die('Return false actually returns true');
}

$Event->on('event/data_modification', function ($data) {
	$data['test'] = 'passed';
});
$test = 'failed';
$Event->fire('event/data_modification', [
	'test' => &$test
]);
if ($test != 'passed') {
	die('Passing data by reference not working');
}

$Event->off('event/data_modification');
$test = 'failed';
$Event->fire('event/data_modification', [
	'test' => &$test
]);
if ($test != 'failed') {
	die('Event unsubscribing not working');
}
?>
Done
--EXPECT--
Done
