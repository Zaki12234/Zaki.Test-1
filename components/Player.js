'use client';

import { useEffect, useRef, useState } from 'react';

function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

export default function Player() {
  const ref = useRef(null);
  const [state, setState] = useState('idle');

  useEffect(() => {
    const keys = new Set();
    const pos = { x: 20, y: 0, vy: 0, grounded: true, onLadder: false, hanging: false };
    const el = ref.current;

    const down = (e) => {
      keys.add(e.key.toLowerCase());
    };
    const up = (e) => {
      keys.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    function step() {
      let moving = false;
      let speed = 2;
      if (keys.has('shift')) speed = 4;
      if (keys.has('control')) speed = 1;

      if (keys.has('arrowleft') || keys.has('a')) {
        pos.x -= speed;
        moving = true;
      }
      if (keys.has('arrowright') || keys.has('d')) {
        pos.x += speed;
        moving = true;
      }

      const rect = el.getBoundingClientRect();
      const ladders = Array.from(document.querySelectorAll('[data-ladder]'));
      const ledges = Array.from(document.querySelectorAll('[data-ledge]'));
      pos.onLadder = ladders.some((l) => overlaps(rect, l.getBoundingClientRect()));
      pos.hanging =
        !pos.onLadder &&
        pos.vy >= 0 &&
        ledges.some((ld) => {
          const r = ld.getBoundingClientRect();
          return rect.bottom <= r.top + 5 && rect.right > r.left && rect.left < r.right;
        });

      if (pos.onLadder && (keys.has('arrowup') || keys.has('w'))) {
        pos.y -= 3;
        setState('climb');
      } else if (pos.hanging) {
        setState('hang');
        if (keys.has(' ') || keys.has('space')) {
          pos.vy = -10;
          pos.hanging = false;
          setState('jump');
        }
      } else {
        if ((keys.has(' ') || keys.has('space')) && pos.grounded) {
          pos.vy = -10;
          pos.grounded = false;
          setState('jump');
        }
        pos.y += pos.vy;
        pos.vy += 0.5; // gravity
        if (pos.y > 0) {
          pos.y = 0;
          pos.vy = 0;
          pos.grounded = true;
        }
      }

      if (keys.has('control')) {
        setState('crouch');
      } else if (keys.has('shift') && moving) {
        setState('sprint');
      } else if (moving && pos.grounded) {
        setState('walk');
      } else if (!pos.grounded && pos.vy > 0) {
        setState('fall');
      } else if (pos.grounded && !moving) {
        setState('idle');
      }

      el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return <div ref={ref} className={`player ${state}`} />;
}

