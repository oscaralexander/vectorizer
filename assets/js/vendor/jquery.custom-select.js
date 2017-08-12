/**
 * jQuery Custom Select v1.0
 * Copyright © 2016, Alexander Griffioen <mail@oscaralexander.com>
 * Published under MIT license.
 */

(function(root, factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else {
        factory(root.jQuery);
    }
}(this, function($) {
    "use strict";

    var CustomSelect;
    var defaults;

    defaults = {
        classNameFocus: "is-focus",
        classNameWrapper: "customSelect",
        onChange: null
    };

    CustomSelect = function(el, options) {
        this.$el = $(el);
        this.options = $.extend(true, {}, defaults, options);
        this.init();
    };

    CustomSelect.prototype = {
        constructor: CustomSelect,

        init: function () {
            this.$el.wrap($("<div />").addClass(this.options.classNameWrapper))
                .after($("<span />").text(this.getLabel()));
            this.$wrapper = this.$el.closest("." + this.options.classNameWrapper);

            this.$el.on("blur", function (e) {
                this.$wrapper.removeClass(this.options.classNameFocus);
            }.bind(this));

            this.$el.on("change", function (e) {
                this.$wrapper.children("span").text(this.getLabel());
                this.$wrapper.removeClass(this.options.classNameFocus);
            }.bind(this));

            this.$el.on("focus mousedown", function (e) {
                this.$wrapper.addClass(this.options.classNameFocus);
            }.bind(this));
        },

        getLabel: function () {
            return this.$el.find(":selected").length ? this.$el.find(":selected").text() : this.$el.children().first().text();
        },

        update: function () {
            this.$wrapper.children("span").text(this.getLabel());
        }
    };

    $.fn.customSelect = function (options) {
        return this.each(function () {
            var self;

            if (!$.data(this, "customSelect")) {
                $.data(this, "customSelect", new CustomSelect(this, options));
            } else {
                if (typeof options === "string") {
                    self = $.data(this, "customSelect");

                    switch (options) {
                        case "update":
                            self.update();
                            break;
                    }
                }
            }
        });
    };

    $.fn.customSelect.CustomSelect = CustomSelect;
    $.fn.customSelect.defaults = defaults;
}));