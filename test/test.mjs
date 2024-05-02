import assert from 'assert';

export async function navigateTo(urlPath) {
    await browser.url(urlPath);
  
    // In Firefox, if the global PageLoadStrategy is set to "none", then
    // it's possible that `browser.url()` will return before the navigation
    // has started and the old page will still be around, so we have to
    // manually wait until the URL matches the passed URL. Note that this can
    // still fail if the prior test navigated to a page with the same URL.
    if (browser.capabilities.browserName === 'firefox') {
      await browser.waitUntil(async () => {
        return (await browser.getUrl()).endsWith(urlPath);
      });
    }
}

describe('tests', async function () {
  // Retry all tests in this suite up to 2 times.
  this.retries(2);

  beforeEach(async function () {
    await navigateTo('about:blank');
  });

  for (let i=1;i<=3;i++) {
    it('test ' + i, async function () {
      await navigateTo('/index.html');
      // Pause to make sure page has painted
      await browser.pause(2500);
      const output = await $('#output');
      const fcpEntry = JSON.parse(await output.getText());
      console.log('Test ' + i + ' FCP entry:', fcpEntry);
      assert(fcpEntry.startTime < 1000);
    });
  }
});
