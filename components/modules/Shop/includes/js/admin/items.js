// Generated by CoffeeScript 1.9.3

/**
 * @package   Shop
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2014-2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */

(function() {
  $(function() {
    var L, color_set_attribute_type, make_modal, set_attribute_types, string_attribute_types;
    L = cs.Language;
    set_attribute_types = [1, 2, 6, 9];
    color_set_attribute_type = [1, 2, 6, 9];
    string_attribute_types = [5];
    make_modal = function(attributes, categories, title, action) {
      var categories_list, modal;
      attributes = (function() {
        var attribute, attributes_;
        attributes_ = {};
        for (attribute in attributes) {
          attribute = attributes[attribute];
          attributes_[attribute.id] = attribute;
        }
        return attributes_;
      })();
      categories = (function() {
        var categories_, category;
        categories_ = {};
        for (category in categories) {
          category = categories[category];
          categories_[category.id] = category;
        }
        return categories_;
      })();
      categories_list = (function() {
        var categories_list_, category, i, key, keys, len, parent_category, results;
        categories_list_ = {
          '-': "<option disabled>" + L.none + "</option>"
        };
        keys = ['-'];
        for (category in categories) {
          category = categories[category];
          parent_category = parseInt(category.parent);
          while (parent_category && parent_category !== category) {
            parent_category = categories[parent_category];
            if (parent_category.parent === category.id) {
              break;
            }
            category.title = parent_category.title + ' :: ' + category.title;
            parent_category = parseInt(parent_category.parent);
          }
          categories_list_[category.title] = "<option value=\"" + category.id + "\">" + category.title + "</option>";
          keys.push(category.title);
        }
        keys.sort();
        results = [];
        for (i = 0, len = keys.length; i < len; i++) {
          key = keys[i];
          results.push(categories_list_[key]);
        }
        return results;
      })();
      categories_list = categories_list.join('');
      modal = $.cs.simple_modal("<form>\n	<h3 class=\"cs-center\">" + title + "</h3>\n	<p>\n		" + L.shop_category + ": <select is=\"cs-select\" name=\"category\" required>" + categories_list + "</select>\n	</p>\n	<div></div>\n</form>", false, 1200);
      modal.item_data = {};
      modal.update_item_data = function() {
        var attribute, item, ref, value;
        item = modal.item_data;
        modal.find('[name=price]').val(item.price);
        modal.find('[name=in_stock]').val(item.in_stock);
        modal.find("[name=soon][value=" + item.soon + "]").prop('checked', true);
        modal.find("[name=listed][value=" + item.listed + "]").prop('checked', true);
        if (item.images) {
          modal.add_images(item.images);
        }
        if (item.videos) {
          modal.add_videos(item.videos);
        }
        if (item.attributes) {
          ref = item.attributes;
          for (attribute in ref) {
            value = ref[attribute];
            modal.find("[name='attributes[" + attribute + "]']").val(value);
          }
        }
        if (item.tags) {
          return modal.find('[name=tags]').val(item.tags.join(', '));
        }
      };
      modal.find('[name=category]').change(function() {
        var $this, attributes_list, category, images_container, videos_container;
        modal.find('form').serializeArray().forEach(function(item) {
          var attribute, name, value;
          value = item.value;
          name = item.name;
          switch (name) {
            case 'tags':
              value = value.split(',').map(function(v) {
                return $.trim(v);
              });
              break;
            case 'images':
              if (value) {
                value = JSON.parse(value);
              }
          }
          if (attribute = name.match(/attributes\[([0-9]+)\]/)) {
            if (!modal.item_data.attributes) {
              modal.item_data.attributes = {};
            }
            return modal.item_data.attributes[attribute[1]] = value;
          } else {
            return modal.item_data[item.name] = value;
          }
        });
        $this = $(this);
        category = categories[$this.val()];
        attributes_list = (function() {
          var attribute, color, i, len, ref, results, values;
          ref = category.attributes;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            attribute = ref[i];
            attribute = attributes[attribute];
            attribute.type = parseInt(attribute.type);
            if (set_attribute_types.indexOf(attribute.type) !== -1) {
              values = (function() {
                var j, len1, ref1, results1, value;
                ref1 = attribute.value;
                results1 = [];
                for (j = 0, len1 = ref1.length; j < len1; j++) {
                  value = ref1[j];
                  results1.push("<option value=\"" + value + "\">" + value + "</option>");
                }
                return results1;
              })();
              values = values.join('');
              color = attribute.type === color_set_attribute_type ? "<input type=\"color\">" : '';
              results.push("<p>\n	" + attribute.title + ":\n	<select is=\"cs-select\" name=\"attributes[" + attribute.id + "]\">\n		<option value=\"\">" + L.none + "</option>\n		" + values + "\n	</select>\n	" + color + "\n</p>");
            } else if (string_attribute_types.indexOf(attribute.type) !== -1) {
              results.push("<p>\n	" + attribute.title + ": <input name=\"attributes[" + attribute.id + "]\">\n</p>");
            } else {
              results.push("<p>\n	" + attribute.title + ": <textarea is=\"cs-textarea\" autosize name=\"attributes[" + attribute.id + "]\"></textarea>\n</p>");
            }
          }
          return results;
        })();
        attributes_list = attributes_list.join('');
        $this.parent().next().html("<p>\n	" + L.shop_price + ": <input name=\"price\" type=\"number\" value=\"0\" required>\n</p>\n<p>\n	" + L.shop_in_stock + ": <input name=\"in_stock\" type=\"number\" value=\"1\" step=\"1\">\n</p>\n<p>\n	" + L.shop_available_soon + ":\n	<label><input type=\"radio\" name=\"soon\" value=\"1\"> " + L.shop_yes + "</label>\n	<label><input type=\"radio\" name=\"soon\" value=\"0\" checked> " + L.shop_no + "</label>\n</p>\n<p>\n	" + L.shop_listed + ":\n	<label><input type=\"radio\" name=\"listed\" value=\"1\" checked> " + L.shop_yes + "</label>\n	<label><input type=\"radio\" name=\"listed\" value=\"0\"> " + L.shop_no + "</label>\n</p>\n<p>\n	<span class=\"images uk-display-block\"></span>\n	<span class=\"uk-progress uk-progress-striped uk-active uk-hidden uk-display-block\">\n		<span class=\"uk-progress-bar\"></span>\n	</span>\n	<button type=\"button\" class=\"add-images uk-button\">" + L.shop_add_images + "</button>\n	<input type=\"hidden\" name=\"images\">\n</p>\n<p>\n	<div class=\"videos\"></div>\n	<button type=\"button\" class=\"add-video uk-button\">" + L.shop_add_video + "</button>\n</p>\n" + attributes_list + "\n<p>\n	" + L.shop_tags + ": <input name=\"tags\" placeholder=\"shop, high quality, e-commerce\">\n</p>\n<p>\n	<button class=\"uk-button\" type=\"submit\">" + action + "</button>\n</p>");
        images_container = modal.find('.images');
        modal.update_images = function() {
          var images;
          images = [];
          images_container.find('a').each(function() {
            return images.push($(this).attr('href'));
          });
          modal.find('[name=images]').val(JSON.stringify(images));
          images_container.sortable('destroy');
          return images_container.sortable({
            forcePlaceholderSize: true,
            placeholder: '<a class="uk-thumbnail uk-thumbnail-mini"></a>'
          }).on('sortupdate', modal.update_images);
        };
        modal.add_images = function(images) {
          images.forEach(function(image) {
            return images_container.append("<span>\n	<a href=\"" + image + "\" target=\"_blank\" class=\"uk-thumbnail uk-thumbnail-mini\">\n		<img src=\"" + image + "\">\n		<br>\n		<button type=\"button\" class=\"remove-image uk-button uk-button-danger uk-button-mini uk-width-1-1\">" + L.shop_remove_image + "</button>\n	</a>\n</span>");
          });
          return modal.update_images();
        };
        if (cs.file_upload) {
          (function() {
            var progress, uploader;
            progress = modal.find('.add-images').prev();
            uploader = cs.file_upload(modal.find('.add-images'), function(images) {
              progress.addClass('uk-hidden').children().width(0);
              return modal.add_images(images);
            }, function(error) {
              progress.addClass('uk-hidden').children().width(0);
              return alert(error.message);
            }, function(percents) {
              return progress.removeClass('uk-hidden').children().width(percents + '%');
            }, true);
            return modal.on('hide.uk.modal', function() {
              return uploader.destroy();
            });
          })();
        } else {
          modal.find('.add-images').click(function() {
            var image;
            image = prompt(L.shop_image_url);
            if (image) {
              return modal.add_images([image]);
            }
          });
        }
        modal.on('click', '.remove-image', function() {
          $(this).parent().remove();
          modal.update_images();
          return false;
        });
        videos_container = modal.find('.videos');
        modal.update_videos = function() {
          videos_container.sortable('destroy');
          return videos_container.sortable({
            handle: '.handle',
            forcePlaceholderSize: true
          }).on('sortupdate', modal.update_videos);
        };
        modal.add_videos = function(videos) {
          videos.forEach(function(video) {
            var added_video, video_poster, video_video;
            videos_container.append("<p>\n	<i class=\"uk-icon-sort uk-sortable-moving handle\"></i>\n	<select is=\"cs-select\" name=\"videos[type][]\" class=\"video-type\">\n		<option value=\"supported_video\">" + L.shop_youtube_vimeo_url + "</option>\n		<option value=\"iframe\">" + L.shop_iframe_url_or_embed_code + "</option>\n		<option value=\"direct_url\">" + L.shop_direct_video_url + "</option>\n	</select>\n	<textarea is=\"cs-textarea\" autosize name=\"videos[video][]\" placeholder=\"" + L.shop_url_or_code + "\" class=\"video-video uk-form-width-large\" rows=\"3\"></textarea>\n	<input name=\"videos[poster][]\" class=\"video-poster\" placeholder=\"" + L.shop_video_poster + "\">\n	<button type=\"button\" class=\"delete-video uk-button\"><i class=\"uk-icon-close\"></i></button>\n	<span class=\"uk-progress uk-progress-striped uk-active uk-hidden uk-display-block\">\n		<span class=\"uk-progress-bar\"></span>\n	</span>\n</p>");
            added_video = videos_container.children('p:last');
            video_video = added_video.find('.video-video').val(video.video);
            video_poster = added_video.find('.video-poster').val(video.poster);
            if (cs.file_upload) {
              (function() {
                var progress, uploader;
                video_video.after("&nbsp;<button type=\"button\" class=\"uk-button\"><i class=\"uk-icon-upload\"></i></button>");
                progress = video_video.parent().find('.uk-progress');
                uploader = cs.file_upload(video_video.next(), function(video) {
                  progress.addClass('uk-hidden').children().width(0);
                  return video_video.val(video[0]);
                }, function(error) {
                  progress.addClass('uk-hidden').children().width(0);
                  return alert(error.message);
                }, function(percents) {
                  return progress.removeClass('uk-hidden').children().width(percents + '%');
                });
                return modal.on('hide.uk.modal', function() {
                  return uploader.destroy();
                });
              })();
              (function() {
                var progress, uploader;
                video_poster.after("&nbsp;<button type=\"button\" class=\"uk-button\"><i class=\"uk-icon-upload\"></i></button>");
                progress = video_video.parent().find('.uk-progress');
                uploader = cs.file_upload(video_poster.next(), function(poster) {
                  progress.addClass('uk-hidden').children().width(0);
                  return video_poster.val(poster[0]);
                }, function(error) {
                  progress.addClass('uk-hidden').children().width(0);
                  return alert(error.message);
                }, function(percents) {
                  return progress.removeClass('uk-hidden').children().width(percents + '%');
                });
                return modal.on('hide.uk.modal', function() {
                  return uploader.destroy();
                });
              })();
            }
            return added_video.find('.video-type').val(video.type).change();
          });
          return modal.update_videos();
        };
        modal.find('.add-video').click(function() {
          return modal.add_videos([
            {
              video: '',
              poster: '',
              type: 'supported_video'
            }
          ]);
        });
        videos_container.on('click', '.delete-video', function() {
          return $(this).parent().remove();
        });
        videos_container.on('change', '.video-type', function() {
          var container;
          $this = $(this);
          container = $this.parent();
          switch ($this.val()) {
            case 'supported_video':
              container.find('.video-video').next('button').hide();
              return container.find('.video-poster').hide().next('button').hide();
            case 'iframe':
              container.find('.video-video').next('button').hide();
              return container.find('.video-poster').show().next('button').show();
            case 'direct_url':
              container.find('.video-video').next('button').show();
              return container.find('.video-poster').show().next('button').show();
          }
        });
        return modal.update_item_data();
      });
      return modal;
    };
    return $('html').on('mousedown', '.cs-shop-item-add', function() {
      return $.when($.getJSON('api/Shop/admin/attributes'), $.getJSON('api/Shop/admin/categories')).done(function(attributes, categories) {
        var modal;
        modal = make_modal(attributes[0], categories[0], L.shop_item_addition, L.shop_add);
        return modal.find('form').submit(function() {
          $.ajax({
            url: 'api/Shop/admin/items',
            type: 'post',
            data: $(this).serialize(),
            success: function() {
              alert(L.shop_added_successfully);
              return location.reload();
            }
          });
          return false;
        });
      });
    }).on('mousedown', '.cs-shop-item-edit', function() {
      var id;
      id = $(this).data('id');
      return $.when($.getJSON('api/Shop/admin/attributes'), $.getJSON('api/Shop/admin/categories'), $.getJSON("api/Shop/admin/items/" + id)).done(function(attributes, categories, item) {
        var modal;
        modal = make_modal(attributes[0], categories[0], L.shop_item_edition, L.shop_edit);
        modal.find('form').submit(function() {
          $.ajax({
            url: "api/Shop/admin/items/" + id,
            type: 'put',
            data: $(this).serialize(),
            success: function() {
              alert(L.shop_edited_successfully);
              return location.reload();
            }
          });
          return false;
        });
        modal.item_data = item[0];
        return modal.find("[name=category]").val(item[0].category).change();
      });
    }).on('mousedown', '.cs-shop-item-delete', function() {
      var id;
      id = $(this).data('id');
      if (confirm(L.shop_sure_want_to_delete)) {
        return $.ajax({
          url: "api/Shop/admin/items/" + id,
          type: 'delete',
          success: function() {
            alert(L.shop_deleted_successfully);
            return location.reload();
          }
        });
      }
    });
  });

}).call(this);
