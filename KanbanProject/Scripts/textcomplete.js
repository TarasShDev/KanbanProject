/*!
 * jQuery.textcomplete
 *
 * Repository: https://github.com/yuku-t/jquery-textcomplete
 * License:    MIT (https://github.com/yuku-t/jquery-textcomplete/blob/master/LICENSE)
 * Author:     Yuku Takahashi
 */
if (typeof jQuery == "undefined") throw new Error("jQuery.textcomplete requires jQuery");
+function(n) {
    "use strict";
    var t = function(n) { console.warn && console.warn(n); };
    n.fn.textcomplete = function(i, r) {
        var u = Array.prototype.slice.call(arguments);
        return this.each(function() {
            var e = n(this), f = e.data("textComplete");
            if (f || (f = new n.fn.textcomplete.Completer(this, r || {}), e.data("textComplete", f)), typeof i == "string") {
                if (!f) return;
                u.shift();
                f[i].apply(f, u);
                i === "destroy" && e.removeData("textComplete");
            } else n.each(i, function(i) { n.each(["header", "footer", "placement", "maxCount"], function(n) { i[n] && (f.option[n] = i[n], t(n + "as a strategy param is deprecated. Use option."), delete i[n]); }); }), f.register(n.fn.textcomplete.Strategy.parse(i));
        });
    };
}(jQuery);
+function(n) {
    "use strict";

    function t(i, r) {
        if (this.$el = n(i), this.id = "textcomplete" + u++, this.strategies = [], this.views = [], this.option = n.extend({}, t._getDefaults(), r), !this.$el.is("input[type=text]") && !this.$el.is("textarea") && !i.isContentEditable && i.contentEditable != "true") throw new Error("textcomplete must be called on a Textarea or a ContentEditable.");
        if (i === document.activeElement) this.initialize();
        else {
            var f = this;
            this.$el.one("focus." + this.id, function() { f.initialize(); });
        }
    }

    var i = function(n) {
            var i, t;
            return function() {
                var r = Array.prototype.slice.call(arguments), u;
                if (i) {
                    t = r;
                    return;
                }
                i = !0;
                u = this;
                r.unshift(function f() {
                    if (t) {
                        var r = t;
                        t = undefined;
                        r.unshift(f);
                        n.apply(u, r);
                    } else i = !1;
                });
                n.apply(this, r);
            };
        },
        r = function(n) { return Object.prototype.toString.call(n) === "[object String]"; },
        u = 0;
    t._getDefaults = function() { return t.DEFAULTS || (t.DEFAULTS = { appendTo: n("body"), zIndex: "9999" }), t.DEFAULTS; };
    n.extend(t.prototype, {
        id: null,
        option: null,
        strategies: null,
        adapter: null,
        dropdown: null,
        $el: null,
        initialize: function() {
            var t = this.$el.get(0), i, r;
            this.dropdown = new n.fn.textcomplete.Dropdown(t, this, this.option);
            this.option.adapter ? i = this.option.adapter : (r = this.$el.is("textarea") || this.$el.is("input[type=text]") ? typeof t.selectionEnd == "number" ? "Textarea" : "IETextarea" : "ContentEditable", i = n.fn.textcomplete[r]);
            this.adapter = new i(t, this, this.option);
        },
        destroy: function() {
            this.$el.off("." + this.id);
            this.adapter && this.adapter.destroy();
            this.dropdown && this.dropdown.destroy();
            this.$el = this.adapter = this.dropdown = null;
        },
        trigger: function(n, t) {
            var i, r;
            if (this.dropdown || this.initialize(), n != null || (n = this.adapter.getTextFromHeadToCaret()), i = this._extractSearchQuery(n), i.length) {
                if (r = i[1], t && this._term === r) return;
                this._term = r;
                this._search.apply(this, i);
            } else this._term = null, this.dropdown.deactivate();
        },
        fire: function(n) {
            var t = Array.prototype.slice.call(arguments, 1);
            return this.$el.trigger(n, t), this;
        },
        register: function(n) { Array.prototype.push.apply(this.strategies, n); },
        select: function(n, t) {
            this.adapter.select(n, t);
            this.fire("change").fire("textComplete:select", n, t);
            this.adapter.focus();
        },
        _clearAtNext: !0,
        _term: null,
        _extractSearchQuery: function(n) {
            for (var t, i, f, u = 0; u < this.strategies.length; u++) if (t = this.strategies[u], i = t.context(n), (i || i === "") && (r(i) && (n = i), f = n.match(t.match), f)) return [t, f[t.index], f];
            return [];
        },
        _search: i(function(n, t, i, r) {
            var u = this;
            t.search(i, function(i, r) {
                u.dropdown.shown || (u.dropdown.activate(), u.dropdown.setPosition(u.adapter.getCaretPosition()));
                u._clearAtNext && (u.dropdown.clear(), u._clearAtNext = !1);
                u.dropdown.render(u._zip(i, t));
                r || (n(), u._clearAtNext = !0);
            }, r);
        }),
        _zip: function(t, i) { return n.map(t, function(n) { return { value: n, strategy: i }; }); }
    });
    n.fn.textcomplete.Completer = t;
}(jQuery);
+function(n) {
    "use strict";

    function t(r, u, f) {
        this.$el = t.findOrCreateElement(f);
        this.completer = u;
        this.id = u.id + "dropdown";
        this._data = [];
        this.$inputEl = n(r);
        this.option = f;
        f.listPosition && (this.setPosition = f.listPosition);
        f.height && this.$el.height(f.height);
        var e = this;
        n.each(["maxCount", "placement", "footer", "header", "className"], function(n, t) { f[t] != null && (e[t] = f[t]); });
        this._bindEvents(r);
        i[this.id] = this;
    }

    var r = function(n, t) {
            for (var r, u = t.strategy.idProperty, i = 0; i < n.length; i++)
                if (r = n[i], r.strategy === t.strategy)
                    if (u) {
                        if (r.value[u] === t.value[u]) return !0;
                    } else if (r.value === t.value) return !0;
            return !1;
        },
        i = {};
    n(document).on("click", function(t) {
        var r = t.originalEvent && t.originalEvent.keepTextCompleteDropdown;
        n.each(i, function(n, t) { n !== r && t.deactivate(); });
    });
    n.extend(t, {
        findOrCreateElement: function(t) {
            var i = t.appendTo, r;
            return i instanceof n || (i = n(i)), r = i.children(".dropdown-menu"), r.length || (r = n('<ul class="dropdown-menu"><\/ul>').css({ display: "none", left: 0, position: "absolute", zIndex: t.zIndex }).appendTo(i)), r;
        }
    });
    n.extend(t.prototype, {
        $el: null,
        $inputEl: null,
        completer: null,
        footer: null,
        header: null,
        id: null,
        maxCount: 10,
        placement: "",
        shown: !1,
        data: [],
        className: "",
        destroy: function() {
            this.deactivate();
            this.$el.off("." + this.id);
            this.$inputEl.off("." + this.id);
            this.clear();
            this.$el = this.$inputEl = this.completer = null;
            delete i[this.id];
        },
        render: function(t) {
            var i = this._buildContents(t), r = n.map(this.data, function(n) { return n.value; });
            this.data.length ? (this._renderHeader(r), this._renderFooter(r), i && (this._renderContents(i), this._activateIndexedItem()), this._setScroll()) : this.shown && this.deactivate();
        },
        setPosition: function(t) {
            this.$el.css(this._applyPlacement(t));
            var t = "absolute";
            return this.$inputEl.add(this.$inputEl.parents()).each(function() { return n(this).css("position") === "absolute" ? !1 : n(this).css("position") === "fixed" ? (t = "fixed", !1) : void 0; }), this.$el.css({ position: t }), this;
        },
        clear: function() {
            this.$el.html("");
            this.data = [];
            this._index = 0;
            this._$header = this._$footer = null;
        },
        activate: function() { return this.shown || (this.clear(), this.$el.show(), this.className && this.$el.addClass(this.className), this.completer.fire("textComplete:show"), this.shown = !0), this; },
        deactivate: function() { return this.shown && (this.$el.hide(), this.className && this.$el.removeClass(this.className), this.completer.fire("textComplete:hide"), this.shown = !1), this; },
        isUp: function(n) { return n.keyCode === 38 || n.ctrlKey && n.keyCode === 80; },
        isDown: function(n) { return n.keyCode === 40 || n.ctrlKey && n.keyCode === 78; },
        isEnter: function(n) {
            var t = n.ctrlKey || n.altKey || n.metaKey || n.shiftKey;
            return !t && (n.keyCode === 13 || n.keyCode === 9 || this.option.completeOnSpace === !0 && n.keyCode === 32);
        },
        isKeyCode: function(n) {
            var t = n.ctrlKey || n.altKey || n.metaKey || n.shiftKey;
            return !t && (n.keyCode === 32 || n.keyCode === 190);
        },
        isPageup: function(n) { return n.keyCode === 33; },
        isPagedown: function(n) { return n.keyCode === 34; },
        _data: null,
        _index: null,
        _$header: null,
        _$footer: null,
        _bindEvents: function() {
            this.$el.on("mousedown." + this.id, ".textcomplete-item", n.proxy(this._onClick, this));
            this.$el.on("mouseover." + this.id, ".textcomplete-item", n.proxy(this._onMouseover, this));
            this.$inputEl.on("keydown." + this.id, n.proxy(this._onKeydown, this));
        },
        _onClick: function(t) {
            var i = n(t.target), r, u;
            t.preventDefault();
            t.originalEvent.keepTextCompleteDropdown = this.id;
            i.hasClass("textcomplete-item") || (i = i.closest(".textcomplete-item"));
            r = this.data[parseInt(i.data("index"), 10)];
            this.completer.select(r.value, r.strategy);
            u = this;
            setTimeout(function() { u.deactivate(); }, 0);
        },
        _onMouseover: function(t) {
            var i = n(t.target);
            t.preventDefault();
            i.hasClass("textcomplete-item") || (i = i.closest(".textcomplete-item"));
            this._index = parseInt(i.data("index"), 10);
            this._activateIndexedItem();
        },
        _onKeydown: function(n) { this.shown && (this.isUp(n) ? (n.preventDefault(), this._up()) : this.isDown(n) ? (n.preventDefault(), this._down()) : this.isEnter(n) ? (n.preventDefault(), this._enter()) : this.isKeyCode(n) ? (n.preventDefault(), this._selectKey(n.keyCode)) : this.isPageup(n) ? (n.preventDefault(), this._pageup()) : this.isPagedown(n) && (n.preventDefault(), this._pagedown())); },
        _up: function() {
            this._index === 0 ? this._index = this.data.length - 1 : this._index -= 1;
            this._activateIndexedItem();
            this._setScroll();
        },
        _down: function() {
            this._index === this.data.length - 1 ? this._index = 0 : this._index += 1;
            this._activateIndexedItem();
            this._setScroll();
        },
        _enter: function() {
            var n = this.data[parseInt(this._getActiveElement().data("index"), 10)];
            this.completer.select(n.value, n.strategy);
            this._setScroll();
        },
        _selectKey: function(n) {
            var i = this.data[parseInt(this._getActiveElement().data("index"), 10)], t = i.value;
            n === 32 && (t += " ");
            n === 190 && (t += ".");
            this.completer.select(t, i.strategy);
            this._setScroll();
        },
        _pageup: function() {
            var t = 0, i = this._getActiveElement().position().top - this.$el.innerHeight();
            this.$el.children().each(function(r) { if (n(this).position().top + n(this).outerHeight() > i) return t = r, !1; });
            this._index = t;
            this._activateIndexedItem();
            this._setScroll();
        },
        _pagedown: function() {
            var t = this.data.length - 1, i = this._getActiveElement().position().top + this.$el.innerHeight();
            this.$el.children().each(function(r) { if (n(this).position().top > i) return t = r, !1; });
            this._index = t;
            this._activateIndexedItem();
            this._setScroll();
        },
        _activateIndexedItem: function() {
            this.$el.find(".textcomplete-item.active").removeClass("active");
            this._getActiveElement().addClass("active");
        },
        _getActiveElement: function() { return this.$el.children(".textcomplete-item:nth(" + this._index + ")"); },
        _setScroll: function() {
            var t = this._getActiveElement(), n = t.position().top, i = t.outerHeight(), r = this.$el.innerHeight(), u = this.$el.scrollTop();
            this._index === 0 || this._index == this.data.length - 1 || n < 0 ? this.$el.scrollTop(n + u) : n + i > r && this.$el.scrollTop(n + i + u - r);
        },
        _buildContents: function(n) {
            for (var t, f, u = "", i = 0; i < n.length; i++) {
                if (this.data.length === this.maxCount) break;
                (t = n[i], r(this.data, t)) || (f = this.data.length, this.data.push(t), u += '<li class="textcomplete-item" data-index="' + f + '"><a>', u += t.strategy.template(t.value), u += "<\/a><\/li>");
            }
            return u;
        },
        _renderHeader: function(t) {
            if (this.header) {
                this._$header || (this._$header = n('<li class="textcomplete-header"><\/li>').prependTo(this.$el));
                var i = n.isFunction(this.header) ? this.header(t) : this.header;
                this._$header.html(i);
            }
        },
        _renderFooter: function(t) {
            if (this.footer) {
                this._$footer || (this._$footer = n('<li class="textcomplete-footer"><\/li>').appendTo(this.$el));
                var i = n.isFunction(this.footer) ? this.footer(t) : this.footer;
                this._$footer.html(i);
            }
        },
        _renderContents: function(n) { this._$footer ? this._$footer.before(n) : this.$el.append(n); },
        _applyPlacement: function(n) { return this.placement.indexOf("top") !== -1 ? n = { top: "auto", bottom: this.$el.parent().height() - n.top + n.lineHeight, left: n.left } : (n.bottom = "auto", delete n.lineHeight), this.placement.indexOf("absleft") !== -1 ? n.left = 0 : this.placement.indexOf("absright") !== -1 && (n.right = 0, n.left = "auto"), n; }
    });
    n.fn.textcomplete.Dropdown = t;
}(jQuery);
+function(n) {
    "use strict";

    function t(t) {
        n.extend(this, t);
        this.cache && (this.search = i(this.search));
    }

    var i = function(n) {
        var t = {};
        return function(i, r) {
            t[i] ? r(t[i]) : n.call(this, i, function(n) {
                t[i] = (t[i] || []).concat(n);
                r.apply(null, arguments);
            });
        };
    };
    t.parse = function(i) { return n.map(i, function(n) { return new t(n); }); };
    n.extend(t.prototype, { match: null, replace: null, search: null, cache: !1, context: function() { return !0; }, index: 2, template: function(n) { return n; }, idProperty: null });
    n.fn.textcomplete.Strategy = t;
}(jQuery);
+function(n) {
    "use strict";

    function i() {}

    var t = Date.now || function() { return (new Date).getTime(); },
        r = function(n, i) {
            var r,
                u,
                f,
                e,
                o,
                s = function() {
                    var h = t() - e;
                    h < i ? r = setTimeout(s, i - h) : (r = null, o = n.apply(f, u), f = u = null);
                };
            return function() { return f = this, u = arguments, e = t(), r || (r = setTimeout(s, i)), o; };
        };
    n.extend(i.prototype, {
        id: null,
        completer: null,
        el: null,
        $el: null,
        option: null,
        initialize: function(t, i, u) {
            this.el = t;
            this.$el = n(t);
            this.id = i.id + this.constructor.name;
            this.completer = i;
            this.option = u;
            this.option.debounce && (this._onKeyup = r(this._onKeyup, this.option.debounce));
            this._bindEvents();
        },
        destroy: function() {
            this.$el.off("." + this.id);
            this.$el = this.el = this.completer = null;
        },
        select: function() { throw new Error("Not implemented"); },
        getCaretPosition: function() {
            var n = this._getCaretRelativePosition(), t = this.$el.offset();
            return n.top += t.top, n.left += t.left, n;
        },
        focus: function() { this.$el.focus(); },
        _bindEvents: function() { this.$el.on("keyup." + this.id, n.proxy(this._onKeyup, this)); },
        _onKeyup: function(n) { this._skipSearch(n) || this.completer.trigger(this.getTextFromHeadToCaret(), !0); },
        _skipSearch: function(n) {
            switch (n.keyCode) {
            case 40:
            case 38:
                return !0;
            }
            if (n.ctrlKey)
                switch (n.keyCode) {
                case 78:
                case 80:
                    return !0;
                }
        }
    });
    n.fn.textcomplete.Adapter = i;
}(jQuery);
+function(n) {
    "use strict";

    function t(n, t, i) { this.initialize(n, t, i); }

    t.DIV_PROPERTIES = { left: -9999, position: "absolute", top: 0, whiteSpace: "pre-wrap" };
    t.COPY_PROPERTIES = ["border-width", "font-family", "font-size", "font-style", "font-variant", "font-weight", "height", "letter-spacing", "word-spacing", "line-height", "text-decoration", "text-align", "width", "padding-top", "padding-right", "padding-bottom", "padding-left", "margin-top", "margin-right", "margin-bottom", "margin-left", "border-style", "box-sizing", "tab-size"];
    n.extend(t.prototype, n.fn.textcomplete.Adapter.prototype, {
        select: function(t, i) {
            var u = this.getTextFromHeadToCaret(), f = this.el.value.substring(this.el.selectionEnd), r = i.replace(t);
            n.isArray(r) && (f = r[1] + f, r = r[0]);
            u = u.replace(i.match, r);
            this.$el.val(u + f);
            this.el.selectionStart = this.el.selectionEnd = u.length;
        },
        _getCaretRelativePosition: function() {
            var i = n("<div><\/div>").css(this._copyCss()).text(this.getTextFromHeadToCaret()), r = n("<span><\/span>").text(".").appendTo(i), t;
            return this.$el.before(i), t = r.position(), t.top += r.height() - this.$el.scrollTop(), t.lineHeight = r.height(), i.remove(), t;
        },
        _copyCss: function() { return n.extend({ overflow: this.el.scrollHeight > this.el.offsetHeight ? "scroll" : "auto" }, t.DIV_PROPERTIES, this._getStyles()); },
        _getStyles: function(n) {
            var i = n("<div><\/div>").css(["color"]).color;
            return typeof i != "undefined" ? function() { return this.$el.css(t.COPY_PROPERTIES); } : function() {
                var r = this.$el, i = {};
                return n.each(t.COPY_PROPERTIES, function(n, t) { i[t] = r.css(t); }), i;
            };
        }(n),
        getTextFromHeadToCaret: function() { return this.el.value.substring(0, this.el.selectionEnd); }
    });
    n.fn.textcomplete.Textarea = t;
}(jQuery);
+function(n) {
    "use strict";

    function i(i, r, u) {
        this.initialize(i, r, u);
        n("<span>" + t + "<\/span>").css({ position: "absolute", top: -9999, left: -9999 }).insertBefore(i);
    }

    var t = "吶";
    n.extend(i.prototype, n.fn.textcomplete.Textarea.prototype, {
        select: function(t, i) {
            var r = this.getTextFromHeadToCaret(), e = this.el.value.substring(r.length), u = i.replace(t), f;
            n.isArray(u) && (e = u[1] + e, u = u[0]);
            r = r.replace(i.match, u);
            this.$el.val(r + e);
            this.el.focus();
            f = this.el.createTextRange();
            f.collapse(!0);
            f.moveEnd("character", r.length);
            f.moveStart("character", r.length);
            f.select();
        },
        getTextFromHeadToCaret: function() {
            var i, n;
            return this.el.focus(), i = document.selection.createRange(), i.moveStart("character", -this.el.value.length), n = i.text.split(t), n.length === 1 ? n[0] : n[1];
        }
    });
    n.fn.textcomplete.IETextarea = i;
}(jQuery);
+function(n) {
    "use strict";

    function t(n, t, i) { this.initialize(n, t, i); }

    n.extend(t.prototype, n.fn.textcomplete.Adapter.prototype, {
        select: function(t, i) {
            var f = this.getTextFromHeadToCaret(), e = window.getSelection(), r = e.getRangeAt(0), h = r.cloneRange(), s;
            h.selectNodeContents(r.startContainer);
            var c = h.toString(), o = c.substring(r.startOffset), u = i.replace(t);
            n.isArray(u) && (o = u[1] + o, u = u[0]);
            f = f.replace(i.match, u);
            r.selectNodeContents(r.startContainer);
            r.deleteContents();
            s = document.createTextNode(f + o);
            r.insertNode(s);
            r.setStart(s, f.length);
            r.collapse(!0);
            e.removeAllRanges();
            e.addRange(r);
        },
        _getCaretRelativePosition: function() {
            var r = window.getSelection().getRangeAt(0).cloneRange(), u = document.createElement("span"), i, t, f;
            return r.insertNode(u), r.selectNodeContents(u), r.deleteContents(), i = n(u), t = i.offset(), t.left -= this.$el.offset().left, t.top += i.height() - this.$el.offset().top, t.lineHeight = i.height(), f = this.$el.attr("dir") || this.$el.css("direction"), f === "rtl" && (t.left -= this.listView.$el.width()), t;
        },
        getTextFromHeadToCaret: function() {
            var n = window.getSelection().getRangeAt(0), t = n.cloneRange();
            return t.selectNodeContents(n.startContainer), t.toString().substring(0, n.startOffset);
        }
    });
    n.fn.textcomplete.ContentEditable = t;
}(jQuery);
//# sourceMappingURL=textcomplete.min.js.map