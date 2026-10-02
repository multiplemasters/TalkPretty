---
layout: framework
title: "SBAR"
order: 12
full_name: "Situation, Background, Assessment, Recommendation"
topics: ["Executive updates"]
tagline: "Give a busy decision-maker the signal first."
description: "A concise handoff format designed to make the current situation and requested decision immediately clear."
steps:
  - letter: "S"
    label: "Situation"
    description: "What is happening right now?"
  - letter: "B"
    label: "Background"
    description: "What context is essential?"
  - letter: "A"
    label: "Assessment"
    description: "What do you think is going on?"
  - letter: "R"
    label: "Recommendation"
    description: "What action do you recommend?"
how_to_use: "Use headings when writing. Put the recommendation in the subject line when possible."
example: "“Situation: checkout is failing for mobile users. Background: the issue began after Tuesday’s deploy. Assessment: a payment SDK conflict. Recommendation: roll back and patch tomorrow.”"
best_for: ["Escalations", "Handoffs", "Risk updates"]
mnemonic:
  word: "SBAR"
  cue: "A baton pass: signal, context, read, handoff."
  color: "#B27C9B"
source_note: "Adapted across healthcare and other high-reliability environments; context details vary."
---
