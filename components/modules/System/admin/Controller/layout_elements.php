<?php
/**
 * @package    CleverStyle CMS
 * @subpackage System module
 * @category   modules
 * @author     Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright  Copyright (c) 2015, Nazar Mokrynskyi
 * @license    MIT License, see license.txt
 */
namespace cs\modules\System\admin\Controller;
use
	cs\Config,
	cs\Language,
	h;

trait layout_elements {
	/**
	 * @param string[][] $rows
	 *
	 * @return string
	 */
	protected static function vertical_table ($rows) {
		return h::{'table.cs-table[right-left] tr| td'}(func_get_args());
	}
	/**
	 * @param string[] $header_columns
	 * @param string[] $columns
	 *
	 * @return string
	 */
	protected static function horizontal_table ($header_columns, $columns) {
		return h::{'table.cs-table[center] tr| td'}($header_columns, $columns);
	}
	/**
	 * @param string[]   $header_columns
	 * @param string[][] $rows
	 *
	 * @return string
	 */
	protected static function list_center_table ($header_columns, $rows) {
		return h::{'table.cs-table[center][list]'}(
			h::{'tr th'}($header_columns).
			h::{'tr| td'}($rows ? [$rows] : false)
		);
	}
	protected static function core_input ($item, $type = 'text', $info_item = null, $disabled = false, $min = false, $max = false, $post_text = '') {
		$Config = Config::instance();
		$L      = Language::instance();
		if ($type != 'radio') {
			switch ($item) {
				default:
					$value = $Config->core[$item];
					break;
				case 'name':
				case 'closed_title':
				case 'mail_from_name':
					$value = get_core_ml_text($item);
			}
			return [
				$info_item !== false ? h::info($info_item ?: $item) : $L->$item,
				h::{'input[is=cs-input-text]'}(
					[
						'name'  => "core[$item]",
						'value' => $value,
						'min'   => $min,
						'max'   => $max,
						'type'  => $type,
						($disabled ? 'disabled' : '')
					]
				).
				$post_text
			];
		} else {
			return [
				$info_item !== false ? h::info($info_item ?: $item) : $L->$item,
				h::radio(
					[
						'name'    => "core[$item]",
						'checked' => $Config->core[$item],
						'value'   => [0, 1],
						'in'      => [$L->off, $L->on]
					]
				)
			];
		}
	}
	protected static function core_textarea ($item, $editor = null, $info_item = null) {
		switch ($item) {
			default:
				$content = Config::instance()->core[$item];
				break;
			case 'closed_text':
			case 'mail_signature':
			case 'rules':
				$content = get_core_ml_text($item);
		}
		return [
			h::info($info_item ?: $item),
			h::{'textarea[is=cs-textarea][autosize]'}(
				$content,
				[
					'name'  => "core[$item]",
					'class' => $editor ? " $editor" : ''
				]
			)
		];
	}
	protected static function core_select ($items_array, $item, $id = null, $info_item = null, $multiple = false, $size = 5) {
		return [
			h::info($info_item ?: $item),
			h::{'select[is=cs-select]'}(
				$items_array,
				[
					'name'     => "core[$item]".($multiple ? '[]' : ''),
					'selected' => Config::instance()->core[$item],
					'size'     => $size,
					'id'       => $id ?: false,
					$multiple ? 'multiple' : false
				]
			)
		];
	}
}
