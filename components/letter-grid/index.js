Component({
  properties: { words: Array, value: String, judged: Boolean, ok: Boolean },
  data: { focused: true, keyboardStyle: "left:50%;top:32rpx;" },
  observers: {
    words() { this.positionKeyboard(); },
  },
  lifetimes: {
    ready() { this.positionKeyboard(); },
  },
  methods: {
    positionKeyboard() {
      const version = this.positionVersion = (this.positionVersion || 0) + 1;
      wx.nextTick(() => {
        if (version !== this.positionVersion) return;
        const query = this.createSelectorQuery();
        query.select(".grid").boundingClientRect();
        query.select(".focused").boundingClientRect();
        query.exec((rects) => {
          const grid = rects[0];
          const cell = rects[1];
          if (version !== this.positionVersion || !grid || !cell) return;
          // iOS can paint the native caret despite opacity; anchor it inside the active cell.
          this.setData({ keyboardStyle: `left:${cell.left - grid.left + cell.width / 2}px;top:${cell.top - grid.top}px;height:${cell.height}px;` });
        });
      });
    },
    input(e) {
      this.triggerEvent("typing", { value: e.detail.value });
    },
    focus() {
      this.positionKeyboard();
      this.setData({ focused: false }, () => this.setData({ focused: true }));
    },
  },
});
