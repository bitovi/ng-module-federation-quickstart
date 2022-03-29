export class Loader {
  private timer = null;
  private isInitialized: boolean = false;

  public clearTimer() {
    clearInterval(this.timer);
    process.stdout.write('\r\x1b');

    this.isInitialized = false;
    this.timer = null;
  }

  public startTimer(message = '') {
    var loaderParts = ['\\', '|', '/', '-'];
    var index = 0;

    this.timer = setInterval(() => {
      const previousLine: string = this.isInitialized ? '\r\x1b' : '';
      this.isInitialized = true;

      process.stdout.write(`${previousLine} ${loaderParts[index++]} ${message}`);
      index &= 3;
    }, 250);
  }
}
