<?php
/**
 * @package   CleverStyle CMS
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2011-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
namespace cs\DB;
class MySQLi extends _Abstract {
	/**
	 * @var \MySQLi Instance of DB connection
	 */
	protected $instance;
	/**
	 * @inheritdoc
	 */
	function __construct ($database, $user = '', $password = '', $host = 'localhost', $charset = 'utf8mb4', $prefix = '') {
		$this->connecting_time = microtime(true);
		/**
		 * Parsing of $host variable, detecting port and persistent connection
		 */
		list($host, $port) = $this->get_host_and_port($host);
		$this->instance = @new \MySQLi($host, $user, $password, $database, $port);
		if (is_object($this->instance) && !$this->instance->connect_errno) {
			$this->database = $database;
			/**
			 * Changing DB charset
			 */
			if ($charset && $charset != $this->instance->character_set_name()) {
				$this->instance->set_charset($charset);
			}
			$this->connected = true;
		} else {
			return;
		}
		$this->connecting_time = microtime(true) - $this->connecting_time;
		$this->db_type         = 'mysql';
		$this->prefix          = $prefix;
	}
	/**
	 * Parse host string into host and port separately
	 *
	 * Understands `p:` prefix for persistent connections
	 *
	 * @param string $host_string
	 *
	 * @return array
	 */
	protected function get_host_and_port ($host_string) {
		$host = explode(':', $host_string);
		$port = ini_get('mysqli.default_port') ?: 3306;
		switch (count($host)) {
			case 1:
				$host = $host[0];
				break;
			case 2:
				if ($host[0] == 'p') {
					$host = "$host[0]:$host[1]";
				} else {
					$port = $host[1];
					$host = $host[0];
				}
				break;
			case 3:
				$port = $host[2];
				$host = "$host[0]:$host[1]";
		}
		return [$host, $port];
	}
	/**
	 * @inheritdoc
	 *
	 * @return false|\mysqli_result
	 */
	protected function q_internal ($query) {
		if (!$query) {
			return false;
		}
		$result_mode = $this->async && defined('MYSQLI_ASYNC') ? MYSQLI_ASYNC : MYSQLI_STORE_RESULT;
		$result      = @$this->instance->query($query, $result_mode);
		// In case of MySQL Client error - try to fix everything, but only once
		if (
			!$result &&
			$this->instance->errno >= 2000 &&
			$this->instance->ping()
		) {
			$result = @$this->instance->query($query, $result_mode);
		}
		return $result;
	}
	/**
	 * @inheritdoc
	 */
	protected function q_multi_internal ($query) {
		$query  = implode(';', $query);
		$return = @$this->instance->multi_query($query);
		/** @noinspection LoopWhichDoesNotLoopInspection */
		while ($this->instance->more_results() && $this->instance->next_result()) {
			$result = $this->instance->use_result();
			if (is_object($result)) {
				$result->free();
			}
		}
		return $return;
	}
	/**
	 * @inheritdoc
	 */
	function n ($query_result) {
		if (is_object($query_result)) {
			return $query_result->num_rows;
		} else {
			return false;
		}
	}
	/**
	 * @inheritdoc
	 *
	 * @param false|\mysqli_result $query_result
	 */
	function f ($query_result, $single_column = false, $array = false, $indexed = false) {
		if (!is_object($query_result)) {
			return false;
		}
		$result_type = $single_column || $indexed ? MYSQLI_NUM : MYSQLI_ASSOC;
		if ($array) {
			$result = [];
			while ($current = $query_result->fetch_array($result_type)) {
				$result[] = $single_column ? $current[0] : $current;
			}
			$this->free($query_result);
			return $result;
		}
		$result = $query_result->fetch_array($result_type);
		return $single_column && $result ? $result[0] : $result;
	}
	/**
	 * @inheritdoc
	 */
	function id () {
		return $this->instance->insert_id;
	}
	/**
	 * @inheritdoc
	 */
	function affected () {
		return $this->instance->affected_rows;
	}
	/**
	 * @inheritdoc
	 *
	 * @param false|\mysqli_result $query_result
	 */
	function free ($query_result) {
		if (is_object($query_result)) {
			$query_result->free();
		}
		return true;
	}
	/**
	 * @inheritdoc
	 */
	protected function s_internal ($string, $single_quotes_around) {
		$return = $this->instance->real_escape_string($string);
		return $single_quotes_around ? "'$return'" : $return;
	}
	/**
	 * @inheritdoc
	 */
	function server () {
		return $this->instance->server_info;
	}
	/**
	 * @inheritdoc
	 */
	function __destruct () {
		if ($this->connected && is_object($this->instance)) {
			$this->instance->close();
			$this->connected = false;
		}
	}
}
