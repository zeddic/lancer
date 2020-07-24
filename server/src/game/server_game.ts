import {World} from 'ecsy';

import {Position} from 'lancer-shared/lib/game/position_component';
import {Movement} from 'lancer-shared/lib/game/movement_component';
import {randomInt, randomValue} from 'lancer-shared/lib/util/random';
import {PhysicsSystem} from 'lancer-shared/lib/game/physics_system';
import {Vector} from 'lancer-shared/lib/util/vector';
import {createFixedTimestepFn} from 'lancer-shared/lib/util/fixed_timestep';
import {performance} from 'perf_hooks';
import {WorldBoundsSystem} from 'lancer-shared/lib/game/world_bounds_system';
import {ServerNetworkSystem} from './server_network_system';
import {RemotePlayerControlSystem} from './remote_player_control_system';
import {RemotePlayerComponent} from './remote_player_component';

const UPDATES_PER_SECOND = 60;
const MS_PER_UPDATE = 1000 / UPDATES_PER_SECOND;
const MS_PER_CHECK = 1000 / (UPDATES_PER_SECOND * 2);

/**
 * The game simulation run on the server.
 */
export class ServerGame {
  destroyed = false;
  world: World;

  constructor() {
    this.world = new World();
    this.world
      .registerComponent(Position)
      .registerComponent(Movement)
      .registerComponent(RemotePlayerComponent)
      .registerSystem(ServerNetworkSystem)
      .registerSystem(RemotePlayerControlSystem)
      .registerSystem(PhysicsSystem)
      .registerSystem(WorldBoundsSystem);
  }

  setup() {
    // for (let i = 0; i < 1; i++) {
    //   const a = new Vector(
    //     randomValue(-0.001, 0.001),
    //     randomValue(-0.001, 0.001)
    //   );
    //   const v = new Vector(randomValue(-0.2, 0.2), randomValue(-0.2, 0.2));
    //   this.world
    //     .createEntity(String(i))
    //     .addComponent(Movement, {v})
    //     .addComponent(Position, {
    //       x: randomInt(40, 200),
    //       y: randomInt(40, 200),
    //     });
    // }

    this.startGameLoop();
  }

  private startGameLoop() {
    const fixedUpdatedFn = createFixedTimestepFn(
      MS_PER_UPDATE,
      (delta, time) => {
        this.world.execute(delta, time);
      }
    );

    let lastTimestamp = performance.now();
    const step = () => {
      if (!this.destroyed) {
        setTimeout(step, MS_PER_CHECK);
      }

      const now = performance.now();
      const delta = now - lastTimestamp;
      fixedUpdatedFn(delta, delta / 1000);
      lastTimestamp = now;
    };

    setTimeout(step, MS_PER_CHECK);
  }

  destroy() {
    this.destroyed = true;
  }
}
