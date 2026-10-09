Component({
  data: { letters: ["l", "e", "a", "r", "n"] },
  lifetimes: {
    ready() { this.timer = setTimeout(() => this.finish(), 1400); },
    detached() { clearTimeout(this.timer); },
  },
  methods: {
    finish() {
      if (this.finished) return;
      this.finished = true;
      clearTimeout(this.timer);
      this.triggerEvent("done");
    },
  },
});
