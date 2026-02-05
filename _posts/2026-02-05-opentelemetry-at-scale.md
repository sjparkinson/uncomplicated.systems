# Notes from how to Roll Out OpenTelemetry at Scale

From a talk by Ted Young at The Royal Lancaster on 4th February 2026 hosted by Grafana Labs.

## Insights from before the talk

* Don't apply sampling manually at the source (say sidecar collector) if you want to do span metrics centrally.

* A patchwork rollout of tracing leads to gaps in the observability, unlear value from the effort, and a loss of motivation for the initiative. Prioritise onboarding strategy, not just making it available. For example, pick a critical user journey like article read or subscription purchase, and instrument that end-to-end first (easier in single product organisations).

* You _really_ need to watch out for the maintenance burden of deploying SDKs and collectors. The OpenTelemetry project's intent is to achieve a zero-touch experience (via the new [OpenTelemetry Injector](https://github.com/open-telemetry/opentelemetry-injector) project). For example don't deploy sidecars that then require a code change and rollout to update configuration across hundreds of services.

## OpenTelemetry at Scale

Below is the recomended aproach to adopting OpenTelemetry within an enterprise. It's almost the opposite order of what people might naturally jump to (e.g. app specific insighs first).

The idea is to have foundational observability in place first, all that you'll need to help figure out what's going on during an incident.

There was also a strong emphsis on **not** jumping to installing the OpenTelemtry SDK manually in your applications. Lean on tooling and aproaching this with your infrastructure hat on, treating services as homogeneous when starting out.

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

## OpenTelemetry Injector

- **OpenTelemetry Injector is worth exploring**
  - Not for **Go or Rust** (as they don't have a standard library that can be instrumented)
- **Fargate**: bake into image
- **eBPF** called out as a key mechanism (but language/platform coverage concerns remain)

## Grafana Infrastructure Hub

- **Alloy**
  - Configured centrally in **Grafana Cloud**
  - Aim: **less local management**, more “baked in” config

- **App visibility**
  - **eBPF** for app visibility **at the moment** (noted as **OBI**)
  - Expected to also support **otel-injector**

- **Instrumentation Hub**
  - Might **adaptive telemetry** “to the source”, but **managed via an instrumentation hub**

- **Standardisation theme**
  - Standardised dashboards in Grafana Cloud
  - Manage **collector configuration centrally**, treat it as something that should be dynamic
  - **Fleet Management** _and_ **OpAMP** support

- **How does this work for Amazon ECS Fargate?**
  - **OpenTelemetry Injector** covers most languages
  - Concern: **Go** (note: no eBPF support in ECS Fargate, AWS promotes Managed Instances)

- **Strategy principle**
  - **Everything is a code change** — this is what to avoid
  - Goal: shared understanding of observability (e.g. **operations and engineers looking at the same metrics**)
  - **Sampling controlled centrally** so statistics (e.g. **span metrics**) are trusted
  - Need automation to glue it all together

- **Operational concerns**
  - Alloy mapping more to collector behaviour
  - What happens during a **scaling event** if **Fleet Management API** isn't available?
    - Risk: pressure to fall back to a **default config**, increasing load

- **Sampling warning**
  - **Don't do tail sampling**
  - Adds **state** to your architecture → **bad idea**
