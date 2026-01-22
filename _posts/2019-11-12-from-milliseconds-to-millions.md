# Harry Roberts on From Milliseconds to Millions

_A Look at the Numbers Powering Web Performance_

> We all know performance is big business, but how big? Let's take a look at some of the numbers powering the web performance industry, from both sides of the table. What do performance improvements mean for my clients, and how do we translate that into a working relationship.

From <https://2019.ffconf.org/#from-milliseconds-to-millions>.

I was at ffconf 2019 last Friday (8th November 2019), where there was a wonderful selection of eight talks all related to the web.

Harry ([@csswizardry](https://twitter.com/csswizardry)) walked us through how he approaches the website performance projects he does as a day job. It was a really interesting insight that can apply well to any team looking to improve their own website's performance.

In summary, Harry _really_ likes talking about the `<head>` section of a document.

What was made clear was how important it is to spend the time gathering the current performance metrics and aligning them to a companies critical business metrics such as their count of conversions. This will help to keep your performance project focused on what actually matters, and make prioritising the work with other disciplines much easier.

Harry's key performance metric to focus on was Start Render. Good to hear what people are aligning to on what is the "best" performance metric, always seems to be an area of rapid change.

There was an interesting insight into a review of <https://www.apple.com>, where Harry demonstrated how to identify when different pages of a website are powered by different technologies by looking at the time to first byte (TTFB) performance metric. Pages that share the same stack will typically have a consistent TTFB value.

![Business Insider Time to First Byte]({{ '/assets/images/6c8ecde7-b2f9-4f71-a1d1-7b217d275e83.png' | relative_url }})

_The TTFB of Business Insider's front page and article page, with a gap implying two different technology stacks are involved._

Harry also addressed how to use thresholds to ensure after the project comes to an end the performance of the website doesn't begin to degrade _again_. Leaning on tools like SpeedCurve and being strict about never increasing the thresholds, rather reducing them as you make progress.

There was a good tip about picking a threshold, simply look back over _two weeks_ of your performance metrics and set your threshold to the highest level seen.
