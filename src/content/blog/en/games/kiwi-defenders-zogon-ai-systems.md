---
title: "Inside the AI Systems Behind the Zogon Alien Army"
description: "How we used state-machine logic, tactical support units, and adaptive spawn pressure to create a dynamic enemy force in Kiwi Defenders."
date: 2026-05-16
category: "Games"
---

### Making Enemies Feel Tactical Instead of Disposable

Enemy design in Kiwi Defenders focused on creating battlefield synergy rather than simply increasing health numbers every level.

Every Zogon unit operates through lightweight state-machine logic that controls:
* Movement behavior
* Attack priorities
* Target selection
* Hit reactions
* Cooldown timing
* Frontline engagement decisions

This allows enemy waves to behave more like coordinated assaults instead of disconnected units walking down lanes.

**[Read our previous breakdown on designing New Zealand as a tactical battlefield ➔](/blog/kiwi-defenders-nz-battlefield-design)**

### Support Units Changed the Entire Meta

One of the most important additions during development was the Enemy Healer class.

Rather than dealing damage directly, these support units remain behind the frontline and continuously restore nearby Zogon troops. Ignoring them quickly turns manageable battles into overwhelming pushes.

This forced players to:
1. Break defensive tunnel vision.
2. Prioritize targets more carefully.
3. Actively hunt high-value support enemies.

It also created stronger battlefield decision-making than traditional HP-scaling difficulty systems.

### Countering Defensive "Turtle" Strategies

Late-game balancing introduced specialized anti-defense units.

**Bombers** were designed as extremely fast breach units capable of devastating clustered frontline defenses if left unchecked.

Meanwhile, **Devastators** function as slow-moving siege tanks with massive durability and resistance to crowd-control effects. Their purpose is to absorb tower focus while faster enemy units penetrate defenses behind them.

Together, these systems prevent gameplay from devolving into passive waiting.

### Dynamic Spawn Pressure

Enemy wave generation also evolved beyond static scripting. 

The spawn system monitors player battlefield momentum. If players aggressively push the frontline toward enemy landing zones, the game responds by increasing reinforcement pressure.

Additional adaptive systems monitor:
* Anti-air coverage
* Tower composition
* Enemy kill ratios

Players overcommitting to ground defense may suddenly face airborne swarm punishments, forcing rapid strategic adaptation.