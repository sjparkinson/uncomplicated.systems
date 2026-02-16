## Rolling Out OpenTelemetry at Scale

From a talk by Ted Young at The Royal Lancaster on 4th February 2026, hosted by Grafana Labs.

### Insights from before the talk

* Don't apply sampling manually at the source (say, sidecar collector) if you want to do span metrics centrally.

* A patchwork rollout of tracing leads to gaps in the observability, unclear value from the effort, and a loss of motivation for the initiative. Prioritise onboarding strategy, not just making it available. For example, pick a critical user journey like article read or subscription purchase, and instrument that end-to-end first (easier in single product organisations).

* You _really_ need to watch out for the maintenance burden of deploying SDKs and collectors. The OpenTelemetry project's intent is to achieve a zero-touch experience (via the new [OpenTelemetry Injector](https://github.com/open-telemetry/opentelemetry-injector) project). For example, don't deploy sidecars that then require a code change and rollout to update configuration across hundreds of services.

### OpenTelemetry at Scale

Below is the recomended aproach to adopting OpenTelemetry within an enterprise. It's almost the opposite order of what people might naturally jump to (e.g. app specific insights first).

The idea is to have foundational observability in place first, all that you need to help figure out what is going on during an incident.

There was also a strong emphasis on **not** jumping to installing the OpenTelemetry SDK manually in your applications. Lean on tooling and approaching this with your infrastructure hat on, treating services as homogeneous when getting started.

1. **Infrastructure visibility**, e.g. USE metrics via sidecar on host (host metrics etc.)
2. **Baseline service visibility**, e.g. RED metrics and network visibility (eBPF)
3. **Transaction insights**, e.g. traces and derived/deep logs and metrics
4. **Custom logic**, and maybe profiling

General notes from this section:

* **[OBI](https://opentelemetry.io/docs/zero-code/obi/)** can be used for RED metrics
  * It can also do basic traces, but not for all languages (e.g. not Node?)
* App/business-specific visibility + custom metrics:
  * Hard to know what's available in advance → **do this last**
* Adopt internal conventions:
  * Naming/tagging scheme, tooling for this called _weaver_ worth looking out for, and how changes are managed
* Alloy has some **non-upstreamed prometheus exporters** that are worth a look at, will be upstreamed eventually
* **.NET has OpenTelemetry baked in!**

### OpenTelemetry Injector

[OpenTelemetry Injector]](https://github.com/open-telemetry/opentelemetry-injector) sounds well worth exploring, as a general purpose tool for installing the OpenTelemetry SDKs in systems, without teams having to maintain a tightly coupled integration within the code.

- Not (yet) for **Go or Rust** (as they don't have a standard library that can be instrumented)
- For Amazon ECS Fargate, you could include running the OpenTelemetry Injector in the Docker image build

### Grafana Infrastructure Hub

This was a new project offering in Grafana Cloud. Similar to the concept of [OpAMP in the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/management/), but provided as a managed service with a cloud based user interface.

Currently, it requires Alloy collectors, as it uses their Fleet Management API which isn't a part of the OpenTelemetry Collector. But Ted did mention that they will add support for OpAMP, meaning existing collectors could eventually be managed using the Grafana Infrastructure Hub.

The concept is that, in practice, and at scale, OpenTelemetry collector configuration is fairly dynamic and should be managed as such. So _not_ building and baking the configuration into the collector image. An example of this in action would be adjusting sample rates for all requests related to a specific product or user journey to help with incident response.

Adaptive telemetery also came up, this is the Grafana Cloud cost saving tooling for sampling telemetry at the ingest. The suggestion was if collectors are managed with the Infrastructure Hub, sampling produced by adaptive telemetry could be configured within the collectors closer to the source, while taking into account configurations like span metric processors, so that they still produce accurate statistics.

### Strategy ideas and principles

  - Avoid everything OpenTelemetry being a code change
    - The collector configuration is dynamic in nature and should be deployed and managed as such
  - Goal: shared understanding of observability (e.g. operations and engineers looking at the same metrics)
  - **Sampling controlled centrally** so statistics (e.g. _span metrics_) are trusted
  - Need automation to glue it all together, e.g. OpenTelemetry Injector
  - **Don't do tail sampling**
    - Adds **state** to your collector architecture, _bad idea_
