## Cloud Native London August 2026

I popped down to the Just Eat Takeaway office in London yesterday (4th August 2026) to attend the [Cloud Native London meetup](https://www.meetup.com/cloud-native-london/events/314662523/). My first meetup since a [trip to the Disney office to hear about how they do SRE](https://www.meetup.com/the-engineering-roundabout/events/302015837/) (back in 2024!).

Two good talks, one from a new startup called [Tavi](https://heytavi.com/) on how they host their product, and another from [Chronosphere](https://chronosphere.io/) on the Btrfs filesystem.

### Agents as products

Tom Robbins talked us through how they have deployed Tavi, a sort-of OpenClaw-based product for recruiters and hiring managers. He coined "nanoservices" to describe the architecture, where each customer gets their own isolated instance of the product.

He also noted it seems to be the direction travel offered by hosting providers. They're using Fly.io, and Tom pointed out that they've recently launched [Sprites](https://fly.io/sprites) as a pay-as-you-go managed hosting platform perfectly suited to what they are doing. And I _think_ the Cloudflare Agent SDK on their Workers platform could also get you there.

The magic of the product seemed to be in the statefulness of the architecture, and gathering and leaning on the institutional knowledge of each organisation.

So from stateful on-premise hosting, to stateless cloud-native hosting, and now around to stateful cloud-native hosting?

### Scaling Btrfs in an enterprise

Motiejus Jakštys talked us through using [Btrfs](https://en.wikipedia.org/wiki/Btrfs) (pronounced butter-fs?) at Chronosphere (an observability product) to save on their GCP storage costs, the top line item in their cloud bill.

Really well communicated for a fairly technical deep dive into a filesystem. And honest too, one caveat was that their database just happens to write to disk in a way that suits btrfs particularly well.

After trialing btfs locally, they discovered that it was not a supported filesystem on GCP at the time. I liked that they worked with Google to get it supported, so that any customer can now give it a go. Sounded like they are now working with AWS too.

The jist of it is that they are using btrfs for whole disk compression on their metrics data storage instances, achieving something like a 70–80% compression ratio. Meta have been using it in production for a long time, and while it got some flack over the years for data loss issues, it sounds like it is in a great shape now.

Most of the talk is covered in Motiejus's blog post at <https://m.jakstys.lt/2026/scaling-btrfs-in-an-enterprise/>.
