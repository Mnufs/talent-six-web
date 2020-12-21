! function(e) {
  var t, n, o, i, c, d, s =
    '<svg><symbol id="icon-nv" viewBox="0 0 1024 1024"><path d="M614.28710965 629.94921902v-11.32031277h152.89453098V318.32421849C767.18164063 192.28906223 652.85351563 90.125 511.94726562 90.125s-255.234375 102.16406223-255.23437499 228.19921849v300.30468776h152.92968749v11.1796875h-0.24609402l-297.91406222 195.82031223V933.875h801.07031277v-107.01562473z m7.76953098 188.68359375c-72.94921849 70.55859375-110.63671875-36.80859375-110.63671875-36.80859375s-37.68750027 107.33203098-110.70703098 36.80859375c0 0-32.0625-20.74218723-35.50781305-159.85546929l146.21484402 123.04687554 146.21484403-123.04687554c-3.44531223 139.04296902-35.57812527 159.85546848-35.57812527 159.85546929z"  ></path></symbol><symbol id="icon-nanxing" viewBox="0 0 1024 1024"><path d="M512.704 925.568c-41.856 0-129.92-195.456-138.56-275.712 59.2 74.368 101.76 68.48 138.56 68.48s67.84 4.48 137.152-68.48c-7.232 36.48-95.296 275.712-137.152 275.712m445.568-73.28c-18.944-88.064-262.784-132.608-336-254.272-4.48-7.488-1.408-31.36-0.192-34.24a191.36 191.36 0 0 1 32.832-50.368c3.648-3.264 7.104-6.784 10.56-10.24l3.2-2.944-0.192-0.064c43.84-46.08 71.36-111.104 71.36-183.424C739.84 177.152 637.824 64 512 64S284.16 177.152 284.16 316.736c0 72.32 27.52 137.344 71.36 183.424h-0.192l3.2 3.008c3.392 3.456 6.912 6.976 10.496 10.24 18.56 19.584 30.528 44.8 32.896 50.368 1.216 2.816 4.288 26.752-0.192 34.24-73.152 121.664-317.056 166.208-336 254.272-2.496 29.952-6.272 103.552 21.056 103.552C114.048 955.84 512 960 512 960s397.952-4.16 425.216-4.16c27.328 0 23.552-73.6 21.056-103.552"  ></path></symbol></svg>',
    l = (l = document.getElementsByTagName("script"))[l.length - 1].getAttribute("data-injectcss");
  if (l && !e.__iconfont__svg__cssinject__) {
    e.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>"
      )
    } catch (e) {
      console && console.log(e)
    }
  }

  function a() {
    c || (c = !0, o())
  }
  t = function() {
    var e, t, n, o;
    (o = document.createElement("div")).innerHTML = s, s = null, (n = o.getElementsByTagName("svg")[0]) && (n.setAttribute(
        "aria-hidden", "true"), n.style.position = "absolute", n.style.width = 0, n.style.height = 0, n.style.overflow =
      "hidden", e = n, (t = document.body).firstChild ? (o = e, (n = t.firstChild).parentNode.insertBefore(o, n)) :
      t.appendChild(e))
  }, document.addEventListener ? ~["complete", "loaded", "interactive"].indexOf(document.readyState) ? setTimeout(t,
    0) : (n = function() {
    document.removeEventListener("DOMContentLoaded", n, !1), t()
  }, document.addEventListener("DOMContentLoaded", n, !1)) : document.attachEvent && (o = t, i = e.document, c = !1,
    (d = function() {
      try {
        i.documentElement.doScroll("left")
      } catch (e) {
        return void setTimeout(d, 50)
      }
      a()
    })(), i.onreadystatechange = function() {
      "complete" == i.readyState && (i.onreadystatechange = null, a())
    })
}(window);
