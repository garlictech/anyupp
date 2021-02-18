import 'dart:math' as math;
import 'package:animated_background/animated_background.dart';
import 'package:flutter/material.dart';

ParticleOptions particleOptionsHappy = ParticleOptions(
  image: Image.asset('assets/icons/emoji-smile-01.png'),
  baseColor: Colors.blue,
  spawnOpacity: 0.2,
  opacityChangeRate: 0.25,
  minOpacity: 0.5,
  maxOpacity: 1.0,
  spawnMinSpeed: 80.0,
  spawnMaxSpeed: 180.0,
  spawnMinRadius: 22.0,
  spawnMaxRadius: 55.0,
  particleCount: 30,
);

ParticleOptions particleOptionsSad = ParticleOptions(
  image: Image.asset('assets/icons/emoji-sad-01.png'),
  baseColor: Colors.blue,
  spawnOpacity: 0.2,
  opacityChangeRate: 0.25,
  minOpacity: 0.5,
  maxOpacity: 1.0,
  spawnMinSpeed: 80.0,
  spawnMaxSpeed: 180.0,
  spawnMinRadius: 22.0,
  spawnMaxRadius: 55.0,
  particleCount: 30,
);

class RainParticleBehaviour extends RandomParticleBehaviour {
  static math.Random random = math.Random();

  bool enabled;
  bool reverse;

  RainParticleBehaviour(
      {ParticleOptions options = const ParticleOptions(), Paint paint, this.enabled = true, this.reverse = false})
      : assert(options != null),
        super(options: options, paint: paint);

  @override
  void initPosition(Particle p) {
    p.cx = random.nextDouble() * size.width;

    // FROM-UP-TO-DOWN
    if (reverse) {
      if (p.cy == 0.0) {
        p.cy = random.nextDouble() * size.height;
      } else {
        p.cy = random.nextDouble() * size.width * 0.2;
      }
    } else {
      // FROM-DOWN-TO-TOP
      if (p.cy == size.height) {
        p.cy = size.height;
      } else {
        p.cy = size.height - random.nextDouble() * size.height * 0.30;
      }
    }
  }

  @override
  void initDirection(Particle p, double speed) {
    double dirX = (random.nextDouble() - 0.5);
    double dirY = random.nextDouble() * 0.5 + 0.5;
    double magSq = dirX * dirX + dirY * dirY;
    double mag = magSq <= 0 ? 1 : math.sqrt(magSq);

    p.dx = dirX / mag * speed;
    if (reverse) {
      p.dy = dirY / mag * speed; // FROM-UP-TO-DOWN
    } else {
      p.dy = -dirY / mag * speed; // FROM-DOWN-TO-TOP
    }
  }

  @override
  Widget builder(BuildContext context, BoxConstraints constraints, Widget child) {
    return GestureDetector(
      onPanUpdate: enabled ? (details) => _updateParticles(context, details.globalPosition) : null,
      onTapDown: enabled ? (details) => _updateParticles(context, details.globalPosition) : null,
      child: ConstrainedBox(
        // necessary to force gesture detector to cover screen
        constraints: BoxConstraints(minHeight: double.infinity, minWidth: double.infinity),
        child: super.builder(context, constraints, child),
      ),
    );
  }

  void _updateParticles(BuildContext context, Offset offsetGlobal) {
    RenderBox renderBox = context.findRenderObject() as RenderBox;
    var offset = renderBox.globalToLocal(offsetGlobal);
    particles.forEach((particle) {
      var delta = (Offset(particle.cx, particle.cy) - offset);
      if (delta.distanceSquared < 70 * 70) {
        var speed = particle.speed;
        var mag = delta.distance;
        speed *= (70 - mag) / 70.0 * 2.0 + 0.5;
        speed = math.max(options.spawnMinSpeed, math.min(options.spawnMaxSpeed, speed));
        particle.dx = delta.dx / mag * speed;
        particle.dy = delta.dy / mag * speed;
      }
    });
  }
}
