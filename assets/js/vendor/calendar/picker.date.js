/*!
 * Date picker for pickadate.js v3.6.4
 * http://amsul.github.io/pickadate.js/date.htm
 */
!(function (a) {
  "function" == typeof define && define.amd
    ? define(["./picker", "jquery"], a)
    : "object" == typeof exports
    ? (module.exports = a(require("./picker.js"), require("jquery")))
    : a(Picker, jQuery);
})(function (a, b) {
  function c(a, b) {
    var c = this,
      d = a.$node[0],
      e = d.value,
      f = a.$node.data("value"),
      g = f || e,
      h = f ? b.formatSubmit : b.format,
      i = function () {
        return d.currentStyle
          ? "rtl" == d.currentStyle.direction
          : "rtl" == getComputedStyle(a.$root[0]).direction;
      };
    (c.settings = b),
      (c.$node = a.$node),
      (c.queue = {
        min: "measure create",
        max: "measure create",
        now: "now create",
        select: "parse create validate",
        highlight: "parse navigate create validate",
        view: "parse create validate viewset",
        disable: "deactivate",
        enable: "activate",
      }),
      (c.item = {}),
      (c.item.clear = null),
      (c.item.disable = (b.disable || []).slice(0)),
      (c.item.enable = -(function (a) {
        return !0 === a[0] ? a.shift() : -1;
      })(c.item.disable)),
      c.set("min", b.min).set("max", b.max).set("now"),
      g
        ? c.set("select", g, { format: h, defaultValue: !0 })
        : c.set("select", null).set("highlight", c.item.now),
      (c.key = {
        40: 7,
        38: -7,
        39: function () {
          return i() ? -1 : 1;
        },
        37: function () {
          return i() ? 1 : -1;
        },
        go: function (a) {
          var b = c.item.highlight,
            d = new Date(b.year, b.month, b.date + a);
          c.set("highlight", d, { interval: a }), this.render();
        },
      }),
      a
        .on(
          "render",
          function () {
            a.$root.find("." + b.klass.selectMonth).on("change", function () {
              var c = this.value;
              c &&
                (a.set("highlight", [
                  a.get("view").year,
                  c,
                  a.get("highlight").date,
                ]),
                a.$root.find("." + b.klass.selectMonth).trigger("focus"));
            }),
              a.$root.find("." + b.klass.selectYear).on("change", function () {
                var c = this.value;
                c &&
                  (a.set("highlight", [
                    c,
                    a.get("view").month,
                    a.get("highlight").date,
                  ]),
                  a.$root.find("." + b.klass.selectYear).trigger("focus"));
              });
          },
          1
        )
        .on(
          "open",
          function () {
            var d = "";
            c.disabled(c.get("now")) &&
              (d = ":not(." + b.klass.buttonToday + ")"),
              a.$root.find("button" + d + ", select").attr("disabled", !1);
          },
          1
        )
        .on(
          "close",
          function () {
            a.$root.find("button, select").attr("disabled", !0);
          },
          1
        );
  }
  var d = 7,
    e = a._;
  (c.prototype.set = function (a, b, c) {
    var d = this,
      e = d.item;
    return null === b
      ? ("clear" == a && (a = "select"), (e[a] = b), d)
      : ((e["enable" == a ? "disable" : "flip" == a ? "enable" : a] = d.queue[a]
          .split(" ")
          .map(function (e) {
            return (b = d[e](a, b, c));
          })
          .pop()),
        "select" == a
          ? d.set("highlight", e.select, c)
          : "highlight" == a
          ? d.set("view", e.highlight, c)
          : a.match(/^(flip|min|max|disable|enable)$/) &&
            (e.select && d.disabled(e.select) && d.set("select", e.select, c),
            e.highlight &&
              d.disabled(e.highlight) &&
              d.set("highlight", e.highlight, c)),
        d);
  }),
    (c.prototype.get = function (a) {
      return this.item[a];
    }),
    (c.prototype.create = function (a, c, d) {
      var f,
        g = this;
      return (
        (c = void 0 === c ? a : c),
        c == -1 / 0 || c == 1 / 0
          ? (f = c)
          : b.isPlainObject(c) && e.isInteger(c.pick)
          ? (c = c.obj)
          : b.isArray(c)
          ? ((c = new Date(c[0], c[1], c[2])),
            (c = e.isDate(c) ? c : g.create().obj))
          : (c =
              e.isInteger(c) || e.isDate(c)
                ? g.normalize(new Date(c), d)
                : g.now(a, c, d)),
        {
          year: f || c.getFullYear(),
          month: f || c.getMonth(),
          date: f || c.getDate(),
          day: f || c.getDay(),
          obj: f || c,
          pick: f || c.getTime(),
        }
      );
    }),
    (c.prototype.createRange = function (a, c) {
      var d = this,
        f = function (a) {
          return !0 === a || b.isArray(a) || e.isDate(a) ? d.create(a) : a;
        };
      return (
        e.isInteger(a) || (a = f(a)),
        e.isInteger(c) || (c = f(c)),
        e.isInteger(a) && b.isPlainObject(c)
          ? (a = [c.year, c.month, c.date + a])
          : e.isInteger(c) &&
            b.isPlainObject(a) &&
            (c = [a.year, a.month, a.date + c]),
        { from: f(a), to: f(c) }
      );
    }),
    (c.prototype.withinRange = function (a, b) {
      return (
        (a = this.createRange(a.from, a.to)),
        b.pick >= a.from.pick && b.pick <= a.to.pick
      );
    }),
    (c.prototype.overlapRanges = function (a, b) {
      var c = this;
      return (
        (a = c.createRange(a.from, a.to)),
        (b = c.createRange(b.from, b.to)),
        c.withinRange(a, b.from) ||
          c.withinRange(a, b.to) ||
          c.withinRange(b, a.from) ||
          c.withinRange(b, a.to)
      );
    }),
    (c.prototype.now = function (a, b, c) {
      return (
        (b = new Date()),
        c && c.rel && b.setDate(b.getDate() + c.rel),
        this.normalize(b, c)
      );
    }),
    (c.prototype.navigate = function (a, c, d) {
      var e,
        f,
        g,
        h,
        i = b.isArray(c),
        j = b.isPlainObject(c),
        k = this.item.view;
      if (i || j) {
        for (
          j
            ? ((f = c.year), (g = c.month), (h = c.date))
            : ((f = +c[0]), (g = +c[1]), (h = +c[2])),
            d && d.nav && k && k.month !== g && ((f = k.year), (g = k.month)),
            e = new Date(f, g + (d && d.nav ? d.nav : 0), 1),
            f = e.getFullYear(),
            g = e.getMonth();
          new Date(f, g, h).getMonth() !== g;

        )
          h -= 1;
        c = [f, g, h];
      }
      return c;
    }),
    (c.prototype.normalize = function (a) {
      return a.setHours(0, 0, 0, 0), a;
    }),
    (c.prototype.measure = function (a, b) {
      var c = this;
      return (
        e.isInteger(b)
          ? (b = c.now(a, b, { rel: b }))
          : b
          ? "string" == typeof b && (b = c.parse(a, b))
          : (b = "min" == a ? -1 / 0 : 1 / 0),
        b
      );
    }),
    (c.prototype.viewset = function (a, b) {
      return this.create([b.year, b.month, 1]);
    }),
    (c.prototype.validate = function (a, c, d) {
      var f,
        g,
        h,
        i,
        j = this,
        k = c,
        l = d && d.interval ? d.interval : 1,
        m = -1 === j.item.enable,
        n = j.item.min,
        o = j.item.max,
        p =
          m &&
          j.item.disable.filter(function (a) {
            if (b.isArray(a)) {
              var d = j.create(a).pick;
              d < c.pick ? (f = !0) : d > c.pick && (g = !0);
            }
            return e.isInteger(a);
          }).length;
      if (
        (!d || (!d.nav && !d.defaultValue)) &&
        ((!m && j.disabled(c)) ||
          (m && j.disabled(c) && (p || f || g)) ||
          (!m && (c.pick <= n.pick || c.pick >= o.pick)))
      )
        for (
          m && !p && ((!g && l > 0) || (!f && l < 0)) && (l *= -1);
          j.disabled(c) &&
          (Math.abs(l) > 1 &&
            (c.month < k.month || c.month > k.month) &&
            ((c = k), (l = l > 0 ? 1 : -1)),
          c.pick <= n.pick
            ? ((h = !0),
              (l = 1),
              (c = j.create([
                n.year,
                n.month,
                n.date + (c.pick === n.pick ? 0 : -1),
              ])))
            : c.pick >= o.pick &&
              ((i = !0),
              (l = -1),
              (c = j.create([
                o.year,
                o.month,
                o.date + (c.pick === o.pick ? 0 : 1),
              ]))),
          !h || !i);

        )
          c = j.create([c.year, c.month, c.date + l]);
      return c;
    }),
    (c.prototype.disabled = function (a) {
      var c = this,
        d = c.item.disable.filter(function (d) {
          return e.isInteger(d)
            ? a.day === (c.settings.firstDay ? d : d - 1) % 7
            : b.isArray(d) || e.isDate(d)
            ? a.pick === c.create(d).pick
            : b.isPlainObject(d)
            ? c.withinRange(d, a)
            : void 0;
        });
      return (
        (d =
          d.length &&
          !d.filter(function (a) {
            return (
              (b.isArray(a) && "inverted" == a[3]) ||
              (b.isPlainObject(a) && a.inverted)
            );
          }).length),
        -1 === c.item.enable
          ? !d
          : d || a.pick < c.item.min.pick || a.pick > c.item.max.pick
      );
    }),
    (c.prototype.parse = function (a, b, c) {
      var d = this,
        f = {};
      return b && "string" == typeof b
        ? ((c && c.format) || ((c = c || {}), (c.format = d.settings.format)),
          d.formats.toArray(c.format).map(function (a) {
            var c = d.formats[a],
              g = c ? e.trigger(c, d, [b, f]) : a.replace(/^!/, "").length;
            c && (f[a] = b.substr(0, g)), (b = b.substr(g));
          }),
          [f.yyyy || f.yy, +(f.mm || f.m) - 1, f.dd || f.d])
        : b;
    }),
    (c.prototype.formats = (function () {
      function a(a, b, c) {
        var d = a.match(/[^\x00-\x7F]+|\w+/)[0];
        return c.mm || c.m || (c.m = b.indexOf(d) + 1), d.length;
      }
      function b(a) {
        return a.match(/\w+/)[0].length;
      }
      return {
        d: function (a, b) {
          return a ? e.digits(a) : b.date;
        },
        dd: function (a, b) {
          return a ? 2 : e.lead(b.date);
        },
        ddd: function (a, c) {
          return a ? b(a) : this.settings.weekdaysShort[c.day];
        },
        dddd: function (a, c) {
          return a ? b(a) : this.settings.weekdaysFull[c.day];
        },
        m: function (a, b) {
          return a ? e.digits(a) : b.month + 1;
        },
        mm: function (a, b) {
          return a ? 2 : e.lead(b.month + 1);
        },
        mmm: function (b, c) {
          var d = this.settings.monthsShort;
          return b ? a(b, d, c) : d[c.month];
        },
        mmmm: function (b, c) {
          var d = this.settings.monthsFull;
          return b ? a(b, d, c) : d[c.month];
        },
        yy: function (a, b) {
          return a ? 2 : ("" + b.year).slice(2);
        },
        yyyy: function (a, b) {
          return a ? 4 : b.year;
        },
        toArray: function (a) {
          return a.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g);
        },
        toString: function (a, b) {
          var c = this;
          return c.formats
            .toArray(a)
            .map(function (a) {
              return e.trigger(c.formats[a], c, [0, b]) || a.replace(/^!/, "");
            })
            .join("");
        },
      };
    })()),
    (c.prototype.isDateExact = function (a, c) {
      var d = this;
      return (e.isInteger(a) && e.isInteger(c)) ||
        ("boolean" == typeof a && "boolean" == typeof c)
        ? a === c
        : (e.isDate(a) || b.isArray(a)) && (e.isDate(c) || b.isArray(c))
        ? d.create(a).pick === d.create(c).pick
        : !(!b.isPlainObject(a) || !b.isPlainObject(c)) &&
          d.isDateExact(a.from, c.from) &&
          d.isDateExact(a.to, c.to);
    }),
    (c.prototype.isDateOverlap = function (a, c) {
      var d = this,
        f = d.settings.firstDay ? 1 : 0;
      return e.isInteger(a) && (e.isDate(c) || b.isArray(c))
        ? (a = (a % 7) + f) === d.create(c).day + 1
        : e.isInteger(c) && (e.isDate(a) || b.isArray(a))
        ? (c = (c % 7) + f) === d.create(a).day + 1
        : !(!b.isPlainObject(a) || !b.isPlainObject(c)) &&
          d.overlapRanges(a, c);
    }),
    (c.prototype.flipEnable = function (a) {
      var b = this.item;
      b.enable = a || (-1 == b.enable ? 1 : -1);
    }),
    (c.prototype.deactivate = function (a, c) {
      var d = this,
        f = d.item.disable.slice(0);
      return (
        "flip" == c
          ? d.flipEnable()
          : !1 === c
          ? (d.flipEnable(1), (f = []))
          : !0 === c
          ? (d.flipEnable(-1), (f = []))
          : c.map(function (a) {
              for (var c, g = 0; g < f.length; g += 1)
                if (d.isDateExact(a, f[g])) {
                  c = !0;
                  break;
                }
              c ||
                ((e.isInteger(a) ||
                  e.isDate(a) ||
                  b.isArray(a) ||
                  (b.isPlainObject(a) && a.from && a.to)) &&
                  f.push(a));
            }),
        f
      );
    }),
    (c.prototype.activate = function (a, c) {
      var d = this,
        f = d.item.disable,
        g = f.length;
      return (
        "flip" == c
          ? d.flipEnable()
          : !0 === c
          ? (d.flipEnable(1), (f = []))
          : !1 === c
          ? (d.flipEnable(-1), (f = []))
          : c.map(function (a) {
              var c, h, i, j;
              for (i = 0; i < g; i += 1) {
                if (((h = f[i]), d.isDateExact(h, a))) {
                  (c = f[i] = null), (j = !0);
                  break;
                }
                if (d.isDateOverlap(h, a)) {
                  b.isPlainObject(a)
                    ? ((a.inverted = !0), (c = a))
                    : b.isArray(a)
                    ? ((c = a), c[3] || c.push("inverted"))
                    : e.isDate(a) &&
                      (c = [
                        a.getFullYear(),
                        a.getMonth(),
                        a.getDate(),
                        "inverted",
                      ]);
                  break;
                }
              }
              if (c)
                for (i = 0; i < g; i += 1)
                  if (d.isDateExact(f[i], a)) {
                    f[i] = null;
                    break;
                  }
              if (j)
                for (i = 0; i < g; i += 1)
                  if (d.isDateOverlap(f[i], a)) {
                    f[i] = null;
                    break;
                  }
              c && f.push(c);
            }),
        f.filter(function (a) {
          return null != a;
        })
      );
    }),
    (c.prototype.nodes = function (a) {
      var b = this,
        c = b.settings,
        f = b.item,
        g = f.now,
        h = f.select,
        i = f.highlight,
        j = f.view,
        k = f.disable,
        l = f.min,
        m = f.max,
        n = (function (a, b) {
          return (
            c.firstDay && (a.push(a.shift()), b.push(b.shift())),
            e.node(
              "thead",
              e.node(
                "tr",
                e.group({
                  min: 0,
                  max: d - 1,
                  i: 1,
                  node: "th",
                  item: function (d) {
                    return [
                      a[d],
                      c.klass.weekdays,
                      'scope=col title="' + b[d] + '"',
                    ];
                  },
                })
              )
            )
          );
        })(
          (c.showWeekdaysFull ? c.weekdaysFull : c.weekdaysShort).slice(0),
          c.weekdaysFull.slice(0)
        ),
        o = function (a) {
          return e.node(
            "div",
            " ",
            c.klass["nav" + (a ? "Next" : "Prev")] +
              ((a && j.year >= m.year && j.month >= m.month) ||
              (!a && j.year <= l.year && j.month <= l.month)
                ? " " + c.klass.navDisabled
                : ""),
            "data-nav=" +
              (a || -1) +
              " " +
              e.ariaAttr({
                role: "button",
                controls: b.$node[0].id + "_table",
              }) +
              ' title="' +
              (a ? c.labelMonthNext : c.labelMonthPrev) +
              '"'
          );
        },
        p = function () {
          var d = c.showMonthsShort ? c.monthsShort : c.monthsFull;
          return c.selectMonths
            ? e.node(
                "select",
                e.group({
                  min: 0,
                  max: 11,
                  i: 1,
                  node: "option",
                  item: function (a) {
                    return [
                      d[a],
                      0,
                      "value=" +
                        a +
                        (j.month == a ? " selected" : "") +
                        ((j.year == l.year && a < l.month) ||
                        (j.year == m.year && a > m.month)
                          ? " disabled"
                          : ""),
                    ];
                  },
                }),
                c.klass.selectMonth,
                (a ? "" : "disabled") +
                  " " +
                  e.ariaAttr({ controls: b.$node[0].id + "_table" }) +
                  ' title="' +
                  c.labelMonthSelect +
                  '"'
              )
            : e.node("div", d[j.month], c.klass.month);
        },
        q = function () {
          var d = j.year,
            f = !0 === c.selectYears ? 5 : ~~(c.selectYears / 2);
          if (f) {
            var g = l.year,
              h = m.year,
              i = d - f,
              k = d + f;
            if ((g > i && ((k += g - i), (i = g)), h < k)) {
              var n = i - g,
                o = k - h;
              (i -= n > o ? o : n), (k = h);
            }
            return e.node(
              "select",
              e.group({
                min: i,
                max: k,
                i: 1,
                node: "option",
                item: function (a) {
                  return [a, 0, "value=" + a + (d == a ? " selected" : "")];
                },
              }),
              c.klass.selectYear,
              (a ? "" : "disabled") +
                " " +
                e.ariaAttr({ controls: b.$node[0].id + "_table" }) +
                ' title="' +
                c.labelYearSelect +
                '"'
            );
          }
          return e.node("div", d, c.klass.year);
        };
      return (
        e.node(
          "div",
          (c.selectYears ? q() + p() : p() + q()) + o() + o(1),
          c.klass.header
        ) +
        e.node(
          "table",
          n +
            e.node(
              "tbody",
              e.group({
                min: 0,
                max: 5,
                i: 1,
                node: "tr",
                item: function (a) {
                  var f =
                    c.firstDay && 0 === b.create([j.year, j.month, 1]).day
                      ? -7
                      : 0;
                  return [
                    e.group({
                      min: d * a - j.day + f + 1,
                      max: function () {
                        return this.min + d - 1;
                      },
                      i: 1,
                      node: "td",
                      item: function (a) {
                        a = b.create([
                          j.year,
                          j.month,
                          a + (c.firstDay ? 1 : 0),
                        ]);
                        var d = h && h.pick == a.pick,
                          f = i && i.pick == a.pick,
                          n =
                            (k && b.disabled(a)) ||
                            a.pick < l.pick ||
                            a.pick > m.pick,
                          o = e.trigger(b.formats.toString, b, [c.format, a]);
                        return [
                          e.node(
                            "div",
                            a.date,
                            (function (b) {
                              return (
                                b.push(
                                  j.month == a.month
                                    ? c.klass.infocus
                                    : c.klass.outfocus
                                ),
                                g.pick == a.pick && b.push(c.klass.now),
                                d && b.push(c.klass.selected),
                                f && b.push(c.klass.highlighted),
                                n && b.push(c.klass.disabled),
                                b.join(" ")
                              );
                            })([c.klass.day]),
                            "data-pick=" +
                              a.pick +
                              " " +
                              e.ariaAttr({
                                role: "gridcell",
                                label: o,
                                selected: !(!d || b.$node.val() !== o) || null,
                                activedescendant: !!f || null,
                                disabled: !!n || null,
                              })
                          ),
                          "",
                          e.ariaAttr({ role: "presentation" }),
                        ];
                      },
                    }),
                  ];
                },
              })
            ),
          c.klass.table,
          'id="' +
            b.$node[0].id +
            '_table" ' +
            e.ariaAttr({ role: "grid", controls: b.$node[0].id, readonly: !0 })
        ) +
        e.node(
          "div",
          e.node(
            "button",
            c.today,
            c.klass.buttonToday,
            "type=button data-pick=" +
              g.pick +
              (a && !b.disabled(g) ? "" : " disabled") +
              " " +
              e.ariaAttr({ controls: b.$node[0].id })
          ) +
            e.node(
              "button",
              c.clear,
              c.klass.buttonClear,
              "type=button data-clear=1" +
                (a ? "" : " disabled") +
                " " +
                e.ariaAttr({ controls: b.$node[0].id })
            ) +
            e.node(
              "button",
              c.close,
              c.klass.buttonClose,
              "type=button data-close=true " +
                (a ? "" : " disabled") +
                " " +
                e.ariaAttr({ controls: b.$node[0].id })
            ),
          c.klass.footer
        )
      );
    }),
    (c.defaults = (function (a) {
      return {
        labelMonthNext: "Next month",
        labelMonthPrev: "Previous month",
        labelMonthSelect: "Select a month",
        labelYearSelect: "Select a year",
        monthsFull: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        monthsShort: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        weekdaysFull: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        today: "Today",
        clear: "Clear",
        close: "Close",
        closeOnSelect: !0,
        closeOnClear: !0,
        updateInput: !0,
        format: "d mmmm, yyyy",
        klass: {
          table: a + "table",
          header: a + "header",
          navPrev: a + "nav--prev",
          navNext: a + "nav--next",
          navDisabled: a + "nav--disabled",
          month: a + "month",
          year: a + "year",
          selectMonth: a + "select--month",
          selectYear: a + "select--year",
          weekdays: a + "weekday",
          day: a + "day",
          disabled: a + "day--disabled",
          selected: a + "day--selected",
          highlighted: a + "day--highlighted",
          now: a + "day--today",
          infocus: a + "day--infocus",
          outfocus: a + "day--outfocus",
          footer: a + "footer",
          buttonClear: a + "button--clear",
          buttonToday: a + "button--today",
          buttonClose: a + "button--close",
        },
      };
    })(a.klasses().picker + "__")),
    a.extend("pickadate", c);
});
